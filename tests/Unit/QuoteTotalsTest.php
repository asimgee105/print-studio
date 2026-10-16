<?php
namespace Tests\Unit;
use PHPUnit\Framework\TestCase;
use App\Services\QuoteTotals;
class QuoteTotalsTest extends TestCase{public function test_currency_rounding_uses_cents():void{$v=QuoteTotals::calculate([['description'=>'Print','quantity'=>3,'price'=>'0.10']],0,0,0,15);$this->assertSame(30,$v['subtotal_cents']);$this->assertSame(5,$v['tax_cents']);$this->assertSame(35,$v['total_cents']);}}
