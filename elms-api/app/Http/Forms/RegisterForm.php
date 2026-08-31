<?php

namespace App\Http\Forms;

use Core\Validator;

class RegisterForm
{
    protected array $errors = [];

    public function validate($first_name, $last_name, $email, $phone, $role, $department = null, $salary = null, $assigned_to = null): bool
    {
        $this->errors = [];

        if (!Validator::string($first_name, 3, 20)) {
            $this->errors['first_name'] = 'First Name is required and must be between 3 and 20 characters';
        }

        if (!Validator::string($last_name, 3, 20)) {
            $this->errors['last_name'] = 'Last Name is required and must be between 3 and 20 characters';
        }

        if (!Validator::phone($phone)) {
            $this->errors['phone'] = 'Phone number is required and must be a valid phone number';
        }

        if (!Validator::email($email) || !Validator::string($email, 3, 100)) {
            $this->errors['email'] = 'Email is required and must be a valid email address';
        }

        if (!Validator::string($role, 1, 50)) {
            $this->errors['role'] = 'Role is required and must be a valid role';
        }

        if ($role === 'super-admin' && !Validator::string($department, 1, 50)) {
            $this->errors['department'] = 'Department is not a valid department';
        }

        if (!Validator::numeric($salary, 1, 50)) {
            $this->errors['salary'] = 'Salary is not a valid number';
        }

        // Optional for some roles; if provided must be numeric id
        if ($assigned_to !== '' && $assigned_to !== null && !is_numeric($assigned_to)) {
            $this->errors['assigned_to'] = 'Assigned manager must be a valid manager id';
        }

        return empty($this->errors);
    }

    public function errors(): array
    {
        return $this->errors;
    }

    public function hasErrors($field, $message)
    {
        return $this->errors[$field] = $message;
    }
}
