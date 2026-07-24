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

            $first_name = $input['first_name'] ?? '';
            $last_name = $input['last_name'] ?? '';
            $email = $input['email'] ?? '';
            $phone = $input['phone'] ?? '';
            $password = $input['password'] ?? '';

            if($register->validate($first_name, $last_name, $email, $phone, $password)) {

                // check if email exists
                $user = $db->query("SELECT * FROM users WHERE email = :email", [
                    'email' => $email
                ])->find();

                // return a message if employees exist
                if($user) {
                    http_response_code(422);
                    echo json_encode(['message' => 'User already exists']);
                    return;
                }

                // Insert the new user
                $registerUser = $db->query("INSERT INTO users (first_name, last_name, email, phone, password) VALUES (:first_name, :last_name, :email, :phone, :password)", [
                    'first_name' => $first_name,
                    'last_name' => $last_name,
                    'email' => $email,
                    'phone' => $phone,
                    'password' => password_hash($password, PASSWORD_DEFAULT)
                ]);

                http_response_code(201);
                echo json_encode([
                    'success' => true,
                    'message' => 'User created successfully',
                    'user' => $registerUser
                ]);
                return;
            }

            // Return validation errors
            http_response_code(422);
            echo json_encode($register->errors());
            return;

        }

        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid Registration Request'
        ]);


    }
}