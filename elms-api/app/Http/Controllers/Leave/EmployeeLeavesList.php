<?php

namespace App\Http\Controllers\Leave;

use App\Http\Forms\LeaveRequestForm;
use Core\App;
use Core\Database;
use DateTime;

public function submit() {

}

public function index() {

    $db = App::resolve(Database::class);

    $headers = getallheaders();
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    $token = trim(str_replace('Bearer ', '', $authHeader));


    $tokenRow = $db->query("SELECT user_id FROM personal_access_tokens WHERE token = :token", [
        'token' => $token
    ])->find();

    $current_user_id = $tokenRow['user_id'] ?? null;


    if (!$current_user_id) {
        http_response_code(404);
        echo json_encode(["error" => "User not found"]);
        exit();
    }

    $employeeLeavesList
}