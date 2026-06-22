<?php

namespace App\Http\Controllers\Leave;

use App\Http\Forms\LeaveRequestForm;
use App\Http\Middleware\Auth;
use Core\App;
use Core\Database;
use DateTime;

class LeaveReviewController {

    /**
     * @throws \Exception
     */
    public function submit() {
        $db = App::resolve(Database::class);
    }

    public function index() {

        $db = App::resolve(Database::class);
        $current_user_id = Auth::authenticate();

        if (!$current_user_id) {
            http_response_code(404);
            echo json_encode(["error" => "User not found"]);
            exit;
        }

        $currentUser = $db->query("SELECT role FROM users WHERE id = :id", [
            'id' => $current_user_id
        ])->find();

        $role = $currentUser['role'];
        $params = [];

        $sql = "
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
            LEFT JOIN leave_types lt ON lr.leave_type_id = lt.id 
            WHERE lr.deleted_at IS NULL
        ";

        if ($role === 'admin') {
            // Admins see all requests, except their own requests
            $sql .= " AND lr.user_id != :reviewer_id";
            $params['reviewer_id'] = $current_user_id;
        } elseif ($role === 'manager') {
            // Managers only see requests assigned to them
            $sql .= " AND lr.assigned_to = :reviewer_id";
            $params['reviewer_id'] = $current_user_id;
        } else {
            // Stop regular employees from seeing the review list!
            http_response_code(403);
            echo json_encode(["error" => "Forbidden: You do not have review permissions"]);
            exit;
        }

        $leavesList = $db->query($sql, $params)->all();

        echo json_encode([
            'success' => true,
            'message' => 'Employee leaves list fetched successfully',
            'id' => $current_user_id,
            'leaves' => [
                'data' => $leavesList,
            ],
        ]);
    }

    public function patch($id) {

        $db = App::resolve(Database::class);
        $current_user_id = Auth::authenticate();

        if (!$current_user_id) {
            http_response_code(404);
            echo json_encode(["error" => "User not found"]);
            exit;
        }

        $currentUser = $db->query("SELECT role FROM users WHERE id = :id", [
            'id' => $current_user_id
        ])->find();

        $role = $currentUser['role'] ?? 'employee';
        $params = ['id' => $id];


        $sql = "
            SELECT 
                lr.*, 
                e.first_name as employee_name,
                m.first_name as reviewer_name 
            FROM leave_requests lr 
            LEFT JOIN users e ON lr.user_id = e.id
            LEFT JOIN users m ON lr.assigned_to = m.id 
            WHERE lr.id = :id AND lr.deleted_at IS NULL
        ";

        if($role === "admin") {

        }else if ($role === "manager") {
            // Managers can see it if they are assigned to it OR if managers created it
            $sql .= "AND (lr.assigned_to = :current_user_id OR lr.user_id = :current_user_id";
            $params['current_user_id'] = $current_user_id;;
        }else {
            http_response_code(403);
            echo json_encode(['error' => 'Unauthorized User']);
            exit;
        }

        $authorizedUser = $db->query($sql, $params)->find();


        // capture the new value
        $input = json_decode(file_get_contents('php://input'), true);
        $status = $input['status'] ?? '';
        $rejectionReason = $input['rejection_reason'] ?? '';

        // Validation of a rejection phase
        if(!in_array($status, ['approved', 'rejected'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid status. Must be approved or rejected.']);
        }

        if($status == 'rejected' && empty($rejectionReason)) {
            http_response_code(422);
            echo json_encode(['error' => 'Rejection reason is required when status is rejected.']);
        }

        if($current_user_id === $authorizedUser['user_id']) {
            http_response_code(403);
            echo json_encode(["error" => "Self-approval is strictly prohibited."]);
            exit;
        }

        $rejected = $db->query("UPDATE leave_requests SET status = :status, rejection_reason = :rejection_reason WHERE id = :id", [
            'id' => $id,
            'status' => $status,
            'rejection_reason' => $rejectionReason
        ]);

        $approved = $db->query("UPDATE leave_requests SET status = :status, rejection_reason = :rejection_reason WHERE id = :id", [
            'id' => $id,
            'status' => $status,
            'rejection_reason' => $rejectionReason
        ]);

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Leave request status updated successfully',
            'id' => $id,
            'authorized_user' => $authorizedUser,
            'approved' => $approved,
            'rejected' => $rejected,
        ]);





    }
}