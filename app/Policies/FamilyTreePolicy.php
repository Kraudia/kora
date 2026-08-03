<?php

namespace App\Policies;

use App\Models\FamilyTree;
use App\Models\User;

class FamilyTreePolicy
{
    /**
     * Determine whether the user can view the family tree.
     */
    public function view(User $user, FamilyTree $familyTree): bool
    {
        return $user->familyTrees()
            ->where('family_trees.id', $familyTree->id)
            ->exists();
    }
}
