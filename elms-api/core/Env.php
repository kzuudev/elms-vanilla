<?php

namespace Core;


class Env {


    // load the environment variables
    public static function load(string $path): void {


        if(!file_exists($path)) {
            throw new \RuntimeException(".env file not found at: {$path}");
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

}