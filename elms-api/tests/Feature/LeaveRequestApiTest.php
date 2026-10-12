<?php

use PHPUnit\Framework\TestCase;

final class LeaveRequestApiTest extends TestCase
{
    private function payload(): array
    {
        return [
            'leave_type' => getenv('ELMS_TEST_LEAVE_TYPE') ?: 'Sick Leave',
            'start_date' => '2026-11-02',
            'end_date' => '2026-11-03',
            'reason' => 'Automated API test.',
        ];
    }

    private function token(): string
    {
        $token = getenv('ELMS_TEST_TOKEN');

        if (!$token) {
            $this->fail('Set ELMS_TEST_TOKEN to a test employee login token.');
        }

        return $token;
    }

    private function post(array $payload, ?string $token = null): array
    {
        $baseUrl = getenv('ELMS_TEST_BASE_URL');

        if (!$baseUrl) {
            $this->fail('Set ELMS_TEST_BASE_URL to your test API URL.');
        }

        $headers = [
            'Content-Type: application/json',
            'Accept: application/json',
        ];

        if ($token !== null) {
            $headers[] = 'Authorization: Bearer ' . $token;
        }

        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => implode("\r\n", $headers),
                'content' => json_encode($payload, JSON_THROW_ON_ERROR),
                'ignore_errors' => true,
                'timeout' => 10,
                'follow_location' => 0,
            ],
        ]);

        $body = file_get_contents(
            rtrim($baseUrl, '/') . '/leave-request',
            false,
            $context
        );

        if ($body === false) {
            $this->fail('Could not reach the test API.');
        }

        $responseHeaders = $http_response_header ?? [];

        preg_match(
            '/^HTTP\/\S+\s+(\d{3})/',
            $responseHeaders[0] ?? '',
            $matches
        );

        return [
            'status' => (int) ($matches[1] ?? 0),
            'body' => json_decode($body, true, 512, JSON_THROW_ON_ERROR),
        ];
    }

    public function test_valid_submission_creates_a_request(): void
    {
        $response = $this->post($this->payload(), $this->token());
        $body = $response['body'];

        $this->assertSame(201, $response['status'], json_encode($body));
        $this->assertTrue($body['success']);
        $this->assertIsInt($body['data']['leave_request_id']);
        $this->assertGreaterThan(0, $body['data']['leave_request_id']);
    }

    public function test_invalid_date_is_rejected(): void
    {
        $payload = $this->payload();
        $payload['start_date'] = 'not-a-date';

        $response = $this->post($payload, $this->token());
        $body = $response['body'];

        $this->assertSame(422, $response['status'], json_encode($body));
        $this->assertFalse($body['success']);
        $this->assertArrayHasKey(
            'start_date',
            $body['data']['errors']
        );
    }

    public function test_missing_authentication_is_rejected(): void
    {
        $response = $this->post($this->payload());

        $this->assertSame(401, $response['status']);
        $this->assertFalse($response['body']['success']);
    }
}