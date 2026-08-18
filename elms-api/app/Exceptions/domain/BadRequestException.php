<?php

namespace App\Exceptions\domain;

use App\Exceptions\domain\DomainException;

class BadRequestException extends DomainException {

    protected int $status = 400;
    
}