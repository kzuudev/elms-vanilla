<?php

namespace App\Services\dashboard;

use App\Contracts\LeaveAnalyticsInterface;
use App\Http\Middleware\Auth;
use App\Exceptions\domain\UnauthorizedException;
use App\Traits\HasSharedAnalytics;
use Core\App;
use Core\Database;


class AdminDashboardService implements LeaveAnalyticsInterface {


    use HasSharedAnalytics;

    private Database $db;
    private int $current_user_id;

    private string $current_user_role;
    private string $current_user_department;

    public function __construct() {

        $this->db = App::resolve(Database::class);
        $this->current_user_id = Auth::authenticate()['id'];
        $this->current_user_role = Auth::authenticate()['role'];
        $this->current_user_department = Auth::authenticate()['department'];

    }

    private function validateUser() {
        if($this->current_user_role !== 'admin') {
            throw new UnauthorizedException('You are not authorized to access this resource');
        }
    }


    public function getRemainingTotalBalance(): array
    {
        $this->validateUser();
        return $this->executeRemainingTotalBalance($this->current_user_id);
    }

    public function getPendingApprovalMetrics(): array
    {
        $this->validateUser();
        return $this->executePendingApprovalMetrics($this->current_user_id);
    }

    public function getUsedDays(): array
    {
        $this->validateUser();
        return $this->executeUsedDays($this->current_user_id);
    }

    public function getTeamAvailability(): array
    {
        $this->validateUser();
        return $this->executeTeamAvailabilityQuery($this->current_user_role, $this->current_user_id, $this->current_user_department);

    }

    public function getMonthlyConsumption(): array {

        $this->validateUser();
        return $this->executeMonthlyConsumptionQuery($this->current_user_role, $this->current_user_id);
    }

    public function getBacklogRequests(): array {

        $this->validateUser();
        return $this->executeBacklogQuery($this->current_user_role, $this->current_user_id);

    }

    public function getTeamOverlap(): array {

        $this->validateUser();
        $pending_requests = $this->db->query("
            SELECT lr.*, 
                   lr.user_id AS user_id,
                   u.first_name AS first_name, 
                   u.last_name AS last_name,
                   lt.name AS leave_type_name,   
                   u.role AS user_role,
                   u.department AS department,
                   lr.start_date AS start_date, 
                   lr.end_date AS end_date
            FROM leave_requests lr
            LEFT JOIN users u ON lr.user_id = u.id
            LEFT JOIN leave_types lt ON lr.leave_type_id = lt.id
            WHERE lr.status = 'pending' AND lr.assigned_to != :current_user_id
        ", [
            'current_user_id' => $this->current_user_id,
        ])->all();

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
                'user_first_name' => $request['first_name'],
                'user_last_name' => $request['last_name'],
                'leave_type_name' => $request['leave_type_name'],
                'department' => $request['department'],
                'start_date' => $request['start_date'],
                'end_date' => $request['end_date'],
                'overlap' => $overlap
            ];
        }

        return $data;

    }
    

    public function getRecentActivity(): array {
        $this->validateUser();
        $recent_activity = $this->db->query("
            SELECT lr.id,
                   CONCAT(u.first_name, ' ', u.last_name) AS employee_name,
                   lt.name AS leave_type,
                   lr.start_date AS start_date,
                   lr.end_date AS end_date,
                   lr.status AS leave_status,
                   lr.created_at AS created_at,
                   lr.total_days AS total_days
            FROM leave_requests lr
            INNER JOIN users u ON lr.user_id = u.id
            INNER JOIN leave_types lt ON lr.leave_type_id = lt.id
            WHERE u.department = :department 
              AND u.id != :current_user_id 
            ORDER BY lr.created_at ASC
            ", [
            'current_user_id' => $this->current_user_id,
            'department' => $this->current_user_department,
        ])->all();

        return $recent_activity;
    }

}