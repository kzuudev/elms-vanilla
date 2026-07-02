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

    private int $userRole;



    public function __construct() {

        $this->db = App::resolve(Database::class);
        $this->managerId = Auth::authenticate()['id'];
        $this->userRole = Auth::authenticate()['role'];

    }

    public function getTeamAvailability(): array
    {

        return $this->executeTeamAvailabilityQuery($this->managerId, $this->userRole);

    }

    public function getMonthlyConsumption(): array {

        return $this->executeMonthlyConsumptionQuery($this->managerId, $this->userRole);
    }

    public function getBacklogRequests(): array {
        s
        return $this->executeBacklogQuery($this->managerId, $this->userRole);

    }

    public function getTeamOverlap(): array {

        $pendingRequest = $this->db->query("
            SELECT lr.*, 
                   lr.user_id AS user_id,
                   u.first_name AS user_first_name, 
                   u.last_name AS user_last_name,
                   lt.name AS leave_type_name,   
                   u.department AS department,
                   lr.start_date AS start_date, 
                   lr.end_date AS end_date
            FROM leave_requests lr
            LEFT JOIN users u ON lr.user_id = u.id
            LEFT JOIN leave_types lt ON lr.leave_type_id = lt.id
            WHERE lr.status = 'pending' AND lr.assigned_to = :manager_id
        ", [
            'manager_id' => $this->managerId,
        ])->all();

        return $this->executeTeamOverlapQuery(
            $pendingRequest['department'],
            $pendingRequest['start_date'],
            $pendingRequest['end_date'],
            $pendingRequest['user_id'] // the applicant user id
        );

    }



}