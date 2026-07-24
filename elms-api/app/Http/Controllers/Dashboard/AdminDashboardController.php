<?php


namespace App\Http\Controllers\Dashboard;

use App\Contracts\LeaveAnalyticsInterface;
use App\Http\Middleware\Auth;
use App\Services\leaves\AdminLeaveService;
use Core\App;


class AdminDashboardController {

    private LeaveAnalyticsInterface $leaveAnalyticsService;

    private AdminLeaveService $adminLeaveService;

    public function __construct() {

        $this->leaveAnalyticsService = App::resolve(AdminLeaveService::class);
        $this->adminLeaveService = App::resolve(AdminLeaveService::class);
    }

    public function index(): void {

        $currentUser = Auth::authenticate();

        if($currentUser && $currentUser['role'] === 'admin') {

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Dashboard data fetched successfully',
                'remaining_balance' => $this->adminLeaveService->getRemainingTotalBalance(),
                'pending_request' => $this->adminLeaveService->getPendingApprovalMetrics(),
                'total_used_days' => $this->adminLeaveService->getUsedDays(),
                'team_availability' => $this->leaveAnalyticsService->getTeamAvailability(),
                'leave_overlap' => $this->leaveAnalyticsService->getTeamOverlap(),
                'monthly_leave_consumption' => $this->leaveAnalyticsService->getMonthlyConsumption(),
                'approval_backlogs' => $this->leaveAnalyticsService->getBacklogRequests(),
                'recent_activity' => $this->leaveAnalyticsService->getRecentActivity(),
            ]);
            exit;

        }

        http_response_code(403);
        echo json_encode(['error' => 'Forbidden: Only admins can view this dashboard']);
    }
}