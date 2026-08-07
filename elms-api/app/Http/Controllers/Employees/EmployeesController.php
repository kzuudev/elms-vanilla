<?php


namespace App\Http\Controllers\Employees;

use App\Http\Middleware\Auth;
use App\Services\employees\EmployeesService;
use Core\App;
use Core\Database;


class EmployeesController {

    private EmployeesService $employees_service;

    public function __construct() {
        $this->employees_service = App::resolve(EmployeesService::class);
    }

    public function index() {
    
        return $this->employees_service->getEmployees();
       
    }

    public function show($id) {
      
       return $this->employees_service->getEmployee($id);
    }


    public function patch($id) {

       return $this->employees_service->updateEmployee($id);
    }


    public function destroy($id) {

       return $this->employees_service->deleteEmployee($id); 

    }

    public function profile($id) {

       return $this->employees_service->getProfile($id);
    }

    /**
     * Managers for the invite form (department-scoped for department admins).
     */
    public function managers() {
        
        return $this->employees_service->getManagers();
    }



}