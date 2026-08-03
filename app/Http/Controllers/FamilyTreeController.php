<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFamilyTreeRequest;
use App\Http\Resources\FamilyTreeResource;
use App\Models\FamilyTree;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class FamilyTreeController extends Controller
{
    public function store(StoreFamilyTreeRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $name = $request->validated('name');

        $familyTree = DB::transaction(function () use ($user, $name): FamilyTree {
            $familyTree = FamilyTree::create([
                'name' => $name,
                'slug' => $this->uniqueSlug($name),
                'created_by' => $user->id,
            ]);

            $user->familyTrees()->attach($familyTree, [
                'role' => 'owner',
            ]);

            return $user->familyTrees()->findOrFail($familyTree->id);
        });

        return response()->json([
            'family_tree' => new FamilyTreeResource($familyTree),
        ], 201);
    }

    private function uniqueSlug(string $name): string
    {
        $baseSlug = Str::slug($name) ?: 'family-tree';
        $slug = $baseSlug;
        $suffix = 2;

        while (FamilyTree::query()->where('slug', $slug)->exists()) {
            $slug = $baseSlug.'-'.$suffix;
            $suffix++;
        }

        return $slug;
    }
}
