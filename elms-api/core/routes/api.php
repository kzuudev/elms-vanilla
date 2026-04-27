<?php


use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Core\Router;

$router = new Router();

$router->post('/register', [RegisteredUserController::class, 'store'])->only('guest');

$router->post('/', [LoginController::class, 'login'])->only('guest');


// return the router with existing routes inside it
return $router;