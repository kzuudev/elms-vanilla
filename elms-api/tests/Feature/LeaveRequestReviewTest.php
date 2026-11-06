<?php

use PHPUnit\Framework\TestCase;

final class LeaveRequestReviewTest extends TestCase {


    private function payload(): array {
        return [
            'leave_request_id' => getenv('ELMS_TEST_LEAVE_REQUEST_ID') ?: 1,    
            'review_status' => 'approved',
            'review_reason' => 'Automated API test.',
            'review_date' => '2026-11-02',
            'review_'
        ];
    }
}