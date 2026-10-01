<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Middleware\Auth;
use App\Services\dashboard\SuperAdminDashboardService;
use Core\App;
use Core\Database;

class SuperAdminDashboardController
{
    private Database $db;
    private SuperAdminDashboardService $super_admin_dashboard_service;

    public function __construct()
    {
        $this->db = App::resolve(Database::class);
        $this->super_admin_dashboard_service = App::resolve(SuperAdminDashboardService::class);
    }

    public function index(): void
    {
        if ((Auth::user()['role'] ?? null) !== 'super-admin') {
            $this->db->response(403, false, 'Forbidden: Only super admins can view this dashboard');
            return;
        }

        $service = $this->super_admin_dashboard_service;
        $this->db->response(200, true, 'Dashboard data fetched successfully', [
            'remaining_balance' => $service->getRemainingTotalBalance(),
            'pending_request' => $service->getPendingApprovalMetrics(),
            'total_used_days' => $service->getUsedDays(),
            'next_upcoming_leave' => $service->getNextUpcomingLeave(),
            'team_availability' => $service->getTeamAvailability(),
            'leave_overlap' => $service->getTeamOverlap(),
            'monthly_leave_consumption' => $service->getMonthlyConsumption(),
            'approval_backlogs' => $service->getBacklogRequests(),
            'total_users' => $service->getTotalUsers(),
            'recent_activity' => $service->getRecentActivity(),
        ]);
    }
}
