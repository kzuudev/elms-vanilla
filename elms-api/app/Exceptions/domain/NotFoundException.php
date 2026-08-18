<?php

namespace App\Exceptions\domain;

use App\Exceptions\domain\DomainException;

class NotFoundException extends DomainException {

    protected int $status = 404;
    
}