<?php


namespace App\Http\Controllers\Dashboard;

use App\Contracts\LeaveAnalyticsInterface;
use App\Http\Middleware\Auth;
use App\Services\dashboard\AdminDashboardService;
use Core\App;
use Core\Database;


class AdminDashboardController {

    private Database $db;
    private LeaveAnalyticsInterface $leaveAnalyticsService;

    private AdminDashboardService $adminDashboardService;

    public function __construct() {

        $this->db = App::resolve(Database::class);
        $this->leaveAnalyticsService = App::resolve(AdminDashboardService::class);
        $this->adminDashboardService = App::resolve(AdminDashboardService::class);
    }

    public function index(): void {

        $currentUser = Auth::user() ?? null;
        $currentUserRole = $currentUser['role'] ?? null;
        
        if($currentUserRole === 'admin') {

            $this->db->response(200, true, 'Dashboard data fetched successfully', [
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

        $this->db->response(403, false, 'Forbidden: Only admins can view this dashboard');
    }
}
