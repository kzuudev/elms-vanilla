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

        $managerLeavesList = $db->query("
            SELECT 
            lr.*, 
            e.first_name as employee_name, 
            m.first_name as manager_name,
            e.role as employee_role,
            lt.name as leave_type_name,
            DATEDIFF(lr.end_date, lr.start_date) + 1 as total_days
            FROM leave_requests lr 
            LEFT JOIN users e ON lr.user_id = e.id 
            LEFT JOIN users m ON lr.assigned_to = m.id
            LEFT JOIN users r ON lr.user_id = r.id
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