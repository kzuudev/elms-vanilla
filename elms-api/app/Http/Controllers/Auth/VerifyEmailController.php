<?php

namespace App\Http\Controllers\Auth;

use Core\App;
use Core\Database;

class VerifyEmailController {

    private Database $db;

    public function __construct() {
        $this->db = App::resolve(Database::class);
    }

    public function verifyEmail() {

        if (empty($_SERVER['CONTENT_TYPE']) || !str_contains($_SERVER['CONTENT_TYPE'], 'application/json')) {
            $this->db->response(400, false, 'Invalid verification request');
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true);

        $token = $input['token'] ?? '';
        $password = $input['password'] ?? '';
        $confirm_password = $input['confirm_password'] ?? '';

        if ($token === '') {
            $this->db->response(422, false, 'Verification token is required');
            return;
        }

        if ($password === '' || strlen($password) < 8) {
            $this->db->response(422, false, 'Password must be at least 8 characters');
            return;
        }

        if ($password !== $confirm_password) {
            $this->db->response(422, false, 'Passwords do not match');
            return;
        }

        $verification_token = $this->db->query(
            "SELECT * FROM email_verification_token WHERE token = :token",
            ['token' => $token]
        )->find();

        if (!$verification_token) {
            $this->db->response(400, false, 'Invalid or already used verification token');
            return;
        }

        $now = (new \DateTimeImmutable())->format('Y-m-d H:i:s');

        if ($verification_token['expires_at'] < $now) {
            $this->db->response(400, false, 'Verification token expired');
            return;
        }

        // Activate account: set password + mark email verified
        $this->db->query(
            "UPDATE users SET password = :password, email_verified_at = :email_verified_at WHERE id = :id",
            [
                'password' => password_hash($password, PASSWORD_DEFAULT),
                'email_verified_at' => $now,
                'id' => $verification_token['user_id'],
            ]
        );

        // One-time use — delete the token
        $this->db->query(
            "DELETE FROM email_verification_token WHERE id = :id",
            ['id' => $verification_token['id']]
        );

        $this->db->response(200, true, 'Email verified successfully. You can now log in.');
    }
}
