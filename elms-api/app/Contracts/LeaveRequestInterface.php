<?php


namespace App\Contracts;

interface LeaveRequestInterface {

    public function createLeaveRequest(int $user_id, string $role, string $leave_type, string $start_date, string $end_date, string $reason);

    public function getLeaveRequests(int $user_id, string $role, ?string $department, ?string $search_type, ?string $start_date, ?string $end_date, ?string $status);

    public function getLeaveRequest(int $id, int $user_id, string $role);

    public function updateLeaveRequest(int $id, int $user_id, string $role, string $leave_type, string $start_date, string $end_date, string $reason);

    public function deleteLeaveRequest(int $id, int $user_id, string $role);

}
