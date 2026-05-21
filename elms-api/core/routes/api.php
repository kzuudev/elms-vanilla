<?php


use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Leave\LeaveRequestController;
use Core\Router;

$router = new Router();

$router->post('/register', [RegisteredUserController::class, 'store'])->only('guest');

$router->post('/', [LoginController::class, 'login'])->only('guest');

// emplopyee
$router->get('/leave-request', [LeaveRequestController::class, 'index'])->only('auth');
$router->post('/leave-request', [LeaveRequestController::class, 'submit'])->only('auth');
$router->put('/leave-request', [LeaveRequestController::class, 'show'])->only('auth');
$router->patch('/leave-request', [LeaveRequestController::class, 'patch'])->only('auth');

// manager

// return the router with existing routes inside it
return $router;