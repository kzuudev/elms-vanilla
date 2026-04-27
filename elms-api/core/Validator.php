<?php


namespace Core;


class Validator {

    public static function string($value, $min = 1, $max = INF) {

        $input = trim($value);

        return strlen($input) >= $min && strlen($input) <= $max;
    }

    public static function email($value) {

        $input = trim($value);

        return filter_var($input, FILTER_VALIDATE_EMAIL) !== false;
    }

    public static function password($value) {

        $input = trim($value);

        $hashed_password = password_hash($input, PASSWORD_DEFAULT);

        return password_verify($input, $hashed_password);
    }


}