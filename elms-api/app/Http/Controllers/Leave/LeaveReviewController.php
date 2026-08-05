<?php

namespace App\Http\Controllers\Leave;


use App\Http\Middleware\Auth;
use Core\App;
use Core\Database;
use App\Services\notifications\NotificationService;
use App\Services\leaves\LeaveReviewService;
use App\Contracts\LeaveReviewInterface;

class LeaveReviewController {

    private Database $db;
    private Auth $auth;
    private NotificationService $notificationService;

    private LeaveReviewInterface $leaveReviewService;
    
    public function __construct() {
        $this->db = App::resolve(Database::class);
        $this->auth = App::resolve(Auth::class);
        $this->notificationService = App::resolve(NotificationService::class);
        $this->leaveReviewService = App::resolve(LeaveReviewService::class);
    }

    /**
     * @throws \Exception
     */
    public function index() {

        $this->leaveReviewService->getLeaveRequest();
    }

    public function patch(int $id) {

        $this->leaveReviewService->reviewLeaveRequest($id);

    }

    public function checkOverlap(int $id): void {
        $this->leaveReviewService->getCheckOverlap($id);

    }
}