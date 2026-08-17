<?php

namespace App\Http\Controllers\Leave;


use App\Http\Middleware\Auth;
use Core\App;
use Core\Database;
use Exception;
use App\Services\notifications\NotificationService;
use App\Services\leaves\LeaveReviewService;
use App\Contracts\LeaveReviewInterface;
use App\Http\Forms\LeaveRequestForm;


class LeaveReviewController {

    private NotificationService $notification_service;
    private LeaveReviewInterface $leave_review_service;

    private Database $db;
    private Auth $auth;
    private array $user;
    private int $user_id;
    private string $role;
    private string $department;

    private array $input = [];
    
    public function __construct() {
        $this->db = App::resolve(Database::class);
        $this->auth = App::resolve(Auth::class);
        $this->notification_service = App::resolve(NotificationService::class);
        $this->leave_review_service = App::resolve(LeaveReviewService::class);

        $this->input = json_decode(file_get_contents('php://input'), true) ?? [];

        $this->user = Auth::user();
        $this->user_id = (int) $this->user['id'];
        $this->role = (string) $this->user['role'];
        $this->department = (string) $this->user['department'];
    }

    /**
     * @throws \Exception
     */
    public function index() {

        $leave_request_form = new LeaveRequestForm();

        $leave_type = $_GET['leave_type'] ?? '';
        $start_date = $_GET['start_date'] ?? '';
        $end_date = $_GET['end_date'] ?? '';
        $status = $_GET['status'] ?? '';

        if(!$leave_request_form->validateQuery($leave_type, $start_date, $end_date, $status)) {
            $this->db->response(422, false, $leave_request_form->errors(), ['errors' => $leave_request_form->errors()]);
            return;
        }

        try {
            $leave_requests = $this->leave_review_service->getLeaveRequest($leave_type, $start_date, $end_date, $status);
            $this->db->response(200, true, 'Leave requests fetched successfully.', ['leave_requests' => $leave_requests]);
            return $leave_requests;
        }catch (Exception $e) {
            $this->db->response(422, false, $e->getMessage());
        }
    }

    public function patch(int $id) {

        $status = $this->input['status'] ?? '';
        $rejection_reason = $this->input['rejection_reason'] ?? '';

        if(!in_array($status, ['approved', 'rejected'])) {
            throw new Exception('Invalid status. Must be approved or rejected.');
            return;
        }

        try{
            $updated_leave_request = $this->leave_review_service->reviewLeaveRequest($id, $this->user_id, $this->role, $this->department, $status, $rejection_reason);
            
        }catch (Exception $e) {
            $this->db->response(422, false, $e->getMessage());
        }

    }

    public function checkOverlap(int $id) {
        
        try{
            $check_overlap = $this->leave_review_service->getCheckOverlap($id, $this->user_id, $this->role, $this->department);
            $this->db->response(200, true, 'Check overlap fetched successfully.', ['check_overlap' => $check_overlap]);
        }catch (Exception $e) {
            $this->db->response(422, false, $e->getMessage());
        }

    }
}