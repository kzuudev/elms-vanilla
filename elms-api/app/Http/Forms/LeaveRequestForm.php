<?php



namespace App\Http\Forms;


use Core\Validator;
use Core\App;
use Core\Database;


class LeaveRequestForm {

    protected $errors;

    private Database $db;

    public function __construct() {
        $this->db = App::resolve(Database::class);
    }

    public function validate($type, $start_date, $end_date, $reason) {

        $this->errors = [];

        $row = $this->db->query("SELECT name FROM leave_types")->all();

        $allowed_types = array_column($row, 'name');

        if($type === '') {
            $this->errors['leave_type'] = 'Leave type is required';
        }else if(!in_array($type, $allowed_types)) {
            $this->errors['leave_type'] = 'Leave type must be a valid leave type from the list.';
        }

        if (!Validator::date($start_date, 'Y-m-d')) {
            $this->errors['start_date'] = 'Start date is required and must be in the format YYYY-MM-DD.';
        }

        if (!Validator::date($end_date, 'Y-m-d')) {
            $this->errors['end_date'] = 'End date is required and must be in the format YYYY-MM-DD.';
        }

        if(!isset($start_date) || !isset($end_date) && $start_date > $end_date) {
            $this->errors['end_date'] = 'End date must be on or after start date.';
        }

        if(!Validator::string($reason, 1, 100)) {
            $this->errors['reason'] = 'Reason is required and must be at least 1 character';
        }

        return empty($this->errors);
    }

    /**
     * Optional GET filters for listing leave requests.
     * Empty values are allowed (no filter). Invalid values are rejected.
     */
    public function validateQuery($type, $start_date, $end_date, $status) {

        $this->errors = [];

        $row = $this->db->query("SELECT name FROM leave_types")->all();
        
        $allowed_types = array_column($row, 'name');
        $allowed_statuses = ['pending', 'approved', 'rejected'];

        if ($type !== '' && !in_array($type, $allowed_types, true)) {
            $this->errors['leave_type'] = 'Leave type must be a valid leave type from the list.';
        }

        if ($start_date !== '' && !Validator::date($start_date, 'Y-m-d')) {
            $this->errors['start_date'] = 'Start date must be in the format YYYY-MM-DD.';
        }

        if ($end_date !== '' && !Validator::date($end_date, 'Y-m-d')) {
            $this->errors['end_date'] = 'End date must be in the format YYYY-MM-DD.';
        }

        if ($start_date !== '' && $end_date !== '' && $start_date > $end_date) {
            $this->errors['end_date'] = 'End date must be on or after start date.';
        }

        if ($status !== '' && $status !== 'all' && !in_array($status, $allowed_statuses, true)) {
            $this->errors['status'] = 'Status must be pending, approved, or rejected.';
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