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
            
            $assigned_to = $this->db->query("SELECT * FROM users WHERE id = :id", [
                'id' => $this->current_user_id,
            ])->find();

            if(!$assigned_to) {
                http_response_code(404);
                echo json_encode([
                    "success" => false,
                    "message" => "Assigned employee not found",
                    "user_id" => $user_id,
                ]);
                return;
            }
            
            if($assigned_to['id'] !== $user_id) {
                http_response_code(403);
                echo json_encode([
                    "success" => false,
                    "message" => "You are not authorized to create a notification for this employee",
                    "user_id" => $user_id,
                ]);
                return;
            }

            $this->db->query("INSERT INTO notifications (user_id, title, message, type, read_at, data) VALUES (:user_id, :title, :message, :type, :read_at, :data)", [
                'user_id' => $user_id, // recipient id (who will receive the notification)
                'title' => $title,
                'type' => $type,
                'message' => $message,
                'read_at' => $is_read ? date('Y-m-d H:i:s') : null,
                'data' => $data ? json_encode($data) : null,
            ]);
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

        if(!$this->current_user_id) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Unathorized Access',
                'user_id' => $this->current_user_id,
            ]);
            return;
        }

        $notifications = $this->db->query("SELECT * FROM notifications WHERE user_id = :user_id ORDER BY created_at DESC", [
            'user_id' => $this->current_user_id, // list of notifications for the current user
        ])->all();

        return $notifications ?? [];
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

        $this->db->query("UPDATE notifications SET read_at = :read_at WHERE id = :id", [
            'read_at' => date('Y-m-d H:i:s'),
            'id' => $id,
        ]);

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

        $this->db->query("DELETE FROM notifications WHERE id = :id", [
            'id' => $id,
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