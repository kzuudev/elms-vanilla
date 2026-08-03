<?php

namespace App\Services\dashboard;

use App\Contracts\LeaveAnalyticsInterface;
use App\Http\Middleware\Auth;
use App\Traits\HasSharedAnalytics;
use Core\App;
use Core\Database;


class ManagerDashboardService implements LeaveAnalyticsInterface
{

    use HasSharedAnalytics;

    private $db;
    private int $managerId;

    private string $userRole;


    public function __construct()
    {

        $this->db = App::resolve(Database::class);
        $this->managerId = Auth::authenticate()['id'];
        $this->userRole = Auth::authenticate()['role'];

    }


    public function getRemainingTotalBalance(): array
    {
        return $this->executeRemainingTotalBalance($this->managerId);
    }

    public function getPendingApprovalMetrics(): array
    {
        return $this->executePendingApprovalMetrics($this->managerId);
    }

    public function getUsedDays(): array
    {
        return $this->executeUsedDays($this->managerId);
    }

    public function getTeamAvailability(): array
    {

        return $this->executeTeamAvailabilityQuery($this->userRole, $this->managerId);

    }

    public function getMonthlyConsumption(): array
    {

        return $this->executeMonthlyConsumptionQuery($this->userRole, $this->managerId);
    }

    public function getBacklogRequests(): array
    {
        return $this->executeBacklogQuery($this->userRole, $this->managerId);

    }

    public function getTeamOverlap(): array
    {

        $query = "
            SELECT lr.*,
                       lr.user_id AS user_id,
                       u.first_name AS first_name,
                       u.last_name AS last_name,
                       u.role AS user_role,
                       u.department AS department,
                       lt.name AS leave_type,
                       u.department AS department,
                       lr.status AS status,
                       lr.start_date AS start_date,
                       lr.end_date AS end_date
                FROM leave_requests lr
                LEFT JOIN users u ON lr.user_id = u.id
                LEFT JOIN leave_types lt ON lr.leave_type_id = lt.id
                WHERE lr.status = 'pending'
        ";

        $params = [];

        if ($this->userRole === 'manager') {
            $query .= " AND lr.assigned_to = :manager_id";
            $params['manager_id'] = $this->managerId;
        }

        $pendingRequests = $this->db->query($query, $params)->all();

        $data = [];

        foreach ($pendingRequests as $request) {

            $overlap = $this->executeTeamOverlapQuery(
                $request['department'],
                $request['user_id'],
                $request['start_date'],
                $request['end_date']
            );

            $data[] = [
                'user_id' => $request['user_id'],
                'first_name' => $request['first_name'],
                'last_name' => $request['last_name'],
                'leave_type' => $request['leave_type'],
                'status' => $request['status'],
                'department' => $request['department'],
                'start_date' => $request['start_date'],
                'end_date' => $request['end_date'],
                'overlap' => $overlap,
            ];
        }

        return $data;


    }


    public function getRecentActivity(): array
    {

        $recentActivity = $this->db->query("
         SELECT lr.*,
                lt.name AS leave_type_name,
                u.first_name AS first_name,
                u.last_name AS last_name,
                lr.status AS leave_status,
                lr.start_date AS start_date,
                lr.end_date AS end_date,
                lr.created_at AS created_at
            FROM leave_requests lr
            LEFT JOIN users u ON lr.user_id = u.id
            LEFT JOIN leave_types lt ON lr.leave_type_id = lt.id
            WHERE lr.assigned_to = :manager_id
        ", [
            'manager_id' => $this->managerId,
        ])->all();

        $formattedActivity = array_map([self::class, 'getActivityData'], $recentActivity);

        return $formattedActivity;
    }


    public static function getActivityData($activity) : array {

        $employeeName = $activity['first_name'] . ' ' . $activity['last_name'];
        $leaveType = $activity['leave_type_name'] ?? ['No leave type'];
        $startDate = $activity['start_date'] ?? ['No start date'];
        $endDate = $activity['end_date'] ?? ['No end date'];
        $status = $activity['leave_status'] ?? ['No status'];
        $createdAt = $activity['created_at'] ?? ['No date'];

        return [
            'employee_name' => $employeeName,
            'leave_type' => $leaveType,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'leave_status' => $status,
            'created_at' => $createdAt,
        ];

    }
}