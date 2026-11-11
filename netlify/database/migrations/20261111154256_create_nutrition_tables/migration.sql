CREATE TABLE "app_settings" (
	"key" text PRIMARY KEY,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_log_items" (
	"id" serial PRIMARY KEY,
	"user_id" integer NOT NULL,
	"log_date" text NOT NULL,
	"meal_type" text NOT NULL,
	"food_name" text NOT NULL,
	"serving_amount" double precision DEFAULT 1 NOT NULL,
	"serving_unit" text DEFAULT 'serving' NOT NULL,
	"calories" double precision DEFAULT 0 NOT NULL,
	"protein" double precision DEFAULT 0 NOT NULL,
	"carbs" double precision DEFAULT 0 NOT NULL,
	"fats" double precision DEFAULT 0 NOT NULL,
	"fiber" double precision DEFAULT 0 NOT NULL,
	"sugar" double precision DEFAULT 0 NOT NULL,
	"sodium_mg" double precision DEFAULT 0 NOT NULL,
	"saturated_fat" double precision DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_water_logs" (
	"id" serial PRIMARY KEY,
	"user_id" integer NOT NULL,
	"log_date" text NOT NULL,
	"glasses" integer DEFAULT 0 NOT NULL,
	"ml" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "food_items" (
	"id" integer PRIMARY KEY,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"is_recipe" boolean DEFAULT false NOT NULL,
	"serving_size" text NOT NULL,
	"serving_weight_g" double precision DEFAULT 100 NOT NULL,
	"weight_status" text DEFAULT 'cooked' NOT NULL,
	"dietary_type" text DEFAULT 'vegetarian' NOT NULL,
	"calories" double precision DEFAULT 0 NOT NULL,
	"protein" double precision DEFAULT 0 NOT NULL,
	"carbs" double precision DEFAULT 0 NOT NULL,
	"fats" double precision DEFAULT 0 NOT NULL,
	"fiber" double precision DEFAULT 0 NOT NULL,
	"sugar" double precision DEFAULT 0 NOT NULL,
	"added_sugar" double precision DEFAULT 0 NOT NULL,
	"mufa" double precision DEFAULT 0 NOT NULL,
	"pufa" double precision DEFAULT 0 NOT NULL,
	"omega3" double precision DEFAULT 0 NOT NULL,
	"omega6" double precision DEFAULT 0 NOT NULL,
	"saturated_fat" double precision DEFAULT 0 NOT NULL,
	"trans_fat" double precision DEFAULT 0 NOT NULL,
	"cholesterol_mg" double precision DEFAULT 0 NOT NULL,
	"sodium_mg" double precision DEFAULT 0 NOT NULL,
	"potassium_mg" double precision DEFAULT 0 NOT NULL,
	"calcium_mg" double precision DEFAULT 0 NOT NULL,
	"iron_mg" double precision DEFAULT 0 NOT NULL,
	"vitamin_a_mcg" double precision DEFAULT 0 NOT NULL,
	"vitamin_c_mg" double precision DEFAULT 0 NOT NULL,
	"vitamin_d_iu" double precision DEFAULT 0 NOT NULL,
	"vitamin_b12_mcg" double precision DEFAULT 0 NOT NULL,
	"magnesium_mg" double precision DEFAULT 0 NOT NULL,
	"cost_per_serving_inr" double precision DEFAULT 0 NOT NULL,
	"cost_per_100g_inr" double precision DEFAULT 0 NOT NULL,
	"cost_per_10g_protein_inr" double precision DEFAULT 0 NOT NULL,
	"prep_time_minutes" integer DEFAULT 10 NOT NULL,
	"cooking_time_minutes" integer DEFAULT 15 NOT NULL,
	"difficulty" text DEFAULT 'Easy' NOT NULL,
	"cuisine" text DEFAULT 'South Indian' NOT NULL,
	"main_ingredients" text DEFAULT '[]' NOT NULL,
	"recipe_instructions" text DEFAULT '[]' NOT NULL,
	"budget_substitutions" text DEFAULT '[]' NOT NULL,
	"cooking_tips" text DEFAULT '' NOT NULL,
	"nutrition_source" text DEFAULT 'ICMR-NIN Indian Food Composition Tables (IFCT 2017)' NOT NULL,
	"confidence_score" double precision DEFAULT 0.95 NOT NULL,
	"image_url" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meal_plans" (
	"id" serial PRIMARY KEY,
	"user_id" integer NOT NULL,
	"title" text DEFAULT 'Personalized Budget 7-Day Plan' NOT NULL,
	"target_calories" double precision DEFAULT 2000 NOT NULL,
	"target_protein" double precision DEFAULT 100 NOT NULL,
	"daily_budget_inr" double precision DEFAULT 180 NOT NULL,
	"plan_json" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saved_recipes" (
	"id" serial PRIMARY KEY,
	"user_id" integer NOT NULL,
	"food_item_id" integer NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"saved_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scan_history" (
	"id" serial PRIMARY KEY,
	"user_id" integer NOT NULL,
	"identified_food" text NOT NULL,
	"confidence" double precision DEFAULT 0.9 NOT NULL,
	"portion_weight_g" double precision DEFAULT 100 NOT NULL,
	"calories" double precision DEFAULT 0 NOT NULL,
	"protein" double precision DEFAULT 0 NOT NULL,
	"carbs" double precision DEFAULT 0 NOT NULL,
	"fats" double precision DEFAULT 0 NOT NULL,
	"fiber" double precision DEFAULT 0 NOT NULL,
	"uncertainty_note" text DEFAULT 'Estimated from standard portion reference.' NOT NULL,
	"scanned_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shopping_list_items" (
	"id" serial PRIMARY KEY,
	"user_id" integer NOT NULL,
	"item_name" text NOT NULL,
	"quantity" text DEFAULT '100g' NOT NULL,
	"estimated_cost_inr" double precision DEFAULT 0 NOT NULL,
	"category" text DEFAULT 'General' NOT NULL,
	"is_checked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY,
	"username" text NOT NULL UNIQUE,
	"email" text NOT NULL UNIQUE,
	"hashed_password" text NOT NULL,
	"full_name" text DEFAULT 'Fitness Enthusiast' NOT NULL,
	"daily_calorie_target" double precision DEFAULT 2200 NOT NULL,
	"daily_protein_target" double precision DEFAULT 110 NOT NULL,
	"daily_carb_target" double precision DEFAULT 250 NOT NULL,
	"daily_fat_target" double precision DEFAULT 60 NOT NULL,
	"daily_fiber_target" double precision DEFAULT 32 NOT NULL,
	"daily_budget_inr" double precision DEFAULT 180 NOT NULL,
	"dietary_preference" text DEFAULT 'all' NOT NULL,
	"preferred_cuisine" text DEFAULT 'South Indian & Tamil' NOT NULL,
	"allergies" text DEFAULT '' NOT NULL,
	"cooking_equipment" text DEFAULT 'Stove, Pan, Pressure Cooker' NOT NULL,
	"available_cooking_time" integer DEFAULT 30 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "daily_log_items_user_date_idx" ON "daily_log_items" ("user_id","log_date");--> statement-breakpoint
CREATE UNIQUE INDEX "daily_water_logs_user_date_idx" ON "daily_water_logs" ("user_id","log_date");--> statement-breakpoint
CREATE INDEX "food_items_category_idx" ON "food_items" ("category");--> statement-breakpoint
CREATE INDEX "meal_plans_user_idx" ON "meal_plans" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "saved_recipes_user_food_idx" ON "saved_recipes" ("user_id","food_item_id");--> statement-breakpoint
CREATE INDEX "scan_history_user_idx" ON "scan_history" ("user_id");--> statement-breakpoint
CREATE INDEX "shopping_list_items_user_idx" ON "shopping_list_items" ("user_id");--> statement-breakpoint
ALTER TABLE "daily_log_items" ADD CONSTRAINT "daily_log_items_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "daily_water_logs" ADD CONSTRAINT "daily_water_logs_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "meal_plans" ADD CONSTRAINT "meal_plans_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "saved_recipes" ADD CONSTRAINT "saved_recipes_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "saved_recipes" ADD CONSTRAINT "saved_recipes_food_item_id_food_items_id_fkey" FOREIGN KEY ("food_item_id") REFERENCES "food_items"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "scan_history" ADD CONSTRAINT "scan_history_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "shopping_list_items" ADD CONSTRAINT "shopping_list_items_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;