<?php


namespace App\Services\audit;

use Core\App;
use Core\Database;
use App\Http\Middleware\Auth;
use App\Exceptions\domain\UnauthorizedException;
use Throwable;

class AuditLogService
{

    private Database $db;
    private int $current_user_id;
    private string $current_user_role;
    private ?string $current_user_department;

    public function __construct()
    {
        $this->db = App::resolve(Database::class);
        $current_user = Auth::authenticate();
        $this->current_user_id = (int) $current_user['id'];
        $this->current_user_role = $current_user['role'];
        $this->current_user_department = $current_user['department'] ?? null;
    }

    private function validateUser()
    {
        if ($this->current_user_role !== 'super-admin' && $this->current_user_role !== 'admin') {
            throw new UnauthorizedException('You are not authorized to access this resource');
        }

        if ($this->current_user_role === 'admin' && empty($this->current_user_department)) {
            throw new UnauthorizedException('Your department is required to access audit logs');
        }
    }

    /**
     * Create a new audit log
     * @param int $actor_id
     * @param string $actor_role
     * @param string $actor_name
     * @param string $occured_at
     * @param string $occurred_at
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

    public function createAuditLog(int $user_id, int $actor_id, string $actor_role, string $actor_name, string $occurred_at, int $subject_id, string $action, string $subject_type, string $subject_name, string $owner_name, string $owner_role, string $changes, ?array $details = null)
    {

        try {
            $this->db->beginTransaction();

            $audit_log = $this->db->query("
                INSERT INTO audit_logs (user_id, actor_id, actor_role, actor_name, occurred_at, subject_id, action, subject_type, subject_name, owner_name, owner_role, changes, details) VALUES (:user_id, :actor_id, :actor_role, :actor_name, :occurred_at, :subject_id, :action, :subject_type, :subject_name, :owner_name, :owner_role, :changes, :details)
            ", [
                'user_id' => $user_id,
                'actor_id' => $actor_id,
                'actor_role' => $actor_role,
                'actor_name' => $actor_name,
                'occurred_at' => $occurred_at,
                'subject_id' => $subject_id,
                'action' => $action,
                'subject_type' => $subject_type,
                'subject_name' => $subject_name,
                'owner_name' => $owner_name,
                'owner_role' => $owner_role,
                'changes' => $changes,
                'details' => $details ? json_encode($details) : null,
            ]);


            $this->db->commit();

            return $audit_log;
        } catch (Throwable $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    /**
     * Get all audit logs
     * @return array
     * @throws UnauthorizedException
     */
    public function getAuditLogs()
    {

        $this->validateUser();

        $search = $_GET['search'] ?? "";
        $action = $_GET['action'] ?? "";
        $subject_type = $_GET['subject_type'] ?? "";
        $start_date = $_GET['start_date'] ?? "";
        $end_date = $_GET['end_date']   ?? "";

        // 
        $query = "
            SELECT al.* FROM audit_logs al
            LEFT JOIN leave_requests lr ON al.subject_type = 'leave_request' AND lr.id = al.subject_id
            LEFT JOIN users u ON u.id = CASE
                WHEN al.subject_type = 'leave_request' THEN lr.user_id
                ELSE al.user_id
            END
            WHERE 1 = 1
        ";

        $params = [];

        // Super admins see all departments; admins see their own department.
        if ($this->current_user_role === 'admin') {
            $query .= " AND u.department = :department";
            $params['department'] = $this->current_user_department;
        }

        if (!empty($search)) {
            $query .= " AND (al.actor_name LIKE :search OR al.subject_name LIKE :search OR al.owner_name LIKE :search)";
            $params['search'] = "%$search%";
        }

        if (!empty($action) && $action !== 'all') {
            $query .= " AND al.action = :action";
            $params['action'] = $action;
        }

        if (!empty($subject_type) && $subject_type !== 'all') {
            $query .= " AND al.subject_type = :subject_type";
            $params['subject_type'] = $subject_type;
        }

        if (!empty($start_date)) {
            $query .= " AND DATE(al.occurred_at) >= :start_date";
            $params['start_date'] = $start_date;
        }

        if (!empty($end_date)) {
            $query .= " AND DATE(al.occurred_at) <= :end_date";
            $params['end_date'] = $end_date;
        }

        $query .= " ORDER BY al.occurred_at DESC";

        $audit_logs = $this->db->query($query, $params)->all();

        return $audit_logs;
    }

    /**
     * Get a single audit log
     * @param int $id
     * @return array
     * @throws UnauthorizedException
     */
    public function getAuditLog(int $id)
    {
        $this->validateUser();

        $query = "
            SELECT al.* FROM audit_logs al
            LEFT JOIN leave_requests lr ON al.subject_type = 'leave_request' AND lr.id = al.subject_id
            LEFT JOIN users u ON u.id = CASE
                WHEN al.subject_type = 'leave_request' THEN lr.user_id
                ELSE al.user_id
            END
            WHERE al.id = :id
        ";

        $params = ['id' => $id];

        if ($this->current_user_role === 'admin') {
            $query .= " AND u.department = :department";
            $params['department'] = $this->current_user_department;
        }

        $audit_log = $this->db->query($query, $params)->find();

        return $audit_log;
    }
}