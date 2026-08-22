<?php


namespace App\Http\Middleware;

use Core\App;
use Core\Database;

class Guest {

    public function handle() {

        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        $token = trim(str_replace('Bearer ', '', $authHeader));

        if ($token === '' || strtolower($token) === 'null') {
            return;
        }

        $db = App::resolve(Database::class);
        $user = $db->query("
            SELECT u.id
            FROM personal_access_tokens pat
            LEFT JOIN users u ON pat.user_id = u.id
            WHERE pat.token = :token AND pat.expires_at > NOW()
        ", ['token' => $token])->find();

        if ($user) {
            $db->response(403, false, 'You are already logged in');
            exit;
        }
    }
}