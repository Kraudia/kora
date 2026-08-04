<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OnboardingController extends Controller
{
    public function skip(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $user->forceFill([
            'onboarding_skipped_at' => now(),
        ])->save();

        return response()->json([
            'user' => $user->fresh(),
        ]);
    }
}
