<?php


namespace App\Http\Controllers\Dashboard;

use App\Http\Middleware\Auth;
use App\Http\Middleware\Middleware;
use App\Services\AdminLeaveService;
use Core\App;


class AdminDashboardController {

    private AdminLeaveService $usersAvailabilityService;
    private AdminLeaveService $monthlyLeaveConsumptionService;
    private AdminLeaveService $leaveOverlapService;
    private AdminLeaveService $backlogRequestsService;

    private AdminLeaveService $totalUsersService;

    private AdminLeaveService $recentActivityService;

    public function __construct() {

        $this->usersAvailabilityService = App::resolve(AdminLeaveService::class);
        $this->leaveOverlapService = App::resolve(AdminLeaveService::class);
        $this->monthlyLeaveConsumptionService = App::resolve(AdminLeaveService::class);
        $this->backlogRequestsService = App::resolve(AdminLeaveService::class);
        $this->totalUsersService = App::resolve(AdminLeaveService::class);
        $this->recentActivityService = App::resolve(AdminLeaveService::class);
    }

    public function index(): void {

        $currentUser = Auth::authenticate();

        if($currentUser && $currentUser['role'] === 'admin') {

            $usersAvailability = $this->usersAvailabilityService->getTeamAvailability();
            $leaveOverlap = $this->leaveOverlapService->getTeamOverlap();
            $monthlyLeaveConsumption = $this->monthlyLeaveConsumptionService->getMonthlyConsumption();
            $backlogRequests = $this->backlogRequestsService->getBacklogRequests();
            $totalUsers = $this->totalUsersService->getTotalUsers();
            $recentActivity = $this->recentActivityService->getRecentActivity();

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Dashboard data fetched successfully',
                'team_availability' => $usersAvailability,
                'leave_overlap' => $leaveOverlap,
                'monthly_leave_consumption' => $monthlyLeaveConsumption,
                'approval_backlogs' => $backlogRequests,
                'total_users' => $totalUsers,
                'recent_activity' => $recentActivity,
            ]);
            exit;

        }

        http_response_code(403);
        echo json_encode(['error' => 'Forbidden: Only admins can view this dashboard']);
    }
}