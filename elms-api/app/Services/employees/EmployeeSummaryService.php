<?php


namespace App\Services\employees;


use App\Http\Middleware\Auth;
use App\Traits\HasSharedAnalytics;
use Core\App;
use Core\Database;



class EmployeeSummaryService {

    private Database $db;

    private int $id;
    private string $role;
    private string $department;

    public function __construct() {
        $this->db = App::resolve(Database::class);
        $this->id = Auth::authenticate()['id'];
        $this->role = Auth::authenticate()['role'];
        $this->department = Auth::authenticate()['department'];
    }


    public function getEmployeeSummary() {

        $query = "
            SELECT
                COUNT(DISTINCT u.id) AS total_employees,
                COUNT(CASE WHEN is_active = 1 THEN 1 END) AS total_active_employees,
                COUNT(CASE WHEN is_active = 0 THEN 1 END) AS total_inactive_employees,
                COUNT(CASE WHEN lr.id IS NOT NULL THEN u.id END) AS total_on_leave_employees
            FROM users u
            LEFT JOIN leave_requests lr ON u.id = lr.user_id
                AND lr.status = 'approved'
                AND CURRENT_DATE() BETWEEN lr.start_date AND lr.end_date
            WHERE department = :department AND u.id != :user_id
        ";

        $params = [
            'department' => $this->department,
            'user_id' => $this->id,

        ];

        if ($this->role === "manager") {
            $query .= " AND u.assigned_to = :manager_id";
            $params['manager_id'] = $this->id;
        }

        return $this->db->query($query, $params)->find();

    }
}