<?php


namespace App\Http\Forms;

use Core\Validator;

class RegisterForm {


    protected $errors;


    public function validate($first_name, $last_name, $email, $phone, $role, $assigned_to) {

        if(!Validator::string($first_name, 3, 20)) {

            $this->errors['first_name'] = 'First Name is required and  must be between 3 and 20 characters';
        }

        if(!Validator::string($last_name, 3, 20)) {

            $this->errors['last_name'] = 'Last Name is required and  must be between 3 and 20 characters';
        }

        if(!Validator::phone($phone)) {

            $this->errors['phone'] = 'Phone number is required and must be a valid phone number';
        }


        if(!Validator::string($email, 3, 20)) {

            $this->errors['email'] = 'Email is required must be between 3 and 20 characters';
        }

        if(!Validator::string($role, 1, 50)) {

            $this->errors['role'] = 'Role is required';

        }

        // assigned_to is a users.id (manager), not a long string label
        if($assigned_to === '' || $assigned_to === null || !ctype_digit((string) $assigned_to)) {

            $this->errors['assigned_to'] = 'Assigned manager is required';
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