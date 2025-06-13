<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Noted;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class NotedController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $notes = Noted::query()
        ->when($search, function ($query,$search){
            $query->where('header','like',"%{$search}%")
           -> orWhere('content','like', "%{$search}%");
        })->get();
        //
        return Inertia::render('Notes',  [
            'notes' => $notes,
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
                'content' => 'required|string'
            ]
        );
        Noted::create([
            'header' => $request->header,
            'content' => $request->content,
            'user_id' => Auth::id(), // ← pastikan ini dikirim
        ]);

        return redirect()->route('notes.index')->with('success', 'data berhasil ditambahkan');
    }

    // /**
    //  * Display the specified resource.
    //  */
    // public function show(string $id)
    // {
    //     //
    // }

    // /**
    //  * Show the form for editing the specified resource.
    //  */
    // public function edit(string $id)
    // {
    //     //
    // }

    // /**
    //  * Update the specified resource in storage.
    //  */
    public function update(Request $request, Noted $note)
    {
        // dd('MASUK UPDATE', $request->all());
        // dd($note);
        if (!$note) {
            abort(404, 'note not found');
        }

        logger('Before update:', ['id' => $note->id, 'user_id' => $note->user_id]);



        $validate =  $request->validate(
            [
                'header' => 'required|string|max:50',
                'content' => 'required|string'
            ]
        );
        logger('Before update:', $note->toArray());
        $note->update($validate);
        if ($note->save()) {
            logger('After update:', $note->toArray());
        } else {
            logger('Gagal menyimpan noted');
        }

        return redirect()->route('notes.index')->with('success', 'data berhasil diedit');

        //
    }

    // /**
    //  * Remove the specified resource from storage.
    //  */
    public function destroy(Noted $note)
    {
        $note->delete();
        return redirect()->route('notes.index')->with('success', 'data berhasil dihapus');
        
        //
    }
}
