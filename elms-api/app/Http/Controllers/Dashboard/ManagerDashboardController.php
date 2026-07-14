<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Middleware\Auth;

use App\Services\ManagerLeaveService;
use Core\App;

class ManagerDashboardController {


    private ManagerLeaveService $remainingLeaveService;
    private ManagerLeaveService $pendingLeaveService;

    private ManagerLeaveService $usedLeaveService;
    private ManagerLeaveService $teamAvailabilityService;
    private ManagerLeaveService $monthlyLeaveConsumptionService;
    private ManagerLeaveService $leaveOverlapService;
    private ManagerLeaveService $backlogRequestsService;

    private ManagerLeaveService $totalUsersService;

    private ManagerLeaveService $recentActivityService;

    public function __construct() {

        $this->remainingLeaveService = App::resolve(ManagerLeaveService::class);
        $this->pendingLeaveService = App::resolve(ManagerLeaveService::class);
        $this->usedLeaveService = App::resolve(ManagerLeaveService::class);
        $this->teamAvailabilityService = App::resolve(ManagerLeaveService::class);
        $this->leaveOverlapService = App::resolve(ManagerLeaveService::class);
        $this->monthlyLeaveConsumptionService = App::resolve(ManagerLeaveService::class);
        $this->backlogRequestsService = App::resolve(ManagerLeaveService::class);
        $this->totalUsersService = App::resolve(ManagerLeaveService::class);
        $this->recentActivityService = App::resolve(ManagerLeaveService::class);

    }
    public function index(): void {

        $currentUser = Auth::authenticate();

        if($currentUser && $currentUser['role'] === 'manager') {

            $remainingBalance = $this->remainingLeaveService->getRemainingTotalBalance();
            $pendingRequest = $this->pendingLeaveService->getPendingApprovalMetrics();
            $usedDays = $this->usedLeaveService->getUsedDays();
            $teamAvailability = $this->teamAvailabilityService->getTeamAvailability();
            $leaveOverlap = $this->leaveOverlapService->getTeamOverlap();
            $monthlyLeaveConsumption = $this->monthlyLeaveConsumptionService->getMonthlyConsumption();
            $backlogRequests = $this->backlogRequestsService->getBacklogRequests();
            $totalUsers = $this->totalUsersService->getTotalUsers();
            $recentActivity = $this->recentActivityService->getRecentActivity();

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
                'total_users' => $totalUsers,
                'recent_activity' => $recentActivity,
            ]);
            exit;
        }

        http_response_code(403);
        echo json_encode(['error' => 'Forbidden: Only managers can view this dashboard']);
    }

}