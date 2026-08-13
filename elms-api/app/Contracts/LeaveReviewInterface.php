<?php

namespace App\Contracts;

interface LeaveReviewInterface {


    public function getLeaveRequest(): array;

    public function reviewLeaveRequest(int $id, string $status, string $rejection_reason): void;

    public function getCheckOverlap(int $id): void;

    
}