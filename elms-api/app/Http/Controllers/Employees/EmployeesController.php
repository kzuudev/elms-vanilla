<?php


namespace App\Http\Controllers\Employees;

use App\Http\Middleware\Auth;
use App\Services\employees\EmployeeSummaryService;
use Core\App;
use Core\Database;


class EmployeesController {

    private EmployeeSummaryService $employeeSummaryService;

    private Database $db;
    private ?array $currentUser;
    private int $currentUserId;
    private string $currentUserRole;
    private string $currentUserDepartment;

    public function __construct() {
        $this->employeeSummaryService = App::resolve(EmployeeSummaryService::class);

        $this->db = App::resolve(Database::class);
        $user = Auth::user();
        $this->currentUser = $user;
        $this->currentUserId = (int) ($user['id'] ?? 0);
        $this->currentUserRole = (string) ($user['role'] ?? '');
        $this->currentUserDepartment = (string) ($user['department'] ?? '');
    }

    public function index() {
        
        if(!$this->currentUserId) {
            http_response_code(401);
            echo json_encode(["error" => "Admin not found"]);
            exit;
        }

        $search = $_GET['search'] ?? "";
        $status = $_GET['status'] ?? "";
        $department = $_GET['department'] ?? "";
        $role = $_GET['role'] ?? "";

        $query = "
                SELECT id,
                    first_name, 
                    last_name, 
                    email, 
                    phone, 
                    role, 
                    department, 
                    is_active,
                    hired_date
                FROM users 
                WHERE 1=1 
        ";

        $params = [];

        if($this->currentUserRole === 'manager') {
            $query .= " AND assigned_to = :current_user_id ";
            $params = ['current_user_id' => $this->currentUserId];
        }else if ($this->currentUserRole === 'admin') {
            $query .= " AND department = :department AND role != 'super admin'";
            $params = [
                'department' => $this->currentUserDepartment];
        }

        if(!empty($search)) {
            $query .= " AND (first_name LIKE :search OR last_name LIKE :search OR email LIKE :search) ";
            $params['search'] = "%$search%";
        }

        if(!empty($status)) {
            $query .= " AND is_active = :status ";
            $params['status'] = $status;
        }

        if(!empty($department)) {
            $query .= " AND department = :department ";
            $params['department'] = $department;
        }

        if(!empty($role)) {
            $query .= " AND role = :role ";
            $params['role'] = $role;
        }

        $employees = $this->db->query($query, $params)->all();

        http_response_code(200);
        echo json_encode([
             'success' => true,
             'message' => 'Employee List fetched successfully',
             'id' => $this->currentUserId,
             'employees' => $employees ?: [],
             'search' => $search
         ]);
    }

    

    public function show($id) {
      
        if(!$this->currentUserId) {
            http_response_code(401);
            echo json_encode(["error" => "Admin not found"]);
            exit;
        }

        $user = $db->query("
            SELECT id, 
                   first_name, 
                   last_name, 
                   email, 
                   phone, 
                   role, 
                   assigned_to as manager_id,
                   department, 
                   is_active, 
                   hired_date,
                   salary 
                   FROM users
            WHERE id = :id
        ", [
            'id' => $id
        ])->find();

        if (!$user) {
            http_response_code(404);
            echo json_encode(["error" => "User not found"]);
            exit;
        }


