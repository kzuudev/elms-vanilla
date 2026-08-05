<?php

namespace App\Contracts;

interface LeaveReviewInterface {


    public function getLeaveRequest(): array;

    public function reviewLeaveRequest(int $id): void;

    public function getCheckOverlap(int $id): void;

    
}