<?php

namespace App\Http\Controllers\employees;

use App\Services\employees\EmployeesSummaryService;
use Core\App;
use Core\Database;

class EmployeesSummaryController {

    private EmployeesSummaryService $employeesSummaryService;

    public function __construct() {
        $this->employeesSummaryService = new EmployeesSummaryService();
    }

    public function summary() {

        if(!$this->currentUserId) {
            http_response_code(401);
            echo json_encode(["error" => "User not found"]);
            exit;
        }

        $employeeSummary = $this->employeesSummaryService->getEmployeeSummary();

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Employee summary fetched successfully',
            'id' => $this->currentUserId,
            'employee_summary' => $employeeSummary
        ]);
    }
}

