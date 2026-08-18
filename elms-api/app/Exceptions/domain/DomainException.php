<?php

namespace App\Exceptions\domain;

use Exception;

/** serve as a base class for all domain exceptions (template for all domain exceptions) **/
abstract class DomainException extends Exception {

    protected int $status = 0;
    
    public function getStatus(): int {
        return $this->status;

    }

}