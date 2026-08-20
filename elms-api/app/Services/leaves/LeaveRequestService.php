<?php


namespace App\Services\leaves;

use Core\App;
use Throwable;
use Exception;
use DateTime;
use DatePeriod;
use DateInterval;
use Core\Database;
use App\Exceptions\domain\ForbiddenException;
use App\Contracts\LeaveRequestInterface;
use App\Exceptions\domain\NotFoundException;
use App\Exceptions\domain\BadRequestException;
use App\Services\notifications\NotificationService;


class LeaveRequestService implements LeaveRequestInterface {

    private Database $db;


    public function __construct() {

        $this->db = App::resolve(Database::class);

    }


    public function createLeaveRequest(int $user_id, string $role, string $leave_type, string $start_date, string $end_date, string $reason) {

            $assigned_to = $this->db->query(
                "SELECT 
                    assigned_to AS approver_id, 
                    CONCAT(first_name, ' ', last_name) AS approver_name, 
                    role AS approver_role
                    FROM users 
                    WHERE id = :id"
            , [
                'id' => $user_id
            ])->find();
        
            // validate if the start date is before the end date
            if ($start_date > $end_date) {
                throw new BadRequestException('Start date cannot be after end date.');
            }

            // convert the start and end date to DateTime objects
            $start_date_obj = new DateTime($start_date);
            $end_date_obj = new DateTime($end_date);

            // count for days requested (weekdays)
            $days_requested = 0;

            // calculate the start and end date (only weekdays), and ensures include the end date in the loop
            $period = new DatePeriod($start_date_obj, new DateInterval('P1D'), clone $end_date_obj->modify('+1 day'));

            foreach ($period as $date) {
                if ($date->format('N') < 6) { // format('N') returns 1-5 for Mon-Fri
                    $days_requested++;
                }
            }

            // capture the leave_type id based on the leave type name submitted
            $leave_type_record = $this->db->query("SELECT id FROM leave_types WHERE name = :name", [
                'name' => $leave_type
            ])->find();

            if (!$leave_type_record) {
                throw new NotFoundException('Leave type not found.');
            }

            // query the remaining balance and leave types
            $remaining_balance = $this->db->query("SELECT remaining_balance FROM leave_balance WHERE user_id = :user_id AND leave_type_id = :leave_type_id", [
                'user_id' => $user_id,
                'leave_type_id' => $leave_type_record['id']
            ])->find();

            // validate the overlap (to check if the user already has a pending or approved request that covers the dates they just picked)
            // and prevent employees from submitting the EXACT SAME TYPE while one is already pending.
            $overlap = $this->db->query("
                SELECT id AS overlap_request_id FROM leave_requests WHERE user_id = :user_id 
                AND status IN ('pending', 'approved')
                AND deleted_at IS NULL
                AND start_date <= :end_date AND end_date >= :start_date AND (start_date >= CURRENT_DATE OR end_date >= CURRENT_DATE)
            ", [
                'user_id' => $user_id,
                'start_date' => $start_date,
                'end_date' => $end_date
            ])->find();

            if ($overlap) {
                throw new BadRequestException('You already have a pending or approved request for this leave type during the selected dates.');
            }

            if (!$remaining_balance || $remaining_balance['remaining_balance'] < $days_requested) {
                throw new BadRequestException('Insufficient leave balance for this leave type.');
            }

            if (!$role) {
                throw new NotFoundException('Role not found.');
            }

            if(!$reason) {
                throw new BadRequestException('Please provide a reason for your leave request.');
            }

