<?php


namespace App\Http\Controllers\Employees;

use App\Http\Middleware\Auth;
use App\Services\employees\EmployeesService;
use Core\App;
use Core\Database;


class EmployeesController {



    private EmployeesService $employees_service;
    private Database $db;

    public function __construct() {
        $this->employees_service = App::resolve(EmployeesService::class);
        $this->db = App::resolve(Database::class);
    }

    public function index() {
    
        try{
            $employees = $this->employees_service->getEmployees();
            $this->db->response(200, true, 'Employees fetched successfully.', ['employees' => $employees]);
            return;
        } catch(Exception $e) {
            $this->db->response(422, false, $e->getMessage());
            return;
        }
       
    }

    public function show($id) {
      
       try{
            $employee = $this->employees_service->getProfile($id);
            $this->db->response(200, true, 'Employee fetched successfully.', ['employee' => $employee]);
            return;
       } catch(Exception $e) {
            $this->db->response(422, false, $e->getMessage());
            return;
       }
    }


    public function patch($id) {

       try{
            $updated_employee = $this->employees_service->updateEmployee($id);
            $this->db->response(200, true, 'Employee updated successfully.', ['employee' => $updated_employee]);
            return $updated_employee;
       } catch(Exception $e) {
            $this->db->response(422, false, $e->getMessage());
            return;
       }
    }
    /**
     * Managers for the invite form (department-scoped for department admins).
     */
    public function managers() {
        
        try{
            $managers = $this->employees_service->getManagers();
            $this->db->response(200, true, 'Managers fetched successfully.', ['managers' => $managers]);
            return $managers;
        } catch(Exception $e) {
            $this->db->response(422, false, $e->getMessage());
            return;
        }
    }

    public function admins() {

        try{
            $admins = $this->employees_service->getAdmins();
            $this->db->response(200, true, 'Admins fetched successfully.', ['admins' => $admins]);
            return $admins;
        } catch(Exception $e) {
            $this->db->response(422, false, $e->getMessage());
            return;
        }
    }



}