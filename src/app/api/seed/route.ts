import { NextResponse } from "next/server";
import { initTables, getDb } from "@/lib/db";
import { nanoid } from "nanoid";
import { DELIVERY_DEFAULTS, TAX_RATE } from "@/lib/shared/constants";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Seed disabled in production" }, { status: 403 });
  }

  const sql = getDb();

  await initTables();

  // Clear existing data
  await sql`DELETE FROM order_items`;
  await sql`DELETE FROM orders`;
  await sql`DELETE FROM menu_items`;
  await sql`DELETE FROM menu_categories`;
  await sql`DELETE FROM settings`;

  const categories = [
    { id: nanoid(), name: "Signature", description: "Our famous hot honey creations", sort_order: 0 },
    { id: nanoid(), name: "Chicken", description: "Crispy fried chicken pieces and wings", sort_order: 1 },
    { id: nanoid(), name: "Seafood", description: "Fresh catfish, shrimp, and fish", sort_order: 2 },
    { id: nanoid(), name: "Sandwiches", description: "Handcrafted sandwiches and burgers", sort_order: 3 },
    { id: nanoid(), name: "Specialty Eggrolls", description: "Creative stuffed eggrolls", sort_order: 4 },
    { id: nanoid(), name: "Pizza", description: '14" specialty pizzas', sort_order: 5 },
    { id: nanoid(), name: "Specials", description: "Chef specials and limited items", sort_order: 6 },
    { id: nanoid(), name: "Sides & Drinks", description: "Fries, coleslaw, and beverages", sort_order: 7 },
    { id: nanoid(), name: "Sauces", description: "Dipping sauces and extras", sort_order: 8 },
  ];

  for (const cat of categories) {
    await sql`INSERT INTO menu_categories (id, name, description, sort_order) VALUES (${cat.id}, ${cat.name}, ${cat.description}, ${cat.sort_order})`;
  }

  const catMap = Object.fromEntries(categories.map((c) => [c.name, c.id]));

  const items = [
    { cat: "Signature", name: "Hot Honey Chicken (3pc)", price: 1099, featured: true },
    { cat: "Signature", name: "Hot Honey Chicken (5pc)", price: 1599, featured: true },
    { cat: "Signature", name: "Hot Honey Catfish Dinner", price: 1499, featured: true },
    { cat: "Chicken", name: "Chick-Hen Mixed Pieces (3pc)", price: 899 },
    { cat: "Chicken", name: "Chick-Hen Mixed Pieces (5pc)", price: 1399 },
    { cat: "Chicken", name: "Whole Chick-Hen Wings (6pc)", price: 899, featured: true },
    { cat: "Chicken", name: "Whole Chick-Hen Wings (10pc)", price: 1499 },
    { cat: "Chicken", name: "Whole Chick-Hen Wings (15pc)", price: 1999 },
    { cat: "Chicken", name: "Whole Chick-Hen Wings (25pc)", price: 3299 },
    { cat: "Chicken", name: "Whole Chick-Hen Wings (50pc)", price: 5999 },
    { cat: "Chicken", name: "Chicken Tenders (3pc)", price: 799 },
    { cat: "Chicken", name: "Chicken Tenders (5pc)", price: 1199 },
    { cat: "Seafood", name: "Catfish Dinner", price: 1399 },
    { cat: "Seafood", name: "Shrimp Dinner", price: 1299 },
    { cat: "Seafood", name: "Fish Sandwich", price: 899 },
    { cat: "Seafood", name: "Wings & Fish Combo", price: 1599, featured: true },
    { cat: "Sandwiches", name: "Jus Chick-Hen Sandwich", price: 999, featured: true },
    { cat: "Sandwiches", name: "Jus Chick-Hen Sandwich Combo", price: 1299 },
    { cat: "Sandwiches", name: "Philly Chicken Sandwich", price: 999 },
    { cat: "Sandwiches", name: "Philly Chicken Sandwich Combo", price: 1299 },
    { cat: "Sandwiches", name: "Jus Fish Sandwich", price: 899 },
    { cat: "Sandwiches", name: "Cheeseburger", price: 799 },
    { cat: "Sandwiches", name: "Double Cheeseburger", price: 1099 },
    { cat: "Specialty Eggrolls", name: "Alfredo Eggroll", price: 599, featured: true },
    { cat: "Specialty Eggrolls", name: "Italian Beef Eggroll", price: 599 },
    { cat: "Specialty Eggrolls", name: "Philly Eggroll", price: 599 },
    { cat: "Specialty Eggrolls", name: "Jerk Eggroll", price: 599 },
    { cat: "Pizza", name: "Jerk Alfredo Pizza", price: 1799 },
    { cat: "Pizza", name: "Italian Beef Pizza", price: 1799 },
    { cat: "Pizza", name: "Buffalo Chicken Pizza", price: 1799 },
    { cat: "Specials", name: "Fried Jerk Chicken Tacos (3pc)", price: 1099 },
    { cat: "Specials", name: "Pizza Puff", price: 399 },
    { cat: "Sides & Drinks", name: "French Fries (Regular)", price: 399 },
    { cat: "Sides & Drinks", name: "French Fries (Large)", price: 599 },
    { cat: "Sides & Drinks", name: "Coleslaw", price: 299 },
    { cat: "Sides & Drinks", name: "Can Soda", price: 150 },
    { cat: "Sides & Drinks", name: "Bottle Water", price: 150 },
    { cat: "Sides & Drinks", name: "Juice", price: 250 },
    { cat: "Sauces", name: "Hot Honey Sauce", price: 199 },
    { cat: "Sauces", name: "Mild Sauce", price: 0 },
    { cat: "Sauces", name: "Hot Sauce", price: 0 },
    { cat: "Sauces", name: "BBQ Sauce", price: 50 },
    { cat: "Sauces", name: "Ranch", price: 50 },
  ];

  let sortOrder = 0;
  for (const item of items) {
    await sql`INSERT INTO menu_items (id, category_id, name, price_cents, is_featured, sort_order)
      VALUES (${nanoid()}, ${catMap[item.cat]}, ${item.name}, ${item.price}, ${item.featured ?? false}, ${sortOrder++})`;
  }

  const settings = [
    { key: "delivery_radius_miles", value: String(DELIVERY_DEFAULTS.RADIUS_MILES) },
    { key: "delivery_fee_cents", value: String(DELIVERY_DEFAULTS.FEE_CENTS) },
    { key: "tax_rate", value: String(TAX_RATE) },
    { key: "min_order_cents", value: String(DELIVERY_DEFAULTS.MIN_ORDER_CENTS) },
    { key: "store_open", value: "true" },
  ];

  for (const s of settings) {
    await sql`INSERT INTO settings (key, value) VALUES (${s.key}, ${s.value}) ON CONFLICT (key) DO UPDATE SET value = ${s.value}`;
  }

  return NextResponse.json({
    success: true,
    categories: categories.length,
    items: items.length,
    settings: settings.length,
  });
}
