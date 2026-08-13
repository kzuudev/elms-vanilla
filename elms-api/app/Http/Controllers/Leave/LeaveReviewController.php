<?php

namespace App\Http\Controllers\Leave;


use App\Http\Middleware\Auth;
use Core\App;
use Core\Database;
use App\Services\notifications\NotificationService;
use App\Services\leaves\LeaveReviewService;
use App\Contracts\LeaveReviewInterface;

class LeaveReviewController {

    private NotificationService $notification_service;
    private LeaveReviewInterface $leave_review_service;

    private Database $db;
    private Auth $auth;

    private array $input = [];
    
    public function __construct() {
        $this->db = App::resolve(Database::class);
        $this->auth = App::resolve(Auth::class);
        $this->notification_service = App::resolve(NotificationService::class);
        $this->leave_review_service = App::resolve(LeaveReviewService::class);

        $this->input = json_decode(file_get_contents('php://input'), true) ?? [];

        $user = Auth::user();
        $this->user_id = (int) $user['id'];
        $this->role = (string) $user['role'];
        $this->department = (string) $user['department'];
    }

    /**
     * @throws \Exception
     */
    public function index() {

        try {
            $leave_requests = $this->leave_review_service->getLeaveRequest();
            $this->db->response(200, true, 'Leave requests fetched successfully.', ['leave_requests' => $leave_requests]);
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

    public function checkOverlap(int $id): void {
        $this->leave_review_service->getCheckOverlap($id);

    }
}