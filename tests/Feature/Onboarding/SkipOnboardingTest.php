<?php

namespace Tests\Feature\Onboarding;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SkipOnboardingTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_skip_onboarding(): void
    {
        $this->postJson('/api/onboarding/skip')->assertUnauthorized();
    }

    public function test_user_can_skip_onboarding(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('/api/onboarding/skip');

        $response
            ->assertOk()
            ->assertJsonPath('user.id', $user->id)
            ->assertJsonStructure([
                'user' => [
                    'onboarding_skipped_at',
                ],
            ]);

        $this->assertNotNull($response->json('user.onboarding_skipped_at'));
        $this->assertNotNull($user->fresh()->onboarding_skipped_at);
    }
}
