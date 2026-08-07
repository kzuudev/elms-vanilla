<?php


namespace App\Http\Controllers\Employees;

use App\Http\Middleware\Auth;
use App\Services\employees\EmployeesService;
use Core\App;
use Core\Database;


class EmployeesController {

    private EmployeesService $employeesService;

    private Database $db;
    private ?array $currentUser;
    private int $currentUserId;
    private string $currentUserRole;
    private string $currentUserDepartment;

    public function __construct() {
        $this->employeesService = App::resolve(EmployeesService::class);
    }

    public function index() {
    
        return $this->employeesService->getEmployees();
       
    }

    public function show($id) {
      
       return $this->employeesService->getEmployee($id);
    }


    public function patch($id) {

       return $this->employeesService->updateEmployee($id);
    }


    public function destroy($id) {

       return $this->employeesService->deleteEmployee($id); 

    }

    public function profile() {

       return $this->employeesService->getProfile();
    }

    /**
     * Managers for the invite form (department-scoped for department admins).
     */
    public function managers() {
        
        return $this->employeesService->getManagers();
    }



}