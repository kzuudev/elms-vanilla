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
