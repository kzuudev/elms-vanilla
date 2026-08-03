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

        $this->db->query("INSERT INTO notifications (user_id, title, message, type, read_at, data) VALUES (:user_id, :title, :message, :type, :read_at, :data)", [
            'user_id' => $user_id, // recipient id (who will receive the notification)
            'title' => $title,
            'type' => $type,
            'message' => $message,
            'read_at' => $is_read ? date('Y-m-d H:i:s') : null,
            'data' => $data ? json_encode($data) : null,
        ]);
        
    }

    /**
     * Get all notifications for a user
     * @return array
     */
    public function index() {

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

        $this->db->query("UPDATE notifications SET read_at = :read_at WHERE id = :id", [
            'read_at' => date('Y-m-d H:i:s'),
            'id' => $id,
        ]);

        return true;
    }

    /**
     * Delete a notification
     * @return void
     */
    public function destroy(int $id): void {
        
        $this->db->query("DELETE FROM notifications WHERE id = :id", [
            'id' => $id,
        ])->find();

    }

}