<?php

namespace App\Http\Controllers\Auth;

use Core\App;
use Core\Database;
use App\Http\Forms\LoginForm;


class LoginController {

    public function login() {

        $loginAttempt = new LoginForm();
        $db = App::resolve(Database::class);

        $input = json_decode(file_get_contents('php://input'), true);
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';

        // validate the inputs
        if(!$loginAttempt->validate($email, $password)) {
            http_response_code(422);
            echo json_encode($loginAttempt->errors());
            return;
        }

        // check if the provided credential exists in the database
        $user = $db->query("SELECT * FROM users WHERE email = :email", [
            'email' => $email
        ])->find();

        if(!$user || !password_verify($password, $user['password'])) {
            http_response_code(401);
            echo json_encode(['message' => 'Invalid credentials']);
            return;
        }

        http_response_code(200);
        echo json_encode(['message' => 'Login successful']);
        exit;

    }



}