<?php

namespace App\Http\Controllers\Dashboard\department;

use App\Services\dashboard\department\DepartmentEmployeesService;
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
        
        try {
            $active_employees_by_department = $this->department_employees_service->getDepartmentActiveEmployees();
            $inactive_employees_by_department = $this->department_employees_service->getDepartmentInactiveEmployees();
            $this->db->response(200, true, 'Employees by department fetched successfully', [
                'active_employees_by_department' => $active_employees_by_department,
                'inactive_employees_by_department' => $inactive_employees_by_department
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