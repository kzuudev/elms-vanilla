<?php

namespace App\Services\Notifications;
use Core\App;
use Core\Database;
use App\Http\Middleware\Auth;
use App\Exceptions\domain\UnauthorizedException;
use App\Exceptions\domain\NotFoundException;
use App\Exceptions\domain\BadRequestException;
use Throwable;

class NotificationService { 

    private Database $db;
    private int $current_user_id;

    public function __construct() {

        $this->db = App::resolve(Database::class);
        $this->current_user_id = Auth::authenticate()['id'];
    }


    /**
     * Create a new notification
     * @return array
     */
    public function createNotification(int $user_id, string $title, string $type, string $message, bool $is_read = false, ?array $data = null) {

        if($this->current_user_id) {

            $new_notification = $this->db->query("INSERT INTO notifications (user_id, title, message, type, read_at, data) VALUES (:user_id, :title, :message, :type, :read_at, :data)", [
                'user_id' => $user_id, // recipient id (who will receive the notification)
                'title' => $title,
                'type' => $type,
                'message' => $message,
                'read_at' => $is_read ? date('Y-m-d H:i:s') : null,
                'data' => $data ? json_encode($data) : null,
            ]);

            return $new_notification;
        }

        return false;
    }

    /**
     * Get all notifications for a user
     * @return array
     */
    public function getNotifications() {

        if($this->current_user_id) {

            $notifications = $this->db->query("SELECT * FROM notifications WHERE user_id = :user_id ORDER BY created_at DESC", [
            'user_id' => $this->current_user_id, // list of notifications for the current user
            ])->all();

            return $notifications ?? [];

        }

        return [];
       
    }


    /**
     * Update a notification (mark as read)
     * @return void
     */
    public function markAsRead(int $id): bool {

        if(!$this->current_user_id) {
            $this->db->response(401, false, 'Unathorized Access', ['user_id' => $this->current_user_id]);
            return false;
        }

        $notification = $this->db->query("SELECT * FROM notifications WHERE id = :id AND user_id = :user_id", [
            'id' => $id,
            'user_id' => $this->current_user_id,
        ])->find();

        if(!$notification) {
            throw new NotFoundException('Notification not found');
        }
        
        if($notification['read_at'] == date('Y-m-d H:i:s')) {
            throw new BadRequestException('Notification already marked as read');
        }

        try {
            $this->db->beginTransaction();
            $this->db->query("UPDATE notifications SET read_at = :read_at WHERE id = :id AND user_id = :user_id", [
            'read_at' => date('Y-m-d H:i:s'),
            'id' => $id,
            'user_id' => $this->current_user_id,
        ]);
            $this->db->commit();
            return true;

        }catch(Throwable $e) {
            $this->db->rollBack();
            throw $e;
        }

      return false;
    }

    /**
     * Delete a notification
     * @param int $id
     * @return void
     * @throws UnauthorizedException
     * @throws Throwable
     */
    public function destroyNotification(int $id): void {
        
        if(!$this->current_user_id) {
            throw new UnauthorizedException('Unathorized Access');
        }

        try {
            $this->db->beginTransaction();
            $this->db->query("DELETE FROM notifications WHERE id = :id AND user_id = :user_id", [
                'id' => $id,
                'user_id' => $this->current_user_id,
            ]);
            $this->db->commit();
        }catch(Throwable $e) {
            $this->db->rollBack();
            throw $e;
        }

    }

}
