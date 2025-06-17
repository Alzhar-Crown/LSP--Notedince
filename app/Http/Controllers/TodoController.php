<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;
use Inertia\Inertia;

class TodoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $todos = Todo::where('user_id',Auth::id())
        ->when($search, function ($query,$search){
            $query->where('header','like',"%{$search}%");
        })->get();
        //
        
        return Inertia::render('Todo',  [
            'todo' => $todos,
            'search' => $search,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $request->validate(
            [
                'header' => 'required|string|max:50',
            ]
        );
        Todo::create([
            'header' => $request->header,
            'user_id' => Auth::id(), // ← pastikan ini dikirim
        ]);

        return redirect()->route('todo.index')->with('success', 'data berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
   public function update(Request $request, Todo $todo)
    {
        // dd('MASUK UPDATE', $request->all());
        // dd($note);
        if (!$todo) {
            abort(404, 'todo not found');
        }

        logger('Before update:', ['id' => $todo->id, 'user_id' => $todo->user_id]);



        $validate =  $request->validate(
            [
                'header' => 'required|string|max:50',
            ]
        );
        logger('Before update:', $todo->toArray());
        $todo->update($validate);
        if ($todo->save()) {
            logger('After update:', $todo->toArray());
        } else {
            logger('Gagal menyimpan todo');
        }

        return redirect()->route('todo.index')->with('success', 'data berhasil diedit');

        //
    }
    /**
     * Remove the specified resource from storage.
     */
   public function destroy(Todo $todo)
    {
        $todo->delete();
        return redirect()->route('todo.index')->with('success', 'data berhasil dihapus');
        
        //
    }

    public function deleteAll()
    {
        Todo::Truncate();
        return redirect()->route('todo.index')->with('success', 'Semua data berhasil dihapus');
        
        //
    }
}
