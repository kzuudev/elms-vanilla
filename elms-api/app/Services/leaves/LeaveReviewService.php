<?php

namespace App\Services\leaves;

use App\Http\Middleware\Auth;
use Core\App;
use Core\Database;
use Throwable;
use App\Services\notifications\NotificationService;
use App\Exceptions\domain\NotFoundException;
use App\Exceptions\domain\ForbiddenException;
use App\Exceptions\domain\BadRequestException;
use App\Contracts\LeaveReviewInterface;


class LeaveReviewService implements LeaveReviewInterface {

    private Database $db;
    private Auth $auth;
    private NotificationService $notification_service;

    public function __construct() {

        $this->db = App::resolve(Database::class);
        $this->auth = App::resolve(Auth::class);
        $this->notification_service = App::resolve(NotificationService::class);
    }

    public function getLeaveRequest($leave_type, $start_date, $end_date, $status): array {

            $current_user = $this->auth->authenticate();

            $current_user_id = $current_user['id'] ?? null;
            $role = $current_user['role'] ?? null;

            if (!$current_user_id || !$role) {
                throw new NotFoundException('User not found');
            }
            
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


            if (!empty($leave_type)) {
                $sql .= " AND lt.name = :leave_type";
                $params['leave_type'] = $leave_type;
            }

            if (!empty($start_date)) {
                $sql .= " AND lr.start_date = :start_date AND lr.start_date >= :start_date";
                $params['start_date'] = $start_date;
            }

            if (!empty($end_date)) {
                $sql .= " AND lr.end_date = :end_date AND lr.end_date <= :end_date";
                $params['end_date'] = $end_date;
            }

            if (!empty($status)) {
                $sql .= " AND lr.status = :status";
                $params['status'] = $status;
            }

            if($role === 'super-admin') {
                
            }else if ($role === 'admin') {
                // Admins see all requests, except their own requests
                $sql .= " AND lr.user_id != :reviewer_id AND e.department = :department";
                $params['reviewer_id'] = $current_user_id;
                $params['department'] = $current_user['department'];
            } elseif ($role === 'manager') {
                // Managers only see requests assigned to them
                $sql .= " AND lr.assigned_to = :reviewer_id";
                $params['reviewer_id'] = $current_user_id;
            } else {
                // Stop regular employees from seeing the review list!
                throw new ForbiddenException('Forbidden: You do not have review permissions');
            }

            $leave_requests = $this->db->query($sql, $params)->all();
            return $leave_requests;

    }

    public function reviewLeaveRequest(int $id, int $user_id, string $role, string $department, string $status, string $rejection_reason) {
            
            $current_user = $this->auth->authenticate();

            $current_user_id = $current_user['id'] ?? null;

            if (!$current_user_id) {
                throw new NotFoundException('User not found');
            }
            
            $role = $current_user['role'] ?? null;

            if(!$role) {
                throw new NotFoundException('User role not found');
            }

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

                
            $params = ['id' => $id];


            if($role === 'super-admin') {
                $sql .= " AND e.department = :department AND lr.user_id != :current_user_id";
                $params['department'] = $current_user['department'];
                $params['current_user_id'] = $current_user_id;
            }else if($role === 'admin') {
                $sql .= " AND e.department = :department";
                $params['department'] = $current_user['department'];
            }else if ($role === "manager") {
                // Managers can see it if they are assigned to it OR if managers created it
                $sql .= " AND (lr.assigned_to = :current_user_id OR lr.user_id = :current_user_id)";
                $params['current_user_id'] = $current_user_id;
            }else {
                throw new ForbiddenException('Forbidden: You do not have review permissions');
            }

            // capture the authorized user
            $authorized_for_leave_request = $this->db->query($sql, $params)->find();

            if(!$authorized_for_leave_request) {
                throw new NotFoundException('Authorized user not found');
            }

            if($current_user_id === $authorized_for_leave_request['user_id']) {
                throw new BadRequestException('Self-approval is strictly prohibited.');
            }
    
            // capture the leave request
            $leave_request = $this->db->query("SELECT * FROM leave_requests WHERE id = :id", [
                'id' => $id,
            ])->find();


            if(!in_array($status, ['approved', 'rejected'])) {
                throw new BadRequestException('Invalid status. Must be approved or rejected.');
            }
            
            if($leave_request['status'] !== 'pending') {
                throw new BadRequestException('Leave request already approved or rejected');
            }

            try{

                $this->db->beginTransaction();
            
                if($status == 'rejected') {
                    // reject the leave request status
                    $rejected = $this->db->query("UPDATE leave_requests SET status = :status, rejection_reason = :rejection_reason WHERE id = :id", [
                        'id' => $id,
                        'status' => $status,
                        'rejection_reason' => $rejection_reason
                    ]);

                    if(!$rejected) {
                        throw new Exception('Failed to reject leave request');
                        
                    }

                    
                    $this->notification_service->createNotification($leave_request['user_id'], 
                        'Leave Request Rejected', 
                        'leave_request_rejected', 
                        'Your Leave Request has been rejected by ' . $authorized_for_leave_request['first_name'] . ' ' . $authorized_for_leave_request['last_name'] . ' with the reason: ' . $rejection_reason, 
                        'false',
                        [
                            'leave_request_id' => $id,
                            'rejected_by' => $authorized_for_leave_request['first_name'] . ' ' . $authorized_for_leave_request['last_name'],
                        ]
                    );

                    $this->db->commit();
                    return $id;
                }

                if($status == 'approved') {

                    $remaining_balance = $this->db->query("SELECT remaining_balance FROM leave_balance WHERE user_id = :user_id AND leave_type_id = :leave_type_id" , [
                        'user_id' => $leave_request['user_id'],
                        'leave_type_id' => $leave_request['leave_type_id'],
                    ])->find();

                    if(!$remaining_balance || $remaining_balance['remaining_balance'] < $leave_request['total_days']) {
                        throw new BadRequestException('Remaining balance for this leave type is insufficient');
                    }
                
                    // update the leave balance
                    $update_leave_balance = $this->db->query("UPDATE leave_balance SET remaining_balance = :remaining_balance WHERE user_id = :employee_id AND leave_type_id = :leave_type_id", [
                        'employee_id' => $leave_request['user_id'],
                        'remaining_balance' => $remaining_balance['remaining_balance'] - $leave_request['total_days'],
                        'leave_type_id' => $leave_request['leave_type_id'],
                    ]);

                    // approved the leave request status
                    $approved = $this->db->query("UPDATE leave_requests SET status = :status, rejection_reason = :rejection_reason WHERE id = :id", [
                        'id'               => $id,
                        'status'           => $status,
                        'rejection_reason' => $rejection_reason
                    ]);

                    $this->notification_service->createNotification($leave_request['user_id'], 
                        'Leave Request Approved by ' . $authorized_for_leave_request['first_name'] . ' ' . $authorized_for_leave_request['last_name'], 
                        'leave_request_approved', 
                        'Your Leave Request has been approved by ' . $authorized_for_leave_request['first_name'] . ' ' . $authorized_for_leave_request['last_name'], 
                        'true',
                        [
                            'leave_request_id' => $id,
                            'approved_by' => $authorized_for_leave_request['first_name'] . ' ' . $authorized_for_leave_request['last_name'],
                        ]
                    );

                    $this->db->commit();
                    return $id;

                }


            }catch(Throwable $e) {
                $this->db->rollBack();
                throw $e;
            }
            

    }

