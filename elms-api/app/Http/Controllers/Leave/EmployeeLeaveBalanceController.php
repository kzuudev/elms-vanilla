<?php



namespace App\Http\Controllers\Leave;
use App\Http\Middleware\Auth;
use Core\App;
use Core\Database;

class EmployeeLeaveBalanceController {


    public function index () {

        $db = App::resolve(Database::class);
        $currentUser = Auth::authenticate();

        $role = $currentUser['role'];

        // only admin and managers are allowed to view at OTHER employees balance
//        if($role !== 'admin' && $role !== 'manager') {
//            http_response_code(403);
//            echo json_encode(['error' => 'Forbidden: Only admins and managers can view leave balances']);
//            exit;
//        }

        if(!$role) {
            http_response_code(401);
            echo json_encode(['error' => 'Forbidden: User not found']);
            exit;
        }

        $balances = $db->query("
           SELECT
                lb.used_days,
                lb.remaining_balance,
                lb.allocated_days as total_days,
                lt.name as leave_type
           FROM leave_balance lb
           LEFT JOIN leave_types lt ON lb.leave_type_id = lt.id
           WHERE lb.user_id = :user_id
        ", [
            'user_id' => $currentUser['id'],
        ])->all();

        $structuredBalances = [];

        foreach ($balances as $balance) {
            if (!empty($balance['leave_type'])) {
                $structuredBalances[] = [
                    'leave_type'        => $balance['leave_type'],
                    'remaining_balance' => (float)$balance['remaining_balance'],
                    'used_days'         => (float)$balance['used_days'],
                    'total_days'        => (float)$balance['total_days']
                ];
            }
        }


        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Leave balances fetched successfully',
            'id' => $currentUser['id'],
            'balances' => $structuredBalances
        ]);


    }
}






?>