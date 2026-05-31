<?php

namespace App\Http\Controllers\Employee;

use Core\App;
use Core\Database;



class EmployeeController {

     public function index() {

         $db = App::resolve(Database::class);

         $headers = getallheaders();
         $authHeader = $headers['Authorization'];
         $token = trim(str_replace('Bearer ', '', $authHeader));

         $tokenRow = $db->query("SELECT user_id FROM personal_access_tokens WHERE token = :token", [
             'token' => $token
         ])->find();

         $current_manager_id = $tokenRow['user_id'] ?? null;

         if (!$current_manager_id) {
             http_response_code(404);
             echo json_encode(["error" => "User not found"]);
             exit;
         }

         $employeeList = $db->query("
            SELECT u.id,
                   u.first_name as employee_first_name, 
                   u.last_name as employee_last_name,
                   u.email as employee_email,  
                   u.role as employee_role
            FROM users u 
            WHERE u.manager_id = :manager_id
        ", [
             "manager_id" => $current_manager_id
         ])->all();


         echo json_encode([
             'success' => true,
             'message' => 'Employee List fetched successfully',
             'id' => $current_manager_id,
             'employee_list' => $employeeList
         ]);



     }
 }