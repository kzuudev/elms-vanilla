<?php

namespace App\Services\Notifications;
use Core\App;
use Core\Database;
use App\Http\Middleware\Auth;

class NotificationService {

    private $db;
    private $current_user_id;

    public function __construct() {

        $this->db = App::resolve(Database::class);
        $this->current_user_id = Auth::authenticate()['id'];
    }


    /**
     * Create a new notification
     * @return void
     */
    public function store(int $user_id, string $title, string $type, string $message, bool $is_read = false, ?array $data = null): void {

        if($this->current_user_id) {

            $this->db->query("INSERT INTO notifications (user_id, title, message, type, read_at, data) VALUES (:user_id, :title, :message, :type, :read_at, :data)", [
                'user_id' => $user_id, // recipient id (who will receive the notification)
                'title' => $title,
                'type' => $type,
                'message' => $message,
                'read_at' => $is_read ? date('Y-m-d H:i:s') : null,
                'data' => $data ? json_encode($data) : null,
            ]);

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Notification created successfully',
                'user_id' => $user_id,
            ]);
            return;
        }

        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Unathorized Access',
            'user_id' => $this->current_user_id,
        ]);
        return;
    }

    /**
     * Get all notifications for a user
     * @return array
     */
    public function index() {

        if($this->current_user_id) {

            $notifications = $this->db->query("SELECT * FROM notifications WHERE user_id = :user_id ORDER BY created_at DESC", [
            'user_id' => $this->current_user_id, // list of notifications for the current user
            ])->all();

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Notifications fetched successfully',
                'notifications' => $notifications,
            ]);
            return $notifications ?? [];
        }

        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Unathorized Access',
            'user_id' => $this->current_user_id,
        ]);
        return;

       
    }


    /**
     * Update a notification (mark as read)
     * @return void
     */
    public function markAsRead(int $id): bool {

        if(!$this->current_user_id) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Unathorized Access',
                'user_id' => $this->current_user_id,
            ]);
            return false;
        }

        $notification = $this->db->query("SELECT * FROM notifications WHERE id = :id AND user_id = :user_id", [
            'id' => $id,
            'user_id' => $this->current_user_id,
        ])->find();

        if(!$notification) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Notification not found',
                'user_id' => $this->current_user_id,
            ]);
            return false;
        }
        if($notification['read_at'] == date('Y-m-d H:i:s')) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Notification already marked as read',
                'user_id' => $this->current_user_id,
            ]);
            return false;
        }

        $this->db->query("UPDATE notifications SET read_at = :read_at WHERE id = :id AND user_id = :user_id", [
            'read_at' => date('Y-m-d H:i:s'),
            'id' => $id,
            'user_id' => $this->current_user_id,
        ])->find();

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Notification marked as read',
            'user_id' => $this->current_user_id,
        ]);
        return true;
    }

    /**
     * Delete a notification
     * @return void
     */
    public function destroy(int $id): void {
        

        if(!$this->current_user_id) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Unathorized Access',
                'user_id' => $this->current_user_id,
            ]);
            return;
        }

        $this->db->query("DELETE FROM notifications WHERE id = :id AND user_id = :user_id", [
            'id' => $id,
            'user_id' => $this->current_user_id,
        ])->find();

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Notification deleted successfully',
            'user_id' => $this->current_user_id,
        ]);
        return;
    }

}