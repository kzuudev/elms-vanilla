<?php

namespace App\Exceptions;

use Exception;

class VerificationEmailException extends Exception {

    public function __construct(string $message = "Failed to send verification email.") {
        parent::__construct($message);
    }
}