<?php

namespace App\Http\Controllers\employees;

use App\Services\employees\EmployeeSummaryService;
use App\Http\Middleware\Auth;
use Core\App;


class EmployeesSummaryController {

    private EmployeeSummaryService $employee_summary_service;
    private ?array $current_user;
    private int $current_user_id;
    private string $current_user_role;
    public function __construct() {

        $this->employee_summary_service = App::resolve(EmployeeSummaryService::class);
        $this->current_user = Auth::user();
        $this->current_user_id = (int) ($this->current_user['id'] ?? 0);
        $this->current_user_role = (string) ($this->current_user['role'] ?? '');
    }

    public function summary() {

        if(!$this->current_user_id && !$this->current_user_role === 'admin') {
            http_response_code(401);
            echo json_encode([
                "success" => false,
                "message" => "Unauthorized Access",
                "id" => $this->current_user_id
            ]);
            return;
        }

        $employee_summary = $this->employee_summary_service->getEmployeeSummary();

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Employee summary fetched successfully',
            'id' => $this->current_user_id,
            'employee_summary' => $employee_summary
        ]);

        return $employee_summary;
    }
}

