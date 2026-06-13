<?php

namespace Core;

use PDO;

class Database {

    public $connection;
    public $statement;

    public function __construct($config, $username = 'root', $password = '') {

        $dsn = 'mysql:' . http_build_query($config, '', ';');

        $this->connection = new PDO($dsn, $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        ]);
    }

    // Prepare the SQL statement to prevent SQL injection
    public function query($query, $params = []) {
        $this->connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        $this->statement = $this->connection->prepare($query);
        $this->statement->execute($params);

        // for chaining methods
        return $this;
    }

    public function find() {

        return $this->statement->fetch();
    }

    public function all() {

        return $this->statement->fetchAll();
    }

    public function lastInsertId() {
        return $this->connection->lastInsertId();
    }

    public static function abort($code, $message) {
        http_response_code($code);

        echo json_encode([
            "success" => false,
            "error" => $message
        ]);

        die();
    }
}