<?php


namespace App\Http\Controllers\Dashboard;

use App\Http\Middleware\Auth;
use App\Services\leaves\EmployeeLeaveService;
use Core\App;

class EmployeeDashboardController {

    // Declare the property so that the whole class can use it
    private EmployeeLeaveService $employeeLeaveService;
    private EmployeeLeaveService $pendingLeaveService;
    private EmployeeLeaveService $usedLeaveService;
    private EmployeeLeaveService $recentLeaveService;

    private EmployeeLeaveService $teamAvailabilityLeaveService;
    private EmployeeLeaveService $monthlyLeaveConsumptionService;

    public function __construct() {

        $this->employeeLeaveService = App::resolve(EmployeeLeaveService::class);
        $this->pendingLeaveService = App::resolve(EmployeeLeaveService::class);
        $this->usedLeaveService = App::resolve(EmployeeLeaveService::class);
        $this->recentLeaveService = App::resolve(EmployeeLeaveService::class);
        $this->teamAvailabilityLeaveService = App::resolve(EmployeeLeaveService::class);
        $this->monthlyLeaveConsumptionService = App::resolve(EmployeeLeaveService::class);

    }

    public function index(): void
    {

        $currentUser = Auth::user() ?? null;

        $currentUserId = $currentUser['id'] ?? null;;
        $currentUserRole = $currentUser['role'] ?? null;

        $totalRemainingBalance = $this->employeeLeaveService->getRemainingTotalBalance();
        $totalPendingRequest = $this->pendingLeaveService->getPendingApprovalMetrics();
        $totalUsedDays = $this->usedLeaveService->getUsedDays();
        $recentActivity = $this->recentLeaveService->getRecentActivity($currentUserId);
        $teamAvailability = $this->teamAvailabilityLeaveService->getTeamAvailability($currentUserId, $currentUserRole);
        $monthlyLeaveConsumption = $this->monthlyLeaveConsumptionService->getMonthlyLeaveConsumption($currentUserId);

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