<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LogoutTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_logs_out_an_authenticated_user(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->withHeader('Origin', 'http://localhost')
            ->postJson('/api/logout');

        $response->assertNoContent();
        $this->assertGuest('web');
    }
}
