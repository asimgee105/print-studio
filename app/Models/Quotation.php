<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Quotation extends Model{protected $guarded=[];protected function casts():array{return ['items'=>'array'];} public function inquiry(){return $this->belongsTo(Inquiry::class);}}
