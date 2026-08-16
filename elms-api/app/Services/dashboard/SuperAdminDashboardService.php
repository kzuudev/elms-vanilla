<?php


namespace App\Services\dashboard;

use App\Traits\HasSharedAnalytics;
use Core\App;

class SuperAdminDashboardService {

    use HasSharedAnalytics;

    private $db;

    private int $current_user_id;
    private string $current_user_role;
    private string $current_user_department;

    public function __construct() {
        $this->db = App::resolve(Database::class);
        $this->current_user_id = Auth::authenticate()['id'];
        $this->current_user_role = Auth::authenticate()['role'];
        $this->current_user_department = Auth::authenticate()['department'];
    }
}