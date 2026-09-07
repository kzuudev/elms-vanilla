<?php


namespace app\Http\Controllers\Audit;

use App\Http\Controllers\Controller;
use App\Services\audit\AuditLogService;


class AuditLogController {

    private AuditLogService $audit_log_service;
    
    public function __construct() {
        $this->audit_log_service = new AuditLogService();
        
    }


    public function store() {
        // create validation for audit log creation
        
        
        return $this->audit_log_service->createAuditLog();
    }

    public function index() {
        return $this->audit_log_service->getAuditLogs();
    }


}