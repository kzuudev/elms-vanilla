<?php

namespace Core;


class Env {


    // load the environment variables
    public static function load(string $path): void {


        if(!file_exists($path)) {
            // Railway injects variables into the process. The .env file stays off GitHub.
            self::loadFromProcess();
            return;
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        foreach($lines as $line) {
            $line = trim($line);

            // skip empty lines and comments
            if ($line === '' || str_starts_with($line, '#')) {
                continue;
            }

            [$name, $value] = explode('=', $line, 2);

            $name = trim($name);
            $value = trim($value);

            // validate the name and value
            if(!$name) {
                throw new \RuntimeException("Invalid environment variable: {$line}");
            }

            // set the environment variables
            $_ENV[$name] = $value;
            $_SERVER[$name] = $value;
            putenv("{$name}={$value}");

        }


    }

    // Copy the variables this API reads. A missing database or frontend value stops boot with the variable name.
    private static function loadFromProcess(): void
    {
        $required = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASS', 'FRONTEND_URL'];
        $optional = ['MAIL_HOST', 'MAIL_PORT', 'MAIL_USER', 'MAIL_PASS'];

        foreach ([...$required, ...$optional] as $name) {
            $value = $_ENV[$name] ?? $_SERVER[$name] ?? getenv($name);

            if ($value === false || $value === null || $value === '') {
                if (in_array($name, $required, true)) {
                    throw new \RuntimeException("Missing environment variable: {$name}");
                }
                continue;
            }

            $_ENV[$name] = $value;
            $_SERVER[$name] = $value;
            putenv("{$name}={$value}");
        }
    }

}