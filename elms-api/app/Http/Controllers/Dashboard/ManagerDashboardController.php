<?php

namespace App\Http\Controllers\Dashboard;

use App\Contracts\LeaveAnalyticsInterface;
use App\Http\Middleware\Auth;
use App\Services\dashboard\ManagerDashboardService;
use Core\App;
use Core\Database;

class ManagerDashboardController {

    private Database $db;
    private LeaveAnalyticsInterface $leaveAnalyticsService;

    private ManagerDashboardService $managerDashboardService;

    public function __construct() {

        $this->db = App::resolve(Database::class);
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

            $this->db->response(200, true, 'Dashboard data fetched successfully', [
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

        $this->db->response(403, false, 'Forbidden: Only managers can view this dashboard');
    }

}
