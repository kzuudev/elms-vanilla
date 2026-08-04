<?php


namespace App\Contracts;

interface LeaveRequestInterface {

    public function store(array $input, int $user_id, string $role): void;

    public function index(int $user_id, string $role, ?string $department): void;

    public function show(int $id, int $user_id, string $role): void;

    public function patch(int $id, int $user_id, string $role, array $input): void;

    public function destroy(int $id, int $user_id, string $role): void;

}
