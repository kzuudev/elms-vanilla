<?php

namespace App\Http\Controllers\Leave;

use App\Http\Forms\LeaveRequestForm;
use Core\App;
use Core\Database;
use DateTime;

class LeaveRequestController {


    /**
     * @throws \Exception
     */
    public function submit() {

        $leaveRequestForm = new LeaveRequestForm();
        $db = App::resolve(Database::class);

        // get the token using header authorization
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        $token = trim(str_replace('Bearer ', '', $authHeader));

        // identify the user first via token
        $tokenRow= $db->query("SELECT user_id FROM personal_access_tokens WHERE token = :token", [
            'token' => $token
        ])->find();

        $current_user_id = $tokenRow['user_id'] ?? null;

        $assignedManager = $db->query("SELECT m.id AS manager_id, m.first_name AS manager_name FROM users e LEFT JOIN users m ON e.manager_id = m.id WHERE e.id = :id", [
            'id' => $current_user_id,
        ])->find();


        if (!$current_user_id) {
            http_response_code(404);
            echo json_encode(["error" => "User not found"]);
            exit();
        }


        $input = json_decode(file_get_contents('php://input'), true);

        $leave_type = $input['leave_type'] ?? '';
        $start_date = $input['start_date'] ?? '';
        $end_date = $input['end_date'] ?? '';
        $reason = $input['reason'] ?? '';

        $start_date_obj = new DateTime($start_date);
        $end_date_obj = new DateTime($end_date);

        // validate the inputs
        if(!$leaveRequestForm->validate($leave_type, $start_date, $end_date, $reason)) {
            http_response_code(422);
            echo json_encode($leaveRequestForm->errors());
            return;
        }

        // validate the interval of start and end date
        $interval = $start_date_obj->diff($end_date_obj);

        // date should always start with 1 (because if start and end are the same day, it should count as 1 day)
        $days_requested = $interval->days + 1;

        // get the name of the leave type based on the leave_type_id
        $leaveTypeRecord = $db->query("SELECT id FROM leave_types WHERE name = :name", [
            'name' => $leave_type
        ])->find();

        // query the remaining balance and leave types
        $remaining_balance = $db->query("SELECT remaining_balance from leave_balance WHERE user_id = :user_id AND leave_type_id = :leave_type_id", [
            'user_id' => $current_user_id,
            'leave_type_id' => $leaveTypeRecord['id']
        ])->find();

        // validate the overlap (to check if the user already has a pending or approved request that covers the dates they just picked)
        // and prevent users from submitting the EXACT SAME TYPE while one is already pending.
        $overlap = $db->query("SELECT id FROM leave_requests WHERE user_id = :user_id AND status IN ('pending', 'approved') AND start_date <= :end_date AND end_date >= :start_date", [
            'user_id' => $current_user_id,
            'start_date' => $start_date,
            'end_date' => $end_date
        ])->find();

        $existingLeaveType = $db->query("SELECT id FROM leave_requests WHERE user_id = :user_id AND leave_type_id = :leave_type_id AND status = 'pending'", [
            'user_id' => $current_user_id,
            'leave_type_id' =>  $leaveTypeRecord['id']
        ])->find();

        if($overlap) {
            http_response_code(422);
            echo json_encode([
                'message' => 'You already have a pending or approved leave request that covers this date range.',
            ]);
            exit();
        }

        if($existingLeaveType) {
            http_response_code(422);
            echo json_encode([
                'message' => 'You already have a pending or approved leave request for this leave type.',
            ]);
            exit();
        }

        // validate the remaining balance based on a leave type
        if($remaining_balance['remaining_balance'] < $days_requested) {
            http_response_code(422);
            echo json_encode([
                'message' => 'Insufficient leave balance for this leave type.',
                'remaining_balance' => $remaining_balance['remaining_balance'],
            ]);
            exit();
        }

        // insert it then
        $db->query("INSERT INTO leave_requests(user_id, leave_type_id, start_date, end_date, reason, assigned_to) VALUES (:user_id, :leave_type_id, :start_date, :end_date,  :reason, :assigned_to)", [
            'user_id' => $current_user_id,
            'leave_type_id' =>  $leaveTypeRecord['id'],
            'start_date' => $start_date,
            'end_date' => $end_date,
            'reason' => $reason,
            'assigned_to' => $assignedManager['manager_id'] ?? null ,
        ]);

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Leave request submitted successfully',
            'user_id' => $current_user_id,
            'data' => [
                'id' => $db->lastInsertId(), // Get the ID of the row just created
                'leave_type_id' => $leaveTypeRecord['id'],
                'leave_type' => $leave_type,
                'start_date' => $start_date,
                'end_date' => $end_date,
                'reason' => $reason,
                'status' => 'pending',
                'assigned_to' => [
                    'manager_id' => $assignedManager['manager_id'] ?? null,
                    'manager_name' => $assignedManager['manager_name'] ?? null,
                ]
            ]
        ]);
        exit();


    }


    // fetching all leave requests
    public function index() {

        $db = App::resolve(Database::class);

        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        $token = trim(str_replace('Bearer ', '', $authHeader));

        $tokenRow = $db->query("SELECT user_id FROM personal_access_tokens WHERE token = :token", [
            'token' => $token
        ])->find();

        $current_user_id = $tokenRow['user_id'] ?? null;

//        $assignedManager = $db->query("SELECT m.id AS manager_id, m.name AS manager_name FROM users e LEFT JOIN users m ON e.manager_id = m.id WHERE e.id = :id", [
//            'id' => $current_user_id,
//        ])->find();


        if (!$current_user_id) {
            http_response_code(404);
            echo json_encode(["error" => "User not found"]);
            exit();
        }

        $leaveRequests = $db->query(' 
            SELECT 
            lr.*, 
            m.first_name AS manager_name,
            lt.name AS leave_type_name 
            FROM leave_requests lr 
            LEFT JOIN users m ON lr.assigned_to = m.id
            LEFT JOIN leave_types lt ON lr.leave_type_id = lt.id
            WHERE lr.user_id = :user_id
            ', [
                'user_id' => $current_user_id,
        ])->all();



        echo json_encode([
            'success' => true,
            'message' => 'Leave requests fetched successfully',
            'id' => $current_user_id,
            'user_id' => $current_user_id,
            'leave_requests' => [
                'data' => $leaveRequests,
            ],
        ]);

    }

    // show a specific leave request
    public function show($id) {

        $db = App::resolve(Database::class);

        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        $token = trim(str_replace('Bearer ', '', $authHeader));

        $tokenRow = $db->query("SELECT user_id FROM personal_access_tokens WHERE token = :token", [
            'token' => $token
        ])->find();

        $current_user_id = $tokenRow['user_id'] ?? null;

        if (!$current_user_id) {
            http_response_code(404);
            echo json_encode(["error" => "User not found"]);
            exit();
        }

        $leaveRequestDetails = $db->query("
            SELECT 
                lr.id,
                lr.reason,
                lr.start_date,
                lr.end_date,
                lr.status,
                lr.created_at,
                lr.updated_at,
                CONCAT(m.first_name, ' ', m.last_name) AS manager_name, 
                lt.name AS leave_type,
                DATEDIFF(lr.end_date, lr.start_date) + 1 AS total_days
            FROM leave_requests lr 
            LEFT JOIN users m ON lr.assigned_to = m.id
            LEFT JOIN leave_types lt ON lr.leave_type_id = lt.id
            WHERE lr.id = :id
        ", [
            'id' => $id,
        ])->find();


        echo json_encode([
            'success' => true,
            'message' => 'Leave request details fetched successfully',
            'id' => $current_user_id,
            'leave_request' => $leaveRequestDetails,
        ]);
    }


    public function patch($id) {

            $db = App::resolve(Database::class);

            $input = json_decode(file_get_contents('php://input'), true);

            $headers = getallheaders();
            $authHeader = $headers['Authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';
            $token = trim(str_replace('Bearer ', '', $authHeader));

            $tokenRow = $db->query("SELECT user_id FROM personal_access_tokens WHERE token = :token", [
                'token' => $token
            ])->find();

            $current_user_id = $tokenRow['user_id'] ?? null;

            if (!$current_user_id) {
                http_response_code(401);
                echo json_encode(["error" => "User not found"]);
                exit;
            }

            $existingLeaveRequest = $db->query("SELECT * FROM leave_requests WHERE id = :id", ['id' => $id])->find();

            if(!$existingLeaveRequest) {
                http_response_code(404);
                echo json_encode(["error" => "Leave request not found"]);
                exit;
            }

            if($existingLeaveRequest['user_id'] !== $current_user_id) {
                http_response_code(403);
                echo json_encode(["error" => "Unauthorized to update this leave request"]);
                exit;
            }


            if(!empty($leave_type)) {
                $leaveTypeRecord = $db->query("SELECT id FROM leave_types WHERE name = :name", [
                    'name' => $input['leave_type']
                ])->find();

                $leave_type_id = $leaveTypeRecord ? $leaveTypeRecord['id'] : $existingLeaveRequest['leave_type_id'];
            }else {
                $leave_type_id = $existingLeaveRequest['leave_type_id'];
            }

            $start_date = $input['start_date'] ?? $existingLeaveRequest['start_date'];
            $end_date   = $input['end_date'] ?? $existingLeaveRequest['end_date'];
            $reason     = $input['reason'] ?? $existingLeaveRequest['reason'];

            $updateLeaveRequest = $db->query("UPDATE leave_requests SET leave_type_id = :leave_type_id, start_date = :start_date, end_date = :end_date, reason = :reason WHERE id = :id", [
                'id' => $id,
                'leave_type_id' => $leave_type_id,
                'start_date' => $start_date,
                'end_date' => $end_date,
                'reason' => $reason,
            ]);

            if(!$updateLeaveRequest) {
                http_response_code(404);
                echo json_encode(["error" => "Leave request not found"]);
                exit;
            }

        // 2. FETCH THE FRESH DATA ROW FROM THE DATABASE RIGHT AFTER CHANGING IT
        $freshlyUpdatedRecord = $db->query("
        SELECT 
            lr.id,
            lr.reason,
            lr.start_date,
            lr.end_date,
            lr.status,
            lr.created_at,
            lr.updated_at,
            CONCAT(m.first_name, ' ', m.last_name) AS manager_name, 
            lt.name AS leave_type,
            DATEDIFF(lr.end_date, lr.start_date) + 1 AS total_days
        FROM leave_requests lr 
        LEFT JOIN users m ON lr.assigned_to = m.id
        LEFT JOIN leave_types lt ON lr.leave_type_id = lt.id
        WHERE lr.id = :id
    ", ['id' => $id])->find();

    // 3. Return the fresh database object to your frontend React app
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Leave request updated successfully',
            'id' => $id,
            'leave_request' => $freshlyUpdatedRecord,
        ]);


        }







}