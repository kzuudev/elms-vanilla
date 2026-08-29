<?php

namespace App\Http\Controllers\Leave;

use Core\App;
use Core\Database;
use App\Services\leaves\LeaveTypeSummaryService;
use App\Exceptions\domain\DomainException;
use throwable;


class LeaveTypeSummaryController
{

    private Database $db;
    private LeaveTypeSummaryService $leave_type_summary_service;

    
    public function __construct()
    {

        $this->db = App::resolve(Database::class);
        $this->leave_type_summary_service = App::resolve(LeaveTypeSummaryService::class);
    }

    public function index()
    {

        $search_leave_type = $_GET['search_leave_type'] ?? '';

        try {

            $total_leave_types = $this->leave_type_summary_service->getTotalLeaveTypes($search_leave_type);
            $total_paid_leave_types = $this->leave_type_summary_service->getTotalPaidLeaveTypes();
            $total_unpaid_leave_types = $this->leave_type_summary_service->getTotalUnpaidLeaveTypes();
            $total_allocated_leave_types = $this->leave_type_summary_service->getTotalAllocatedLeaveTypes();

            $this->db->response(200, true, 'Leave type summary fetched successfully', [
                'leave_type_summary' => [
                    'total_leave_types' => $total_leave_types,
                    'total_paid_leave_types' => $total_paid_leave_types,
                    'total_unpaid_leave_types' => $total_unpaid_leave_types,
                    'total_allocated_leave_types' => $total_allocated_leave_types,
                ]
            ]);
            return;
        } catch (DomainException $e) {
            $this->db->response($e->getCode(), false, $e->getMessage());
            return;
        } catch (Throwable $e) {
            $this->db->response(500, false, $e->getMessage());
            return;
        }
    }
}
