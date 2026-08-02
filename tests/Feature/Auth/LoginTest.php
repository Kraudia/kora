<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_authenticates_a_user_with_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'jan@example.com',
            'password' => 'sekretne-haslo',
        ]);

        $response = $this->withHeader('Origin', 'http://localhost')->postJson('/api/login', [
            'email' => 'jan@example.com',
            'password' => 'sekretne-haslo',
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('user.id', $user->id)
            ->assertJsonPath('user.email', 'jan@example.com')
            ->assertJsonMissingPath('user.password');

        $this->assertAuthenticatedAs($user);
    }

    public function test_it_rejects_invalid_credentials(): void
    {
        User::factory()->create([
            'email' => 'jan@example.com',
            'password' => 'sekretne-haslo',
        ]);

        $response = $this->withHeader('Origin', 'http://localhost')->postJson('/api/login', [
            'email' => 'jan@example.com',
            'password' => 'nieprawidlowe-haslo',
        ]);

        $response
            ->assertUnprocessable()
            ->assertExactJson([
                'message' => 'Nieprawidłowy adres e-mail lub hasło.',
            ]);

        $this->assertGuest();
    }
}
