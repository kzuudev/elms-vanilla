<?php


namespace Core;

use Exception;


class Validator {

    public static function string($value, $min = 1, $max = INF) {

        $input = trim($value);

        return strlen($input) >= $min && strlen($input) <= $max;
    }

    public static function phone($value) {

        // normalizes: "+63 917-123-4567" into "+639171234567"
        $input = preg_replace('/[\s\-()]/', '', $value);

        $e164pattern = '/^\+[1-9]\d{1,14}$/';

        return preg_match($e164pattern, $input) === 1;
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

    public static function date($date, $format = 'Y-m-d') {

        $d = \DateTime::createFromFormat($format, $date);
        return $d && $d->format($format) === $date;
    }

    public static function number($value) {

        return is_int($value);

    }


    public static function type($value) {

        $allowedTypes = [
            'Annual Leave',
            'Maternity Leave',
            'Sick Leave',
            'Paternity Leave',
            'Bereavement Leave',
            'Public Holidays',
            'Court Leave',
            'Compensatory Off Leave',
            'Sabbatical Leave',
            'Extended Medical Leave'

        ];

        if(in_array($value, $allowedTypes)) {
            return true;
        }
    }

}