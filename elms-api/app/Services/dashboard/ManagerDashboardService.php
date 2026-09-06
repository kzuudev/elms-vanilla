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
    private int $current_user_id;

    private string $current_user_role;
    private string $current_user_department;

    public function __construct()
    {

        $this->db = App::resolve(Database::class);
        $this->current_user_id = Auth::authenticate()['id'];
        $this->current_user_role = Auth::authenticate()['role'];
        $this->current_user_department = Auth::authenticate()['department'];

    }


    public function getRemainingTotalBalance(): array
    {
        return $this->executeRemainingTotalBalance($this->current_user_id);
    }

    public function getPendingApprovalMetrics(): array
    {
        return $this->executePendingApprovalMetrics($this->current_user_id);
    }

    public function getUsedDays(): array
    {
        return $this->executeUsedDays($this->current_user_id);
    }

    public function getTeamAvailability(): array
    {

        return $this->executeTeamAvailabilityQuery($this->current_user_role, $this->current_user_id, $this->current_user_department);

    }

    public function getMonthlyConsumption(): array
    {

        return $this->executeMonthlyConsumptionQuery($this->current_user_role, $this->current_user_id);
    }

    public function getBacklogRequests(): array
    {
        return $this->executeBacklogQuery($this->current_user_role, $this->current_user_id, $this->current_user_department);

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

        if ($this->current_user_role === 'manager') {
            $query .= " AND lr.assigned_to = :manager_id";
            $params['manager_id'] = $this->current_user_id;
        }

        $pending_requests = $this->db->query($query, $params)->all();

        $data = [];

        foreach ($pending_requests as $request) {

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

        $recent_activity = $this->db->query("
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
            WHERE lr.assigned_to = :current_user_id
        ", [
            'current_user_id' => $this->current_user_id,
        ])->all();

        $formatted_activity = array_map([$this, 'getActivityData'], $recent_activity);

        return $formatted_activity;
    }


    public static function getActivityData($activity) : array {

        $employee_name = $activity['first_name'] . ' ' . $activity['last_name'];
        $leave_type = $activity['leave_type_name'] ?? ['No leave type'];
        $start_date = $activity['start_date'] ?? ['No start date'];
        $end_date = $activity['end_date'] ?? ['No end date'];
        $status = $activity['leave_status'] ?? ['No status'];
        $created_at = $activity['created_at'] ?? ['No date'];

        return [
            'employee_name' => $employee_name,
            'leave_type' => $leave_type,
            'start_date' => $start_date,
            'end_date' => $end_date,
            'leave_status' => $status,
            'created_at' => $created_at,
        ];

    }
}