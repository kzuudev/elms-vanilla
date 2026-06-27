<?php

use Core\App;
use Core\Database;
use Core\Container;
use App\Services\EmployeeLeaveService;


$container = new Container();

$container->bind('Core\Database', function() {

    $config = require 'config.php';

    return new Database($config['database']);
});

$container->bind('App\Services\EmployeeLeaveService', function() {
    return new EmployeeLeaveService();
});

App::setContainer($container);

