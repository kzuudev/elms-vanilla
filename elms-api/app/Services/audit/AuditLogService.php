<?php


namespace App\Services\audit;

use Core\App;
use Core\Database;
use App\Http\Middleware\Auth;
use App\Exceptions\domain\UnauthorizedException;
;
class AuditLogService {

    private Database $db;
    private int $current_user_id;
    private string $current_user_role;

    public function __construct() {
        $this->db = App::resolve(Database::class);
        $this->current_user_id = Auth::authenticate()['id'];
        $this->current_user_role = Auth::authenticate()['role'];
    }

    private function validateUser() {
        if($this->current_user_role !== 'super-admin') {
            throw new UnauthorizedException('You are not authorized to access this resource');
        }
    }

    /**
     * Create a new audit log
     * @param int $actor_id
     * @param string $actor_role
     * @param string $actor_name
     * @param string $occured_at
     * @param string $action
     * @param string $subject_type
     * @param string $subject_name
     * @param string $owner_name
     * @param string $owner_role
     * @param string $changes
     * @param array|null $details
     * @return array
     * @throws UnauthorizedException
     */

    public function createAuditLog(int $actor_id, string $actor_role, string $actor_name, string $occured_at, string $action, string $subject_type, string $subject_name, string $owner_name, string $owner_role, string $changes, ?array $details = null) {
        $this->validateUser();

        $audit_log = $this->db->query("
            INSERT INTO audit_logs (actor_id, actor_role, actor_name, occured_at, action, subject_type, subject_name, owner_name, owner_role, changes, details) VALUES (:actor_id, :actor_role, :actor_name, :occured_at, :action, :subject_type, :subject_name, :owner_name, :owner_role, :changes, :details)
        ", [
            'actor_id' => $actor_id,
            'actor_role' => $actor_role,
            'actor_name' => $actor_name,
            'occured_at' => $occured_at,
            'action' => $action,
            'subject_type' => $subject_type,
            'subject_name' => $subject_name,
            'owner_name' => $owner_name,
            'owner_role' => $owner_role,
            'changes' => $changes,
            'details' => $details ? json_encode($details) : null,
        ]);

        return $audit_log;
       
    }

    /**
     * Get all audit logs
     * @return array
     * @throws UnauthorizedException
     */
    public function getAuditLogs() {
        
        $this->validateUser();

        $audit_logs = $this->db->query(
            "SELECT * FROM audit_logs WHERE user_id = :user_id AND role = :role ORDER BY created_at DESC", [
                'user_id' => $this->current_user_id,
                'role' => $this->current_user_role
            ]
        )->all();

        return $audit_logs;
    }

    /**
     * Get a single audit log
     * @param int $id
     * @return array
     * @throws UnauthorizedException
     */
    public function getAuditLog(int $id) {
        $this->validateUser();

        $audit_log = $this->db->query("
            SELECT * FROM audit_logs WHERE id = :id AND user_id = user_id AND role = role", [
                'id' => $id,
                'user_id' => $this->current_user_id,
                'role' => $this->current_user_role
            ])->find();

        return $audit_log;
    }


}