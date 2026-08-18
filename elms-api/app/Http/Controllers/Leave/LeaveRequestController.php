<?php

namespace App\Http\Controllers\Leave;

use Core\App;
use Throwable;

use App\Exceptions\domain\DomainException;
use Core\Database;
use App\Http\Middleware\Auth;
use App\Http\Forms\LeaveRequestForm;
use App\Services\leaves\LeaveRequestService;


class LeaveRequestController
{

    private LeaveRequestService $leave_request_service;

    private ?array $input = null;

    private int $user_id;
    private string $role;
    private string $department;
    private Database $db;

    public function __construct()
    {
        $this->leave_request_service = new LeaveRequestService();
        $this->input = json_decode(file_get_contents('php://input'), true) ?? [];
        $this->db = App::resolve(Database::class);
        
        $user = Auth::user();
        $this->user_id = (int) $user['id'];
        $this->role = (string) $user['role'];
        $this->department = (string) $user['department'];       
    }

    public function store(): void 
    {
        $leave_request_form = new LeaveRequestForm();

        $start_date = $this->input['start_date'] ?? '';
        $end_date = $this->input['end_date'] ?? '';
        $reason = $this->input['reason'] ?? '';
        $leave_type = $this->input['leave_type'] ?? '';

        // validate the inputs
        if(!$leave_request_form->validate($leave_type, $start_date, $end_date, $reason)) {
            $this->db->response(422, false, $leave_request_form->errors(), ['errors' => $leave_request_form->errors()]);
            return;
        }

        try{
            $leave_request = $this->leave_request_service->createLeaveRequest($this->user_id, $this->role, $leave_type, $start_date, $end_date, $reason);
            $this->db->response(201, true, 'Leave request submitted successfully.', ['leave_request_id' => $leave_request]);
            return;
        }catch(DomainException $e) {
            $this->db->response($e->getStatus(), false, $e->getMessage(), ['errors' => $e->getMessage()]);
            return;
        }catch(Throwable $e) {
            $this->db->response(500, false, 'Something went wrong. Please try again later,');
            return;
        }

    }

    public function index(): void
    {

        $leave_request_form = new LeaveRequestForm();

        $leave_type = $_GET['leave_type'] ?? "";
        $start_date = $_GET['start_date'] ?? "";
        $end_date = $_GET['end_date'] ?? "";
        $status = $_GET['status'] ?? ""; 

        if(!$leave_request_form->validateQuery($leave_type, $start_date, $end_date, $status)) {
            $this->db->response(422, false, $leave_request_form->errors(), ['errors' => $leave_request_form->errors()]);
            return;
        } 
    
        try{
            $leave_requests = $this->leave_request_service->getLeaveRequests($this->user_id, $this->role, $this->department, $leave_type, $start_date, $end_date, $status);
            $this->db->response(200, true, 'Leave requests fetched successfully.', ['leave_requests' => $leave_requests]);
            return;
        }catch (Exception $e) {
            $this->db->response(422, false, $e->getMessage());
            return;
        }catch(Throwable $e) {
            $this->db->response(500, false, 'Something went wrong. Please try again later.');
            return;
        }

    }

    public function show($id): void
    {

        try{
            $leave_request = $this->leave_request_service->getLeaveRequest($id, $this->user_id, $this->role);
            $this->db->response(200, true, 'Leave request fetched successfully.', ['leave_request' => $leave_request]);
            return;
        }catch (DomainException $e) {
            $this->db->response($e->getStatus(), false, $e->getMessage(), ['leave_request_id' => $id]);
            return;
        }catch (Throwable $e) {
            $this->db->response(500, false, 'Something went wrong. Please try again later.');
            return;
        }

    }

    public function patch($id): void
    {

        $leave_request_form = new LeaveRequestForm();

        $leave_type = $this->input['leave_type'] ?? '';
        $start_date = $this->input['start_date'] ?? '';
        $end_date = $this->input['end_date'] ?? '';
        $reason = $this->input['reason'] ?? '';

        // validate the inputs
        if(!$leave_request_form->validate($leave_type, $start_date, $end_date, $reason)) {
            $this->db->response(422, false, $leave_request_form->errors(), ['errors' => $leave_request_form->errors()]);
            return;
        }

        try{
            $updated_leave_request = $this->leave_request_service->updateLeaveRequest($id, $this->user_id, $this->role, $leave_type, $start_date, $end_date, $reason);
            $this->db->response(200, true, 'Leave request updated successfully.', ['leave_request' => $updated_leave_request]);
            return;
        }catch (DomainException $e) {
            $this->db->response($e->getStatus(), false, $e->getMessage(), ['leave_request_id' => $id]);
            return;
        }catch(Throwable $e) {
            $this->db->response(500, false, 'Something went wrong. Please try again later.');
            return;
        }

    }

    public function destroy($id): void
    {

        try{
            $deleted_leave_request_id = $this->leave_request_service->deleteLeaveRequest($id, $this->user_id, $this->role);
            $this->db->response(200, true, 'Leave request deleted successfully.', ['leave_request_id' => $deleted_leave_request_id]);
            return;
        }catch (DomainException $e) {
            $this->db->response($e->getStatus(), false, $e->getMessage(), ['leave_request_id' => $id]);
            return;
        }catch(Throwable $e) {
            $this->db->response(500, false, 'Something went wrong. Please try again later.');
            return;
        }
        
    }

    
}
