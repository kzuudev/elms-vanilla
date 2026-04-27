<?php

namespace App\Http\Middleware;

class Auth {

    public function handle() {

        // grab Authorization header if it exists
        $authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : null;


        // Check if the header exists and contains bearer token
        if(!$authHeader && str_starts_with($authHeader, 'Bearer ')) {

            http_response_code(403);
            echo json_encode([
                'success' => false,
                'message' => 'You are not logged in'
            ]);

            exit;
        }
    }
}