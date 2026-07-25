<?php


namespace App\Http\Middleware;


use Exception;

class Middleware {


    const MAP = [
        'auth' => Auth::class,
        'guest' => Guest::class,
    ];

    /**
     * @throws Exception
     */
    public static function resolve($key) {

        // if the route has no middleware, just do nothing
        if(!$key) {
            return;
        }

        // Find the class (middleware) in the map
        $middleware = static::MAP[$key] ?? null;

        // check if the middleware exists in MAP
        if(!$middleware) {
                throw new Exception("No middleware found for {$key}");
        }

        // instantiate the middleware
        (new $middleware)->handle();
    }
}