<?php

namespace App\Http\Controllers\Dashboard;

use App\Contracts\LeaveAnalyticsInterface;
use App\Http\Middleware\Auth;
use App\Services\dashboard\ManagerDashboardService;
use Core\App;

class ManagerDashboardController {

    private LeaveAnalyticsInterface $leaveAnalyticsService;

    private ManagerDashboardService $managerDashboardService;

    public function __construct() {

        $this->leaveAnalyticsService = App::resolve(ManagerDashboardService::class);
        $this->managerDashboardService = App::resolve(ManagerDashboardService::class);

    }
    public function index(): void {

        $currentUser = Auth::user() ?? null;
        $currentUserRole = $currentUser['role'] ?? null;
        
        if($currentUserRole === 'manager') {

            $remainingBalance = $this->managerDashboardService->getRemainingTotalBalance();
            $pendingRequest = $this->managerDashboardService->getPendingApprovalMetrics();
            $usedDays = $this->managerDashboardService->getUsedDays();
            $teamAvailability = $this->leaveAnalyticsService->getTeamAvailability();
            $leaveOverlap = $this->leaveAnalyticsService->getTeamOverlap();
            $monthlyLeaveConsumption = $this->leaveAnalyticsService->getMonthlyConsumption();
            $backlogRequests = $this->leaveAnalyticsService->getBacklogRequests();
            $recentActivity = $this->leaveAnalyticsService->getRecentActivity();

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Dashboard data fetched successfully',
                'remaining_balance' => $remainingBalance,
                'pending_request' => $pendingRequest,
                'total_used_days' => $usedDays,
                'team_availability' => $teamAvailability,
                'leave_overlap' => $leaveOverlap,
                'monthly_leave_consumption' => $monthlyLeaveConsumption,
                'approval_backlogs' => $backlogRequests,
                'recent_activity' => $recentActivity,
            ]);
            exit;
        }

        http_response_code(403);
        echo json_encode(['error' => 'Forbidden: Only managers can view this dashboard']);
    }

}
