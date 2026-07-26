<?php


namespace App\Http\Controllers\Dashboard;

use App\Contracts\LeaveAnalyticsInterface;
use App\Http\Middleware\Auth;
use App\Services\dashboard\AdminDashboardService;
use Core\App;


class AdminDashboardController {

    
    private LeaveAnalyticsInterface $leaveAnalyticsService;

    private AdminDashboardService $adminDashboardService;

    public function __construct() {

        $this->leaveAnalyticsService = App::resolve(AdminDashboardService::class);
        $this->adminDashboardService = App::resolve(AdminDashboardService::class);
    }

    public function index(): void {

        $currentUser = Auth::user() ?? null;
        $currentUserRole = $currentUser['role'] ?? null;
        
        if($currentUserRole === 'admin') {

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Dashboard data fetched successfully',
                'remaining_balance' => $this->adminDashboardService->getRemainingTotalBalance(),
                'pending_request' => $this->adminDashboardService->getPendingApprovalMetrics(),
                'total_used_days' => $this->adminDashboardService->getUsedDays(),
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