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
        var_dump($token);

        // identify the user first via token
        $tokenRow= $db->query("SELECT user_id FROM personal_access_tokens WHERE token = :token", [
            'token' => $token
        ])->find();

        $current_user_id = $tokenRow['user_id'] ?? null;
        var_dump($current_user_id);

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

        // query the remaining balance and leave types
        $remaining_balance = $db->query("SELECT remaining_balance from leave_balance WHERE user_id = :user_id AND leave_type = :leave_type", [
            'user_id' => $current_user_id,
            'leave_type' => $leave_type
        ])->find();

        // validate the overlap (to check if the user already has a pending or approved request that covers the dates they just picked)
        // and prevent users from submitting the EXACT SAME TYPE while one is already pending.
        $overlap = $db->query("SELECT id FROM leave_requests WHERE user_id = :user_id AND status IN ('pending', 'approved') AND start_date <= :end_date AND end_date >= :start_date", [
            'user_id' => $current_user_id,
            'start_date' => $start_date,
            'end_date' => $end_date
        ])->find();

        $existingLeaveType = $db->query("SELECT id FROM leave_requests WHERE user_id = :user_id AND leave_type = :leave_type AND status = 'pending'", [
            'user_id' => $current_user_id,
            'leave_type' => $leave_type
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
        $db->query("INSERT INTO leave_requests(user_id, leave_type, start_date, end_date, reason) VALUES (:user_id, :leave_type, :start_date, :end_date,  :reason)", [
            'user_id' => $current_user_id,
            'leave_type' => $leave_type,
            'start_date' => $start_date,
            'end_date' => $end_date,
            'reason' => $reason
        ]);

        http_response_code(200);
        echo json_encode([
            'message' => 'Leave request submitted successfully',
            'user_id' => $current_user_id,
        ]);
        exit;


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

        if (!$current_user_id) {
            http_response_code(404);
            echo json_encode(["error" => "User not found"]);
            exit();
        }

        $leaveRequests = $db->query('SELECT * FROM leave_requests WHERE user_id = :user_id', [
            'user_id' => $current_user_id,
        ])->all();


        echo json_encode([
            'message' => 'Leave requests fetched successfully',
            'leave_requests' => $leaveRequests,
            'user_id' => $current_user_id,
        ]);

    }

    // show a specific leave request
    public function show($id) {}



}