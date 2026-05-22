-- StepTrendy Supabase Schema
-- Run this in Supabase SQL Editor

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT,
  google_id TEXT UNIQUE,
  role TEXT DEFAULT 'user' CHECK (role IN ('user','admin','staff','vendor','super_admin')),
  avatar TEXT,
  phone TEXT,
  addresses JSONB DEFAULT '[]',
  wishlist UUID[] DEFAULT '{}',
  is_verified BOOLEAN DEFAULT false,
  otp TEXT,
  otp_expire TIMESTAMPTZ,
  reset_password_token TEXT,
  reset_password_expire TIMESTAMPTZ,
  refresh_token TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- 2. CATEGORIES
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  brand TEXT,
  stock INTEGER DEFAULT 0,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  gender TEXT DEFAULT 'unisex' CHECK (gender IN ('men','women','unisex','kids')),
  images JSONB DEFAULT '[]',
  sizes JSONB DEFAULT '[]',
  colors JSONB DEFAULT '[]',
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  is_on_sale BOOLEAN DEFAULT false,
  sale_end_date TIMESTAMPTZ,
  ratings JSONB DEFAULT '{"average":0,"count":0}',
  sales_count INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','draft','archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_trending ON products(is_trending) WHERE is_trending = true;
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_price ON products(price);

-- 4. ORDERS
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  order_number TEXT UNIQUE NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  shipping_address JSONB,
  billing_address JSONB,
  subtotal DECIMAL(10,2) DEFAULT 0,
  shipping DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  coupon_code TEXT,
  total DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled','returned','refunded')),
  payment_info JSONB DEFAULT '{}',
  return_request JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- 5. ORDER ITEMS
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  image TEXT,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  size TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PAYMENTS
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  stripe_payment_intent_id TEXT,
  transaction_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  method TEXT CHECK (method IN ('card','upi','cod','net_banking','wallet','stripe')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','success','failed','refunded','awaiting_verification')),
  screenshot TEXT,
  upi_id TEXT,
  qr_code TEXT,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. COUPONS
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percentage','fixed')),
  discount DECIMAL(10,2) NOT NULL,
  min_amount DECIMAL(10,2) DEFAULT 0,
  max_discount DECIMAL(10,2),
  max_uses INTEGER DEFAULT 100,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  valid_until TIMESTAMPTZ NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. REVIEWS
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_product ON reviews(product_id);

-- 9. NOTIFICATIONS
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'info' CHECK (type IN ('info','warning','success','error')),
  is_read BOOLEAN DEFAULT false,
  target_audience TEXT DEFAULT 'all' CHECK (target_audience IN ('all','users','admins')),
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. BANNERS
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  subtitle TEXT,
  image TEXT,
  link TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. HERO SECTIONS
CREATE TABLE hero_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL DEFAULT 'Step Into Luxury Fashion',
  subtitle TEXT,
  cta_text TEXT DEFAULT 'Shop Now',
  cta_link TEXT DEFAULT '/products',
  secondary_cta_text TEXT DEFAULT 'Explore Collection',
  secondary_cta_link TEXT DEFAULT '/products?category=sneakers',
  badge TEXT DEFAULT 'AI-Powered Fashion Recommendations',
  background_image TEXT,
  overlay_color TEXT DEFAULT 'from-blue-600/30 to-cyan-500/30',
  is_active BOOLEAN DEFAULT true
);

-- 12. ADVERTISEMENTS
CREATE TABLE advertisements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  image TEXT,
  link TEXT DEFAULT '#',
  position TEXT NOT NULL CHECK (position IN ('homepage_banner','homepage_popup','sidebar','floating_bottom','product_page','checkout_page')),
  type TEXT DEFAULT 'banner' CHECK (type IN ('banner','popup','sidebar','floating','video')),
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  clicks INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. SETTINGS
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (key, value) VALUES
  ('site_name', '"StepTrendy"'),
  ('currency', '"INR"'),
  ('currency_symbol', '"₹"'),
  ('free_shipping_threshold', '999'),
  ('shipping_cost', '99'),
  ('tax_rate', '18'),
  ('maintenance_mode', 'false'),
  ('enable_reviews', 'true'),
  ('enable_wishlist', 'true'),
  ('enable_ai_recommendations', 'true');

-- 14. UPI CONFIGS
CREATE TABLE upi_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  upi_id TEXT NOT NULL,
  account_name TEXT NOT NULL,
  bank_name TEXT,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can read own data
CREATE POLICY "Users read own" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own" ON users FOR UPDATE USING (auth.uid() = id);

-- Products publicly readable
CREATE POLICY "Products public read" ON products FOR SELECT USING (status = 'active');
CREATE POLICY "Admins manage products" ON products FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Orders: users see own, admins see all
CREATE POLICY "Orders user read" ON orders FOR SELECT USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Orders user create" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
