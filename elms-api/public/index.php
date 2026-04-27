<?php

const BASE_PATH = __DIR__ . '/../';

require BASE_PATH . 'core/functions.php';


require base_path('vendor/autoload.php');
require base_path('core/bootstrap.php');

\Core\Header::setApiHeaders();

$raw_uri = $_SERVER['REQUEST_URI'];
$parsed_uri = parse_url($raw_uri, PHP_URL_PATH);
$uri = str_replace('/elms-api', '', $parsed_uri);
$method = $_SERVER['REQUEST_METHOD'];

// capture the existing route from api
$router = require base_path('core/routes/api.php');;


try {
    $router->route($uri, $method);
} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
    exit;
}




