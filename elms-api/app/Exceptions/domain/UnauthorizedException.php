<?php

namespace App\Exceptions\domain;

use App\Exceptions\domain\DomainException;

class UnauthorizedException extends DomainException {

    protected int $status = 401;

}