<?php


namespace App\Services\audit;

use Core\App;
use Core\Database;
use App\Http\Middleware\Auth;
use App\Exceptions\domain\UnauthorizedException;
;
class AuditReportService {

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

    public function getAuditlogs() {
        $this->validateUser();

        $audit_logs = $this->db->query("
        ")->all();

        return $audit_logs;
    }
}