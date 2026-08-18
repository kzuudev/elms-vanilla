<?php

namespace App\Http\Controllers\Auth;

use Core\App;
use Core\Database;
use App\Http\Middleware\Auth;
use App\Http\Forms\RegisterForm;
use App\Services\registration\RegisterUserService;
use App\Exceptions\Auth\UserAlreadyExistsExceptions;
use Throwable;

class RegisteredUserController {

    private Database $db;

    public function __construct() {
        $this->db = App::resolve(Database::class);
    }

    public function store() {

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
                    $this->db->response(422, false, 'Validation failed', $register->errors());
                    return;
                }

                try{
                    $register_user_service = new RegisterUserService();
                    $register_user_service->registerUser($first_name, $last_name, $email, $phone, $role, $department, $salary, $assigned_to);
                    $this->db->response(201, true, 'User registered successfully');
                    return;
                }catch(UserAlreadyExistsExceptions $e) {
                    $this->db->response(400, false, $e->getMessage());
                    return;
                }catch(Throwable $e) {
                    $this->db->response(500, false, $e->getMessage());
                    return;
                }
            }

            $this->db->response(400, false, 'Invalid Registration Request');
            return;
            
    }

}
