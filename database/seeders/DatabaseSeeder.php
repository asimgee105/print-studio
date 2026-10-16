<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\{Entry,Setting,Media};
class DatabaseSeeder extends Seeder {
 public function run():void{
 foreach(json_decode(file_get_contents(__DIR__.'/studio-content.json'),true) as $data)Entry::firstOrCreate(['slug'=>$data['slug']],$data);
 foreach(json_decode(file_get_contents(__DIR__.'/studio-media.json'),true) as $data)Media::firstOrCreate(['path'=>$data['path']],$data);
 foreach(['brand_name'=>'Your Brand','tax_enabled'=>'0'] as $key=>$value)Setting::firstOrCreate(['key'=>$key],['value'=>$value]);
 // Intentionally no seeded administrator, customers, testimonials or fabricated counts.
 }
}
