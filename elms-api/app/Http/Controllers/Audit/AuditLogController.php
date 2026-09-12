<?php


namespace app\Http\Controllers\Audit;

use App\Services\audit\AuditLogService;
use Core\App;
use Core\Database;


class AuditLogController {

    private AuditLogService $audit_log_service;
    private Database $db;
    
    public function __construct() {
        $this->audit_log_service = App::resolve(AuditLogService::class);
        $this->db = App::resolve(Database::class);
    }


    public function index() {
        $audit_logs = $this->audit_log_service->getAuditLogs();
        return $this->db->response(200, true, 'Audit logs fetched successfully', $audit_logs);
    }

    public function show(int $id) {

        $audit_log = $this->audit_log_service->getAuditLog($id);
        return $this->db->response(200, true, 'Audit log fetched successfully', $audit_log);
    }


}