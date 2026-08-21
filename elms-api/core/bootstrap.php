<?php

use App\Services\dashboard\AdminDashboardService;
use App\Services\dashboard\EmployeeDashboardService;
use App\Services\dashboard\ManagerDashboardService;
use App\Services\employees\EmployeesService;
use App\Services\employees\EmployeeSummaryService;
use App\Services\notifications\NotificationService;
use App\Services\leaves\LeaveReviewService;
use App\Services\department\DepartmentService;
use App\Services\leaves\LeaveTypeService;
use App\Services\dashboard\department\DepartmentSummaryService;
use App\Services\dashboard\department\DepartmentEmployeesService;
use Core\App;
use Core\Container;
use Core\Database;
use App\Http\Middleware\Auth;


$container = new Container();

$container->bind('Core\Database', function() {

    $config = require 'config.php';

    return new Database($config['database'], $config['user'], $config['pass']);
});

$container->bind(Auth::class, function() {
    return new Auth();
});

$container->bind(NotificationService::class, function() {
    return new NotificationService();
});

$container->bind(EmployeeDashboardService::class, function() {
    return new EmployeeDashboardService();
});

$container->bind(ManagerDashboardService::class, function() {
    return new ManagerDashboardService();
});

$container->bind(AdminDashboardService::class, function() {
    return new AdminDashboardService();
});

$container->bind(EmployeeSummaryService::class, function() {
    return new EmployeeSummaryService();
});

$container->bind(LeaveReviewService::class, function() {
    return new LeaveReviewService();
});

$container->bind(EmployeesService::class, function() {
    return new EmployeesService();
});

$container->bind(DepartmentService::class, function() {
    return new DepartmentService();
});

$container->bind(LeaveTypeService::class, function() {
    return new LeaveTypeService();
});

$container->bind(DepartmentSummaryService::class, function() {
    return new DepartmentSummaryService();
});

$container->bind(DepartmentEmployeesService::class, function() {
    return new DepartmentEmployeesService();
});

App::setContainer($container);

