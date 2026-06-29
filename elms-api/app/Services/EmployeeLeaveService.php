<?php

namespace App\Services;

use Core\App;
use Core\Database;


class EmployeeLeaveService {


    private $db;

    public function __construct() {
        $this->db = App::resolve(Database::class);
    }

    public function getRemainingTotalBalance($user_id) {

        $totalBalance = $this->db->query("
            SELECT 
                SUM(remaining_balance) AS grand_total
            FROM leave_balance lb
            WHERE user_id = :user_id
        ", [
            'user_id' => $user_id,
        ])->all();

        return $totalBalance;

    }


    public function getPendingApprovalMetrics($user_id) {

        $pendingLeaveType = $this->db->query("
            SELECT 
                SUM(total_days) as total_days,
                COUNT(*) as queued_leave_count
            FROM leave_requests lr
            WHERE lr.user_id = :user_id AND lr.status = 'pending'
        ", [
            'user_id' => $user_id,
        ])->all();


        return $pendingLeaveType;
    }

    public function getUsedDays($user_id) {

        $usedDays = $this->db->query("
            SELECT
                SUM(used_days) as total_used_days,
                SUM(allocated_days) as total_allocated_days
            FROM leave_balance lb
            WHERE lb.user_id = :user_id
        ", [
            'user_id' => $user_id,
        ])->all();

        return $usedDays;
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

    public function getTeamStatus($user_id, $role) {

        $teamStatus = $this->db->query("
            SELECT u.*,
                lr.status AS leave_request_status,
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
                lt.name AS leave_type_name,
                m.first_name AS manager_name,
                lr.start_date AS request_date,
                lr.end_date AS return_date,
                lr.status AS request_status
            FROM leave_requests lr
            LEFT JOIN users m ON lr.assigned_to = m.id
            LEFT JOIN leave_types lt ON lr.leave_type_id = lt.id
            WHERE lr.user_id = :user_id
            ORDER BY lr.created_at ASC
        ", [
            'user_id' => $user_id,
        ])->all();

        return $recentActivity;
    }




}
