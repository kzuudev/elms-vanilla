<?php

    use App\Services\dashboard\AdminDashboardService;
    use App\Services\dashboard\EmployeeDashboardService;
    use App\Services\dashboard\ManagerDashboardService;
    use App\Services\employees\EmployeeSummaryService;
    use Core\App;
    use Core\Container;
    use Core\Database;


    $container = new Container();

$container->bind('Core\Database', function() {

    $config = require 'config.php';

    return new Database($config['database']);
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
    return new EmployeeSummaryService;
});




App::setContainer($container);

