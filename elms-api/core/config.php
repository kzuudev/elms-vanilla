<?php



return [
    // database configuration only (DSN - Data Source Name)
    'database' => [
        'host' => $_ENV['DB_HOST'],
        'port' => $_ENV['DB_PORT'],
        'dbname' => $_ENV['DB_NAME'],
        'charset' => 'utf8mb4',
    ],
    // database credentials
    'user' => $_ENV['DB_USER'],
    'pass' => $_ENV['DB_PASS'],

    
];