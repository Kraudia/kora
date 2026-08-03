<?php

namespace Tests\Feature\FamilyTree;

use App\Models\FamilyTree;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ListFamilyTreesTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_list_family_trees(): void
    {
        $this->getJson('/api/family-trees')->assertUnauthorized();
    }

    public function test_user_sees_only_family_trees_they_belong_to_with_their_roles(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $ownedTree = FamilyTree::create([
            'name' => 'Rodzina Kowalskich',
            'slug' => 'rodzina-kowalskich',
            'created_by' => $user->id,
        ]);
        $sharedTree = FamilyTree::create([
            'name' => 'Rodzina Nowaków',
            'slug' => 'rodzina-nowakow',
            'created_by' => $otherUser->id,
        ]);
        $otherTree = FamilyTree::create([
            'name' => 'Rodzina Wiśniewskich',
            'slug' => 'rodzina-wisniewskich',
            'created_by' => $otherUser->id,
        ]);

        $user->familyTrees()->attach($ownedTree, ['role' => 'owner']);
        $user->familyTrees()->attach($sharedTree, ['role' => 'viewer']);
        $otherUser->familyTrees()->attach($sharedTree, ['role' => 'owner']);
        $otherUser->familyTrees()->attach($otherTree, ['role' => 'owner']);

        $response = $this->actingAs($user)->getJson('/api/family-trees');

        $response
            ->assertOk()
            ->assertJsonCount(2, 'family_trees')
            ->assertJsonPath('family_trees.0.id', $ownedTree->id)
            ->assertJsonPath('family_trees.0.role', 'owner')
            ->assertJsonPath('family_trees.1.id', $sharedTree->id)
            ->assertJsonPath('family_trees.1.role', 'viewer')
            ->assertJsonMissing([
                'id' => $otherTree->id,
            ])
            ->assertJsonStructure([
                'family_trees' => [
                    '*' => [
                        'id',
                        'name',
                        'slug',
                        'role',
                        'created_at',
                        'updated_at',
                    ],
                ],
            ]);
    }
}
