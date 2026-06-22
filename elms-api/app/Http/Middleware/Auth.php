<?php

namespace App\Http\Middleware;

use Core\App;
use Core\Database;

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

    public static function authenticate() {
        $db = App::resolve(Database::class);

        // Get the token
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        $token = trim(str_replace('Bearer ', '', $authHeader));

        if (!$token) {
            $db::abort(401, 'Unauthorized, No token provided');
        }

        // Find the user
        $tokenRow = $db->query("SELECT user_id FROM personal_access_tokens WHERE token = :token", [
            'token' => $token
        ])->find();

        if (!$tokenRow) {
            $db->abort(401, 'Invalid token');
            exit;
        }

        // Return just the ID so it's super easy to use in your controllers!
        return $tokenRow['user_id'] ;
    }
}