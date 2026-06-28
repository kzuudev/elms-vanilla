<?php


namespace App\Http\Controllers\Dashboard;

use App\Http\Middleware\Auth;
use App\Services\EmployeeLeaveService;
use Core\App;

class EmployeeDashboardController {

    // Declare the property so that the whole class can use it
    private EmployeeLeaveService $employeeLeaveService;
    private EmployeeLeaveService $pendingLeaveService;
    private EmployeeLeaveService $usedLeaveService;
    private EmployeeLeaveService $recentLeaveService;

    private EmployeeLeaveService $teamStatusLeaveService;

    public function __construct() {

        $this->employeeLeaveService = App::resolve(EmployeeLeaveService::class);
        $this->pendingLeaveService = App::resolve(EmployeeLeaveService::class);
        $this->usedLeaveService = App::resolve(EmployeeLeaveService::class);
        $this->recentLeaveService = App::resolve(EmployeeLeaveService::class);
        $this->teamStatusLeaveService = App::resolve(EmployeeLeaveService::class);

    }

    public function index(): void
    {

        $currentUser = Auth::authenticate();

        $current_user_id = $currentUser['id'] ?? null;;
        $current_user_role = $currentUser['role'] ?? null;

        $totalRemainingBalance = $this->employeeLeaveService->getRemainingTotalBalance($current_user_id);
        $totalPendingRequest = $this->pendingLeaveService->getPendingApprovalMetrics($current_user_id);
        $totalUsedDays = $this->usedLeaveService->getUsedDays($current_user_id);
        $recentActivity = $this->recentLeaveService->getRecentActivity($current_user_id);
        $teamStatus = $this->teamStatusLeaveService->getTeamStatus($current_user_id, $current_user_role);


        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Dashboard data fetched successfully',
            'total_remaining_balance' => $totalRemainingBalance,
            'total_pending_request' => $totalPendingRequest,
            'total_used_days' => $totalUsedDays,
            'recent_activity' => $recentActivity,
            'team_status' => $teamStatus
        ]);
        exit;
    }
}