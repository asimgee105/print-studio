<?php
namespace App\Services;
use Illuminate\Validation\ValidationException;
class QuoteTotals {
 public static function cents(mixed $v):int{return (int)round((float)$v*100);}
 public static function calculate(array $items,int $discount,int $delivery,int $installation,float $tax):array{
 $subtotal=0;foreach($items as &$item){$item['price_cents']=self::cents($item['price']);$item['line_cents']=$item['price_cents']*(int)$item['quantity'];$subtotal+=$item['line_cents'];}unset($item);
 if($discount>$subtotal)throw ValidationException::withMessages(['discount'=>'Discount exceeds subtotal.']);
 $base=$subtotal-$discount+$delivery+$installation;$taxCents=(int)round($base*$tax/100);
 return ['items'=>$items,'subtotal_cents'=>$subtotal,'discount_cents'=>$discount,'delivery_cents'=>$delivery,'installation_cents'=>$installation,'tax_rate'=>$tax,'tax_cents'=>$taxCents,'total_cents'=>$base+$taxCents];
 }
}
