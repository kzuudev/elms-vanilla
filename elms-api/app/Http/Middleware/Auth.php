<?php

namespace App\Http\Middleware;

use Core\App;
use Core\Database;

class Auth {

    private static ?array $user = null;
    private Database $db;

    public function __construct() {
        $this->db = App::resolve(Database::class);
    }

    public static function authenticate() {

        $db = App::resolve(Database::class);

        // Get the token
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        $token = trim(str_replace('Bearer ', '', $authHeader));

        if (!$token) {
            $db->abort(401, 'Unauthorized, No token provided');
            exit;
        }

        // Find the user
        $user = $db->query("
            SELECT u.id, u.first_name, u.email, u.role, u.department, token
            FROM personal_access_tokens pat
            LEFT JOIN users u ON pat.user_id = u.id
            WHERE pat.token = :token AND pat.expires_at > NOW()
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
        
        self::authenticate();
        return self::user();
    }
}