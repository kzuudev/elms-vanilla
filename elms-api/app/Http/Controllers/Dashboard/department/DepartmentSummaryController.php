<?php


namespace App\Http\Controllers\Dashboard\Department;

use Core\App;
use Core\Database;
use App\Http\Middleware\Auth;
use App\Services\dashboard\department\DepartmentSummaryService;
use App\Exceptions\domain\DomainException;
use Throwable;

class DepartmentSummaryController {

    private DepartmentSummaryService $department_summary_service;
    private Database $db;


    public function __construct() {
        $this->department_summary_service = App::resolve(DepartmentSummaryService::class);
        $this->db = App::resolve(Database::class);
    }

    public function index() {
        try {
            $total_departments = $this->department_summary_service->getTotalDepartments();
            $total_employees_by_department = $this->department_summary_service->getTotalEmployeesByDepartment();
            $largest_department = $this->department_summary_service->getLargestDepartment();
            $this->db->response(200, true, 'Department summary fetched successfully', [
                'total_departments' => $total_departments,
                'total_employees_by_department' => $total_employees_by_department,
                'largest_department' => $largest_department,
            ]);
            return;
        } catch (DomainException $e) {
            $this->db->response($e->getStatus(), false, $e->getMessage());
            return;
        } catch (Throwable $e) {
            $this->db->response(500, false, $e->getMessage());
            return;
        }
    }
}