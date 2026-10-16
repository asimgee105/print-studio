<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Entry extends Model {
 protected $guarded=[];
 protected function casts(): array{return ['title'=>'array','body'=>'array','meta'=>'array','published'=>'boolean','featured'=>'boolean'];}
 public function text(string $field): string{return $this->$field[app()->getLocale()]??$this->$field['en']??'';}
}
