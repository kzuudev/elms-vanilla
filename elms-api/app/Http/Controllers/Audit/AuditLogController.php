<?php


namespace app\Http\Controllers\Audit;

use App\Services\audit\AuditLogService;
use Core\App;
use Core\Database;
use App\Http\Middleware\Auth;
use App\Exceptions\domain\UnauthorizedException;


class AuditLogController {

    private Database $db;
    private int $current_user_id;
    private AuditLogService $audit_log_service;
    
    public function __construct() {
        $this->audit_log_service = new AuditLogService();

        $this->db = App::resolve(Database::class);
        $this->current_user_id = Auth::authenticate()['id'];
    }


    public function index() {
        return $this->audit_log_service->getAuditLogs();
    }

    public function show(int $id) {

        return $this->audit_log_service->getAuditLog($id);
    }


}