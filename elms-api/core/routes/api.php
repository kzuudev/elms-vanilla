<?php


use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Leave\LeaveRequestController;
use App\Http\Controllers\Leave\LeaveReviewController;
use App\Http\Controllers\Manager\EmployeeController;
use App\Http\Controllers\Admin\UsersController;
use Core\Router;

$router = new Router();



$router->post('/', [LoginController::class, 'login'])->only('guest');

// employee
$router->get('/leave-request', [LeaveRequestController::class, 'index'])->only('auth');
$router->post('/leave-request', [LeaveRequestController::class, 'submit'])->only('auth');
$router->get('/leave-request/{id}', [LeaveRequestController::class, 'show'])->only('auth');
$router->patch('/leave-request/{id}', [LeaveRequestController::class, 'patch'])->only('auth');
$router->destroy('/leave-request/{id}', [LeaveRequestController::class, 'destroy'])->only('auth');

// manager
$router->get('/leaves', [LeaveReviewController::class, 'index'])->only('auth');
$router->patch('/leaves/{id}', [LeaveReviewController::class, 'patch'])->only('auth');
$router->get('/employees-list', [EmployeeController::class, 'index'])->only('auth');
$router->get('/employees-list/{id}', [EmployeeController::class, 'show'])->only('auth');

// admin
$router->get('/admin/users', [UsersController::class, 'index'])->only('auth');
$router->post('/register', [RegisteredUserController::class, 'store'])->only('auth');
$router->get('/admin/users/{id}', [UsersController::class, 'show'])->only('auth');
$router->patch('/admin/users/{id}', [UsersController::class, 'patch'])->only('auth');
$router->destroy('/admin/users/{id}', [UsersController::class, 'delete'])->only('auth');


// return the router with existing routes inside it
return $router;