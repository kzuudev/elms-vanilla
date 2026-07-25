<?php

namespace App\Http\Middleware;

use Core\App;
use Core\Database;

class Auth {

    private static ?array $user = null;

    public static function authenticate() {
        $db = App::resolve(Database::class);

        // Get the token
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        $token = trim(str_replace('Bearer ', '', $authHeader));

        if (!$token) {
            $db::abort(401, 'Unauthorized, No token provided');
            exit;
        }

        // Find the user
        $user = $db->query("
            SELECT u.id, u.first_name, u.email, u.role, u.department, token
            FROM personal_access_tokens pat
            LEFT JOIN users u ON pat.user_id = u.id
            WHERE pat.token = :token
        ", ['token' => $token])->find();

        if (!$user) {
            $db->abort(401, 'Invalid token');
            exit;
        }

        // Remember the user for the rest of the request
        static::$user = $user;

        return $user;
    }

    public static function user(): ?array
    {
        return static::$user;
    }


    public function handle() {

        // grab Authorization header if it exists
        // $authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : null;

        // Check if the header exists and validate if the token is valid, and which user it belongs to 
        if(!self::authenticate()['token'] ?? null) {
            $db::abort(401, 'Unauthorized, No token provided');
        }

        return self::user();
    }
}