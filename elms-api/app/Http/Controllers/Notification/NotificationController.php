<?php


namespace App\Http\Controllers\Notification;

use Core\App;
use Core\Database;
use App\Http\Middleware\Auth;
use App\Services\notifications\NotificationService;

class NotificationController {

    private Database $db;
    private Auth $auth;

    private NotificationService $notification_service;

    public function __construct() {

        $this->db = App::resolve(Database::class);
        $this->auth = App::resolve(Auth::class);
        $this->notification_service = App::resolve(NotificationService::class);
    }

    public function index() {

        return $this->notification_service->getNotifications();
    }

    public function patch(int $id) {
        
        $mark_as_read = $this->notification_service->markAsRead($id);

        if(!$mark_as_read) {
            return $this->db->response(400, false, 'Failed to mark as read');
        }
    }


}