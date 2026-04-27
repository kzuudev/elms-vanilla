<?php


namespace App\Http\Forms;

use Core\Validator;


class LoginForm {

    protected $errors;


    public function validate($email, $password) {

        if(!Validator::email($email)) {
            $this->errors['email'] = 'Email is not a valid email address';
        }

        if(!Validator::string($email, 3, 100)) {
            $this->errors['email'] = 'Email is required';
        }

        if(!Validator::string($password)) {
            $this->errors['password'] = 'Password is required';
        }

        return empty($this->errors);
    }

    public function errors() {
        return $this->errors;
    }

}