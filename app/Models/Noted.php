<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Noted extends Model
{
    //
    protected $fillable=['user_id','header','content'];
}
