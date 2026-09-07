<?php


namespace App\Http\Controllers\Dashboard;

use App\Http\Middleware\Auth;
use App\Services\dashboard\EmployeeDashboardService;
use Core\App;
use Core\Database;


class EmployeeDashboardController {

    private Database $db;
    private EmployeeDashboardService $employeeDashboardService;

    public function __construct() {

        $this->db = App::resolve(Database::class);
        $this->employeeDashboardService = App::resolve(EmployeeDashboardService::class);

    }

    public function index(): void
    {

        $current_user = Auth::user() ?? null;

        $current_user_id = $current_user['id'] ?? null;
        $current_user_role = $current_user['role'] ?? null;

        $total_remaining_balance = $this->employeeDashboardService->getRemainingTotalBalance();
        $total_pending_request = $this->employeeDashboardService->getPendingApprovalMetrics();
        $total_used_days = $this->employeeDashboardService->getUsedDays();
        $recent_activity = $this->employeeDashboardService->getRecentActivity($current_user_id);
        $team_availability = $this->employeeDashboardService->getTeamAvailability($current_user_id, $current_user_role);
        $monthly_leave_consumption = $this->employeeDashboardService->getMonthlyLeaveConsumption();

        $this->db->response(200, true, 'Dashboard data fetched successfully', [
            'total_remaining_balance' => $total_remaining_balance,
            'total_pending_request' => $total_pending_request,
            'total_used_days' => $total_used_days,
            'recent_activity' => $recent_activity,
            'team_availability' => $team_availability,
            'monthly_leave_consumption' => $monthly_leave_consumption
        ]);
        exit;
    }
}
