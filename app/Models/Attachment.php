<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Attachment extends Model{protected $guarded=[]; public function inquiry(){return $this->belongsTo(Inquiry::class);}}
