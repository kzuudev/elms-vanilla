<?php


namespace App\Services\employees;


use App\Http\Middleware\Auth;
use Core\App;
use Core\Database;



class EmployeeSummaryService {

    private Database $db;

    private ?array $current_user;
    private int $current_user_id;
    private string $current_user_role;
    private string $current_user_department;

    public function __construct() {

        $this->db = App::resolve(Database::class);
        $this->current_user = Auth::user();
        $this->current_user_id = (int) ($this->current_user['id'] ?? 0);
        $this->current_user_role = (string) ($this->current_user['role'] ?? '');
        $this->current_user_department = (string) ($this->current_user['department'] ?? '');
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
            'department' => $this->current_user_department,
            'user_id' => $this->current_user_id,

        ];

        if ($this->current_user_role === "manager") {
            $query .= " AND u.assigned_to = :manager_id";
            $params['manager_id'] = $this->current_user_id;
        }

        $summary = $this->db->query($query, $params)->find();

        return [
            'success' => true,
            'message' => 'Employee summary fetched successfully',
            'summary' => $summary
        ];

    }
}