<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\FamilyTreeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/family-trees', [FamilyTreeController::class, 'index']);
    Route::post('/family-trees', [FamilyTreeController::class, 'store']);
});
