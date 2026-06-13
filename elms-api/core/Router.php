<?php

namespace Core;

use App\Http\Middleware\Middleware;

class Router {

    public array $routes = [];

    public function add($uri, $method, $controller) {
        $this->routes[] = [
            'uri' => $uri,
            'method' => $method,
            'controller' => $controller,
            'middleware' => ''
        ];

        return $this;
    }


    public function get($uri, $controller) {
        return $this->add($uri, 'GET', $controller);
    }

    public function post($uri, $controller) {
        return $this->add($uri, 'POST', $controller);
    }

    public function destroy($uri, $controller) {
        return $this->add($uri, 'DELETE', $controller);
    }

    public function patch($uri, $controller) {
        return $this->add($uri, 'PATCH', $controller);
    }

    public function put($uri, $controller) {
        return $this->add($uri, 'PUT', $controller);
    }

    public function only($key) {
        $this->routes[array_key_last($this->routes)]['middleware'] = $key;

        return $this;
    }
    /**
     * @throws \Exception
     */
    public function route($uri, $method) {

        foreach ($this->routes as $route) {

            // match any URL that starts with exactly /leaves/
            $pattern = preg_replace('/\{[a-zA-Z0-9_]+\}/', '([^/]+)', $route['uri']);
            $pattern = "#^" . $pattern . "$#";

            if(preg_match($pattern, $uri, $matches) && $route['method'] === strtoupper($method)) {
                Middleware::resolve($route['middleware']);

                // removes the first element of URL and leaving ONLY the variables (e.g., ["18"]) in the array.
                array_shift($matches);

                // create a logic for getting the class-based controller
                // check first if the route controller was passed as an array
                if(is_array($route['controller'])) {

                        // destructure the class and function from the route controller
                        [$class, $function] = $route['controller'];

                        // create a controller instance
                        $controller = new $class();

                        // call the method from controller
                        return $controller->$function(...$matches);

                    }

                return (new $route['controller'])->{$method}(...$matches);

            }
        }

        $this->abort();

        return false;
    }



    protected function abort($code = 404) {
        http_response_code($code);
        die();
    }
}