            try{
                $this->db->beginTransaction();
            
                // insert the leave request into the database
                $this->db->query("INSERT INTO leave_requests (user_id, leave_type_id, start_date, end_date, total_days, reason, status, assigned_to) VALUES (:user_id, :leave_type_id, :start_date, :end_date, :total_days, :reason, :status, :assigned_to)", [
                    'user_id' => $user_id,
                    'leave_type_id' => $leave_type_record['id'],
                    'start_date' => $start_date,
                    'end_date' => $end_date,
                    'total_days' => $days_requested,
                    'reason' => $reason,
                    'status' => 'pending',
                    'assigned_to' => $assigned_to['approver_id'] ?? null
                ]);

                $notification_service = new NotificationService();
                $notification_service->createNotification(
                    $assigned_to['approver_id'],
                    'New Leave Request Submitted',
                    'leave_request_submitted',
                    'A new leave request has been submitted for your approval. Please review it and take appropriate action.'
                );

                $this->db->commit();
                return $this->db->lastInsertId();
            }catch(Throwable $e) {
                $this->db->rollBack();
                throw $e;
            }

    }

    public function getLeaveRequests(int $user_id, string $role, ?string $department, ?string $search_type, ?string $start_date, ?string $end_date, ?string $status) {

    
        if(!$user_id || !$role) {
            throw new Exception('You are not authorized to fetch leave requests.');
        }
    
        $query = "
            SELECT 
                lr.*,
                CONCAT(m.first_name, ' ', m.last_name) AS assigned_name,
                lt.name as leave_type
            FROM leave_requests lr
            LEFT JOIN users u ON lr.user_id = u.id
            LEFT JOIN users m ON lr.assigned_to = m.id
            LEFT JOIN leave_types lt ON lr.leave_type_id = lt.id
            WHERE lr.deleted_at IS NULL
            AND (lr.user_id = :user_id OR lr.assigned_to = :user_id)
        ";

        $params = [
            'user_id' => $user_id,
        ];

        

        if (!empty($search_type)) {
            $query .= " AND lt.name = :leave_type";
            $params['leave_type'] = $search_type;
        }

        if (!empty($start_date)) {
            $query .= " AND lr.start_date = :start_date AND lr.start_date >= :start_date";
            $params['start_date'] = $start_date;
        }

        if (!empty($end_date)) {
            $query .= " AND lr.end_date = :end_date AND lr.end_date <= :end_date";
            $params['end_date'] = $end_date;
        }

        if (!empty($status)) {
            $query .= " AND lr.status = :status";
            $params['status'] = $status;
        }

        $query .= " ORDER BY lr.created_at DESC";
        $leave_requests = $this->db->query($query, $params)->all();

        return $leave_requests; 
            
    }

    public function getLeaveRequest($id, $user_id, $role) {

        $leave_request = $this->db->query("
            SELECT 
                lr.*,
                CONCAT(m.first_name, ' ', m.last_name) AS assigned_name,
                lt.name as leave_type   
            FROM leave_requests lr
            LEFT JOIN users m ON lr.assigned_to = m.id
            LEFT JOIN leave_types lt ON lr.leave_type_id = lt.id
            WHERE lr.deleted_at IS NULL
            AND lr.id = :id AND (lr.user_id = :user_id OR lr.assigned_to = :user_id)
        ", [
            'id' => $id,
            'user_id' => $user_id
        ])->find();

        if(!$leave_request) {
            throw new NotFoundException('Leave request not found.');
        }

        if($leave_request['user_id'] !== $user_id && $leave_request['assigned_to'] !== $user_id && $role !== 'admin') {
            throw new ForbiddenException('You are not authorized to fetch this leave request.');
        }

        return $leave_request;
    }

    public function updateLeaveRequest($id, $user_id, $role, $leave_type, $start_date, $end_date, $reason) {

    
            $existing_leave_request = $this->db->query("
            SELECT 
                lr.*,
                lt.name as leave_type
            FROM leave_requests lr
            LEFT JOIN leave_types lt ON lr.leave_type_id = lt.id
            WHERE lr.id = :id AND lr.user_id = :user_id AND lr.deleted_at IS NULL
            ", [
                'id' => $id,
                'user_id' => $user_id,
            ])->find();

            if (!$existing_leave_request) {
                throw new NotFoundException('Existing leave request not found.');
            }

            if($existing_leave_request['user_id'] !== $user_id && $existing_leave_request['assigned_to'] !== $user_id && $role !== 'admin') {
                throw new ForbiddenException('You are not authorized to update this leave request.');
            }

             // validate if the leave request is approved or rejected
             $current_status = $existing_leave_request['status'];

             // if the leave request is approved, return an error
             if($current_status === 'approved') {
                 throw new BadRequestException('You cannot update an approved leave request.');
             }
 
             // if the leave request is rejected, return an error
             if($current_status === 'rejected') {
                 throw new BadRequestException('You cannot update a rejected leave request.');
             }
 
             // existing leave type name (rather than id) since the user will be submitting the leave type name
             $existing_leave_type = $this->db->query("SELECT id, name FROM leave_types WHERE id = :id", [
                 'id' => $existing_leave_request['leave_type_id']
             ])->find();
 
             if (!$existing_leave_type) {
                 throw new NotFoundException('Existing leave type not found.');
             }
 
             // validate the leave type
             $new_leave_type = $this->db->query("SELECT id, name FROM leave_types WHERE name = :name", [
                 'name' => $leave_type
             ])->find();
 
             if (!$new_leave_type) {
                 throw new NotFoundException('New leave type not found.');
             }
 
             if ($start_date > $end_date) {
                 throw new BadRequestException('Start date must be before end date.');
             }
 
             // convert the start and end date to DateTime objects
             $start_date_obj = new DateTime($start_date);
             $end_date_obj = new DateTime($end_date);
 
             // count for days requested (weekdays)
             $days_requested = 0;
 
             // calculate the start and end date (only weekdays), and ensures include the end date in the loop
             $period = new DatePeriod($start_date_obj, new DateInterval('P1D'), clone $end_date_obj->modify('+1 day'));
 
             foreach ($period as $date) {
                 if ($date->format('N') < 6) { // format('N') returns 1-5 for Mon-Fri
                     $days_requested++;
                 }
             }
 
             $remaining_balance = $this->db->query("SELECT remaining_balance FROM leave_balance WHERE user_id = :user_id AND leave_type_id = :leave_type_id", [
                 'user_id' => $user_id,
                 'leave_type_id' => $new_leave_type['id']
             ])->find();
 
             if (!$remaining_balance || $remaining_balance['remaining_balance'] < $days_requested) {
                 throw new BadRequestException('Insufficient leave balance for this leave type.');
             }
 
             // validate if there's already an existing leave request in the date range
             $overlap_request = $this->db->query("
                 SELECT 
                     id AS overlap_request_id
                 FROM leave_requests 
                 WHERE user_id = :user_id 
                 AND status IN ('pending', 'approved')
                 AND deleted_at IS NULL
                 AND start_date <= :end_date AND end_date >= :start_date AND (start_date >= CURRENT_DATE OR end_date >= CURRENT_DATE)
                 AND id != :id
             ", [
                 'id' => $id,
                 'user_id' => $user_id,
                 'start_date' => $start_date,
                 'end_date' => $end_date
             ])->find();
 
             if ($overlap_request) {
                 throw new BadRequestException('You already have a pending or approved request for this leave type during the selected dates.');
             }
 
            try{

                $this->db->beginTransaction();

                $this->db->query("UPDATE leave_requests SET start_date = :start_date, end_date = :end_date, reason = :reason, leave_type_id = :leave_type_id WHERE id = :id", [
                    'id' => $id,
                    'start_date' => $start_date,
                    'end_date' => $end_date,
                    'reason' => $reason,
                    'leave_type_id' => $new_leave_type['id']
                 ]);
             
                $this->db->commit();
                return $id;    

            }catch(Throwable $e) {
                $this->db->rollBack();
                throw $e;
            }


    }

    public function deleteLeaveRequest($id, $user_id, $role) {

        $leave_request = $this->db->query("SELECT * FROM leave_requests WHERE id = :id AND deleted_at IS NULL", [
            'id' => $id
        ])->find();

        if(!$leave_request) {
            throw new NotFoundException('Leave request not found.');
        }

        // validate if the user is the owner of the leave request (tightes just in case admin or super admin wants to delete the leave request)
        if($leave_request['user_id'] !== $user_id && $leave_request['assigned_to'] !== $user_id && $role !== 'admin') {
            throw new ForbiddenException('You are not authorized to delete this leave request.');
        }

        if (in_array($leave_request['status'], ['approved', 'rejected'], true)) {
            throw new BadRequestException('Only pending leave requests can be deleted.');
        }

        try{
            $this->db->beginTransaction();

            $this->db->query("UPDATE leave_requests SET deleted_at = CURRENT_TIMESTAMP WHERE id = :id", [
                'id' => $id
            ]);

            $this->db->commit();
            return $id;
        }catch(Throwable $e) {
            $this->db->rollBack();
            throw $e;
        }

    }



}
