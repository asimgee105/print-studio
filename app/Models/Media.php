<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Media extends Model{protected $table='media';protected $guarded=[];protected function casts():array{return ['caption'=>'array','alt'=>'array','approved'=>'boolean'];}public function mediaUrl():string{return $this->disk==='local'?url('/admin/media/'.$this->id.'/file'):asset($this->path);}public function posterUrl():?string{return $this->poster?($this->disk==='local'?url('/admin/media/'.$this->id.'/poster'):asset($this->poster)):null;}public function text(string $field):string{return $this->$field[app()->getLocale()]??$this->$field['en']??'';}}
