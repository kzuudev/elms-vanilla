<?php

namespace App\Exceptions\domain;

use App\Exceptions\domain\DomainException;


class ForbiddenException extends DomainException {

    protected int $status = 403;
}