<?php

namespace App\Services\leaves;

use Core\App;
use Core\Database;
use App\Exceptions\domain\NotFoundException;
use App\Exceptions\domain\UnauthorizedException;
use App\Http\Middleware\Auth;
use Throwable;

class LeaveTypeService {

    private Database $db;
    private ?array $current_user;

    public function __construct() {
        $this->db = App::resolve(Database::class);
        $this->current_user = Auth::user();
    }

    private function validateUser() {
        if($this->current_user['role'] !== 'super-admin') {
            throw new UnauthorizedException('You are not authorized to access this resource');
        }
    }

    public function getLeaveTypes(int $user_id, string $search_leave_type = '') {

        if($this->current_user['role'] === 'super-admin') {
            $query = "
                SELECT * FROM leave_types
                WHERE deleted_at IS NULL
            ";
            $params = [];

            if(!empty($search_leave_type)) {
                $query .= " AND name LIKE :search_leave_type";
                $params['search_leave_type'] = "%$search_leave_type%";
            }

            $query .= " ORDER BY name ASC";

            return $this->db->query($query, $params)->all();
        }

        $query = "
            SELECT * FROM leave_types WHERE deleted_at IS NULL AND allocated_days > 0
            AND id IN (
                SELECT leave_type_id
                FROM leave_balance
                WHERE user_id = :user_id
            )
        ";
        $params = ['user_id' => $user_id];

        if(!empty($search_leave_type)) {
            $query .= " AND name LIKE :search_leave_type";
            $params['search_leave_type'] = "%$search_leave_type%";
        }

        return $this->db->query($query, $params)->all();
    }

    public function createLeaveType(string $name, int $allocated_days, bool $is_paid) {

        $this->validateUser();

        $this->db->beginTransaction();

        try{  
            $create_leave_type = $this->db->query("
            INSERT INTO leave_types (name, allocated_days, is_paid) VALUES (:name, :allocated_days, :is_paid)
                ", [
                'name' => $name,
                'allocated_days' => $allocated_days,
                'is_paid' => $is_paid
            ]);

        $this->db->commit();
        return $create_leave_type;

        }catch(Throwable $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    public function getLeaveType(int $id) {

        $this->validateUser();

        $leave_type = $this->db->query("
            SELECT * FROM leave_types WHERE id = :id AND deleted_at IS NULL        
        ", ['id' => $id])->find();

        if(!$leave_type) {
            throw new NotFoundException('Leave type not found');
        }

        return $leave_type;

    }

    public function updateLeaveType(int $id, string $name, int $allocated_days, bool $is_paid) {

        $this->validateUser();

        try{
            $this->db->beginTransaction();

            $update_leave_type = $this->db->query("
                UPDATE leave_types SET name = :name, allocated_days = :allocated_days, is_paid = :is_paid WHERE id = :id AND deleted_at IS NULL
                ", [
                'id' => $id,
                'name' => $name,
                'allocated_days' => $allocated_days,
                'is_paid' => $is_paid
            ]);

            if(!$update_leave_type) {
                throw new NotFoundException('Leave type not found');
            }

            $this->db->commit();
            return true;
        }catch(Throwable $e) {
            $this->db->rollBack();
            throw $e;
        }


    }

    public function deleteLeaveType(int $id) {

        $this->validateUser();

        try{
            $this->db->beginTransaction();

            $delete_leave_type = $this->db->query("
            UPDATE leave_types SET deleted_at = NOW() WHERE id = :id AND deleted_at IS NULL
        ", ['id' => $id]);

        if(!$delete_leave_type) {
            throw new NotFoundException('Leave type not found');
        }

            $this->db->commit();
            return true;
        }catch(Throwable $e) {
            $this->db->rollBack();
            throw $e;
        }

    }
}