        // select all possible managers
        $managers = $db->query("
            SELECT id, CONCAT(first_name, ' ', last_name) as name 
            FROM users 
            WHERE role = 'manager' AND is_active = 1
        ")->all();

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Existing user details fetched successfully',
            'id' => $id,
            'user' => $user
        ]);
    }


    public function patch($id) {

        $existingUser = $this->db->query("SELECT * FROM users WHERE id = :id", [
            'id' => $id
        ])->find();

        if (!$existingUser) {
            http_response_code(404);
            echo json_encode(["error" => "User to edit not found"]);
            exit;
        }

        if(!$current_user_id) {
            http_response_code(401);
            echo json_encode(["error" => "Admin not found"]);
            exit;
        }

        $input = json_decode(file_get_contents('php://input'), true);

        $first_name = array_key_exists('first_name', $input) ? $input['first_name'] : $existingUser['first_name'];
        $last_name  = array_key_exists('last_name', $input)  ? $input['last_name']  : $existingUser['last_name'];
        $email      = array_key_exists('email', $input)      ? $input['email']      : $existingUser['email'];
        $phone      = array_key_exists('phone', $input)      ? $input['phone']      : $existingUser['phone'];
        $role       = array_key_exists('role', $input)       ? $input['role']       : $existingUser['role'];
        $department = array_key_exists('department', $input) ? $input['department'] : $existingUser['department'];
        $salary     = array_key_exists('salary', $input)     ? $input['salary']     : $existingUser['salary'];
        $hired_date = array_key_exists('hired_date', $input) ? $input['hired_date'] : $existingUser['hired_date'];
        $is_active  = array_key_exists('is_active', $input)
            ? (int)$input['is_active']
            : (int)$existingUser['is_active'];
        $manager_id = array_key_exists('manager_id', $input)
            ? (!empty($input['manager_id']) ? (int)$input['manager_id'] : null)
            : $existingUser['manager_id'];

        $db->query("
        UPDATE 
            users 
            SET first_name = :first_name, 
                last_name = :last_name, 
                email = :email, 
                phone = :phone, 
                role = :role, 
                department = :department, 
                assigned_to = :assigned_to,
                is_active = :is_active, 
                hired_date = :hired_date, 
                salary = :salary 
            WHERE id = :id
            ", [
                'id'          => $id,
                'first_name'  => $first_name,
                'last_name'   => $last_name,
                'email'       => $email,
                'phone'       => $phone,
                'role'        => $role,
                'department'  => $department,
                'assigned_to'  => $manager_id,
                'is_active'   => $is_active,
                'hired_date' => empty($hired_date) ? null : $hired_date,
                'salary'      => empty($salary) ? null : $salary
        ]);

        $editedUser = $this->db->query("
            SELECT id, first_name, last_name, email, phone, role, department, assigned_to, is_active, hired_date, salary 
            FROM users
            WHERE id = :id", 
            ['id' => $id])->find();

        if(!$editedUser) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update user']);
            exit;
        }

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'User profile updated successfully',
            'user'    => $editedUser
        ]);
    }


    public function destroy($id) {

        if(!$this->currentUserId) {
            http_response_code(401);
            echo json_encode(["error" => "Admin not found"]);
            exit;
        }


        $deleteUser = $this->db->query("UPDATE employees SET is_active = 0 WHERE id = :id", [
            'id' => $id
        ]);

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'User deleted successfully',
            'id' => $id,
            'deleted' => $deleteUser
        ]);

    }

    public function profile($id) {

        if(!$this->currentUserId) {
            http_response_code(401);
            echo json_encode(["error" => "Unauthorized Access"]);
            exit;
        }

        $user = $this->db->query("
             SELECT u.id,
                 u.first_name, 
                 u.last_name,
                 u.email,  
                 u.phone,
                 u.role, 
                 u.assigned_to,
                 u.department,
                 u.salary,
                 u.hired_date,
                 u.is_active,
                 lt.name as leave_type_name,
                 lb.remaining_balance as remaining_balance
            FROM users u 
            LEFT JOIN leave_balance lb ON lb.user_id = u.id
            LEFT JOIN users m ON m.id = u.assigned_to
            LEFT JOIN leave_types lt ON lb.leave_type_id = lt.id
            WHERE u.id = :id
        ", [
            'id' => $id
        ])->all();


        if(!$user) {
            http_response_code(404);
            echo json_encode(["error" => "Employee not found"]);
            exit;
        }



        $structuredData = [
            'id' => $user[0]['id'],
            'first_name' => $user[0]['first_name'],
            'last_name' => $user[0]['last_name'],
            'email' => $user[0]['email'],
            'phone' => $user[0]['phone'],
            'role' => $user[0]['role'],
            'department' => $user[0]['department'],
            'manager' => [
                'id' => $user[0]['assigned_to'],
                'name' => $user[0]['manager_name'] ?? null,
            ],
            'is_active' => $user[0]['is_active'],
            'hired_date' => $user[0]['hired_date'],
            'salary' => $user[0]['salary'],
            'leave_balance' => []
        ];

        foreach($user as $employee) {
            if(!empty($employee['leave_type_name'])) {
                $structuredData['leave_balance'][] = [
                    'leave_type_name' => $employee['leave_type_name'],
                    'remaining_balance' => $employee['remaining_balance'],
                ];
            }
        }

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Employee details fetched successfully',
            'id' => $id,
            'employee' => $structuredData
        ]);
    }

    public function summary() {

        if(!$this->currentUserId) {
            http_response_code(401);
            echo json_encode(["error" => "Admin not found"]);
            exit;
        }

        $employeeSummary = $this->employeeSummaryService->getEmployeeSummary();

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Employee summary fetched successfully',
            'id' => $this->currentUserId,
            'employee_summary' => $employeeSummary
        ]);
    }

    /**
     * Managers for the invite form (department-scoped for department admins).
     */
    public function managers() {
        if (!$this->currentUserId) {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Unauthorized']);
            return;
        }

        if (!in_array($this->currentUserRole, ['admin', 'super admin'], true)) {
            http_response_code(403);
            echo json_encode(['success' => false, 'error' => 'Only admins can list managers']);
            return;
        }

        $query = "
            SELECT id, first_name, last_name, email, role, department
            FROM users
            WHERE role = 'manager'
            AND is_active = 1
        ";
        $params = [];

        // Department admin only sees managers in their department
        if ($this->currentUserRole === 'admin') {
            $query .= " AND department = :department";
            $params['department'] = $this->currentUserDepartment;
        }

        $query .= " ORDER BY first_name, last_name";

        $managers = $this->db->query($query, $params)->all();

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Managers fetched successfully',
            'managers' => $managers ?: [],
        ]);
        return;
    }



}