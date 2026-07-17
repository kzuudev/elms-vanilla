<?php

namespace App\Services;

use App\Http\Middleware\Auth;
use App\Traits\HasSharedAnalytics;
use Core\App;
use Core\Database;


class EmployeeLeaveService {

    use HasSharedAnalytics;
    private $db;

    private int $userId;



    public function __construct() {
        $this->db = App::resolve(Database::class);
        $this->userId = Auth::authenticate()['id'];
    }

    public function getRemainingTotalBalance(): array
    {

        return $this->executeRemainingTotalBalance($this->userId);

    }


    public function getPendingApprovalMetrics(): array
    {

        return $this->executePendingApprovalMetrics($this->userId);
    }

    public function getUsedDays(): array
    {

        return $this->executeUsedDays($this->userId);

    }

    public function getMonthlyLeaveConsumption($user_id) {

        $monthlyLeaveConsumption = $this->db->query("
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

        return $monthlyLeaveConsumption;
    }

    public function getTeamAvailability($user_id, $role) {

        $teamStatus = $this->db->query("
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

        return $teamStatus;
    }

    public function getRecentActivity($user_id) {

        $recentActivity = $this->db->query("
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
            ORDER BY lr.created_at ASC
        ", [
            'user_id' => $user_id,
        ])->all();

        return $recentActivity;
    }




}
