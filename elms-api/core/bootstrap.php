<?php

use Core\App;
use Core\Database;
use Core\Container;
use App\Services\EmployeeLeaveService;
use App\Services\ManagerLeaveService;
use App\Services\AdminLeaveService;

use App\Http\Middleware\Auth;



$container = new Container();

$container->bind('Core\Database', function() {

    $config = require 'config.php';

    return new Database($config['database']);
});

$container->bind('App\Services\EmployeeLeaveService', function() {
    return new EmployeeLeaveService();
});

$container->bind('App\Services\ManagerLeaveService', function() {
    return new ManagerLeaveService();
});

$container->bind('App\Services\AdminLeaveService', function() {
    return new AdminLeaveService();
});



App::setContainer($container);

