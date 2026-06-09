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
         ])->all();

         if(!$viewEmployeeDetails) {
             http_response_code(404);
             echo json_encode(["error" => "Employee not found"]);
             exit;
         }

         // return the very first row of all fetch data
         $structuredData = [
             'id' => $viewEmployeeDetails[0]['id'],
             'employee_first_name' => $viewEmployeeDetails[0]['employee_first_name'],
             'employee_last_name' => $viewEmployeeDetails[0]['employee_last_name'],
             'employee_email' => $viewEmployeeDetails[0]['employee_email'],
             'employee_phone' => $viewEmployeeDetails[0]['employee_phone'],
             'employee_role' => $viewEmployeeDetails[0]['employee_role'],
             'manager_id' => $viewEmployeeDetails[0]['manager_id'],
             'employee_department' => $viewEmployeeDetails[0]['employee_department'],
             'employee_salary' => $viewEmployeeDetails[0]['employee_salary'],
             'employee_hired_date' => $viewEmployeeDetails[0]['employee_hired_date'],
             'employee_is_active' => $viewEmployeeDetails[0]['employee_is_active'],
             "employee_leave_balance" => []
         ];

         // loop through an array and structured the employee_leave_balances
         foreach($viewEmployeeDetails as $employee) {
             if(!empty($employee['leave_type_name'])) {
                 $structuredData['employee_leave_balance'][] = [
                     'leave_type_name' => $employee['leave_type_name'],
                     'remaining_balance' => $employee['remaining_balance'],
                 ];
             }
         }


         echo json_encode([
             'success' => true,
             'message' => 'Employee details fetched successfully',
             'id' => $id,
             'employee_details' => $structuredData
         ]);

     }
 }