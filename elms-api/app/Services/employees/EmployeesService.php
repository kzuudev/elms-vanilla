<?php

namespace App\Services\employees;

use App\Http\Middleware\Auth;
use App\Http\Forms\EmployeeForm;
use Core\App;
use Core\Database;



class EmployeesService {

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

    public function getEmployees() {

        $employee_form = new EmployeeForm();

        if(!$this->current_user_id) {
            $this->db->response(401, false, 'Admin not found', ['id' => $this->current_user_id]);
            return;
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

        if($this->current_user_role === 'manager') {
            $query .= " AND assigned_to = :current_user_id ";
            $params = ['current_user_id' => $this->current_user_id];
        }else if ($this->current_user_role === 'admin') {
            $query .= " AND department = :department AND role != 'super admin' AND id != :current_user_id";
            $params = [
                'department' => $this->current_user_department,
                'current_user_id' => $this->current_user_id
            ];
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

        $this->db->response(200, true, 'Employee List fetched successfully', [
             'id' => $this->current_user_id,
             'employees' => $employees ?: [],
             'search' => $search
         ]);

         return $employees;
    }

    public function getEmployee($id) {

        if(!$this->current_user_id) {
            $this->db->response(401, false, 'Authorized user not found', ['id' => $this->current_user_id]);
            return;
        }

        $user = $this->db->query("
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
            $this->db->response(404, false, 'User not found', ['user_id' => $id]);
            exit;
        }

        // select all possible managers
        $managers = $this->db->query("
            SELECT id, CONCAT(first_name, ' ', last_name) as name 
            FROM users 
            WHERE role = 'manager' AND is_active = 1
        ")->all();

        $this->db->response(200, true, 'Existing user details fetched successfully', [
            'id' => $id,
            'user' => $user
        ]);

        return $user;
    }

    public function updateEmployee($id) {

        if($this->current_user_id && in_array($this->current_user_role, ['admin', 'super admin'], true)) {

            $existing_user = $this->db->query("SELECT * FROM users WHERE id = :id", [
                'id' => $id
            ])->find();

            if (!$existing_user) {
                $this->db->response(404, false, 'Employee to edit not found', ['employee_id' => $id]);
                return;
            }
            
            $input = json_decode(file_get_contents('php://input'), true);

            $first_name = array_key_exists('first_name', $input) ? $input['first_name'] : $existing_user['first_name'];
            $last_name  = array_key_exists('last_name', $input)  ? $input['last_name']  : $existing_user['last_name'];
            $email      = array_key_exists('email', $input)      ? $input['email']      : $existing_user['email'];
            $phone      = array_key_exists('phone', $input)      ? $input['phone']      : $existing_user['phone'];
            $role       = array_key_exists('role', $input)       ? $input['role']       : $existing_user['role'];
            $department = array_key_exists('department', $input) ? $input['department'] : $existing_user['department'];
            $salary     = array_key_exists('salary', $input)     ? $input['salary']     : $existing_user['salary'];
            $hired_date = array_key_exists('hired_date', $input) ? $input['hired_date'] : date('Y-m-d', strtotime($existing_user['hired_date']));
            $is_active  = array_key_exists('is_active', $input)
                ? (int)$input['is_active']
                : (int)$existing_user['is_active'];
            $manager_id = array_key_exists('assigned_to', $input)
                ? (!empty($input['assigned_to']) ? (int) $input['assigned_to'] : null)
                : $existing_user['assigned_to'];

       
            $employee_form = new EmployeeForm();

            if(!$employee_form->validate($first_name, $last_name, $email, $phone, $role, $department, $salary, $manager_id, $is_active, $hired_date)) {
                $this->db->response(422, false, 'Invalid inputs', ['errors' => $employee_form->errors()]);
                return;
            }
            
            $this->db->query("
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
    
            $edited_user = $this->db->query("
                SELECT id, first_name, last_name, email, phone, role, department, assigned_to, is_active, hired_date, salary 
                FROM users
                WHERE id = :id", 
                ['id' => $id])->find();
    
            if(!$edited_user) {
                $this->db->response(422, false, 'Failed to update employee details', ['employee_id' => $id]);
                return;
            }
    
            $this->db->response(200, true, 'Employee details updated successfully', [
                'employee_id' => $id,
                'employee'    => $edited_user
            ]);

            return $edited_user;
        }

       $this->db->response(401, false, 'Unauthorized access', ['id' => $this->current_user_id]);
       return;
    }

    public function deleteEmployee($id) {

        if($this->current_user_id && in_array($this->current_user_role, ['admin', 'super admin'], true)) {

            $user = $this->db->query("SELECT * FROM users WHERE id = :id", [
                'id' => $id
            ])->find();
    
            if(!$user) {
                $this->db->response(404, false, 'User not found', ['id' => $id]);
                return;
            }
    
            if($user['role'] === 'admin') {
                $this->db->response(401, false, 'You are not authorized to delete this employee (admin).', ['id' => $id]);
                return;
            }
    
    
            $delete_user = $this->db->query("UPDATE users SET is_active = 0 AND deleted_at = CURRENT_TIMESTAMP WHERE id = :id", [
                'id' => $id
            ]);
    
            $this->db->response(200, true, 'Employee deleted successfully', [
                'id' => $id,
                'deleted' => $delete_user
            ]);
    
            return;
        }


        $this->db->response(401, false, 'Unauthorized Access', ['id' => $this->current_user_id]);
        return;

       
    }

    public function getProfile($id) {

        if($this->current_user_id && in_array($this->current_user_role, ['admin', 'super admin', 'manager'], true)) {
           
            $user = $this->db->query("
                SELECT u.id,
                    u.first_name, 
                    u.last_name,
                    u.email,  
                    u.phone,
                    u.role, 
                    u.assigned_to,
                    CONCAT(m.first_name, ' ', m.last_name) as manager_name,
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
                $this->db->response(404, false, 'Employee not found', ['id' => $id]);
                return;
            }

            $structured_data = [
                'id' => $user[0]['id'],
                'first_name' => $user[0]['first_name'],
                'last_name' => $user[0]['last_name'],
                'email' => $user[0]['email'],
                'phone' => $user[0]['phone'],
                'role' => $user[0]['role'],
                'department' => $user[0]['department'],
                'assigned_to' => [
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
                    $structured_data['leave_balance'][] = [
                        'leave_type_name' => $employee['leave_type_name'],
                        'remaining_balance' => $employee['remaining_balance'],
                    ];
                }
            }

            $this->db->response(200, true, 'Employee details fetched successfully', [
                'id' => $id,
                'employee' => $structured_data
            ]);

            return $structured_data;
        }

        $this->db->response(401, false, 'Unauthorized Access', ['id' => $this->current_user_id]);
        return;
    }

    public function getManagers() {

        if ($this->current_user_id && in_array($this->current_user_role, ['admin', 'super admin'], true)) {

            $query = "
                SELECT id, first_name, last_name, email, role, department,
                    CONCAT(first_name, ' ', last_name) as name
                FROM users
                WHERE role = 'manager'
                AND is_active = 1
            ";

            $params = [];

            // Department admin only sees managers in their department
            // Super admin sees all managers
            if ($this->current_user_role === 'super admin') {
                
            }else if($this->current_user_role === 'admin') {
                $query .= " AND department = :department";
                $params['department'] = $this->current_user_department;
            }

            $query .= " ORDER BY first_name, last_name";

            $managers = $this->db->query($query, $params)->all();

            $this->db->response(200, true, 'Managers fetched successfully', [
                'managers' => $managers ?: [],
            ]);

            return $managers; 
            
        }


        $this->db->response(401, false, 'Unauthorized Access', ['id' => $this->current_user_id]);
        return;


       
    }

}
