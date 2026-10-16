<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Inquiry extends Model {
 const STATUSES=['New','Contacted','Quoted','Accepted','In Production','Ready','Completed','Cancelled'];
 protected $guarded=[];protected function casts():array{return ['configuration'=>'array','basket'=>'array','installation'=>'boolean','consent'=>'boolean'];}
 public function attachments(){return $this->hasMany(Attachment::class);}public function histories(){return $this->hasMany(StatusHistory::class);}public function quotations(){return $this->hasMany(Quotation::class);}
}
