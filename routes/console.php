<?php
use Illuminate\Support\Facades\{Artisan,Hash};
use App\Models\User;
Artisan::command('studio:admin',function(){
 $name=$this->ask('Administrator name');$email=$this->ask('Email');$password=$this->secret('Password (at least 12 characters)');$confirm=$this->secret('Confirm password');
 $validator=validator(compact('name','email','password'),['name'=>'required|string|max:120','email'=>'required|email|unique:users,email','password'=>'required|string|min:12']);if($validator->fails()||$password!==$confirm){$this->error('Invalid details or password confirmation mismatch.');return 1;}
 User::create(['name'=>$name,'email'=>$email,'password'=>Hash::make($password),'role'=>'admin']);$this->info('Administrator created.');return 0;
})->purpose('Create an administrator without a default password');
