<?php

namespace App\Http\Controllers\Auth;

use App\Http\Forms\RegisterForm;
use App\Http\Middleware\Auth;
use App\Services\Auth\EmailVerificationService;
use Core\App;
use Core\Database;

class RegisteredUserController {

    private Database $db;

    public function __construct() {
        $this->db = App::resolve(Database::class);
    }

    public function store() {


     $admin = Auth::user();
    
     if($admin !== 'admin') {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Forbidden: You are not authorized to create a new user',
        ]);
        return;
     }

     // check first the content type and see whether it is a JSON format
     if(!empty($_SERVER['CONTENT_TYPE']) && str_contains($_SERVER['CONTENT_TYPE'], 'application/json')) {
        $input = json_decode(file_get_contents('php://input'), true);

        $register = new RegisterForm();
        

        $first_name = $input['first_name'] ?? '';
        $last_name = $input['last_name'] ?? '';
        $email = $input['email'] ?? '';
        $phone = $input['phone'] ?? '';
        $role = $input['role'] ?? '';
        $assigned_to = $input['assigned_to'] ?? '';

        if(!$register->validate($first_name, $last_name, $email, $phone, $role, $assigned_to)) {
            http_response_code(422);
            echo json_encode([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $register->errors()
            ]);
            return;
        }

        // check if email exists
        $user = $this->db->query("SELECT * FROM users WHERE email = :email", [
            'email' => $email
        ])->find();

        if($user) {
            http_response_code(422);
            echo json_encode([
                'success' => false,
                'message' => 'User already exists',
                'id' => $user['id']
            ]);
            return;
        }

        // Department comes from the logged-in admin (department-scoped invite)
        $department = $admin['department'] ?? null;

        $this->db->query("INSERT INTO users (first_name, last_name, email, phone, password, role, department, assigned_to) VALUES (:first_name, :last_name, :email, :phone, :password, :role, :department, :assigned_to)", [
            'first_name' => $first_name,
            'last_name' => $last_name,
            'email' => $email,
            'phone' => $phone,
            'password' => null,
            'role' => $role,
            'department' => $department,
            'assigned_to' => (int) $assigned_to,
        ]);

        $user_id = (int) $this->db->lastInsertId();

        // create a verification token for email verification of the user
        $verification_token = bin2hex(random_bytes(32));

        // set the expiration time to 24 hours from now
        $expires_at = (new \DateTimeImmutable('+24 hours'))->format('Y-m-d H:i:s');

        $this->db->query("INSERT INTO email_verification_token (token, user_id, expires_at) VALUES (:token, :user_id, :expires_at)", [
            'token' => $verification_token,
            'user_id' => $user_id,
            'expires_at' => $expires_at,
        ]);

        $email_verification_service = new EmailVerificationService();
        $name = $first_name . ' ' . $last_name;

        try {
            $email_verification_service->sendVerificationEmail($name, $email, $verification_token);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'User created but failed to send verification email',
                'error' => $e->getMessage(),
            ]);
            return;
        }

        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Registration successful! Please verify your email to activate your account.',
            'user' => [
                'id' => $user_id,
                'first_name' => $first_name,
                'last_name' => $last_name,
                'email' => $email,
                'role' => $role,
                'department' => $department,
                'assigned_to' => (int) $assigned_to,
            ],
        ]);
        return;
    }

        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid Registration Request',
            'id' => $user_id
        ]);
        return;
    }
}
