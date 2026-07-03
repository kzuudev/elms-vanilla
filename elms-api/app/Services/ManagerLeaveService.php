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
    private int $currentUserId;

    private string $userRole;





    public function __construct() {

        $this->db = App::resolve(Database::class);
        $this->currentUserId = Auth::authenticate()['id'];
        $this->userRole = Auth::authenticate()['role'];

    }

    public function getTeamAvailability(): array
    {

        return $this->executeTeamAvailabilityQuery($this->userRole, $this->currentUserId);

    }

    public function getMonthlyConsumption(): array {

        return $this->executeMonthlyConsumptionQuery($this->userRole, $this->currentUserId);
    }

    public function getBacklogRequests(): array {
        return $this->executeBacklogQuery($this->userRole, $this->currentUserId);

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
            $params['manager_id'] = $this->currentUserId;
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



}