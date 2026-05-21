<?php

namespace App\Http\Controllers\Leave;

use App\Http\Forms\LeaveRequestForm;
use Core\App;
use Core\Database;
use DateTime;

class EmployeeLeavesListController {

    /**
     * @throws \Exception
     */
    public function submit() {
        $db = App::resolve(Database::class);
    }

    public function index() {

        $db = App::resolve(Database::class);

        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        $token = trim(str_replace('Bearer ', '', $authHeader));


        $tokenRow = $db->query("SELECT user_id FROM personal_access_tokens WHERE token = :token", [
            'token' => $token
        ])->find();

        $current_manager_id = $tokenRow['user_id'] ?? null;

        if (!$current_manager_id) {
            http_response_code(404);
            echo json_encode(["error" => "User not found"]);
            exit();
        }
//
//        $employeeLeavesList = $db->query("SELECT * FROM leave_requests WHERE assigned_to = :assigned_to", [
//            'assigned_to' => $current_user_id
//        ])->all();


        $managerLeavesList = $db->query("
    SELECT 
        lr.*, 
        e.name as employee_name, 
        lt.name as leave_type_name 
        FROM leave_requests lr 
        LEFT JOIN users e ON lr.user_id = e.id 
        LEFT JOIN leave_types lt ON lr.leave_type_id = lt.id 
        WHERE lr.assigned_to = :manager_id
", [
            'manager_id' => $current_manager_id
        ])->all();

        if(!$managerLeavesList) {
            http_response_code(404);
            echo json_encode(["error" => "No employee leaves found"]);
        }



        echo json_encode([
            'success' => true,
            'message' => 'Employee leaves list fetched successfully',
            'id' => $current_manager_id,
            'employee_leaves' => [
                'data' => $managerLeavesList,
            ],
        ]);
    }
}