<?php

namespace Core;

use Exception;

class Container {

    protected $bindings = [];

    // binding it for callback later
    public function bind($key, $resolver) {
        $this->bindings[$key] = $resolver;
    }


    public function resolve($key) {

        // check if it's already built it, then return it
//        if(isset($this->bindings[$key])) {
//            $instance = ;
//            return $instance;
//        }

        if(!array_key_exists($key, $this->bindings)) {
                throw new Exception("No binding found for {$key}");
        }

        $resolver = $this->bindings[$key];

        // Execute the class, and return the finished object
        return call_user_func($resolver);
    }
}