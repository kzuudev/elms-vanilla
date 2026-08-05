<?php


namespace App\Services\leaves;

use Core\App;
use Core\Database;
use App\Contracts\LeaveRequestInterface;
use App\Http\Forms\LeaveRequestForm;
use App\Services\notifications\NotificationService;
use DateTime;
use DateInterval;
use DatePeriod;

class LeaveRequestService implements LeaveRequestInterface {

    private Database $db;

    public function __construct() {

        $this->db = App::resolve(Database::class);
    }


    public function store(array $input, int $user_id, string $role): void {

        $leaveRequestForm = new LeaveRequestForm();

        $assigned_to = $this->db->query(
            "SELECT 
                assigned_to AS approver_id, 
                CONCAT(first_name, ' ', last_name) AS approver_name, 
                role AS approver_role
                FROM users 
                WHERE id = :id"
        , [
            'id' => $user_id
        ])->find();

        $leave_type = $input['leave_type'] ?? '';
        $start_date = $input['start_date'] ?? '';
        $end_date = $input['end_date'] ?? '';
        $reason = $input['reason'] ?? '';

        $start_date_obj = new DateTime($start_date);
        $end_date_obj = new DateTime($end_date);

        // validate the inputs
        if (!$leaveRequestForm->validate($leave_type, $start_date, $end_date, $reason)) {
            http_response_code(422);
            echo json_encode($leaveRequestForm->errors());
            return;
        }

        // count for days requested (weekdays)
        $days_requested = 0;

        // calculate the start and end date (only weekdays), and ensures include the end date in the loop
        $period = new DatePeriod($start_date_obj, new DateInterval('P1D'), clone $end_date_obj->modify('+1 day'));

        foreach ($period as $date) {
            if ($date->format('N') < 6) { // format('N') returns 1-5 for Mon-Fri
                $days_requested++;
            }
        }

        // capture the leave_type id based on the leave type name submitted
        $leaveTypeRecord = $this->db->query("SELECT id FROM leave_types WHERE name = :name", [
            'name' => $leave_type
        ])->find();

        if (!$leaveTypeRecord) {
            http_response_code(422);
            echo json_encode(['error' => 'Invalid leave type.']);
            return;
        }

        $leave_type_id = $leaveTypeRecord['id'];

        // query the remaining balance and leave types
        $remaining_balance = $this->db->query("SELECT remaining_balance FROM leave_balance WHERE user_id = :user_id AND leave_type_id = :leave_type_id", [
            'user_id' => $user_id,
            'leave_type_id' => $leave_type_id
        ])->find();

        // validate the overlap (to check if the user already has a pending or approved request that covers the dates they just picked)
        // and prevent employees from submitting the EXACT SAME TYPE while one is already pending.
        $overlap = $this->db->query("
            SELECT id FROM leave_requests WHERE user_id = :user_id 
            AND leave_type_id = :leave_type_id 
            AND status IN ('pending', 'approved')
            AND deleted_at IS NULL
            AND start_date <= :end_date AND end_date >= :start_date
        ", [
            'user_id' => $user_id,
            'leave_type_id' => $leave_type_id,
            'start_date' => $start_date,
            'end_date' => $end_date
        ])->find();

        if ($overlap) {
            http_response_code(422);
            echo json_encode(['error' => 'You already have a pending or approved request for this leave type during the selected dates.']);
            return;
        }

        if (!$remaining_balance || $remaining_balance['remaining_balance'] < $days_requested) {
            http_response_code(422);
            echo json_encode(['error' => 'Insufficient leave balance for this leave type.']);
            return;
        }

        if (!$role) {
            http_response_code(403);
            echo json_encode(['error' => 'You are not authorized to submit a leave request.']);
            return;
        }

        // insert the leave request into the database
        $this->db->query("INSERT INTO leave_requests (user_id, leave_type_id, start_date, end_date, total_days, reason, status, assigned_to) VALUES (:user_id, :leave_type_id, :start_date, :end_date, :total_days, :reason, :status, :assigned_to)", [
            'user_id' => $user_id,
            'leave_type_id' => $leave_type_id,
            'start_date' => $start_date,
            'end_date' => $end_date,
            'total_days' => $days_requested,
            'reason' => $reason,
            'status' => 'pending',
            'assigned_to' => $assigned_to['approver_id'] ?? null
        ]);

