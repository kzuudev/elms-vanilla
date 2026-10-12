<?php

namespace App\Services\dashboard;

use App\Contracts\LeaveAnalyticsInterface;
use App\Exceptions\domain\UnauthorizedException;
use App\Http\Middleware\Auth;
use App\Traits\HasSharedAnalytics;
use Core\App;
use Core\Database;

class SuperAdminDashboardService implements LeaveAnalyticsInterface
{
    use HasSharedAnalytics;

    private Database $db;
    private int $current_user_id;
    private string $current_user_role;

    public function __construct()
    {
        $this->db = App::resolve(Database::class);
        $user = Auth::user() ?? Auth::authenticate();
        $this->current_user_id = $user['id'];
        $this->current_user_role = $user['role'];
    }

    private function validateUser(): void
    {
        if ($this->current_user_role !== 'super-admin') {
            throw new UnauthorizedException('Only super admins can view this dashboard');
        }
    }

    public function getRemainingTotalBalance(): array
    {
        $this->validateUser();
        return $this->db->query("SELECT COALESCE(SUM(remaining_balance), 0) AS grand_total
            FROM leave_balance WHERE user_id = :user_id", ['user_id' => $this->current_user_id])->all();
    }

    public function getPendingApprovalMetrics(): array
    {
        $this->validateUser();
        return $this->db->query("SELECT COALESCE(SUM(total_days), 0) AS total_days,
            COUNT(*) AS queued_leave_count FROM leave_requests
            WHERE user_id = :user_id AND status = 'pending' AND deleted_at IS NULL",
            ['user_id' => $this->current_user_id])->all();
    }

    public function getUsedDays(): array
    {
        $this->validateUser();
        // Approved requests are authoritative: the review flow does not maintain used_days.
        return $this->db->query("SELECT
            (SELECT COALESCE(SUM(total_days), 0) FROM leave_requests
             WHERE user_id = :request_user_id AND status = 'approved' AND deleted_at IS NULL
               AND start_date >= MAKEDATE(YEAR(CURRENT_DATE), 1)
               AND start_date < MAKEDATE(YEAR(CURRENT_DATE) + 1, 1)) AS total_used_days,
            COALESCE(SUM(allocated_days), 0) AS total_allocated_days
            FROM leave_balance WHERE user_id = :balance_user_id", [
                'request_user_id' => $this->current_user_id,
                'balance_user_id' => $this->current_user_id,
            ])->all();
    }

