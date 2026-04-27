<?php


namespace App\Http\Forms;

use Core\Validator;

class RegisterForm {


    protected $errors;


    public function validate($name, $email, $password) {

        if(!Validator::string($name, 3, 20)) {

            $this->errors['name'] = 'Name is required and  must be between 3 and 20 characters';
        }

        if(!Validator::string($email, 3, 20)) {

            $this->errors['email'] = 'Email is required must be between 3 and 20 characters';
        }

        if(!Validator::string($password, 3, 20)) {

            $this->errors['password'] = 'password is required must be between 3 and 20 characters';

        }

        if(!Validator::password($password)) {

            $this->errors['password'] = 'password should be matched with the confirm password';
        }


        return empty($this->errors);

    }

    public function errors() {

        return $this->errors;
    }

    public function hasErrors($field, $message) {

        return $this->errors[$field] = $message;
    }
}