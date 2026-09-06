<?php

namespace App\Http\Controllers\Dashboard;

use App\Contracts\LeaveAnalyticsInterface;
use App\Http\Middleware\Auth;
use App\Services\dashboard\ManagerDashboardService;
use Core\App;
use Core\Database;

class ManagerDashboardController {

    private Database $db;
    private LeaveAnalyticsInterface $leave_analytics_service;

    private ManagerDashboardService $manager_dashboard_service;

    public function __construct() {

        $this->db = App::resolve(Database::class);
        $this->leave_analytics_service = App::resolve(ManagerDashboardService::class);
        $this->manager_dashboard_service = App::resolve(ManagerDashboardService::class);

    }
    public function index(): void {

        $current_user = Auth::user() ?? null;
        $current_user_role = $current_user['role'] ?? null;
        
        if($current_user_role === 'manager') {

            $remaining_balance = $this->manager_dashboard_service->getRemainingTotalBalance();
            $pending_request = $this->manager_dashboard_service->getPendingApprovalMetrics();
            $total_used_days = $this->manager_dashboard_service->getUsedDays();
            $team_availability = $this->leave_analytics_service->getTeamAvailability();
            $leave_overlap = $this->leave_analytics_service->getTeamOverlap();
            $monthly_leave_consumption = $this->leave_analytics_service->getMonthlyConsumption();
            $approval_backlogs = $this->leave_analytics_service->getBacklogRequests();
            $recent_activity = $this->manager_dashboard_service->getRecentActivity();

            $this->db->response(200, true, 'Dashboard data fetched successfully', [
                'remaining_balance' => $remaining_balance,
                'pending_request' => $pending_request,
                'total_used_days' => $total_used_days,
                'team_availability' => $team_availability,
                'leave_overlap' => $leave_overlap,
                'monthly_leave_consumption' => $monthly_leave_consumption,
                'approval_backlogs' => $approval_backlogs,
                'recent_activity' => $recent_activity,
            ]);
            exit;
        }

        $this->db->response(403, false, 'Forbidden: Only managers can view this dashboard');
    }

}
