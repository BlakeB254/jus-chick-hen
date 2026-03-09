import { neon } from "@neondatabase/serverless";
import { nanoid } from "nanoid";
import { initTables } from "./db";
import { DELIVERY_DEFAULTS, TAX_RATE } from "./shared/constants";

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set. Create a .env file with your Neon connection string.");
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);

  console.log("Initializing tables...");
  await initTables();

  console.log("Clearing existing data...");
  await sql`DELETE FROM order_items`;
  await sql`DELETE FROM orders`;
  await sql`DELETE FROM menu_items`;
  await sql`DELETE FROM menu_categories`;
  await sql`DELETE FROM settings`;

  console.log("Seeding categories...");
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

  console.log("Seeding menu items...");
  const items = [
    // Signature
    { cat: "Signature", name: "Hot Honey Chicken (3pc)", price: 1099, featured: true, desc: "Our signature crispy chicken drizzled with hot honey sauce" },
    { cat: "Signature", name: "Hot Honey Chicken (5pc)", price: 1599, featured: true, desc: "5 pieces of our famous hot honey chicken" },
    { cat: "Signature", name: "Hot Honey Catfish Dinner", price: 1499, featured: true, desc: "Golden catfish filets with our signature hot honey glaze, served with fries and coleslaw" },

    // Chicken
    { cat: "Chicken", name: "Chick-Hen Mixed Pieces (3pc)", price: 899, desc: "3 pieces of crispy fried mixed chicken" },
    { cat: "Chicken", name: "Chick-Hen Mixed Pieces (5pc)", price: 1399, desc: "5 pieces of crispy fried mixed chicken" },
    { cat: "Chicken", name: "Whole Chick-Hen Wings (6pc)", price: 899, featured: true, desc: "6 whole crispy fried chicken wings" },
    { cat: "Chicken", name: "Whole Chick-Hen Wings (10pc)", price: 1499, desc: "10 whole crispy fried chicken wings" },
    { cat: "Chicken", name: "Whole Chick-Hen Wings (15pc)", price: 1999, desc: "15 whole crispy fried chicken wings" },
    { cat: "Chicken", name: "Whole Chick-Hen Wings (25pc)", price: 3299, desc: "25 whole crispy fried chicken wings — party size" },
    { cat: "Chicken", name: "Whole Chick-Hen Wings (50pc)", price: 5999, desc: "50 whole crispy fried chicken wings — catering size" },
    { cat: "Chicken", name: "Chicken Tenders (3pc)", price: 799, desc: "3 golden crispy chicken tenders" },
    { cat: "Chicken", name: "Chicken Tenders (5pc)", price: 1199, desc: "5 golden crispy chicken tenders" },

    // Seafood
    { cat: "Seafood", name: "Catfish Dinner", price: 1399, desc: "Golden fried catfish served with fries and coleslaw" },
    { cat: "Seafood", name: "Shrimp Dinner", price: 1299, desc: "Crispy fried shrimp served with fries and coleslaw" },
    { cat: "Seafood", name: "Fish Sandwich", price: 899, desc: "Crispy fried fish fillet on a toasted bun" },
    { cat: "Seafood", name: "Wings & Fish Combo", price: 1599, featured: true, desc: "Wings and fish fillet combo with fries" },

    // Sandwiches
    { cat: "Sandwiches", name: "Jus Chick-Hen Sandwich", price: 999, featured: true, desc: "Our signature crispy chicken sandwich" },
    { cat: "Sandwiches", name: "Jus Chick-Hen Sandwich Combo", price: 1299, desc: "Signature chicken sandwich with fries and drink" },
    { cat: "Sandwiches", name: "Philly Chicken Sandwich", price: 999, desc: "Philly-style chicken sandwich with peppers and onions" },
    { cat: "Sandwiches", name: "Philly Chicken Sandwich Combo", price: 1299, desc: "Philly chicken sandwich with fries and drink" },
    { cat: "Sandwiches", name: "Jus Fish Sandwich", price: 899, desc: "Crispy fish sandwich" },
    { cat: "Sandwiches", name: "Cheeseburger", price: 799, desc: "Classic cheeseburger" },
    { cat: "Sandwiches", name: "Double Cheeseburger", price: 1099, desc: "Double patty cheeseburger" },

    // Specialty Eggrolls
    { cat: "Specialty Eggrolls", name: "Alfredo Eggroll", price: 599, featured: true, desc: "Creamy alfredo chicken stuffed eggroll" },
    { cat: "Specialty Eggrolls", name: "Italian Beef Eggroll", price: 599, desc: "Italian beef stuffed eggroll — Chicago style" },
    { cat: "Specialty Eggrolls", name: "Philly Eggroll", price: 599, desc: "Philly cheesesteak stuffed eggroll" },
    { cat: "Specialty Eggrolls", name: "Jerk Eggroll", price: 599, desc: "Jerk chicken stuffed eggroll" },

    // Pizza
    { cat: "Pizza", name: "Jerk Alfredo Pizza", price: 1799, desc: '14" pizza with jerk chicken and alfredo sauce' },
    { cat: "Pizza", name: "Italian Beef Pizza", price: 1799, desc: '14" pizza loaded with Italian beef' },
    { cat: "Pizza", name: "Buffalo Chicken Pizza", price: 1799, desc: '14" pizza with buffalo chicken' },

    // Specials
    { cat: "Specials", name: "Fried Jerk Chicken Tacos (3pc)", price: 1099, desc: "3 crispy jerk chicken tacos" },
    { cat: "Specials", name: "Pizza Puff", price: 399, desc: "Classic Chicago pizza puff" },

    // Sides & Drinks
    { cat: "Sides & Drinks", name: "French Fries (Regular)", price: 399, desc: "Golden crispy french fries" },
    { cat: "Sides & Drinks", name: "French Fries (Large)", price: 599, desc: "Large order of golden french fries" },
    { cat: "Sides & Drinks", name: "Coleslaw", price: 299, desc: "Creamy coleslaw" },
    { cat: "Sides & Drinks", name: "Can Soda", price: 150, desc: "Assorted can sodas" },
    { cat: "Sides & Drinks", name: "Bottle Water", price: 150, desc: "Bottled water" },
    { cat: "Sides & Drinks", name: "Juice", price: 250, desc: "Assorted juice" },

    // Sauces
    { cat: "Sauces", name: "Hot Honey Sauce", price: 199, desc: "Our signature hot honey sauce" },
    { cat: "Sauces", name: "Mild Sauce", price: 0, desc: "Classic mild sauce" },
    { cat: "Sauces", name: "Hot Sauce", price: 0, desc: "Hot sauce" },
    { cat: "Sauces", name: "BBQ Sauce", price: 50, desc: "BBQ dipping sauce" },
    { cat: "Sauces", name: "Ranch", price: 50, desc: "Ranch dipping sauce" },
  ];

  let sortOrder = 0;
  for (const item of items) {
    await sql`INSERT INTO menu_items (id, category_id, name, description, price_cents, is_featured, sort_order)
      VALUES (${nanoid()}, ${catMap[item.cat]}, ${item.name}, ${item.desc}, ${item.price}, ${item.featured ?? false}, ${sortOrder++})`;
  }

  console.log("Seeding settings...");
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

  console.log(`Seeded ${categories.length} categories, ${items.length} menu items, ${settings.length} settings.`);
  console.log("Done!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
