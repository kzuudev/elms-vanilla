<?php

namespace App\Http\Forms;

use Core\Validator;

class EmployeeForm
{
    protected array $errors = [];

    public function validate(
        $first_name,
        $last_name,
        $email,
        $phone,
        $role,
        $department,
        $salary,
        $assigned_to,
        $is_active,
        $hired_date
    ): bool {
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
            $this->errors['role'] = 'Role is required';
        }

        if (!Validator::string($department, 1, 50)) {
            $this->errors['department'] = 'Department is required';
        }

        if ($salary === '' || $salary === null || !is_numeric($salary) || (float) $salary < 0) {
            $this->errors['salary'] = 'Salary is required and must be a valid number';
        }

        // Optional: null/'' allowed; if present must be a positive integer id
        if ($assigned_to !== null && $assigned_to !== '') {
            if (!is_numeric($assigned_to) || (int) $assigned_to <= 0) {
                $this->errors['assigned_to'] = 'Assigned manager must be a valid manager id';
            }
        }

        $hired_date = is_string($hired_date) ? substr($hired_date, 0, 10) : $hired_date;
        
        if (!Validator::date($hired_date, 'Y-m-d')) {
            $this->errors['hired_date'] = 'Hired date is required and must be in the format YYYY-MM-DD';
        }

        if (!in_array($is_active, [0, 1, '0', '1'], true)) {
            $this->errors['is_active'] = 'Is active must be 0 or 1';
        }

        return empty($this->errors);
    }

    public function errors(): array
    {
        return $this->errors;
    }
}
