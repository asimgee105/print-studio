<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
 public function up(): void {
 Schema::table('users',fn(Blueprint $t)=>$t->string('role')->default('staff'));
 Schema::create('entries',function(Blueprint $t){$t->id();$t->string('type')->index();$t->string('slug')->unique();$t->json('title');$t->json('body');$t->json('meta')->nullable();$t->boolean('published')->default(false);$t->boolean('featured')->default(false);$t->integer('sort_order')->default(0);$t->timestamps();});
 Schema::create('settings',function(Blueprint $t){$t->string('key')->primary();$t->text('value')->nullable();});
 Schema::create('media',function(Blueprint $t){$t->id();$t->string('path');$t->string('poster')->nullable();$t->string('kind');$t->string('disk')->default('public');$t->json('caption');$t->json('alt');$t->boolean('approved')->default(false);$t->timestamps();});
 Schema::create('inquiries',function(Blueprint $t){$t->id();$t->string('reference')->unique();$t->string('name');$t->string('company')->nullable();$t->string('phone');$t->string('email')->nullable();$t->string('city');$t->string('area');$t->string('service');$t->string('product')->nullable();$t->decimal('width',10,2)->nullable();$t->decimal('height',10,2)->nullable();$t->string('unit');$t->unsignedInteger('quantity');$t->string('usage');$t->boolean('installation');$t->date('requested_date')->nullable();$t->text('description');$t->json('configuration')->nullable();$t->json('basket')->nullable();$t->boolean('consent');$t->string('status')->default('New')->index();$t->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();$t->text('notes')->nullable();$t->string('notification_status')->default('not_configured');$t->timestamps();});
 Schema::create('attachments',function(Blueprint $t){$t->id();$t->foreignId('inquiry_id')->constrained()->cascadeOnDelete();$t->string('path');$t->string('name');$t->string('mime');$t->timestamps();});
 Schema::create('status_histories',function(Blueprint $t){$t->id();$t->foreignId('inquiry_id')->constrained()->cascadeOnDelete();$t->foreignId('user_id')->nullable()->constrained()->nullOnDelete();$t->string('status');$t->timestamps();});
 Schema::create('quotations',function(Blueprint $t){$t->id();$t->foreignId('inquiry_id')->constrained()->cascadeOnDelete();$t->json('items');$t->unsignedBigInteger('subtotal_cents');$t->unsignedBigInteger('discount_cents')->default(0);$t->unsignedBigInteger('delivery_cents')->default(0);$t->unsignedBigInteger('installation_cents')->default(0);$t->decimal('tax_rate',5,2)->default(0);$t->unsignedBigInteger('tax_cents')->default(0);$t->unsignedBigInteger('total_cents');$t->date('valid_until');$t->text('terms');$t->timestamps();});
 }
 public function down(): void {foreach(['quotations','status_histories','attachments','inquiries','media','settings','entries'] as $table)Schema::dropIfExists($table);Schema::table('users',fn(Blueprint $t)=>$t->dropColumn('role'));}
};
