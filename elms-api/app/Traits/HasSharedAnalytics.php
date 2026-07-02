<?php



namespace App\Traits;


use Core\App;
use Core\Database;


trait HasSharedAnalytics {

    protected function db(): Database
    {
        return App::resolve(Database::class);
    }


    /**
     * Shared SQL query for the team coverage roster stream
     */

    protected function executeTeamAvailabilityQuery(string $userRole, int $currentUserId): array {

        $query = "
            SELECT
                COUNT(DISTINCT lr.used_id) as total_users,
                u.id as user_id,
                u.name as employee_name,
                u.role as user_position,
                u.department as department,
                lr.leave_type_id as leave_type_id,
                lt.name as leave_type_name,
                lr.start_date as start_date,
                lr.end_date as end_date
            FROM leave_requests lr
            LEFT JOIN users u ON lr.user_id = u.id
            LEFT JOIN leave_types lt ON lr.leave_type_id = lt.id
            WHERE lr.user_id != :current_user_id AND lr.status != 'rejected'
            GROUP BY u.id, u.name, u.role, u.department, lr.leave_type_id, lt.name, lr.start_date, lr.end_date
        ";


        $params = [
            'current_user_id' => $currentUserId,
        ];

        if($userRole === 'manager') {
            $query .= ' AND lr.assigned_to = :manager_id';
            $params['manager_id'] = $currentUserId;
        }

        return $this->db->query($query, $params)->all();

    }

    /**
     * Shared SQL query for the monthly consumption metrics
     */
    protected function executeMonthlyConsumptionQuery(int $currentUserId, string $userRole, ): array {


        $query = "
            SELECT
                DATE_FORMAT(lr.start_date, '%b') AS month_name,
                MONTH(lr.start_date) AS month_num,
               s SUM(lr.total_days) AS total_used_day
            FROM leave_requests lr
            WHERE lr.user_id != :current_user_id AND lr.status = 'approved'
            GROUP BY MONTH(lr.start_date), DATE_FORMAT(lr.start_date, '%b')
        ";

        $params = [
            'current_user_id' => $currentUserId,
        ];

        if($userRole === 'manager') {
            $query .= ' AND lr.assigned_to = :manager_id';
            $params['manager_id'] = $currentUserId;

        }

        return $this->db->query($query, $params)->all();
    }


    /**
     * Shared SQL query for the approval backlog counter
     */
    protected function executeBacklogQuery(int $currentUserId, string $userRole ): array {



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

    protected function executeTeamOverlapQuery(string $department, string $startDate, string $endDate, int $applicantUserId): array {

        $query = "
            SELECT
               lr.id,
               u.name as employee_name,
               lr.start_date as start_date,
               lr.end_date as end_date,
               lr.leave_type_id as leave_type_id,
               lt.name as leave_type_name,
               lr.start_date as start_date,
               lr.end_date as end_date
            FROM leave_requests lr
            LEFT JOIN users u ON lr.user_id = u.id
            LEFT JOIN leave_types lt ON lr.leave_type_id = lt.id
            WHERE u.department = :department 
              AND lr.user_id != :current_user_id 
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

