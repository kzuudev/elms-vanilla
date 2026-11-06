<?php

use Core\Validator;
use PHPUnit\Framework\TestCase;

final class ValidatorTest extends TestCase
{
    public function test_valid_date_is_accepted(): void
    {
        $result = Validator::date('2026-10-19');

        $this->assertTrue($result);
    }

    public function test_impossible_date_is_rejected(): void
    {
        $result = Validator::date('2026-02-30');

        $this->assertFalse($result);
    }

    public function test_blank_leave_reason_is_rejected(): void
    {
        $result = Validator::string('   ', 1, 100);

        $this->assertFalse($result);
    }

    public function test_leave_reason_over_limit_is_rejected(): void
    {
        $result = Validator::string(str_repeat('a', 101), 1, 100);

        $this->assertFalse($result);
    }

    public function test_leave_reason_at_limit_is_accepted(): void
    {
        $result = Validator::string(str_repeat('a', 100), 1, 100);

        $this->assertTrue($result);
    }
}