    public function getCheckOverlap(int $id, int $user_id, string $role, string $department) {

        $current_user = $this->auth->authenticate();

        $current_user_id = $current_user['id'] ?? null;

        if (!$current_user_id) {
            throw new NotFoundException('User not found');
        }

        $role = $current_user['role'] ?? null;

        if(!$role) {
            throw new NotFoundException('User role not found');
        }

        if(!$id) {
            throw new NotFoundException('Leave request not found.');
        }

        if($role !== 'admin' && $role !== 'manager' && $role !== 'super_admin') {
            throw new ForbiddenException('You are not authorized to check overlap for this leave request.');
        }

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

        if($role === 'super-admin') {
            $query .= " AND u.department = :department AND lr.user_id != :current_user_id";
            $params['department'] = $current_user['department'];
            $params['current_user_id'] = $current_user_id;
        }else if($role === "admin") {
            $query .= " AND u.department = :department";
            $params['department'] = $current_user['department'];
        }else if($role === "manager") {
            $query .= " AND lr.assigned_to = :current_user_id";
            $params['current_user_id'] = $current_user_id;
        }else {
            throw new ForbiddenException('Forbidden: You do not have check overlap permissions');
        }

        // Capture the review request
        $review_request = $this->db->query($query, $params)->find();

        if(!$review_request) {
            throw new NotFoundException('Leave request not found');
        }

        // Count total ACTIVE EMPLOYEES in the exact department
        $active_staff = $this->db->query("
            SELECT COUNT(*) AS total_active_staff
            FROM users u
            WHERE u.department = :department AND u.is_active = 1
        ", ['department' => $review_request['department']]);

        $total_active_staff = (int) $active_staff->find()['total_active_staff'] ?? 0;

        // Fetch already approved leaves in the department (exclude the requester id)
        $approved_leaves = $this->db->query("
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
            'start_date' => $review_request['start_date'],
            'end_date' => $review_request['end_date'],
            'department' => $review_request['department'],
            'requester_id' => $review_request['employee_id'],
        ])->all();


        // Count total currently OFF EMPLOYEES
        $total_off_staff = count($approved_leaves);

        // Calculate Remaining Staff
        $remaining_staff = $total_active_staff - $total_off_staff;

        // Check if there is a critical overlap
        $critical_overlap = $remaining_staff <= 0;

        return [
            'department'            => $review_request['department'],
            'total_active_staff'    => $total_active_staff,
            'remaining_staff'       => $remaining_staff,
            'has_critical_overlap'  => $critical_overlap,
            'overlapping_employees' => $approved_leaves,    
        ];

    }
}
