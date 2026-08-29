<?php 


namespace App\Services\registration;

use Core\App;
use Core\Database;
use Throwable;
use App\Http\Middleware\Auth;
use App\Services\Auth\EmailVerificationService;
use App\Exceptions\UserAlreadyExistsExceptions;
use App\Exceptions\domain\UnauthorizedException;

class RegisterUserService {

    private Database $db;
    private ?array $current_user;

    public function __construct() {

        $this->db = App::resolve(Database::class);
        $this->current_user = Auth::user();
    }

    private function validateUser() {
        if($this->current_user['role'] !== 'super-admin' && $this->current_user['role'] !== 'admin') {
            throw new UnauthorizedException('You are not authorized to access this resource');
        }
    }

    public function registerUser($first_name, $last_name, $email, $phone, $role, $department, $salary, $assigned_to) {

        $this->validateUser();

        // check if email exists
        $existing_user = $this->db->query("SELECT * FROM users WHERE email = :email", [
            'email' => $email
        ])->find();

        if($existing_user) {
            throw new UserAlreadyExistsExceptions();
        }
        
        try {

            $this->db->beginTransaction();

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

            // create a verification token for email verification of the registered user
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


            $email_verification_service->sendVerificationEmail($name, $email, $verification_token);
            $this->db->commit();
            return;

        }catch(Throwable $e) {
            $this->db->rollBack();
            throw $e;
        }
    }
}