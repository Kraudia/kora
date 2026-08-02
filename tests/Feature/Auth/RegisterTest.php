<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class RegisterTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_registers_and_authenticates_a_user(): void
    {
        $response = $this->withHeader('Origin', 'http://localhost')->postJson('/api/register', [
            'name' => 'Jan Kowalski',
            'email' => 'jan@example.com',
            'password' => 'sekretne-haslo',
            'password_confirmation' => 'sekretne-haslo',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('user.name', 'Jan Kowalski')
            ->assertJsonPath('user.email', 'jan@example.com')
            ->assertJsonMissingPath('user.password');

        $user = User::query()->where('email', 'jan@example.com')->firstOrFail();

        $this->assertAuthenticatedAs($user);
        $this->assertTrue(Hash::check('sekretne-haslo', $user->password));
    }

    public function test_it_rejects_registration_when_email_already_exists(): void
    {
        User::factory()->create([
            'email' => 'jan@example.com',
        ]);

        $response = $this->withHeader('Origin', 'http://localhost')->postJson('/api/register', [
            'name' => 'Jan Kowalski',
            'email' => 'jan@example.com',
            'password' => 'sekretne-haslo',
            'password_confirmation' => 'sekretne-haslo',
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonPath('message', 'Konto z tym adresem e-mail już istnieje.')
            ->assertJsonValidationErrors([
                'email' => 'Konto z tym adresem e-mail już istnieje.',
            ]);

        $this->assertDatabaseCount('users', 1);
    }
}
