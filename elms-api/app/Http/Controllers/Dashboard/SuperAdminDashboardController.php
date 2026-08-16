<?php


namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Services\dashboard\SuperAdminDashboardService;
use Core\App;
use Core\Database;

class SuperAdminDashboardController {

    private Database $db;
    private SuperAdminDashboardService $super_admin_dashboard_service;
}