        $notificationService = new NotificationService();
        $notificationService->store(
        $assigned_to['approver_id'],
        'New Leave Request Submitted',
        'leave_request_submitted',
        'A new leave request has been submitted for your approval. Please review it and take appropriate action.',
        false,
        ['leave_request_id' => $this->db->lastInsertId()]
        );

        http_response_code(200);
        echo json_encode(['success' => 'Leave request submitted successfully']);
        return;

    }

    public function index($user_id, $role, $department): void {

        if ($user_id && $role) {
            $query = "
                SELECT 
                    lr.*,
                    CONCAT(m.first_name, ' ', m.last_name) AS assigned_name,
                    lt.name as leave_type
                FROM leave_requests lr
                LEFT JOIN users u ON lr.user_id = u.id
                LEFT JOIN users m ON lr.assigned_to = m.id
                LEFT JOIN leave_types lt ON lr.leave_type_id = lt.id
                WHERE lr.user_id = :user_id AND lr.deleted_at IS NULL
            ";

            $params = [
                'user_id' => $user_id,
            ];

            $search_type = $_GET['search_type'] ?? "";
            $start_date = $_GET['start_date'] ?? "";
            $end_date = $_GET['end_date'] ?? "";
            $status = $_GET['status'] ?? "";


            if (!empty($search_type)) {
                $query .= " AND lt.name = :leave_type";
                $params['leave_type'] = $search_type;
            }

            if (!empty($start_date)) {
                $query .= " AND lr.start_date = :start_date AND lr.start_date >= :start_date";
                $params['start_date'] = $start_date;
            }

            if (!empty($end_date)) {
                $query .= " AND lr.end_date = :end_date AND lr.end_date <= :end_date";
                $params['end_date'] = $end_date;
            }

            if (!empty($status)) {
                $query .= " AND lr.status = :status";
                $params['status'] = $status;
            }

            $query .= " ORDER BY lr.created_at DESC";
            $leave_requests = $this->db->query($query, $params)->all();


            if (empty($leave_requests)) {
                http_response_code(404);
                echo json_encode(['error' => 'No leave requests found.']);
                exit;
            }

            http_response_code(200);
            echo json_encode([
                'success' => 'Leave requests fetched successfully',
                'leave_requests' => [
                    'data' => $leave_requests,
                ],
            ]);
            return;
        }else {
            http_response_code(403);
            echo json_encode(['error' => 'You are not authorized to fetch leave requests.']);
            return;
            exit;
        }
    }

    public function show($id, $user_id, $role): void {

        if ($id && $user_id && $role) {
            $leave_request = $this->db->query(
                "SELECT 
                lr.*, 
                CONCAT(m.first_name, ' ', m.last_name) AS assigned_name, 
                lt.name AS leave_type
                FROM leave_requests lr
                LEFT JOIN users m ON lr.assigned_to = m.id 
                LEFT JOIN leave_types lt ON lr.leave_type_id = lt.id 
                WHERE lr.id = :id AND lr.user_id = :user_id", [
                    'id' => $id,
                    'user_id' => $user_id
                ])->find();

            if (!$leave_request) {
                http_response_code(404);
                echo json_encode(['error' => 'Leave request not found.']);
                return;
            }

            // validate if the user is the owner of the leave request or the assigned to the leave request
            if ((int) $leave_request['user_id'] !== (int) $user_id
                && (int) ($leave_request['assigned_to'] ?? 0) !== (int) $user_id) {
                http_response_code(403);
                echo json_encode(['error' => 'You are not authorized to fetch this leave request.']);
                return;
            }

            http_response_code(200);
            echo json_encode([
                'success' => 'Leave request fetched successfully',
                'leave_request' => $leave_request,
            ]);
            return;
            exit;
        }else {
            http_response_code(403);
            echo json_encode(['error' => 'You are not authorized to fetch this leave request.']);
            return;
            exit;
        }
    }

    public function patch($id, $user_id, $role, $input): void {


        if($user_id && $role) {

            $start_date = $input['start_date'] ?? $existingLeaveRequest['start_date'];
            $end_date = $input['end_date'] ?? $existingLeaveRequest['end_date'];
            $reason = $input['reason'] ?? $existingLeaveRequest['reason'];

            $existingLeaveRequest = $this->db->query("SELECT * FROM leave_requests WHERE id = :id AND user_id = :user_id", [
                'id' => $id,
                'user_id' => $user_id
            ])->find();

            if (!$existingLeaveRequest) {
                http_response_code(404);
                echo json_encode(['error' => 'Leave request not found.']);
                return;
                exit;
            }

            if(!$existingLeaveRequest['user_id'] == $user_id) {
                http_response_code(403);
                echo json_encode(['error' => 'You are not authorized to update this leave request.']);
                return;
                exit;
            }

            $current_status = $existingLeaveRequest['status'];

            if($current_status === 'approved') {
                http_response_code(422);
                echo json_encode(['error' => 'You cannot update an approved leave request.']);
                return;
                exit;
            }

            if($current_status === 'rejected') {
                http_response_code(422);
                echo json_encode(['error' => 'You cannot update a rejected leave request.']);
                return;
                exit;
            }

            if (!empty($input['leave_type'] || $input['start_date'] || $input['end_date'] || $input['reason'])) {
                    $leaveTypeRecord = $db->query("SELECT id FROM leave_types WHERE name = :name", [
                        'name' => $input['leave_type']
                    ])->find();

                    $leave_type_id = $leaveTypeRecord ? $leaveTypeRecord['id'] : $existingLeaveRequest['leave_type_id'];
                    $start_date = $input['start_date'] ?? $existingLeaveRequest['start_date'];
                    $end_date = $input['end_date'] ?? $existingLeaveRequest['end_date'];
                    $reason = $input['reason'] ?? $existingLeaveRequest['reason'];
                } else {
                    $leave_type_id = $existingLeaveRequest['leave_type_id'];
                    $start_date = $existingLeaveRequest['start_date'];
                    $end_date = $existingLeaveRequest['end_date'];
                    $reason = $existingLeaveRequest['reason'];
            }


            // validate if there's already an existing leave request in the date range
            $overlapRequest = $this->db->query("
                SELECT 
                    id,
                FROM leave_requests 
                WHERE user_id = :user_id 
                AND leave_type_id = :leave_type_id 
                AND status IN ('pending', 'approved')
                AND CURRENT_DATE BETWEEN start_date AND end_date
                AND ((start_date <= :end_date AND end_date >= :start_date) OR (start_date >= :start_date AND end_date <= :end_date))
                AND id != :id
            ", [
                'id' => $id,
                'user_id' => $user_id,
                'leave_type_id' => $leave_type_id,
                'start_date' => $start_date,
                'end_date' => $end_date
            ])->find();

            if ($overlapRequest) {
                http_response_code(422);
                echo json_encode(['error' => 'You already have a pending or approved request for this leave type during the selected dates.']);
                return;
                exit;
            }


            $this->db->query("UPDATE leave_requests SET start_date = :start_date, end_date = :end_date, reason = :reason, leave_type_id = :leave_type_id WHERE id = :id", [
                'id' => $id,
                'start_date' => $start_date,
                'end_date' => $end_date,
                'reason' => $reason,
                'leave_type_id' => $leave_type_id
            ])->find();
            
            http_response_code(200);
            echo json_encode(['success' => 'Leave request updated successfully']);
            return;
            exit;

            
        }

    }


    public function destroy($id, $user_id, $role): void {

    if ($id && $user_id && $role) {
        $this->db->query("DELETE FROM leave_requests WHERE id = :id", [
            'id' => $id
        ])->find();

        http_response_code(200);
        echo json_encode(['success' => 'Leave request deleted successfully']);
        return;
        exit;
    }else {
        http_response_code(403);
        echo json_encode(['error' => 'You are not authorized to delete this leave request.']);
        return;
        exit;
    }


    }

}
