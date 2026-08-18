<?php

namespace App\Exceptions;

use Exception;

class UserAlreadyExistsExceptions extends Exception {

    public function __construct(string $message = "User already exists.") {
        parent::__construct($message);
    }
}