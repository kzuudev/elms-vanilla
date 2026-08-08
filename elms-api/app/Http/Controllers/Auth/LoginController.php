<?php

namespace App\Http\Controllers\Auth;

use Core\App;
use Core\Database;
use App\Http\Forms\LoginForm;
use App\Http\Middleware\Auth;
use DateTimeImmutable;

class LoginController {

    private Database $db;
    private Auth $auth;

    public function __construct() {
        $this->db = App::resolve(Database::class);
        $this->auth = App::resolve(Auth::class);
    }

    public function login() {

        $login_form = new LoginForm();

        $input = json_decode(file_get_contents('php://input'), true);
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';

        // validate the inputs
        if(!$login_form->validate($email, $password)) {
            $this->db->response(422, false, 'Validation failed', $login_form->errors());
            return;
        }

        // check if the provided credential exists in the database
        $user = $this->db->query("SELECT * FROM users WHERE email = :email", [
            'email' => $email
        ])->find();


        // validate the user and provided password
        if(!$user || !password_verify($password, $user['password'])) {
            $this->db->response(401, false, 'Invalid credentials', $login_form->errors());
            return;
        }

        // generate a token (random-string)
        $token = bin2hex(random_bytes(64));

        // insert the token with user_id
        $this->db->query("INSERT INTO personal_access_tokens (user_id, token, expires_at) VALUES (:user_id, :token, :expires_at)", [
            'user_id' => $user['id'],
            'token' => $token,
            'expires_at' => (new DateTimeImmutable('+1 Day'))->format('Y-m-d H:i:s')
        ]);

        $this->db->response(200, true, 'Login successful', [
            'user' => [
                'id' => $user['id'],
                'name' => $user['first_name'] . ' ' . $user['last_name'],
                'email' => $user['email'],
                'role' => $user['role']
            ],
            'token' => $token
        ]);

        return;

    }

    public function logout() {

        $user = $this->auth->user();

        if(!$user || empty($user['token'])) {
            $this->db->response(401, false, 'Unauthorized, No token provided');
            return;
        }

        $this->db->query(
            "DELETE FROM personal_access_tokens WHERE token = :token AND user_id = :user_id",
                [
                    'token' => $user['token'],
                    'user_id' => $user['id'],
                ]
        );

        $this->db->response(200, true, 'logout successful');
        return;

    }

    

}