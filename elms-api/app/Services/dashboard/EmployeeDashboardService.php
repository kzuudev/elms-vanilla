<?php

namespace App\Services\dashboard;

use App\Http\Middleware\Auth;
use App\Traits\HasSharedAnalytics;
use Core\App;
use Core\Database;


class EmployeeDashboardService {

    use HasSharedAnalytics;
    private $db;

    private int $user_id;

    private string $user_role;
    private string $user_department;


    public function __construct() {
        $this->db = App::resolve(Database::class);
        $this->user_id = Auth::authenticate()['id'];
        $this->user_role = Auth::authenticate()['role'];
        $this->user_department = Auth::authenticate()['department'];
    }

    public function getRemainingTotalBalance(): array
    {

        return $this->executeRemainingTotalBalance($this->user_id);

    }


    public function getPendingApprovalMetrics(): array
    {

        return $this->executePendingApprovalMetrics($this->user_id);
    }

    public function getUsedDays(): array
    {

        return $this->executeUsedDays($this->user_id);

    }

    public function getMonthlyLeaveConsumption() {

        $monthly_leave_consumption = $this->db->query("
            SELECT
                DATE_FORMAT(lr.start_date, '%b') AS month_name,
                MONTH(lr.start_date) AS month_num,
                SUM(lr.total_days) AS total_used_days
            FROM leave_requests lr    
            WHERE lr.user_id = :user_id AND lr.status = 'approved'
            GROUP BY MONTH(lr.start_date), DATE_FORMAT(lr.start_date, '%b')
            ORDER BY month_num ASC
        ", [
            'user_id' => $user_id,
        ])->all();

        return $monthly_leave_consumption;
    }

    public function getTeamAvailability($user_id, $role) {

        $team_status = $this->db->query("
            SELECT u.*,
                CONCAT(u.first_name, ' ', u.last_name) AS name,   
                lr.status AS leave_status,
                COUNT(lr.id) as queued_leave_count
            FROM users u
            LEFT JOIN leave_requests lr ON u.id = lr.user_id AND lr.status = 'pending'
            WHERE u.role = :role AND u.id != :user_id
            GROUP BY u.id
        ", [
            'user_id' => $user_id,
            'role' => $role
        ])->all();

        return $team_status;
    }

    public function getRecentActivity($user_id) {

        $recent_activity = $this->db->query("
            SELECT lr.*,
                   CONCAT(u.first_name, ' ', u.last_name) AS employee_name,
                   lt.name AS leave_type,
                   m.first_name AS manager_name,
                   lr.start_date AS start_date,
                   lr.end_date AS end_date,
                   lr.reason AS reason,
                   lr.status AS leave_status
            FROM leave_requests lr
            LEFT JOIN users m ON lr.assigned_to = m.id
            INNER JOIN users u ON lr.user_id = u.id    
            LEFT JOIN leave_types lt ON lr.leave_type_id = lt.id
            WHERE lr.user_id = :user_id
            ORDER BY lr.created_at DESC
        ", [
            'user_id' => $user_id,
        ])->all();

        return $recent_activity;
    }




}
