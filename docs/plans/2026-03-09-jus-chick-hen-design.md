# Jus Chick-Hen Demo Website — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a pitch demo website for Jus Chick-Hen Inc (3602 W 16th St, Chicago) — a full-featured restaurant site with in-house ordering, delivery zone logic, admin dashboard, and 3rd-party review integration. Red/yellow brand palette, mobile-first.

**Architecture:** Single Next.js 16 app with route groups — `(storefront)` for customer-facing and `(admin)` for owner dashboard. Neon PostgreSQL for menu/orders/settings. Zustand for cart. Geocoding API for delivery zone checks. No real payment processing (mock checkout for demo).

**Tech Stack:** Next.js 16.1.6, React 19, Tailwind CSS v4, shadcn/ui, Radix, Neon PostgreSQL, Zustand, Framer Motion, Leaflet (maps), Resend (magic link auth)

---

## Business Data (Verified)

- **Name:** Jus Chick-Hen Inc
- **Address:** 3602 W 16th St, Chicago, IL 60623
- **Phone:** (773) 565-4733
- **Hours:** Mon 12pm-6pm | Tue-Sun 11am-10pm
- **Type:** Take-out only
- **Tagline:** "Home of Jus Chick-Hen Hot Honey Chicken and Hot Honey Catfish"
- **Social:** Facebook @juschickhen | Instagram @juschickhen
- **Listed on:** DoorDash, Grubhub, Seamless, Yelp
- **Brand Colors:** Red (#CC0000) + Yellow (#FFD700)

## Menu Data (Compiled from DoorDash, Grubhub, Yelp, review sites)

### Signature Items
- Hot Honey Chicken (signature) — various piece counts
- Hot Honey Catfish (signature)

### Chicken
| Item | Price |
|------|-------|
| Chick-Hen Mixed Pieces (3pc) | $8.99 |
| Chick-Hen Mixed Pieces (5pc) | $13.99 |
| Whole Chick-Hen Wings (6pc) | $8.99 |
| Whole Chick-Hen Wings (10pc) | $14.99 |
| Whole Chick-Hen Wings (15pc) | $19.99 |
| Whole Chick-Hen Wings (25pc) | $32.99 |
| Whole Chick-Hen Wings (50pc) | $59.99 |
| Chicken Tenders (3pc) | $7.99 |
| Chicken Tenders (5pc) | $11.99 |

### Seafood
| Item | Price |
|------|-------|
| Catfish Dinner | $13.99 |
| Hot Honey Catfish Dinner | $14.99 |
| Shrimp Dinner | $12.99 |
| Fish Sandwich | $8.99 |
| Wings & Fish Combo | $15.99 |

### Sandwiches
| Item | Price |
|------|-------|
| Jus Chick-Hen Sandwich | $9.99 |
| Jus Chick-Hen Sandwich Combo | $12.99 |
| Philly Chicken Sandwich | $9.99 |
| Philly Chicken Sandwich Combo | $12.99 |
| Jus Fish Sandwich | $8.99 |
| Cheeseburger | $7.99 |
| Double Cheeseburger | $10.99 |

### Specialty Eggrolls
| Item | Price |
|------|-------|
| Alfredo Eggroll | $5.99 |
| Italian Beef Eggroll | $5.99 |
| Philly Eggroll | $5.99 |
| Jerk Eggroll | $5.99 |

### Pizza (14")
| Item | Price |
|------|-------|
| Jerk Alfredo Pizza | $17.99 |
| Italian Beef Pizza | $17.99 |
| Buffalo Chicken Pizza | $17.99 |

### Specials
| Item | Price |
|------|-------|
| Fried Jerk Chicken Tacos (3pc) | $10.99 |
| Pizza Puff | $3.99 |

### Sides & Drinks
| Item | Price |
|------|-------|
| French Fries (Regular) | $3.99 |
| French Fries (Large) | $5.99 |
| Coleslaw | $2.99 |
| Can Soda | $1.50 |
| Bottle Water | $1.50 |
| Juice | $2.50 |

### Sauces
| Item | Price |
|------|-------|
| Hot Honey Sauce | $1.99 |
| Mild Sauce | Free |
| Hot Sauce | Free |
| BBQ Sauce | $0.50 |
| Ranch | $0.50 |

---

## Implementation Tasks

### Task 1: Project Scaffold
Scaffold from sacred-geometry-template. Configure brand.ts with red/yellow palette. Set up package.json with all dependencies.

**Files:**
- Copy: `_sacred-geometry-template/` → `jus-chick-hen/`
- Modify: `src/config/brand.ts` — Jus Chick-Hen brand config
- Modify: `src/app/globals.css` — red/yellow @theme tokens
- Modify: `src/lib/fonts.ts` — display font (Oswald for bold headings)
- Modify: `package.json` — add zustand, leaflet, @neondatabase/serverless, nanoid, resend

**Step 1:** Copy template files
**Step 2:** Update brand.ts with restaurant identity
**Step 3:** Update globals.css with red/yellow color system
**Step 4:** Install dependencies: `pnpm add zustand @neondatabase/serverless nanoid resend react-leaflet leaflet @types/leaflet`
**Step 5:** Verify `pnpm dev` starts without errors
**Step 6:** Commit: "feat: scaffold jus-chick-hen from template"

### Task 2: Database Schema & Seed Data
Set up Neon DB tables: menu_categories, menu_items, orders, order_items, customers, settings. Seed with real menu data.

**Files:**
- Create: `src/lib/db.ts` — lazy Neon connection + table init
- Create: `src/lib/shared/types.ts` — all TypeScript interfaces
- Create: `src/lib/shared/constants.ts` — auth config, delivery defaults
- Create: `src/lib/seed.ts` — seed menu data from verified business info

**Tables:**
1. `menu_categories` — id, name, description, sort_order, is_active
2. `menu_items` — id, category_id, name, description, price_cents, image_url, is_available, is_featured, variants (JSONB), sort_order
3. `customers` — id, email, phone, name, address, lat, lng, created_at
4. `orders` — id, customer_id, status, type (pickup/delivery), subtotal, delivery_fee, tax, total, address, notes, created_at, updated_at
5. `order_items` — id, order_id, menu_item_id, name, price_cents, quantity, variant, notes
6. `settings` — key, value (delivery_radius_miles, delivery_fee_cents, tax_rate, min_order_cents, store_open)
7. `auth_tokens` — email, token, expires_at, used_at
8. `sessions` — email, session_token, is_admin, expires_at

**Step 1:** Create db.ts with lazy getDb() and all CREATE TABLE functions
**Step 2:** Create types.ts with interfaces for all tables + API payloads
**Step 3:** Create constants.ts with auth config and delivery defaults
**Step 4:** Create seed.ts with all verified menu items
**Step 5:** Create `src/app/api/seed/route.ts` for one-click seeding
**Step 6:** Commit: "feat: database schema and seed data"

### Task 3: Auth System
Magic link auth for customers + simple password admin auth.

**Files:**
- Create: `src/lib/auth.ts` — magic link token creation/validation
- Create: `src/lib/session.ts` — session management, dual-cookie pattern
- Create: `src/proxy.ts` — route protection for /admin
- Create: `src/app/(storefront)/auth/login/page.tsx` — customer login
- Create: `src/app/(storefront)/auth/verify/page.tsx` — magic link verify
- Create: `src/app/(admin)/login/page.tsx` — admin login (password)
- Create: `src/app/api/auth/magic-link/route.ts`
- Create: `src/app/api/auth/verify/route.ts`
- Create: `src/app/api/auth/admin-login/route.ts`
- Create: `src/app/api/auth/session/route.ts`
- Create: `src/app/api/auth/logout/route.ts`

### Task 4: Storefront — Hero & Landing Page
The main page with hero section, featured menu items, hours, location map, reviews carousel, and CTA.

**Files:**
- Modify: `src/app/(storefront)/page.tsx` — landing page
- Create: `src/components/storefront/HeroSection.tsx` — full-bleed hero with Hot Honey Chicken imagery
- Create: `src/components/storefront/FeaturedMenu.tsx` — 6 signature items grid
- Create: `src/components/storefront/LocationSection.tsx` — map + address + hours
- Create: `src/components/storefront/ReviewsCarousel.tsx` — Yelp/review testimonials
- Create: `src/components/storefront/OrderCTA.tsx` — "Order Now" / "View Menu" CTAs
- Create: `src/components/layout/StorefrontNavbar.tsx` — branded nav
- Create: `src/components/layout/StorefrontFooter.tsx` — footer with social links
- Create: `src/app/(storefront)/layout.tsx` — storefront layout wrapper

### Task 5: Menu Page
Full interactive menu with category filtering, item details, and add-to-cart.

**Files:**
- Create: `src/app/(storefront)/menu/page.tsx` — menu page (server component, fetch from DB)
- Create: `src/components/storefront/MenuCategoryTabs.tsx` — horizontal scrollable category tabs
- Create: `src/components/storefront/MenuItemCard.tsx` — card with image, name, description, price, add button
- Create: `src/components/storefront/MenuItemModal.tsx` — detail modal with quantity, variant, notes
- Create: `src/app/api/menu/route.ts` — GET menu items (grouped by category)
- Create: `src/stores/cart.ts` — Zustand cart store (items, add, remove, update, clear, totals)

### Task 6: Cart & Checkout Flow
Cart sidebar/page, delivery vs pickup toggle, address validation with zone check, mock payment.

**Files:**
- Create: `src/components/storefront/CartDrawer.tsx` — slide-out cart drawer
- Create: `src/components/storefront/CartItem.tsx` — individual cart line item
- Create: `src/app/(storefront)/checkout/page.tsx` — checkout page
- Create: `src/components/storefront/DeliveryToggle.tsx` — pickup vs delivery selector
- Create: `src/components/storefront/AddressInput.tsx` — address with geocoding
- Create: `src/components/storefront/DeliveryZoneCheck.tsx` — in-range/out-of-range UI
- Create: `src/components/storefront/OutOfRangeRedirect.tsx` — DoorDash/Grubhub links
- Create: `src/components/storefront/OrderSummary.tsx` — subtotal, tax, delivery fee, total
- Create: `src/components/storefront/MockPayment.tsx` — payment form UI (no real processing)
- Create: `src/app/(storefront)/order-confirmation/page.tsx` — success page
- Create: `src/app/api/orders/route.ts` — POST create order, GET list orders
- Create: `src/app/api/delivery/check-zone/route.ts` — address geocoding + distance calc
- Create: `src/lib/geo.ts` — Haversine distance calculation, geocoding helper

### Task 7: Admin Dashboard
Order management, menu editor, delivery settings, business info.

**Files:**
- Create: `src/app/(admin)/layout.tsx` — admin layout with sidebar
- Create: `src/app/(admin)/dashboard/page.tsx` — overview (today's orders, revenue, popular items)
- Create: `src/app/(admin)/orders/page.tsx` — order list with status management
- Create: `src/app/(admin)/menu/page.tsx` — menu item CRUD
- Create: `src/app/(admin)/delivery/page.tsx` — radius config with map preview
- Create: `src/app/(admin)/settings/page.tsx` — hours, contact, social links editor
- Create: `src/components/admin/AdminSidebar.tsx` — navigation sidebar
- Create: `src/components/admin/OrderCard.tsx` — order with status buttons
- Create: `src/components/admin/MenuItemForm.tsx` — add/edit menu item form
- Create: `src/components/admin/DeliveryZoneMap.tsx` — Leaflet map with radius circle
- Create: `src/components/admin/StatsCards.tsx` — summary stat cards
- Create: `src/app/api/admin/orders/route.ts` — order management endpoints
- Create: `src/app/api/admin/orders/[id]/route.ts` — update order status
- Create: `src/app/api/admin/menu/route.ts` — menu CRUD
- Create: `src/app/api/admin/menu/[id]/route.ts` — individual menu item
- Create: `src/app/api/admin/settings/route.ts` — settings CRUD
- Create: `src/app/api/admin/stats/route.ts` — dashboard statistics

### Task 8: Mobile Optimization & Polish
Ensure all pages are mobile-first responsive. Add animations, loading states, empty states.

**Files:**
- Review and adjust all components for mobile breakpoints
- Add Framer Motion entrance animations
- Add loading skeletons for menu/orders
- Add empty state illustrations
- Test on mobile viewport sizes
- Optimize images with next/image
- Add PWA manifest for "Add to Home Screen"

### Task 9: SEO & Meta
Restaurant schema markup, Open Graph, meta tags.

**Files:**
- Modify: `src/app/(storefront)/layout.tsx` — metadata
- Create: `src/components/seo/RestaurantJsonLd.tsx` — Restaurant schema.org markup
- Add: Open Graph images, favicon, apple-touch-icon

---

## Delivery Zone Logic (Detail)

```
1. Customer selects "Delivery" → address input appears
2. Client-side: geocode address via Nominatim (free) or Mapbox
3. API: Calculate Haversine distance from restaurant (41.8584, -87.7148) to customer coords
4. If distance ≤ settings.delivery_radius_miles:
   → Show "Delivery available!" + delivery fee
   → Proceed to checkout
5. If distance > radius:
   → Show "Outside our delivery area"
   → Display DoorDash + Grubhub buttons with direct links
   → Option: "Order for Pickup instead?"
```

## Brand Color System

```
Primary Red: #CC0000 (brand red)
Primary Red Light: #FF1A1A
Primary Red Dark: #990000
Accent Yellow: #FFD700 (brand gold/yellow)
Accent Yellow Light: #FFE44D
Accent Yellow Dark: #CCA600
Background: #FFFDF5 (warm cream)
Surface: #FFF8E7 (light warm)
Dark BG: #1A0A00 (dark warm brown)
Text: #1A1A1A
Text Muted: #666666
```
