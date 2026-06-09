<?php

namespace App\Http\Controllers\Employee;

use Core\App;
use Core\Database;
use App\Http\Middleware\Auth;


class EmployeeController {

     public function index() {

         $db = App::resolve(Database::class);

         $current_manager_id = Auth::authenticate();

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

     public function show($id) {

         $db = App::resolve(Database::class);
         $current_manager_id = Auth::authenticate();

         if(!$current_manager_id) {
             http_response_code(404);
             echo json_encode(["error" => "Manager not found"]);
             exit;
         }

         $viewEmployeeDetails = $db->query("
          SELECT u.id,
                 u.first_name as employee_first_name, 
                 u.last_name as employee_last_name,
                 u.email as employee_email,  
                 u.phone as employee_phone,
                 u.role as employee_role, 
                 u.manager_id as manager_id,
                 u.department as employee_department,
                 u.salary as employee_salary,
                 u.hired_date as employee_hired_date,
                 u.is_active as employee_is_active,
                 lt.name as leave_type_name,
                 lb.remaining_balance as remaining_balance
            FROM users u 
            LEFT JOIN leave_balance lb ON lb.user_id = u.id
            LEFT JOIN leave_types lt ON lb.leave_type_id = lt.id
            WHERE u.id = :id
         ", [
             'id' => $id
         ], [

         ])->find();

         if(!$viewEmployeeDetails) {
             http_response_code(404);
             echo json_encode(["error" => "Employee not found"]);
             exit;
         }

         echo json_encode([
             'success' => true,
             'message' => 'Employee details fetched successfully',
             'id' => $id,
             'employee_details' => $viewEmployeeDetails
         ]);

     }
 }