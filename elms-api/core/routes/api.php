<?php


use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Leave\LeaveRequestController;
use App\Http\Controllers\Leave\LeaveReviewController;
use App\Http\Controllers\Manager\EmployeeController;
use App\Http\Controllers\Employees\EmployeesController;
use App\Http\Controllers\Employees\EmployeesSummaryController;
use App\Http\Controllers\Leave\EmployeeLeaveBalanceController;
use App\Http\Controllers\Dashboard\EmployeeDashboardController;
use App\Http\Controllers\Dashboard\ManagerDashboardController;
use App\Http\Controllers\Dashboard\AdminDashboardController;
use App\Http\Controllers\Notification\NotificationController;
use App\Http\Controllers\Leave\LeaveTypesController;

use Core\Router;

$router = new Router();

$router->post('/', [LoginController::class, 'login'])->only('guest');
$router->post('/logout', [LoginController::class, 'logout'])->only('auth');

$router->post('/verify-email', [VerifyEmailController::class, 'verifyEmail']);
$router->post('/leave-request', [LeaveRequestController::class, 'store'])->only('auth');


// view leave balance
$router->get('/leave-balance/me', [EmployeeLeaveBalanceController::class, 'index'])->only('auth');

// employee
$router->get('/leave-request', [LeaveRequestController::class, 'index'])->only('auth');
$router->get('/leave-request/{id}', [LeaveRequestController::class, 'show'])->only('auth');
$router->patch('/leave-request/{id}', [LeaveRequestController::class, 'patch'])->only('auth');
$router->delete('/leave-request/{id}', [LeaveRequestController::class, 'destroy'])->only('auth');

// employee dashboard
$router->get('/employee-dashboard', [EmployeeDashboardController::class, 'index'])->only('auth');


// manager dashboard
$router->get('/manager-dashboard', [ManagerDashboardController::class, 'index'])->only('auth');

// manager
$router->get('/leave-requests/me', [LeaveRequestController::class, 'index'])->only('auth');
$router->get('/leave-requests', [LeaveReviewController::class, 'index'])->only('auth');
$router->get('/leave-requests/{id}', [LeaveRequestController::class, 'show'])->only('auth');
$router->patch('/leave-requests/{id}', [LeaveReviewController::class, 'patch'])->only('auth');
$router->get('/leave-requests/{id}/overlaps', [LeaveReviewController::class, 'checkOverlap'])->only('auth');

$router->get('/manager-dashboard', [ManagerDashboardController::class, 'index'])->only('auth');


// admin and manager and super admin
$router->get('/employees', [EmployeesController::class, 'index'])->only('auth');
$router->get('/employees/summary', [EmployeesSummaryController::class, 'summary'])->only('auth');
$router->get('/employees/managers', [EmployeesController::class, 'managers'])->only('auth');
$router->get('/employees/admins', [EmployeesController::class, 'admins'])->only('auth');
$router->post('/register', [RegisteredUserController::class, 'store'])->only('auth');
$router->get('/employees/{id}/profile', [EmployeesController::class, 'show'])->only('auth');
// $router->get('/employees/{id}', [EmployeesController::class, 'show'])->only('auth');
$router->patch('/employees/{id}', [EmployeesController::class, 'patch'])->only('auth');
$router->delete('/employees/{id}', [EmployeesController::class, 'destroy'])->only('auth');


$router->get('/leave-requests/me', [LeaveRequestController::class, 'index'])->only('auth');
$router->get('/leave-requests', [LeaveReviewController::class, 'index'])->only('auth');
$router->get('/leave-requests/{id}', [LeaveRequestController::class, 'show'])->only('auth');
$router->patch('/leave-requests/{id}/review', [LeaveReviewController::class, 'patch'])->only('auth');

$router->get('/admin-dashboard', [AdminDashboardController::class, 'index'])->only('auth');

// leave types
$router->get('/leave-types', [LeaveTypesController::class, 'index'])->only('auth');

// notifications
$router->get('/notifications', [NotificationController::class, 'index'])->only('auth');
$router->patch('/notifications/{id}', [NotificationController::class, 'patch'])->only('auth');




// return the router with existing routes inside it
return $router;