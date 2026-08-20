<?php

namespace App\Services\leaves;

use Core\App;
use Core\Database;
use App\Http\Middleware\Auth;
use App\Exceptions\domain\NotFoundException;
use App\Exceptions\domain\ForbiddenException;

class LeaveTypeService {

    private Database $db;
    private ?array $current_user;

    public function __construct() {
        $this->db = App::resolve(Database::class);
        $this->current_user = Auth::user();
    }

    public function getLeaveTypes() {

        if($this->current_user['role'] !== 'super-admin') {
            throw new ForbiddenException('You are not authorized to access this resource');
        }

        $leave_types = $this->db->query("
            SELECT * FROM leave_types WHERE deleted_at IS NULL
            ORDER BY created_at DESC
        ", [])->all();

        return $leave_types;
    }

    public function createLeaveType(string $name, int $allocated_days, bool $is_paid) {

        if($this->current_user['role'] !== 'super-admin') {
            throw new ForbiddenException('You are not authorized to create a leave type');
        }

        $create_leave_type = $this->db->query("
            INSERT INTO leave_types (name, allocated_days, is_paid) VALUES (:name, :allocated_days, :is_paid)
        ", [
            'name' => $name,
            'allocated_days' => $allocated_days,
            'is_paid' => $is_paid
        ])->lastInsertId();

        return $create_leave_type;

    }

    public function getLeaveType(int $id) {

        if($this->current_user['role'] !== 'super-admin') {
            throw new ForbiddenException('You are not authorized to view a leave type details');
        }

        $leave_type = $this->db->query("
            SELECT * FROM leave_types WHERE id = :id AND deleted_at IS NULL        
        ", ['id' => $id])->find();

        if(!$leave_type) {
            throw new NotFoundException('Leave type not found');
        }

        return $leave_type;

    }

    public function updateLeaveType(int $id, string $name, int $allocated_days, bool $is_paid) {

        if($this->current_user['role'] !== 'super-admin') {
            throw new ForbiddenException('You are not authorized to update a leave type');
        }

        $update_leave_type = $this->db->query("
            UPDATE leave_types SET name = :name, allocated_days = :allocated_days, is_paid = :is_paid WHERE id = :id AND deleted_at IS NULL
        ", [
            'id' => $id,
            'name' => $name,
            'allocated_days' => $allocated_days,
            'is_paid' => $is_paid
        ])->lastInsertId();

        if(!$update_leave_type) {
            throw new NotFoundException('Leave type not found');
        }

        return $update_leave_type;

    }

    public function deleteLeaveType(int $id) {

        if($this->current_user['role'] !== 'super-admin') {
            throw new ForbiddenException('You are not authorized to delete a leave type');
        }

        $delete_leave_type = $this->db->query("
            UPDATE leave_types SET deleted_at = NOW() WHERE id = :id AND deleted_at IS NULL
        ", ['id' => $id]);

        if(!$delete_leave_type) {
            throw new NotFoundException('Leave type not found');
        }

        return $delete_leave_type;

    }
}