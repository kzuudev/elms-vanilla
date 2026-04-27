<?php

namespace App\Http\Controllers\Auth;

use App\Http\Forms\RegisterForm;
use Core\App;
use Core\Database;

class RegisteredUserController {

    public function store() {

        // check first the content type and see whether it is a JSON format
        if(!empty($_SERVER['CONTENT_TYPE']) && str_contains($_SERVER['CONTENT_TYPE'], 'application/json')) {
            $input = json_decode(file_get_contents('php://input'), true);

            $register = new RegisterForm();
            $db = App::resolve(Database::class);

            $name = $input['name'] ?? '';
            $email = $input['email'] ?? '';
            $password = $input['password'] ?? '';

            if($register->validate($name, $email, $password)) {

                // check if email exists
                $user = $db->query("SELECT * FROM users WHERE email = :email", [
                    'email' => $email
                ])->find();

                // return a message if users exist
                if($user) {
                    http_response_code(422);
                    echo json_encode(['message' => 'User already exists']);
                    return;
                }

                // Insert the new user
                $db->query("INSERT INTO users (name, email, password) VALUES (:name, :email, :password)", [
                    'name' => $name,
                    'email' => $email,
                    'password' => password_hash($password, PASSWORD_DEFAULT)
                ]);

                http_response_code(201);
                echo json_encode(['message' => 'User created successfully']);
                return;
            }

            // Return validation errors
            http_response_code(422);
            echo json_encode($register->errors());
            return;

        }

        http_response_code(400);
        echo json_encode(['message' => 'Invalid request']);


    }
}