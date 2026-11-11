import { pgTable, serial, integer, text, doublePrecision, boolean, timestamp, index, uniqueIndex } from "drizzle-orm/pg-core";

const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();

// Key/value store for server-generated settings (e.g. the token signing secret)
export const appSettings = pgTable("app_settings", {
  key: text().primaryKey(),
  value: text().notNull(),
});

export const users = pgTable("users", {
  id: serial().primaryKey(),
  username: text().notNull().unique(),
  email: text().notNull().unique(),
  hashed_password: text("hashed_password").notNull(),
  full_name: text("full_name").notNull().default("Fitness Enthusiast"),
  daily_calorie_target: doublePrecision("daily_calorie_target").notNull().default(2200),
  daily_protein_target: doublePrecision("daily_protein_target").notNull().default(110),
  daily_carb_target: doublePrecision("daily_carb_target").notNull().default(250),
  daily_fat_target: doublePrecision("daily_fat_target").notNull().default(60),
  daily_fiber_target: doublePrecision("daily_fiber_target").notNull().default(32),
  daily_budget_inr: doublePrecision("daily_budget_inr").notNull().default(180),
  dietary_preference: text("dietary_preference").notNull().default("all"),
  preferred_cuisine: text("preferred_cuisine").notNull().default("South Indian & Tamil"),
  allergies: text().notNull().default(""),
  cooking_equipment: text("cooking_equipment").notNull().default("Stove, Pan, Pressure Cooker"),
  available_cooking_time: integer("available_cooking_time").notNull().default(30),
  created_at: createdAt(),
});

const num = (name: string) => doublePrecision(name).notNull().default(0);

export const foodItems = pgTable("food_items", {
  id: integer().primaryKey(),
  name: text().notNull(),
  category: text().notNull(),
  is_recipe: boolean("is_recipe").notNull().default(false),
  serving_size: text("serving_size").notNull(),
  serving_weight_g: doublePrecision("serving_weight_g").notNull().default(100),
  weight_status: text("weight_status").notNull().default("cooked"),
  dietary_type: text("dietary_type").notNull().default("vegetarian"),
  calories: num("calories"),
  protein: num("protein"),
  carbs: num("carbs"),
  fats: num("fats"),
  fiber: num("fiber"),
  sugar: num("sugar"),
  added_sugar: num("added_sugar"),
  mufa: num("mufa"),
  pufa: num("pufa"),
  omega3: num("omega3"),
  omega6: num("omega6"),
  saturated_fat: num("saturated_fat"),
  trans_fat: num("trans_fat"),
  cholesterol_mg: num("cholesterol_mg"),
  sodium_mg: num("sodium_mg"),
  potassium_mg: num("potassium_mg"),
  calcium_mg: num("calcium_mg"),
  iron_mg: num("iron_mg"),
  vitamin_a_mcg: num("vitamin_a_mcg"),
  vitamin_c_mg: num("vitamin_c_mg"),
  vitamin_d_iu: num("vitamin_d_iu"),
  vitamin_b12_mcg: num("vitamin_b12_mcg"),
  magnesium_mg: num("magnesium_mg"),
  cost_per_serving_inr: num("cost_per_serving_inr"),
  cost_per_100g_inr: num("cost_per_100g_inr"),
  cost_per_10g_protein_inr: num("cost_per_10g_protein_inr"),
  prep_time_minutes: integer("prep_time_minutes").notNull().default(10),
  cooking_time_minutes: integer("cooking_time_minutes").notNull().default(15),
  difficulty: text().notNull().default("Easy"),
  cuisine: text().notNull().default("South Indian"),
  main_ingredients: text("main_ingredients").notNull().default("[]"),
  recipe_instructions: text("recipe_instructions").notNull().default("[]"),
  budget_substitutions: text("budget_substitutions").notNull().default("[]"),
  cooking_tips: text("cooking_tips").notNull().default(""),
  nutrition_source: text("nutrition_source").notNull().default("ICMR-NIN Indian Food Composition Tables (IFCT 2017)"),
  confidence_score: doublePrecision("confidence_score").notNull().default(0.95),
  image_url: text("image_url").notNull().default(""),
}, (t) => [index("food_items_category_idx").on(t.category)]);

export const savedRecipes = pgTable("saved_recipes", {
  id: serial().primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  food_item_id: integer("food_item_id").notNull().references(() => foodItems.id, { onDelete: "cascade" }),
  notes: text().notNull().default(""),
  saved_at: timestamp("saved_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("saved_recipes_user_food_idx").on(t.user_id, t.food_item_id)]);

export const mealPlans = pgTable("meal_plans", {
  id: serial().primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text().notNull().default("Personalized Budget 7-Day Plan"),
  target_calories: doublePrecision("target_calories").notNull().default(2000),
  target_protein: doublePrecision("target_protein").notNull().default(100),
  daily_budget_inr: doublePrecision("daily_budget_inr").notNull().default(180),
  plan_json: text("plan_json").notNull(),
  is_active: boolean("is_active").notNull().default(true),
  created_at: createdAt(),
}, (t) => [index("meal_plans_user_idx").on(t.user_id)]);

export const shoppingListItems = pgTable("shopping_list_items", {
  id: serial().primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  item_name: text("item_name").notNull(),
  quantity: text().notNull().default("100g"),
  estimated_cost_inr: doublePrecision("estimated_cost_inr").notNull().default(0),
  category: text().notNull().default("General"),
  is_checked: boolean("is_checked").notNull().default(false),
  created_at: createdAt(),
}, (t) => [index("shopping_list_items_user_idx").on(t.user_id)]);

export const dailyLogItems = pgTable("daily_log_items", {
  id: serial().primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  log_date: text("log_date").notNull(),
  meal_type: text("meal_type").notNull(),
  food_name: text("food_name").notNull(),
  serving_amount: doublePrecision("serving_amount").notNull().default(1),
  serving_unit: text("serving_unit").notNull().default("serving"),
  calories: num("calories"),
  protein: num("protein"),
  carbs: num("carbs"),
  fats: num("fats"),
  fiber: num("fiber"),
  sugar: num("sugar"),
  sodium_mg: num("sodium_mg"),
  saturated_fat: num("saturated_fat"),
  created_at: createdAt(),
}, (t) => [index("daily_log_items_user_date_idx").on(t.user_id, t.log_date)]);

export const dailyWaterLogs = pgTable("daily_water_logs", {
  id: serial().primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  log_date: text("log_date").notNull(),
  glasses: integer().notNull().default(0),
  ml: integer().notNull().default(0),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("daily_water_logs_user_date_idx").on(t.user_id, t.log_date)]);

export const scanHistory = pgTable("scan_history", {
  id: serial().primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  identified_food: text("identified_food").notNull(),
  confidence: doublePrecision().notNull().default(0.9),
  portion_weight_g: doublePrecision("portion_weight_g").notNull().default(100),
  calories: num("calories"),
  protein: num("protein"),
  carbs: num("carbs"),
  fats: num("fats"),
  fiber: num("fiber"),
  uncertainty_note: text("uncertainty_note").notNull().default("Estimated from standard portion reference."),
  scanned_at: timestamp("scanned_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("scan_history_user_idx").on(t.user_id)]);
