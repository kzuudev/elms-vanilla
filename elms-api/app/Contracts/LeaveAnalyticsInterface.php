<?php



namespace App\Contracts;

interface LeaveAnalyticsInterface {

    public function getTeamAvailability(): array;

    public function getMonthlyConsumption(): array;

    public function getBacklogRequests(): array;

    public function getTeamOverlap(): array;

}