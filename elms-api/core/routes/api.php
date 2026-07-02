<?php


use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Leave\LeaveRequestController;
use App\Http\Controllers\Leave\LeaveReviewController;
use App\Http\Controllers\Manager\EmployeeController;
use App\Http\Controllers\Admin\UsersController;
use App\Http\Controllers\Leave\UserLeaveBalanceController;
use App\Http\Controllers\Dashboard\EmployeeDashboardController;
use App\Http\Controllers\Dashboard\ManagerDashboardController;
use Core\Router;

$router = new Router();



$router->post('/', [LoginController::class, 'login'])->only('guest');
$router->post('/leave-request', [LeaveRequestController::class, 'store'])->only('auth');

// view leave balance
$router->get('/leave-balance/me', [UserLeaveBalanceController::class, 'index'])->only('auth');

// employee
$router->get('/leave-request', [LeaveRequestController::class, 'index'])->only('auth');
$router->get('/leave-request/{id}', [LeaveRequestController::class, 'show'])->only('auth');
$router->patch('/leave-request/{id}', [LeaveRequestController::class, 'patch'])->only('auth');
$router->delete('/leave-request/{id}', [LeaveRequestController::class, 'destroy'])->only('auth');

// employee dashboard
$router->get('/employee-dashboard', [EmployeeDashboardController::class, 'index'])->only('auth');

// manager
$router->get('/employees-list', [EmployeeController::class, 'index'])->only('auth');
$router->get('/employees-list/{id}', [EmployeeController::class, 'show'])->only('auth');

$router->get('/leave-requests/me', [LeaveRequestController::class, 'index'])->only('auth');
$router->get('/leave-requests', [LeaveReviewController::class, 'index'])->only('auth');
$router->get('/leave-requests/{id}', [LeaveRequestController::class, 'show'])->only('auth');
$router->patch('/leave-requests/{id}', [LeaveReviewController::class, 'patch'])->only('auth');

$router->get('/manager-dashboard', [ManagerDashboardController::class, 'index'])->only('auth');

// admin
$router->get('/users', [UsersController::class, 'index'])->only('auth');
$router->post('/register', [RegisteredUserController::class, 'store'])->only('auth');
$router->get('/users/{id}/profile', [UsersController::class, 'profile'])->only('auth');
$router->get('/users/{id}', [UsersController::class, 'show'])->only('auth');
$router->patch('/users/{id}', [UsersController::class, 'patch'])->only('auth');
$router->delete('/users/{id}', [UsersController::class, 'destroy'])->only('auth');

$router->get('/leave-requests/me', [LeaveRequestController::class, 'index'])->only('auth');
$router->get('/leave-requests', [LeaveReviewController::class, 'index'])->only('auth');
$router->get('/leave-requests/{id}', [LeaveRequestController::class, 'show'])->only('auth');
$router->patch('/leave-requests/{id}/review', [LeaveReviewController::class, 'patch'])->only('auth');


// return the router with existing routes inside it
return $router;