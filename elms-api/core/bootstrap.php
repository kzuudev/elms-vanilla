<?php

    use App\Services\leaves\AdminLeaveService;
    use App\Services\leaves\EmployeeLeaveService;
    use App\Services\leaves\ManagerLeaveService;
    use App\Services\employees\EmployeeSummaryService;
    use Core\App;
    use Core\Container;
    use Core\Database;


    $container = new Container();

$container->bind('Core\Database', function() {

    $config = require 'config.php';

    return new Database($config['database']);
});

$container->bind('App\Services\leaves\EmployeeLeaveService', function() {
    return new EmployeeLeaveService();
});

$container->bind('App\Services\leaves\ManagerLeaveService', function() {
    return new ManagerLeaveService();
});

$container->bind('App\Services\leaves\AdminLeaveService', function() {
    return new AdminLeaveService();
});

$container->bind('App\Services\employees\EmployeeSummaryService', function() {
    return new EmployeeSummaryService;
});




App::setContainer($container);

