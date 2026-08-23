<?php

namespace App\Http\Controllers\Department;

use Core\App;
use Core\Database;

use App\Services\department\DepartmentService;
use App\Http\Middleware\Auth;
use App\Exceptions\domain\DomainException;
use Throwable;

class DepartmentController {

    private Database $db;
    private DepartmentService $department_service;
    private ?array $input = null;


    public function __construct() {
        $this->db = App::resolve(Database::class);
        $this->department_service = App::resolve(DepartmentService::class);
        $this->input = json_decode(file_get_contents('php://input'), true) ?? [];

    }

    public function index() {

        $department_name = $_GET['department_name'] ?? '';
        $sort_by = $_GET['sort_by'] ?? 'a-z';

        try{
            $departments = $this->department_service->getDepartments($department_name, $sort_by);
            $this->db->response(200, true, 'Departments fetched successfully', ['departments' => $departments]);
            return;

        }catch(DomainException $e) {
            $this->db->response($e->getStatus(), false, $e->getMessage());
            return;
        }catch(Throwable $e) {
            $this->db->response(500, false, $e->getMessage());
            return;
        }

    }

    public function store() {

        $name = $this->input['name'] ?? '';
        
        if(empty($name)) {
            $this->db->response(422, false, 'Name is required');
            return;
        }

        try{
            $department = $this->department_service->createDepartment($name);
            $this->db->response(201, true, 'Department created successfully', ['department' => $department]);
            return;
        }catch(DomainException $e) {
            $this->db->response($e->getStatus(), false, $e->getMessage());
            return;
        }catch(Throwable $e) {
            $this->db->response(500, false, 'Internal server error');
            return;
        }
    }

    public function show(int $id) {


        try{
            $department = $this->department_service->getDepartment($id);
            $this->db->response(200, true, 'Department fetched successfully', ['department' => $department]);
            return;
        }catch(DomainException $e) {
            $this->db->response($e->getStatus(), false, $e->getMessage());
            return;
        }catch(Throwable $e) {
            $this->db->response(500, false, 'Internal server error');
            return;
        }

    }   

    public function update(int $id) {

        $name = $this->input['name'] ?? '';
            
        if(empty($name)) {
            $this->db->response(422, false, 'Name is required');
            return;
        }

        try{
            $department = $this->department_service->updateDepartment($id, $name);
            $this->db->response(200, true, 'Department updated successfully', ['department' => $department]);
            return;
        }catch(DomainException $e) {
            $this->db->response($e->getStatus(), false, $e->getMessage());
            return;
        }catch(Throwable $e) {
            $this->db->response(500, false, 'Internal server error');
            return;
        }

    }

    public function destroy(int $id) {
        try{
            $department = $this->department_service->deleteDepartment($id);
            $this->db->response(200, true, 'Department deleted successfully', ['department' => $department]);
            return;
        }catch(DomainException $e) {
            $this->db->response($e->getStatus(), false, $e->getMessage());
            return;
        }catch(Throwable $e) {
            $this->db->response(500, false, 'Internal server error');
            return;
        }
    }
    
}