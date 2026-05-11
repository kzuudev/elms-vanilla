<?php



namespace App\Http\Forms;


use Core\Validator;


class LeaveRequestForm {

    protected $errors;

    public function validate($type, $start_date, $end_date, $reason) {

        if(!Validator::type($type)) {
            $this->errors['leave_type'] = 'Leave type is required and must a valid leave type from the list';
        }


        if (!Validator::date($start_date, 'Y-m-d')) {
            $this->errors['start_date'] = 'Start date is required and must be in the format mm/dd/yyyy';
        }

        if (!Validator::date($end_date, 'Y-m-d')) {
            $this->errors['end_date'] = 'End date is required and must be in the format mm/dd/yyyy';
        }

        if(!Validator::string($reason, 1, 100)) {
            $this->errors['reason'] = 'Reason is required and must be at least 1 character';
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