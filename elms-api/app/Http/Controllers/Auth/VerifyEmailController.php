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
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid verification request',
            ]);
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true);

        $token = $input['token'] ?? '';
        $password = $input['password'] ?? '';
        $confirmPassword = $input['confirm_password'] ?? '';

        if ($token === '') {
            http_response_code(422);
            echo json_encode([
                'success' => false,
                'message' => 'Verification token is required',
            ]);
            return;
        }

        if ($password === '' || strlen($password) < 8) {
            http_response_code(422);
            echo json_encode([
                'success' => false,
                'message' => 'Password must be at least 8 characters',
            ]);
            return;
        }

        if ($password !== $confirmPassword) {
            http_response_code(422);
            echo json_encode([
                'success' => false,
                'message' => 'Passwords do not match',
            ]);
            return;
        }

        $verificationToken = $this->db->query(
            "SELECT * FROM email_verification_token WHERE token = :token",
            ['token' => $token]
        )->find();

        if (!$verificationToken) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid or already used verification token',
            ]);
            return;
        }

        $now = (new \DateTimeImmutable())->format('Y-m-d H:i:s');

        if ($verificationToken['expires_at'] < $now) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Verification token expired',
            ]);
            return;
        }

        // Activate account: set password + mark email verified
        $this->db->query(
            "UPDATE users SET password = :password, email_verified_at = :email_verified_at WHERE id = :id",
            [
                'password' => password_hash($password, PASSWORD_DEFAULT),
                'email_verified_at' => $now,
                'id' => $verificationToken['user_id'],
            ]
        );

        // One-time use — delete the token
        $this->db->query(
            "DELETE FROM email_verification_token WHERE id = :id",
            ['id' => $verificationToken['id']]
        );

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Email verified successfully. You can now log in.',
        ]);
    }
}
