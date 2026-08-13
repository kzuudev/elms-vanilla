<?php

namespace App\Http\Controllers\Leave;

use Core\Database;
use Core\App;
use App\Http\Middleware\Auth;


class LeaveTypesController {

    private Database $db;
    private Auth $auth;

    public function __construct() {
        $this->db = App::resolve(Database::class);
        $this->auth = App::resolve(Auth::class);
    }

    /**
     * Leave types for the filter bar and leave request form
     */

    public function index() {

        $user = Auth::user();
        $user_id = (int) ($user['id'] ?? 0);

        if (!$user_id) {
            $this->db->response(401, false, 'Unauthorized');
            return;
        }

        $rows = $this->db->query(
            "SELECT id, name
            FROM leave_types
            WHERE default_allocated_days > 0
            AND id IN (
                SELECT leave_type_id
                FROM leave_balance
                WHERE user_id = :user_id
            )",
            ['user_id' => $user_id]
        )->all();

        if(!$rows) {
            $this->db->response(404, false, 'No leave types found');
            return;
        }

        $this->db->response(200, true, 'Leave types fetched successfully', ['leave_types' => $rows ?: []]);
        return $rows ?: [];
    }



}