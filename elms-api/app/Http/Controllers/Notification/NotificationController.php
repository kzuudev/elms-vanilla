<?php


namespace App\Http\Controllers\Notification;

use Core\App;
use Core\Database;
use App\Http\Middleware\Auth;
use App\Services\notifications\NotificationService;

class NotificationController {

    private Database $db;
    private Auth $auth;

    private NotificationService $notificationService;

    public function __construct() {

        $this->db = App::resolve(Database::class);
        $this->auth = App::resolve(Auth::class);
        $this->notificationService = App::resolve(NotificationService::class);
    }

    public function index() {

        $current_user = $this->auth->authenticate();

        $current_user_id = $current_user['id'] ?? null;

        if(!$current_user_id) {
            http_response_code(401);
            echo json_encode(["error" => "User not found"]);
            exit;
        }

        $notifications = $this->notificationService->index();

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'notifications' => $notifications,
        ]);
        exit;
    }

    public function patch(int $id) {

        $current_user = $this->auth->authenticate();

        $current_user_id = $current_user['id'] ?? null;

        if(!$current_user_id) {
            http_response_code(401);
            echo json_encode(["error" => "User not found"]);
            exit;
        }

        $mark_as_read = $this->notificationService->markAsRead($id);

        if(!$mark_as_read) {
            http_response_code(400);
            echo json_encode(["error" => "Failed to mark as read"]);
            exit;
        }

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => "Notification marked as read",
            'mark_as_read' => $mark_as_read,
        ]);
        exit;
    }


}