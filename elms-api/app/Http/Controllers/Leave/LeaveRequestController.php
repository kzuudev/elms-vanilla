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

    
}
