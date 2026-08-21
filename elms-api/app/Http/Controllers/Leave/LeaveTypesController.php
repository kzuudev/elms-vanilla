<?php

namespace App\Http\Controllers\Leave;

use Core\Database;
use Core\App;
use App\Http\Middleware\Auth;
use App\Services\leaves\LeaveTypeService;
use App\Exceptions\domain\DomainException;
use Throwable;


class LeaveTypesController {

    private Database $db;
    private ?array $user;
    private LeaveTypeService $leave_type_service;
    private ?array $input = null;

    public function __construct() {
        $this->db = App::resolve(Database::class);
        $this->user = Auth::user();
        $this->input = json_decode(file_get_contents('php://input'), true) ?? [];
        $this->leave_type_service = App::resolve(LeaveTypeService::class);
    }

    /**
     * Leave types for the filter bar and leave request form
     */

    public function index() {

       try {    
        $leave_types = $this->leave_type_service->getLeaveTypes($this->user['id']);
        $this->db->response(200, true, 'Leave types fetched successfully', ['leave_types' => $leave_types]);
        return;
       }catch (DomainException $e) {
         $this->db->response($e->getCode(), false, $e->getMessage());
         return;
       }catch (Throwable $e) {
         $this->db->response(500, false, $e->getMessage());
         return;
       }
    }

    public function store() {


        $name = $this->input['name'] ?? '';
        $allocated_days = $this->input['allocated_days'] ?? 0;
        $is_paid = $this->input['is_paid'] ?? false;
        
        if(empty($name)) {
            $this->db->response(422, false, 'Name is required and must be a string');
            return;
        }

        if($allocated_days <= 0 || !is_int($allocated_days)) {
            $this->db->response(422, false, 'Allocated days must be greater than 0 and must be an integer');
            return;
        }
        
        if(!is_bool($is_paid) || $is_paid === null) {
            $this->db->response(422, false, 'Is paid must be a boolean value');
            return;
        }

        try {
            $leave_type = $this->leave_type_service->createLeaveType($name, $allocated_days, $is_paid);
            $this->db->response(201, true, 'Leave type created successfully', ['leave_type' => $leave_type]);
            return;
        }catch (DomainException $e) {
            $this->db->response($e->getCode(), false, $e->getMessage());
            return;
        }catch (Throwable $e) {
            $this->db->response(500, false, $e->getMessage());
            return;
        }
    }


    public function show(int $id) {
     

        try {
            $leave_type = $this->leave_type_service->getLeaveType($id);
            $this->db->response(200, true, 'Leave type fetched successfully', ['leave_type' => $leave_type]);
            return;
        }catch (DomainException $e) {
            $this->db->response($e->getCode(), false, $e->getMessage());
            return;
        }catch (Throwable $e) {
            $this->db->response(500, false, $e->getMessage());
            return;
        }
    }

    public function update(int $id) {


        $name = $this->input['name'] ?? '';
        $allocated_days = $this->input['allocated_days'] ?? 0;
        $is_paid = $this->input['is_paid'] ?? false;
        
        if(empty($name)) {
            $this->db->response(422, false, 'Name is required and must be a string');
            return;
        }

        if($allocated_days <= 0 || !is_int($allocated_days)) {
            $this->db->response(422, false, 'Allocated days must be greater than 0 and must be an integer');
            return;
        }
        
        if(!is_bool($is_paid) || $is_paid === null) {
            $this->db->response(422, false, 'Is paid must be a boolean value');
            return;
        }

        try {
            $leave_type = $this->leave_type_service->updateLeaveType($id, $name, $allocated_days, $is_paid);
            $this->db->response(200, true, 'Leave type updated successfully', ['leave_type' => $leave_type]);
            return;
        }catch (DomainException $e) {
            $this->db->response($e->getCode(), false, $e->getMessage());
            return;

        }catch (Throwable $e) {
            $this->db->response(500, false, $e->getMessage());
            return;
        }   

    }

    public function destroy(int $id) {

        if($this->user['role'] !== 'super-admin') {
            $this->db->response(403, false, 'You are not authorized to delete a leave type');
            return;
        }

        try {
            $deleted_leave_type = $this->leave_type_service->deleteLeaveType($id);
            $this->db->response(200, true, 'Leave type deleted successfully', ['deleted_leave_type' => $deleted_leave_type]);
            return;
        }catch (DomainException $e) {
            $this->db->response($e->getCode(), false, $e->getMessage());
            return;
        }catch (Throwable $e) {
            $this->db->response(500, false, $e->getMessage());
            return;
        }
    }



}