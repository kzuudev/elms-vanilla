<?php

namespace App\Http\Controllers\Department;

use App\Services\department\DepartmentEmployeesService;
use Core\App;
use Core\Database;
use App\Exceptions\domain\DomainException;
use Throwable;

class DepartmentEmployeesController {

    private DepartmentEmployeesService $department_employees_service;
    private Database $db;

    public function __construct() {
        $this->department_employees_service = new DepartmentEmployeesService();
        $this->db = App::resolve(Database::class);
    }

    public function index() {


        $department_name = $_GET['department_name'] ?? '';
        $sort_by = $_GET['sort_by'] ?? 'a-z';

        try {
            $active_employees_by_department = $this->department_employees_service->getDepartmentActiveEmployees($department_name, $sort_by);
            $on_leave_employees_by_department = $this->department_employees_service->getDepartmentOnLeaveEmployees();
            $total_employees_by_department = $this->department_employees_service->getTotalEmployeesByDepartment();
            $this->db->response(200, true, 'Employees by department fetched successfully', [
                'department_employees' => [
                    'active_employees_by_department' => $active_employees_by_department,
                    'on_leave_employees_by_department' => $on_leave_employees_by_department,
                    'total_employees_by_department' => $total_employees_by_department
                ]
            ]);
            return;
        }catch(DomainException $e) {
            $this->db->response($e->getStatus(), false, $e->getMessage());
            return;
        }catch(Throwable $e) {
            $this->db->response(500, false, $e->getMessage());
            return;
        }
    }
    
}