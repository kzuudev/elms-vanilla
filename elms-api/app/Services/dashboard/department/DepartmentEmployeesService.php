<?

namespace App\Services\dashboard\department;

use Core\App;
use Core\Database;
use App\Http\Middleware\Auth;
use App\Exceptions\domain\UnauthorizedException;


class DepartmentEmployeesService {

    private Database $db;
    private Auth $auth;
    private array $user;

    public function __construct() {
        $this->db = App::resolve(Database::class);
        $this->auth = App::resolve(Auth::class);
        $this->user = $this->auth->user();
    }

    private function checkUserRole() {
        if($this->user['role'] !== 'super-admin') {
            throw new UnauthorizedException('You are not authorized to access this resource');
        }
    }

    public function getDepartmentActiveEmployees() {

        $this->checkUserRole();

        $active_employees_by_department = $this->db->query("
            SELECT
                d.id AS department_id,
                d.name AS department_name,
                COUNT(u.id) AS total_active_employees
            FROM users u
            INNER JOIN departments d ON d.id = u.department_id
            WHERE u.deleted_at IS NULL
              AND d.deleted_at IS NULL
              AND u.is_active = :status
              AND u.role != 'super-admin'
              AND u.id != :current_user_id
            GROUP BY d.id, d.name
            ORDER BY total_active_employees DESC
        ", [
            'current_user_id' => $this->user['id'],
            'status' => 1
        ])->all();

        return $active_employees_by_department;

    }

    public function getDepartmentInactiveEmployees() {

        $this->checkUserRole();

        $inactive_employees_by_department = $this->db->query("
            SELECT 
                d.id AS department_id,
                d.name AS department_name,
                COUNT(u.id) AS total_inactive_employees
            FROM users u
            INNER JOIN departments d ON d.id = u.department_id    
            WHERE u.deleted_at IS NULL
              AND d.deleted_at IS NULL
              AND u.is_active = :status
              AND u.role != 'super-admin'
              AND u.id != :current_user_id
            GROUP BY d.id, d.name
            ORDER BY total_inactive_employees DESC
        ", [
            'current_user_id' => $this->user['id'],
            'status' => 0
        ])->all();

        return $inactive_employees_by_department;
    }

    public function getTotalEmployeesAssignedToDepartment() {
        
        $this->checkUserRole();

        $total_employees_assigned_to_department = $this->db->query("
            SELECT
                d.id AS department_id,
                COUNT(u.id) AS total_employees_assigned_to_department
            FROM users u
            INNER JOIN departments d ON d.id = u.department_id
            WHERE u.role != 'super-admin'
                AND u.id != :current_user_id
                AND u.department_id IS NOT NULL
                AND u.deleted_at IS NULL
                AND d.deleted_at IS NULL
            GROUP BY d.id, d.name
            ORDER BY total_employees_assigned_to_department DESC
        ", [
            'current_user_id' => $this->user['id']
        ])->all();

        return $total_employees_assigned_to_department;
    }

    public function getTotalEmployeesNotAssignedToDepartment() {

        $this->checkUserRole();

        $total_employees_not_assigned_to_department = $this->db->query("
            SELECT
                d.id AS department_id,
                COUNT(u.id) AS total_employees_not_assigned_to_department
            FROM users u
            INNER JOIN departments d ON d.id = u.department_id
            WHERE u.role != 'super-admin'
            AND u.id != :current_user_id
            AND u.department_id IS NULL
            AND u.deleted_at IS NULL
            AND d.deleted_at IS NULL
            GROUP BY d.id, d.name
            ORDER BY total_employees_not_assigned_to_department DESC
        ", [
            'current_user_id' => $this->user['id']
        ])->all();

        return $total_employees_not_assigned_to_department;

    }
    
}