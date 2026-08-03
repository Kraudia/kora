<?php

namespace Tests\Feature\FamilyTree;

use App\Models\FamilyTree;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShowFamilyTreeTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_view_a_family_tree(): void
    {
        $familyTree = $this->createFamilyTree();

        $this->getJson("/api/family-trees/{$familyTree->slug}")
            ->assertUnauthorized();
    }

    public function test_member_can_view_a_family_tree_by_slug_with_their_role(): void
    {
        $user = User::factory()->create();
        $familyTree = $this->createFamilyTree();
        $user->familyTrees()->attach($familyTree, ['role' => 'editor']);

        $response = $this->actingAs($user)
            ->getJson("/api/family-trees/{$familyTree->slug}");

        $response
            ->assertOk()
            ->assertJsonPath('family_tree.id', $familyTree->id)
            ->assertJsonPath('family_tree.name', 'Rodzina Kowalskich')
            ->assertJsonPath('family_tree.slug', 'rodzina-kowalskich')
            ->assertJsonPath('family_tree.role', 'editor')
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
    }

    public function test_non_member_cannot_view_a_family_tree(): void
    {
        $user = User::factory()->create();
        $familyTree = $this->createFamilyTree();

        $this->actingAs($user)
            ->getJson("/api/family-trees/{$familyTree->slug}")
            ->assertForbidden();
    }

    public function test_unknown_family_tree_slug_returns_not_found(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->getJson('/api/family-trees/nieistniejace-drzewo')
            ->assertNotFound();
    }

    private function createFamilyTree(): FamilyTree
    {
        $creator = User::factory()->create();

        $familyTree = FamilyTree::create([
            'name' => 'Rodzina Kowalskich',
            'slug' => 'rodzina-kowalskich',
            'created_by' => $creator->id,
        ]);

        $creator->familyTrees()->attach($familyTree, ['role' => 'owner']);

        return $familyTree;
    }
}
