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

        try {

            $this->db->beginTransaction();

            $user = Auth::user();

            // Department comes from the logged-in admin (department-scoped invite)
            $department = $user['department'] ?? null;
            
            if(!$user || !in_array($user['role'], ['admin', 'super-admin'], true))  {
                $this->db->response(403, false, 'Forbidden: You are not authorized to create a new user');
                return;
            }

            // check first the content type and see whether it is a JSON format
            if(!empty($_SERVER['CONTENT_TYPE']) && str_contains($_SERVER['CONTENT_TYPE'], 'application/json')) {

                $input = json_decode(file_get_contents('php://input'), true);
                
                $first_name = $input['first_name'] ?? '';
                $last_name = $input['last_name'] ?? '';
                $email = $input['email'] ?? '';
                $phone = $input['phone'] ?? '';
                $role = $input['role'] ?? '';
                $department = $input['department'] ?? '';
                $salary = $input['salary'] ?? '';
                $assigned_to = $input['assigned_to'] ?? '';

                $register = new RegisterForm();

                if(!$register->validate($first_name, $last_name, $email, $phone, $role, $department, $salary, $assigned_to)) {
                    $this->db->rollBack();
                    $this->db->response(422, false, 'Validation failed', $register->errors());
                    return;
                }

                // check if email exists
                $existing_user = $this->db->query("SELECT * FROM users WHERE email = :email", [
                    'email' => $email
                ])->find();

                if($existing_user) {
                    $this->db->rollBack();
                    $this->db->response(422, false, 'User already exists', ['id' => $existing_user['id']]);
                    return;
                }

                $this->db->query("INSERT INTO users (first_name, last_name, email, phone, password, role, department, salary, assigned_to) VALUES (:first_name, :last_name, :email, :phone, :password, :role, :department, :salary, :assigned_to)", [
                    'first_name' => $first_name,
                    'last_name' => $last_name,
                    'email' => $email,
                    'phone' => $phone,
                    'password' => null,
                    'role' => $role,
                    'department' => $department,
                    'salary' => $salary,
                    'assigned_to' => ($assigned_to === '' || $assigned_to === null)
                    ? null
                    : (int) $assigned_to,
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
                    $this->db->response(201, true, 'Registration successful! Please verify your email to activate your account.', [
                        'user' => [
                            'id' => $user_id,
                            'first_name' => $first_name,
                            'last_name' => $last_name,
                            'email' => $email,
                            'role' => $role,
                        ],
                    ]);
                } catch (\Exception $e) {
                    $this->db->rollBack();
                    $this->db->response(500, false, 'User created but failed to send verification email', ['error' => $e->getMessage()]);
                    return;
                }

                // commit the transaction
                $this->db->commit();
                return;
            }

        $this->db->rollBack();
        $this->db->response(400, false, 'Invalid Registration Request', ['id' => $user_id]);
        return;

        }catch (Exception $e) {
            $this->db->rollBack();
            $this->db->response(500, false, $e->getMessage());
            return;
        }
     
    }
}
