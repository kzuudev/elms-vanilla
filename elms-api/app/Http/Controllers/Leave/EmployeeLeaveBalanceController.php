<?php



namespace App\Http\Controllers\Leave;
use App\Http\Middleware\Auth;
use Core\App;
use Core\Database;

class EmployeeLeaveBalanceController {

    private Database $db;
    private Auth $auth;

    public function __construct() {
        $this->db = App::resolve(Database::class);
        $this->auth = App::resolve(Auth::class);
    }

    public function index () {

        $current_user = $this->auth->user();

        if(!$current_user || !$current_user['token']) {
            $this->db->response(401, false, 'Unauthorized: No token provided');
            exit;
        }

        if(!in_array($current_user['role'], ['admin', 'manager', $current_user['role']])) {
            $this->db->response(403, false, 'Forbidden: You are not authorized to view this page');
            exit;
        }

        $balances = $this->db->query("
           SELECT
                lb.used_days,
                lb.remaining_balance,
                lb.allocated_days as total_days,
                lt.name as leave_type
           FROM leave_balance lb
           LEFT JOIN leave_types lt ON lb.leave_type_id = lt.id
           WHERE lb.user_id = :user_id
        ", [
            'user_id' => $current_user['id'],
        ])->all();

        $structured_balances = [];

        foreach ($balances as $balance) {
            if (!empty($balance['leave_type'])) {
                $structured_balances[] = [
                    'leave_type'        => $balance['leave_type'],
                    'remaining_balance' => (float)$balance['remaining_balance'],
                    'used_days'         => (float)$balance['used_days'],
                    'total_days'        => (float)$balance['total_days']
                ];
            }
        }


        $this->db->response(200, true, 'Leave balances fetched successfully', [
            'id' => $current_user['id'],
            'balances' => $structured_balances
        ]);


    }
}





?>
