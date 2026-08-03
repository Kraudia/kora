<?php

namespace Tests\Feature\FamilyTree;

use App\Models\User;
use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use Tests\TestCase;

class CreateFamilyTreeTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_create_a_family_tree(): void
    {
        $response = $this->postJson('/api/family-trees', [
            'name' => 'Rodzina Kowalskich',
        ]);

        $response->assertUnauthorized();

        $this->assertDatabaseCount('family_trees', 0);
    }

    public function test_user_can_create_a_family_tree(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/family-trees', [
            'name' => 'Rodzina Kowalskich',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('family_tree.name', 'Rodzina Kowalskich')
            ->assertJsonPath('family_tree.slug', 'rodzina-kowalskich')
            ->assertJsonPath('family_tree.role', 'owner')
            ->assertJsonStructure([
                'family_tree' => [
                    'id',
                    'name',
                    'slug',
                    'role',
                    'created_at',
                    'updated_at',
                ],
            ]);

        $this->assertDatabaseHas('family_trees', [
            'name' => 'Rodzina Kowalskich',
            'slug' => 'rodzina-kowalskich',
            'created_by' => $user->id,
        ]);
        $this->assertDatabaseHas('family_tree_user', [
            'family_tree_id' => $response->json('family_tree.id'),
            'user_id' => $user->id,
            'role' => 'owner',
        ]);
    }

    public function test_family_tree_name_is_validated(): void
    {
        $user = User::factory()->create();

        foreach ([null, '', 'A', str_repeat('A', 101), 123] as $name) {
            $response = $this->actingAs($user)->postJson('/api/family-trees', [
                'name' => $name,
            ]);

            $response
                ->assertUnprocessable()
                ->assertJsonValidationErrors('name');
        }

        $this->assertDatabaseCount('family_trees', 0);
    }

    public function test_family_tree_name_is_trimmed(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/family-trees', [
            'name' => '  Rodzina Kowalskich  ',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('family_tree.name', 'Rodzina Kowalskich');

        $this->assertDatabaseHas('family_trees', [
            'name' => 'Rodzina Kowalskich',
        ]);
    }

    public function test_family_tree_slug_gets_a_unique_suffix(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->postJson('/api/family-trees', [
            'name' => 'Rodzina Kowalskich',
        ])->assertCreated();

        $response = $this->actingAs($user)->postJson('/api/family-trees', [
            'name' => 'Rodzina Kowalskich',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('family_tree.slug', 'rodzina-kowalskich-2');

        $this->assertDatabaseHas('family_trees', [
            'slug' => 'rodzina-kowalskich-2',
        ]);
    }

    public function test_family_tree_creation_is_atomic(): void
    {
        $user = User::factory()->create();

        DB::listen(function (QueryExecuted $query): void {
            if (str_starts_with(strtolower(ltrim($query->sql)), 'insert')
                && str_contains($query->sql, 'family_tree_user')) {
                throw new RuntimeException('Membership creation failed.');
            }
        });

        $this->withoutExceptionHandling();

        try {
            $this->actingAs($user)->postJson('/api/family-trees', [
                'name' => 'Rodzina Kowalskich',
            ]);

            $this->fail('The simulated membership failure was not thrown.');
        } catch (RuntimeException $exception) {
            $this->assertSame('Membership creation failed.', $exception->getMessage());
        }

        $this->assertDatabaseCount('family_trees', 0);
        $this->assertDatabaseCount('family_tree_user', 0);
    }
}