    public function getNextUpcomingLeave(): ?array
    {
        $this->validateUser();
        return $this->db->query("SELECT lr.start_date, lr.end_date, lt.name AS leave_type
            FROM leave_requests lr INNER JOIN leave_types lt ON lr.leave_type_id = lt.id
            WHERE lr.user_id = :user_id AND lr.status = 'approved' AND lr.deleted_at IS NULL
              AND lr.start_date >= CURRENT_DATE
            ORDER BY lr.start_date, lr.id LIMIT 1", ['user_id' => $this->current_user_id])->find() ?: null;
    }

    public function getTeamAvailability(): array
    {
        $this->validateUser();
        // Pick one current approved request per employee so overlapping rows cannot inflate coverage.
        return $this->db->query("SELECT u.id, CONCAT(u.first_name, ' ', u.last_name) AS name,
            u.role, u.department, u.is_active, lr.leave_type_id, lt.name AS leave_type,
            lr.status AS leave_status, lr.start_date, lr.end_date,
            (SELECT COUNT(*) FROM leave_requests pending WHERE pending.user_id = u.id
             AND pending.status = 'pending' AND pending.deleted_at IS NULL) AS queued_leave_count
            FROM users u
            LEFT JOIN leave_requests lr ON lr.id = (
                SELECT current_leave.id FROM leave_requests current_leave
                WHERE current_leave.user_id = u.id AND current_leave.status = 'approved'
                  AND current_leave.deleted_at IS NULL
                  AND CURRENT_DATE BETWEEN current_leave.start_date AND current_leave.end_date
                ORDER BY current_leave.start_date, current_leave.id LIMIT 1)
            LEFT JOIN leave_types lt ON lr.leave_type_id = lt.id
            WHERE u.is_active = 1 AND u.deleted_at IS NULL
            AND u.role != 'super-admin'
            ORDER BY u.department, u.last_name, u.first_name, u.id")->all();
    }

    public function getMonthlyConsumption(): array
    {
        $this->validateUser();
        return $this->db->query("SELECT MONTH(lr.start_date) AS month_num,
            DATE_FORMAT(lr.start_date, '%b') AS month_name, SUM(lr.total_days) AS total_used_days
            FROM leave_requests lr INNER JOIN users u ON lr.user_id = u.id
            WHERE lr.status = 'approved' AND lr.deleted_at IS NULL AND u.deleted_at IS NULL
              AND lr.start_date >= MAKEDATE(YEAR(CURRENT_DATE), 1)
              AND lr.start_date < MAKEDATE(YEAR(CURRENT_DATE) + 1, 1)
            GROUP BY MONTH(lr.start_date), DATE_FORMAT(lr.start_date, '%b')
            ORDER BY month_num")->all();
    }

    public function getBacklogRequests(): array
    {
        $this->validateUser();
        return $this->db->query("SELECT COUNT(*) AS pending_count,
            COALESCE(ROUND(AVG(DATEDIFF(CURRENT_DATE, lr.created_at)), 1), 0) AS average_days_in_queue,
            COALESCE(MAX(DATEDIFF(CURRENT_DATE, lr.created_at)), 0) AS oldest_request_days
            FROM leave_requests lr INNER JOIN users u ON lr.user_id = u.id
            WHERE lr.status = 'pending' AND lr.deleted_at IS NULL AND u.deleted_at IS NULL")->all();
    }

    public function getTotalUsers(): array
    {
        $this->validateUser();
        return $this->db->query("SELECT COUNT(*) AS total_users,
            COALESCE(SUM(is_active = 1), 0) AS total_active_users,
            COALESCE(SUM(is_active = 0), 0) AS total_inactive_users,
            COUNT(DISTINCT department) AS total_departs_users
            FROM users WHERE deleted_at IS NULL")->all();
    }

    public function getTeamOverlap(): array
    {
        $this->validateUser();
        $pending = $this->db->query("SELECT lr.id, lr.user_id, u.first_name, u.last_name,
            u.department, lt.name AS leave_type, lr.status AS leave_status,
            lr.total_days, lr.start_date, lr.end_date
            FROM leave_requests lr INNER JOIN users u ON lr.user_id = u.id
            INNER JOIN leave_types lt ON lr.leave_type_id = lt.id
            WHERE lr.status = 'pending' AND lr.deleted_at IS NULL AND u.deleted_at IS NULL
              AND u.is_active = 1 AND lr.end_date >= CURRENT_DATE
            ORDER BY lr.start_date, lr.id")->all();

        // Fetch pairs in one query instead of running a query for every pending request.
        $overlaps = $this->db->query("SELECT pending.id AS pending_id, approved.id,
            colleague.first_name AS employee_first_name, colleague.last_name AS employee_last_name,
            approved.start_date, approved.end_date, approved.total_days, approved.leave_type_id,
            approved.status AS leave_request_status, lt.name AS leave_type_name
            FROM leave_requests pending
            INNER JOIN users applicant ON pending.user_id = applicant.id
            INNER JOIN users colleague ON colleague.department = applicant.department
              AND colleague.id != applicant.id AND colleague.deleted_at IS NULL AND colleague.is_active = 1
            INNER JOIN leave_requests approved ON approved.user_id = colleague.id
              AND approved.status = 'approved' AND approved.deleted_at IS NULL
              AND approved.start_date <= pending.end_date AND approved.end_date >= pending.start_date
            INNER JOIN leave_types lt ON approved.leave_type_id = lt.id
            WHERE pending.status = 'pending' AND pending.deleted_at IS NULL
              AND applicant.deleted_at IS NULL AND applicant.is_active = 1
              AND pending.end_date >= CURRENT_DATE
            ORDER BY pending.id, approved.start_date, approved.id")->all();

        $by_request = [];
        foreach ($overlaps as $overlap) {
            $pending_id = $overlap['pending_id'];
            unset($overlap['pending_id']);
            $by_request[$pending_id][] = $overlap;
        }
        foreach ($pending as &$request) {
            $request['overlap'] = $by_request[$request['id']] ?? [];
        }
        unset($request);
        return $pending;
    }

    public function getRecentActivity(): array
    {
        $this->validateUser();
        return $this->db->query("SELECT lr.id, CONCAT(u.first_name, ' ', u.last_name) AS employee_name,
            u.role AS employee_role, u.department AS employee_department,
            lt.name AS leave_type, lr.status AS leave_status, lr.reason,
            lr.start_date, lr.end_date, lr.total_days, lr.created_at
            FROM leave_requests lr INNER JOIN users u ON lr.user_id = u.id
            INNER JOIN leave_types lt ON lr.leave_type_id = lt.id
            WHERE lr.deleted_at IS NULL AND u.deleted_at IS NULL
            ORDER BY lr.created_at DESC, lr.id DESC LIMIT 20")->all();
    }
}
