<?php

namespace App\Services;

use App\Contracts\LeaveAnalyticsInterface;
use App\Http\Middleware\Auth;
use Core\Database;
use Core\App;
use App\Traits\HasSharedAnalytics;



class ManagerLeaveService implements LeaveAnalyticsInterface {

    use HasSharedAnalytics;
    private $db;
    private int $managerId;

    private string $userRole;





    public function __construct() {

        $this->db = App::resolve(Database::class);
        $this->managerId = Auth::authenticate()['id'];
        $this->userRole = Auth::authenticate()['role'];

    }

    public function getTeamAvailability(): array
    {

        return $this->executeTeamAvailabilityQuery($this->userRole, $this->managerId);

    }

    public function getMonthlyConsumption(): array {

        return $this->executeMonthlyConsumptionQuery($this->userRole, $this->managerId);
    }

    public function getBacklogRequests(): array {
        return $this->executeBacklogQuery($this->userRole, $this->managerId);

    }

    public function getTeamOverlap(): array {

        $query = "
            SELECT lr.*,
                       lr.user_id AS user_id,
                       u.first_name AS first_name,
                       u.last_name AS last_name,
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

        if($this->userRole === 'manager') {
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
                'department' => $request['department'],
                'start_date' => $request['start_date'],
                'end_date' => $request['end_date'],
                'overlap' => $overlap,
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
            WHERE u.id = :manager_id AND u.role = :role
        ", [
            'manager_id' => $this->managerId,
            'role' => $this->userRole,
        ])->all();

        $users = [];

        foreach ($authenticatedUser as $user) {

            $users[] = $this->executeTotalUsers(
                $user['department'],
                $user['user_role'],
                $this->managerId,
            );

//            $data[] = [
//                'user_id' => $user['id'],
//                'first_name' => $user['first_name'],
//                'last_name' => $user['last_name'],
//                'user_role' => $user['user_role'],
//                'department' => $user['department'],
//                'is_active' => $user['is_active'],
//                'total_users' => $users,
//            ];




        }

        return $users;
    }



}