<?php

namespace App\Services\leaves;

use Core\App;
use Core\Database;
use App\Exceptions\domain\UnauthorizedException;
use App\Exceptions\domain\NotFoundException;
use App\Http\Middleware\Auth;



class LeaveTypeSummaryService {

    private Database $db;
    private ?array $current_user;
    private Auth $auth;

    public function __construct() {
        $this->db = App::resolve(Database::class);
        $this->auth = App::resolve(Auth::class);
        $this->current_user = $this->auth->user();
    }

    private function validateUser() {
        if($this->current_user['role'] !== 'super-admin' && $this->current_user['role'] !== 'admin') {
            throw new UnauthorizedException('You are not authorized to access this resource');
        }
    }

    public function getTotalLeaveTypes(string $search_leave_type = '') {

        $this->validateUser();

        $query = "
            SELECT COUNT(*) AS total_leave_types 
            FROM leave_types 
            WHERE deleted_at IS NULL
        ";

        $params = [];

        if(!empty($search_leave_type)) {
            $query .= " AND name LIKE :search_leave_type";
            $params['search_leave_type'] = "%$search_leave_type%";
        }

        $total_leave_types = $this->db->query($query, $params)->all();

        return $total_leave_types;

    }

    public function getTotalPaidLeaveTypes() {

        $this->validateUser();

        $total_paid_leave_types = $this->db->query("
            SELECT COUNT(*) AS total_paid_leave_types
            FROM leave_types
            WHERE deleted_at IS NULL AND is_paid = :is_paid
        ", [
            'is_paid' => 1
        ])->all();

        if(!empty($search_leave_type)) {
            
        }

        return $total_paid_leave_types;

    }

    public function getTotalUnpaidLeaveTypes() {

        $this->validateUser();

        $total_unpaid_leave_types = $this->db->query("
            SELECT COUNT(*) AS total_paid_leave_types
            FROM leave_types
            WHERE deleted_at IS NULL AND is_paid = :is_paid
        ", [
            'is_paid' => 0
        ])->all();
        
        return $total_unpaid_leave_types;
    }

    public function getTotalAllocatedLeaveTypes() {

        $this->validateUser();

        $total_allocated_leave_types = $this->db->query("
            SELECT SUM(allocated_days) AS total_allocated_days
            FROM leave_types
            WHERE deleted_at IS NULL
        ")->all();

        return $total_allocated_leave_types;
    }


}