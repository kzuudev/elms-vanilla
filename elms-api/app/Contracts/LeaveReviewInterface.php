<?php

namespace App\Contracts;

interface LeaveReviewInterface {


    public function getLeaveRequest($leave_type, $start_date, $end_date, $status): array;

    public function reviewLeaveRequest(int $id, int $user_id, string $role, string $department, string $status, string $rejection_reason);

    public function getCheckOverlap(int $id, int $user_id, string $role, string $department);

    
}