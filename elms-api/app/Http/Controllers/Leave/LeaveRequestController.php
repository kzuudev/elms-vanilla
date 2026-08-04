<?php

namespace App\Http\Controllers\Leave;

use App\Services\leaves\LeaveRequestService;
use App\Http\Middleware\Auth;
use Core\Database;
use Core\App;

class LeaveRequestController
{

    private LeaveRequestService $leaveRequestService;

    private ?array $input = null;

    private int $user_id;
    private string $role;
    private string $department;
    private Database $db;

    public function __construct()
    {
        $this->leaveRequestService = new LeaveRequestService();
        $this->input = json_decode(file_get_contents('php://input'), true) ?? [];
        $this->db = App::resolve(Database::class);
        $user = Auth::user();

        $this->user_id = (int) $user['id'];
        $this->role = (string) $user['role'];
        $this->department = (string) $user['department'];
    }

    public function store(): void
    {
        $this->leaveRequestService->store($this->input, $this->user_id, $this->role);
    }

    public function index(): void
    {
        $this->leaveRequestService->index($this->user_id, $this->role, $this->department);
    }

    public function show($id): void
    {
        $this->leaveRequestService->show($id, $this->user_id, $this->role);
    }

    public function patch($id): void
    {
        $this->leaveRequestService->patch($id, $this->user_id, $this->role, $this->input);
    }

    public function destroy($id): void
    {
        $this->leaveRequestService->destroy($id, $this->user_id, $this->role);
    }

    
    /**
     * Leave types for the filter bar
     */

    public function leaveTypes(): void {

        if (!$this->user_id) {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Unauthorized']);
            return;
        }

        $leave_types = $this->db->query(
        "SELECT id, name FROM leave_types WHERE default_allocated_days > 0")->all();


        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Leave types fetched successfully',
            'leave_types' => $leave_types ?: [],
        ]);
        return;

    }   
}
