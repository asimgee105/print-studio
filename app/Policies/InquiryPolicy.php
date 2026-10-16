<?php
namespace App\Policies;
use App\Models\{User,Inquiry};
class InquiryPolicy{public function view(User $user,Inquiry $inquiry):bool{return in_array($user->role,['admin','staff'],true);}public function update(User $user,Inquiry $inquiry):bool{return $this->view($user,$inquiry);}}
