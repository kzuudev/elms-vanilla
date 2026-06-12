<?php


namespace App\Http\Controllers\Admin;

use Core\App;
use Core\Database;
use App\Http\Middleware\Auth;


class UsersController {


    public function index() {

        $db = App::resolve(Database::class);

        $current_admin_id = Auth::authenticate();

        if(!$current_admin_id) {
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
             'id' => $current_admin_id,
             'users' => $users
         ]);
    }


    public function show($id) {

        $db = App::resolve(Database::class);
        $current_admin_id = Auth::authenticate();

        if(!$current_admin_id) {
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
                   department, 
                   is_active, 
                   hired_date 
        ", [
            'id' => $id
        ])->find();

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Employee details fetched successfully',
            'id' => $id,
            'user' => $user
        ]);
    }




    public function patch($id) {

        $db = App::resolve(Database::class);
        $current_admin_id = Auth::authenticate();

        if(!$current_admin_id) {
            http_response_code(404);
            echo json_encode(["error" => "Admin not found"]);
            exit;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        $first_name = $input['first_name'] ?? '';
        $last_name = $input['last_name'] ?? '';
        $email = $input['email'] ?? '';
        $phone = $input['phone'] ?? '';
        $role = $input['role'] ?? '';
        $department = $input['department'] ?? '';
        $manager_id = !empty($input['manager_id']) ? $input['manager_id'] : null;
        $is_active  = isset($input['is_active']) ? (int)$input['is_active'] : 1;
        $hired_date = $input['hired_date'] ?? '';
        $password = $input['password'] ?? '';
        $confirm_password = $input['confirm_password'] ?? '';
        $new_password = $input['new_password'] ?? '';
        $confirm_new_password = $input['confirm_new_password'] ?? '';
        $salary = $input['salary'] ?? '';



        $editUser = $db->query("UPDATE users SET first_name = :first_name, last_name = :last_name, email = :email, phone = :phone, role = :role, department = :department, is_active = :is_active, hired_date = :hired_date, salary = :salary WHERE id = :id", [
            'id' => $id,
            'first_name'  => $first_name,
            'last_name'   => $last_name,
            'email'       => $email,
            'phone'       => $phone,
            'role'        => $role,
            'department'  => $department,
            'is_active'   => $is_active,
            'hired_date'  => $hired_date,
            'salary'      => $salary
        ]);

        if(!$editUser) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update user']);
            exit;
        }

        $editedUser = $db->query("
        SELECT id, 
               first_name, 
               last_name, 
               email, phone, 
               role, 
               department, 
               is_active, 
               hired_date, 
               salary 
        FROM users 
        WHERE id = :id
    ", ['id' => $id])->find();


        echo json_encode([
            'success' => true,
            'message' => 'User profile updated successfully',
            'user'    => $editedUser
        ]);
    }


    public function destroy($id) {

        $db = App::resolve(Database::class);
        $current_admin_id = Auth::authenticate();

        if(!$current_admin_id) {
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

}