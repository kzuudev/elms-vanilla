<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Middleware\Auth;
use App\Services\ManagerLeaveService;
use Core\App;

class ManagerDashboardController {


    private ManagerLeaveService $teamAvailabilityService;
    private ManagerLeaveService $monthlyLeaveConsumptionService;
    private ManagerLeaveService $leaveOverlapService;
    private ManagerLeaveService $backlogRequestsService;

    public function __construct() {

        $this->teamAvailabilityService = App::resolve(ManagerLeaveService::class);
        $this->leaveOverlapService = App::resolve(ManagerLeaveService::class);
        $this->monthlyLeaveConsumptionService = App::resolve(ManagerLeaveService::class);
        $this->backlogRequestsService = App::resolve(ManagerLeaveService::class);

    }
    public function index(): void {

        $currentUser = Auth::authenticate();

        if($currentUser['role'] === 'manager') {

            $teamAvailability = $this->teamAvailabilityService->getTeamAvailability();
            $leaveOverlap = $this->leaveOverlapService->getTeamOverlap();
            $monthlyLeaveConsumption = $this->monthlyLeaveConsumptionService->getMonthlyConsumption();
            $backlogRequests = $this->backlogRequestsService->getBacklogRequests();

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Dashboard data fetched successfully',
                'team_availability' => $teamAvailability,
                'leave_overlap' => $leaveOverlap,
                'monthly_leave_consumption' => $monthlyLeaveConsumption,
                'approval_backlogs' => $backlogRequests
            ]);
            exit;
        }

        http_response_code(403);
        echo json_encode(['error' => 'Forbidden: Only managers can view this dashboard']);
    }

}