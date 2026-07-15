<?php

namespace App\Services;

use App\Contracts\LeaveAnalyticsInterface;
use App\Traits\HasSharedAnalytics;
use App\Http\Middleware\Auth;
use Core\Database;
use Core\App;


class AdminLeaveService implements LeaveAnalyticsInterface {


    use HasSharedAnalytics;

    private $db;
    private int $adminId;

    private string $userRole;
    private string $userDepartment;

    public function __construct() {

        $this->db = App::resolve(Database::class);
        $this->adminId = Auth::authenticate()['id'];
        $this->userRole = Auth::authenticate()['role'];
        $this->userDepartment = Auth::authenticate()['department'];

    }

    public function getTeamAvailability(): array
    {

        return $this->executeTeamAvailabilityQuery($this->userRole, $this->adminId);

    }

    public function getMonthlyConsumption(): array {

        return $this->executeMonthlyConsumptionQuery($this->userRole, $this->adminId);
    }

    public function getBacklogRequests(): array {

        return $this->executeBacklogQuery($this->userRole, $this->adminId);

    }

    public function getTeamOverlap(): array {

        $pendingRequest = $this->db->query("
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
            WHERE lr.status = 'pending' AND lr.assigned_to != :admin_id
        ", [
            'admin_id' => $this->adminId,
        ])->all();

        $data = [];

        foreach ($pendingRequest as $request) {
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

    public function getTotalUsers(): array {

        $authenticatedUser = $this->db->query("
            SELECT 
                u.id,
                u.first_name AS first_name,
                u.last_name AS last_name,
                u.role AS user_role,
                u.department AS department,
                u.is_active AS is_active
                FROM users u
            WHERE u.id = :admin_id AND u.role = :role
        ", [
         'admin_id' => $this->adminId,
         'role' => $this->userRole
        ])->all();

        $users = [];

        foreach ($authenticatedUser as $user) {
            $users[] = $this->executeTotalUsers(
                $user['department'],
                $user['user_role'],
                $this->adminId,
            );
        }

        return $users;
    }


    public function getRecentActivity(): array {
        $recentActivity = $this->db->query("
            SELECT lr.id,
                   CONCAT(u.first_name, ' ', u.last_name) AS employee_name,
                   lt.name AS leave_type,
                   lr.start_date AS start_date,
                   lr.end_date AS end_date,
                   lr.status AS leave_status,
                   lr.created_at AS created_at
            FROM leave_requests lr
            INNER JOIN users u ON lr.user_id = u.id
            INNER JOIN leave_types lt ON lr.leave_type_id = lt.id
            WHERE u.department = :department 
              AND u.id != :admin_id 
            ORDER BY lr.created_at ASC
            ", [
            'admin_id' => $this->adminId,
            'department' => $this->userDepartment,
        ])->all();

        return $recentActivity;
    }
}