<?php

use App\Http\Controllers\NotedController;
use App\Http\Controllers\TodoController;
use App\Models\Noted;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard',[
            'notes' => Noted::where('user_id', Auth::id())->get(),
        ]);
    })->name('dashboard');
});

Route::resource('notes', NotedController::class)->middleware('auth');
Route::resource('todo', TodoController::class)->middleware('auth');
Route::delete('notesD',[NotedController::class,'deleteAll'])->name('deleteAll');
Route::delete('todoD',[TodoController::class,'deleteAll'])->name('deleteAll');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
