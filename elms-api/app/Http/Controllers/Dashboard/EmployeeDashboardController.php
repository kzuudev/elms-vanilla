<?php


namespace App\Http\Controllers\Dashboard;

use App\Http\Middleware\Auth;
use App\Services\dashboard\EmployeeDashboardService;
use Core\App;


class EmployeeDashboardController {

    private EmployeeDashboardService $employeeDashboardService;

    public function __construct() {

        $this->employeeDashboardService = App::resolve(EmployeeDashboardService::class);

    }

    public function index(): void
    {

        $currentUser = Auth::user() ?? null;

        $currentUserId = $currentUser['id'] ?? null;
        $currentUserRole = $currentUser['role'] ?? null;

        $totalRemainingBalance = $this->employeeDashboardService->getRemainingTotalBalance();
        $totalPendingRequest = $this->employeeDashboardService->getPendingApprovalMetrics();
        $totalUsedDays = $this->employeeDashboardService->getUsedDays();
        $recentActivity = $this->employeeDashboardService->getRecentActivity($currentUserId);
        $teamAvailability = $this->employeeDashboardService->getTeamAvailability($currentUserId, $currentUserRole);
        $monthlyLeaveConsumption = $this->employeeDashboardService->getMonthlyLeaveConsumption($currentUserId);

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Dashboard data fetched successfully',
            'total_remaining_balance' => $totalRemainingBalance,
            'total_pending_request' => $totalPendingRequest,
            'total_used_days' => $totalUsedDays,
            'recent_activity' => $recentActivity,
            'team_availability' => $teamAvailability,
            'monthly_leave_consumption' => $monthlyLeaveConsumption
        ]);
        exit;
    }
}
