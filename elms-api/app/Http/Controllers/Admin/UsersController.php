<?php


namespace App\Http\Controllers\Admin;

use Core\App;
use Core\Database;
use App\Http\Middleware\Auth;


class UsersController {


    public function index() {

        $db = App::resolve(Database::class);

        $currentUser = Auth::authenticate();

        $current_user_id = $currentUser['id'] ?? null;

        if(!$current_user_id) {
            http_response_code(404);
            echo json_encode(["error" => "Admin not found"]);
            exit;
        }

        $users = $db->query("
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
        ")->all();


        echo json_encode([
             'success' => true,
             'message' => 'Employee List fetched successfully',
             'id' => $current_user_id,
             'users' => $users
         ]);
    }


    public function show($id) {
        $db = App::resolve(Database::class);
        $currentUser = Auth::authenticate();

        $current_user_id = $currentUser['id'] ?? null;

        if(!$current_user_id) {
            http_response_code(404);
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
                   manager_id,
                   department, 
                   is_active, 
                   hired_date,
                   salary 
                   FROM users
            WHERE id = :id
        ", [
            'id' => $id
        ])->find();

        // select all possible managers
        $managers = $db->query("
        SELECT id, CONCAT(first_name, ' ', last_name) as name 
        FROM users 
        WHERE role = 'manager' AND is_active = 1
        ")->all();


        $userDetails = [
            'id' => $user['id'],
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'email' => $user['email'],
            'phone' => $user['phone'],
            'role' => $user['role'],
            'manager_id' => $user['manager_id'],
            'department' => $user['department'],
            'is_active' => $user['is_active'],
            'hired_date' => $user['hired_date'],
            'salary' => $user['salary'],
            'managers' => $managers
        ];

        if (!$user) {
            http_response_code(404);
            echo json_encode(["error" => "User not found"]);
            exit;
        }

        if(!$managers) {
            http_response_code(404);
            echo json_encode(["error" => "Manager not found"]);
            exit;
        }


        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Existing user details fetched successfully',
            'id' => $id,
            'user' => $userDetails
        ]);
    }


    public function patch($id) {

        $db = App::resolve(Database::class);
        $currentUser = Auth::authenticate();

        $current_user_id = $currentUser['id'] ?? null;

        if(!$current_user_id) {
            http_response_code(404);
            echo json_encode(["error" => "Admin not found"]);
            exit;
        }

        $input = json_decode(file_get_contents('php://input'), true);

        $first_name = $input['first_name'] ?? '';
        $last_name  = $input['last_name'] ?? '';
        $email      = $input['email'] ?? '';
        $phone      = $input['phone'] ?? '';
        $role       = $input['role'] ?? '';
        $department = $input['department'] ?? '';
        $is_active  = isset($input['is_active']) ? (int)$input['is_active'] : 1;
        $salary     = $input['salary'] ?? '';
        $hired_date = $input['hired_date'] ?? null;
        $manager_id = !empty($input['manager_id']) ? (int)$input['manager_id'] : null;

        $editUser = $db->query("
        UPDATE users 
        SET first_name = :first_name, 
            last_name = :last_name, 
            email = :email, 
            phone = :phone, 
            role = :role, 
            department = :department, 
            manager_id = :manager_id,
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
            'manager_id'  => $manager_id, // binds this as null if no manager is chosen
            'is_active'   => $is_active,
            'hired_date' => empty($hired_date) ? null : $hired_date,
            'salary'      => empty($salary) ? null : $salary
        ])->find();

        $editedUser = $db->query("
        SELECT id, first_name, last_name, email, phone, role, department, manager_id, is_active, hired_date, salary 
        FROM users 
        WHERE id = :id
        ", ['id' => $id])->find();

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

        $db = App::resolve(Database::class);
        $currentUser = Auth::authenticate();

        $current_user_id = $currentUser['id'] ?? null;

        if(!$current_user_id) {
            http_response_code(404);
            echo json_encode(["error" => "Admin not found"]);
            exit;
        }


        $deleteUser = $db->query("UPDATE users SET is_active = 0 WHERE id = :id", [
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

        $db = App::resolve(Database::class);
        $currentUser = Auth::authenticate();

        $current_user_id = $currentUser['id'] ?? null;

        if(!$current_user_id) {
            http_response_code(404);
            echo json_encode(["error" => "Admin not found"]);
            exit;
        }

        $user = $db->query("
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
            LEFT JOIN leave_types lt ON lb.leave_type_id = lt.id
            WHERE u.id = :id
        ", [
            'id' => $id
        ])->all();

        if(!$user) {
            http_response_code(404);
            echo json_encode(["error" => "User not found"]);
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
            'user' => $structuredData
        ]);
    }

}