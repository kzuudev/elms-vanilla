<?php



namespace App\Traits;


use Core\App;
use Core\Database;


trait HasSharedAnalytics {

    protected function db(): Database
    {
        return App::resolve(Database::class);
    }

    public function executeRemainingTotalBalance(int $userId): array {

        $totalBalance = $this->db->query("
            SELECT 
                SUM(remaining_balance) AS grand_total
            FROM leave_balance lb
            WHERE user_id = :user_id
        ", [
            'user_id' => $userId,
        ])->all();

        return $totalBalance;
    }

    public function executePendingApprovalMetrics(int $userId): array {

        $pendingLeaveType = $this->db->query("
            SELECT 
                COALESCE(SUM(total_days), 0) as total_days,
                COUNT(*) as queued_leave_count
            FROM leave_requests lr
            WHERE lr.user_id = :user_id AND lr.status = 'pending'
        ", [
            'user_id' => $userId,
        ])->all();


        return $pendingLeaveType;
    }

    public function executeUsedDays(int $userId): array {
        $usedDays = $this->db->query("
            SELECT
                SUM(used_days) as total_used_days,
                SUM(allocated_days) as total_allocated_days
            FROM leave_balance lb
            WHERE lb.user_id = :user_id
        ", [
            'user_id' => $userId,
        ])->all();

        return $usedDays;
    }

    /**
     * Shared SQL query for the team coverage roster stream
     */

    protected function executeTeamAvailabilityQuery(string $userRole, int $currentUserId): array {

        $query = "
            SELECT
                u.id as id,
                CONCAT(u.first_name, ' ', u.last_name) AS name,
                u.role as role,
                u.department as department,
                u.is_active as is_active,
                lt.name as leave_type,
                lr.status as leave_status,
                lr.start_date as start_date,
                lr.end_date as end_date
            FROM users u
            LEFT JOIN leave_requests lr 
                ON u.id = lr.user_id 
                AND lr.status = 'approved' 
                AND lr.deleted_at IS NULL
                AND CURRENT_DATE >= lr.start_date 
                AND CURRENT_DATE <= lr.end_date
            LEFT JOIN leave_types lt ON lr.leave_type_id = lt.id 
            WHERE u.id != :current_user_id
              AND u.is_active = 1 
        ";

        $params = [
            'current_user_id' => $currentUserId,
        ];

        if($userRole === 'manager') {
            $query .= ' AND u.assigned_to = :manager_id';
            $params['manager_id'] = $currentUserId;
        }

        return $this->db->query($query, $params)->all();

    }

    /**
     * Shared SQL query for the monthly consumption metrics
     */
    protected function executeMonthlyConsumptionQuery(string $userRole, int $currentUserId): array {

        $query = "
            SELECT 
                lr.user_id,
                u.first_name AS first_name,
                u.last_name AS last_name,
                u.role AS user_role,
                u.department AS department,
                DATE_FORMAT(lr.start_date, '%b') AS month_name,
                MONTH(lr.start_date) AS month_num,
                SUM(lr.total_days) AS total_used_days
            FROM leave_requests lr
            LEFT JOIN users u ON lr.user_id = u.id
            WHERE lr.user_id != :current_user_id AND lr.status = 'approved'
        ";

        $params = [
            'current_user_id' => $currentUserId,
        ];

        if($userRole === 'manager') {
            $query .= ' AND lr.assigned_to = :manager_id';
            $params['manager_id'] = $currentUserId;

        }

        $query .= " 
        GROUP BY lr.user_id, u.first_name, u.last_name, month_num, month_name
        ORDER BY u.last_name ASC, month_num ASC
        ";

        return $this->db->query($query, $params)->all();
    }


    /**
     * Shared SQL query for the approval backlog counter
     */
    protected function executeBacklogQuery(string $userRole, int $currentUserId): array
    {


        $query = " 
            SELECT
                COUNT(*) as pending_count,
                IFNULL(ROUND(AVG(DATEDIFF(NOW(), lr.created_at)), 1), 0) as average_days_in_queue,
                IFNULL(MAX(DATEDIFF(NOW(), lr.created_at)), 0) as oldest_request_days
                from leave_requests lr
            WHERE lr.user_id != :current_user_id AND lr.status = 'pending'
        ";

        $params = [
            'current_user_id' => $currentUserId,
        ];


        if ($userRole === 'manager') {
            $query .= ' AND lr.assigned_to = :manager_id';
            $params['manager_id'] = $currentUserId;
        }


        return $this->db->query($query, $params)->all();


    }

    /**
     * Determines if a specific leave request dates overlap with existing approved leaves
     * within the same department.
     */

    protected function executeTeamOverlapQuery(string $department, int $applicantUserId, string $startDate, string $endDate): array {

        $query = "
            SELECT
               lr.id,
               u.first_name as employee_first_name,
               u.last_name as employee_last_name,
               u.role as user_position,
               u.department as department,
               lr.start_date as start_date,
               lr.end_date as end_date,
               lr.total_days as total_days,
               lr.leave_type_id as leave_type_id,
               lr.status as leave_status,
               lt.name as leave_type,
               lr.start_date as start_date,
               lr.end_date as end_date
            FROM leave_requests lr
            LEFT JOIN users u ON lr.user_id = u.id
            LEFT JOIN leave_types lt ON lr.leave_type_id = lt.id
            WHERE u.department = :department 
              AND lr.user_id != :applicant_user_id 
              AND lr.status = 'approved'
              AND (lr.start_date <= :end_date AND lr.end_date >= :start_date)
        ";

        $params = [
            'department'        => $department,
            'applicant_user_id' => $applicantUserId,
            'start_date'        => $startDate,
            'end_date'          => $endDate,
        ];

        return $this->db->query($query, $params)->all();

    }


    
}

