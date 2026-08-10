<?php

namespace App\Services\leaves;

use App\Http\Middleware\Auth;
use Core\App;
use Core\Database;
use App\Services\notifications\NotificationService;
use App\Contracts\LeaveReviewInterface;


class LeaveReviewService implements LeaveReviewInterface {

    private Database $db;
    private Auth $auth;
    private NotificationService $notificationService;

    public function __construct() {

        $this->db = App::resolve(Database::class);
        $this->auth = App::resolve(Auth::class);
        $this->notificationService = App::resolve(NotificationService::class);
    }

    public function getLeaveRequest(): array {

        $current_user = $this->auth->authenticate();

        $current_user_id = $current_user['id'] ?? null;

        if (!$current_user_id) {
            $this->db->response(401, false, 'Unauthorized');
            exit;
        }

        $role = $current_user['role'];
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
            $this->db->response(403, false, 'Forbidden: You do not have review permissions');
            exit;
        }

        $leavesList = $this->db->query($sql, $params)->all();

        $this->db->response(200, true, 'Employee leaves list fetched successfully', [
            'id' => $current_user_id,
            'leaves' => [
                'data' => $leavesList,
            ],
        ]);
    }

    public function reviewLeaveRequest(int $id): void {
        
        $current_user = $this->auth->authenticate();

        $current_user_id = $current_user['id'] ?? null;

        if (!$current_user_id) {
            $this->db->response(401, false, 'User not found', ['user_id' => $current_user_id]);
            exit;
        }
        
        $role = $current_user['role'] ?? null;
        $params = ['id' => $id];


        $sql = "
            SELECT 
                lr.*, 
                e.first_name as employee_name,
                e.first_name as reviewer_name 
            FROM leave_requests lr 
            LEFT JOIN users e ON lr.user_id = e.id
            LEFT JOIN users m ON lr.assigned_to = m.id 
            WHERE lr.id = :id AND lr.deleted_at IS NULL 
        ";

        if($role === "admin") {
            $sql .= " AND e.department = :department AND lr.user_id != :current_user_id";
            $params['department'] = $current_user['department'];
            $params['current_user_id'] = $current_user_id;

        }else if ($role === "manager") {
            // Managers can see it if they are assigned to it OR if managers created it
            $sql .= " AND (lr.assigned_to = :current_user_id OR lr.user_id = :current_user_id)";
            $params['current_user_id'] = $current_user_id;
        }else {
            $this->db->response(401, false, 'Unauthorized User', ['user_id' => $current_user_id]);
            exit;
        }

        // capture the authorized user
        $authorized_for_leave_request = $this->db->query($sql, $params)->find();

        // capture the new value
        $input = json_decode(file_get_contents('php://input'), true);
        $status = $input['status'] ?? '';
        $rejection_reason = $input['rejection_reason'] ?? '';

        // Validation of the status input
        if(!in_array($status, ['approved', 'rejected'])) {
            $this->db->response(422, false, 'Invalid status. Must be approved or rejected.');
            exit;
        }

        if($status == 'rejected' && empty($rejection_reason)) {
            $this->db->response(422, false, 'Rejection reason is required when status is rejected.');
            exit;
        }

        if($current_user_id === $authorized_for_leave_request['user_id']) {
            $this->db->response(403, false, 'Self-approval is strictly prohibited.');
            exit;
        }
   
        // capture the leave request
        $leave_request = $this->db->query("SELECT * FROM leave_requests WHERE id = :id", [
            'id' => $id,
        ])->find();
        
        if($leave_request['status'] !== 'pending') {
            $this->db->response(400, false, 'Leave request already approved or rejected');
            exit;
        }

        if($status == 'rejected') {

                // reject the leave request status
                $rejected = $this->db->query("UPDATE leave_requests SET status = :status, rejection_reason = :rejection_reason WHERE id = :id", [
                    'id' => $id,
                    'status' => $status,
                    'rejection_reason' => $rejection_reason
                ]);

                $this->notificationService->store($leave_request['user_id'], 
                    'Leave Request Rejected', 
                    'leave_request_rejected', 
                    'Your Leave Request has been rejected by ' . $authorized_for_leave_request['first_name'] . ' ' . $authorized_for_leave_request['last_name'] . ' with the reason: ' . $rejection_reason, 
                    'false',
                    [
                        'leave_request_id' => $id,
                        'rejected_by' => $authorized_for_leave_request['first_name'] . ' ' . $authorized_for_leave_request['last_name'],
                    ]
                );
            }

        if($status == 'approved') {

            if($leave_request['remaining_balance'] < $leave_request['total_days']) {
                $this->db-response(400, false, 'Remaining balance for this leave type is insufficient');
                exit;
            }

            // update the leave balance
            $this->db->query("UPDATE leave_balance SET remaining_balance = remaining_balance - :total_days WHERE user_id = :employee_id AND leave_type_id = :leave_type_id", [
                'employee_id' => $leave_request['user_id'],
                'total_days' => $leave_request['total_days'],
                'leave_type_id' => $leave_request['leave_type_id'],
            ]);

            // approved the leave request status
            $this->db->query("UPDATE leave_requests SET status = :status, rejection_reason = :rejection_reason WHERE id = :id", [
                'id'               => $id,
                'status'           => $status,
                'rejection_reason' => $rejection_reason
            ]);


            $this->notificationService->store($leave_request['user_id'], 
                'Leave Request Approved by ' . $authorized_for_leave_request['first_name'] . ' ' . $authorized_for_leave_request['last_name'], 
                'leave_request_approved', 
                'Your Leave Request has been approved by ' . $authorized_for_leave_request['first_name'] . ' ' . $authorized_for_leave_request['last_name'], 
                'false',
                [
                    'leave_request_id' => $id,
                    'approved_by' => $authorized_for_leave_request['first_name'] . ' ' . $authorized_for_leave_request['last_name'],
                ]
            );
        }

        $this->db->response(200, true, 'Leave request status updated successfully', [
            'id' => $id,
            'authorized_user' => $authorized_for_leave_request,
            'status' => $status,
        ]);

        

    }

    public function getCheckOverlap(int $id): void {

        $current_user = $this->auth->authenticate();
        $current_user_id = $current_user['id'] ?? null;
        if (!$current_user_id) {
            $this->db->response(401, false, 'Unauthorized');
            exit;
        }
        

        $role = $current_user['role'] ?? null;
        $params = ['id' => $id];

        $query = "
            SELECT
                lr.id AS leave_request_id,
                lr.user_id AS employee_id,
                lr.start_date AS start_date,
                lr.end_date AS end_date,
                lt.name AS leave_type,
                lt.id AS leave_type_id,
                u.first_name AS first_name,
                u.last_name AS last_name,
                u.department AS department
            FROM leave_requests lr
            LEFT JOIN users u ON lr.user_id = u.id
            LEFT JOIN leave_types lt ON lr.leave_type_id = lt.id
            WHERE lr.id = :id AND lr.deleted_at IS NULL
        ";

        if($role === "admin") {
            $query .= " AND lr.user_id != :current_user_id";
            $params['current_user_id'] = $current_user_id;
        }else if($role === "manager") {
            $query .= " AND lr.assigned_to = :current_user_id";
            $params['current_user_id'] = $current_user_id;
        }else {
            $this->db->response(401, false, 'Unauthorized', ['user_id' => $current_user_id]);
            exit;
        }
        
        // Capture the pending request
        $pendingRequest = $this->db->query($query, ['id' => $id])->find();

        if(!$pendingRequest) {
            $this->db->response(404, false, 'Leave request not found', [
                'user_id' => $current_user_id,
                'id' => $id,
            ]);
            exit;
        }

        // Count total ACTIVE EMPLOYEES in the exact department
        $activeStaff = $this->db->query("
            SELECT COUNT(*) AS total_active_staff
            FROM users u
            WHERE u.department = :department AND u.is_active = 1
        ", ['department' => $pendingRequest['department']]);

        $totalActiveStaff = (int) $activeStaff->find()['total_active_staff'] ?? 0;

        // Fetch already approved leaves in the department (exclude the requester id)
        $approvedLeaves = $this->db->query("
            SELECT 
                lr.id, 
                lr.user_id, 
                lr.start_date, 
                lr.end_date, 
                lt.name AS leave_type, 
                lt.id AS leave_type_id,
                u.department AS department
            FROM leave_requests lr
            INNER JOIN leave_types lt ON lr.leave_type_id = lt.id
            INNER JOIN users u ON lr.user_id = u.id
            WHERE lr.status = 'approved' 
              AND u.department = :department 
              AND lr.user_id != :requester_id 
              AND lr.deleted_at IS NULL
              AND (lr.start_date <= :end_date AND lr.end_date >= :start_date)
        ", [
            'start_date' => $pendingRequest['start_date'],
            'end_date' => $pendingRequest['end_date'],
            'department' => $pendingRequest['department'],
            'requester_id' => $pendingRequest['employee_id'],
        ])->all();


        // Count total currently OFF EMPLOYEES
        $totalOffStaff = count($approvedLeaves);

        // Calculate Remaining Staff
        $remainingStaff = $totalActiveStaff - $totalOffStaff;

        $criticalOverlap = $remainingStaff <= 0;

        $this->db->response(200, true, 'Check overlap successfully', [
            'department'            => $pendingRequest['department'],
            'total_active_staff'    => $totalActiveStaff,
            'remaining_staff'       => $remainingStaff,
            'has_critical_overlap'  => $criticalOverlap,
            'overlapping_employees' => $approvedLeaves,
        ]);



    }
}
