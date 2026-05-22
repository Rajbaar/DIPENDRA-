# StepTrendy — Production Deployment Architecture

## Architecture Overview

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Browser   │────▶│   Vercel     │────▶│  Supabase    │
│  (User)     │     │  (Next.js)   │     │  (PostgreSQL)│
└─────────────┘     │  Edge Network│     │  + Realtime  │
                    └──────┬───────┘     └──────┬───────┘
                           │                    │
                           ▼                    ▼
                    ┌──────────────┐     ┌──────────────┐
                    │   Stripe     │     │   Resend     │
                    │  (Payments)  │     │   (Email)    │
                    └──────────────┘     └──────────────┘
```

## 1. Vercel (Frontend)

**Deployment URL:** `https://steptrendy.vercel.app`

### Setup Steps

1. Push code to GitHub repository
2. Go to [vercel.com](https://vercel.com) → Import GitHub repo
3. Configure:
   - Framework: Next.js
   - Root Directory: `frontend/`
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. Add environment variables (see `.env.example`)
5. Deploy

### Configuration (`vercel.json`)

- Edge regions: `bom1` (Mumbai), `iad1` (US), `hkg1` (Hong Kong)
- Security headers: X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- Image caching: 1 year for `/images/*`
- Serverless function timeout: 30s

### Custom Domain

Add your domain in Vercel dashboard → Project → Domains.
Configure DNS: `CNAME @ → cname.vercel-dns.com`

## 2. Supabase (Database & Backend)

**Dashboard:** `https://supabase.com/dashboard`

### Database Tables

#### `users`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Primary key |
| email | TEXT UNIQUE | User email |
| name | TEXT | Display name |
| password_hash | TEXT | bcrypt hashed |
| google_id | TEXT | Google OAuth |
| role | TEXT | user, admin, staff, vendor |
| avatar | TEXT | Profile image URL |
| phone | TEXT | Phone number |
| addresses | JSONB | Saved addresses |
| wishlist | UUID[] | Product IDs |
| is_verified | BOOLEAN | Email verified |
| created_at | TIMESTAMPTZ | Auto |

#### `products`
| Column | Type |
|--------|------|
| id | UUID (PK) |
| name | TEXT |
| slug | TEXT UNIQUE |
| description | TEXT |
| price | DECIMAL |
| compare_price | DECIMAL |
| brand | TEXT |
| stock | INTEGER |
| category_id | UUID → categories |
| gender | TEXT |
| images | JSONB |
| sizes | JSONB |
| colors | JSONB |
| tags | TEXT[] |
| is_featured | BOOLEAN |
| is_trending | BOOLEAN |
| is_on_sale | BOOLEAN |
| sale_end_date | TIMESTAMPTZ |
| ratings | JSONB |
| sales_count | INTEGER |
| views | INTEGER |
| status | TEXT |
| created_at | TIMESTAMPTZ |

#### `categories`, `orders`, `order_items`, `payments`, `coupons`, `reviews`, `notifications`, `banners`, `hero_sections`, `advertisements`, `settings`

Full SQL schema is in `supabase/schema.sql`.

### RLS Policies

```sql
-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Admins can read all
CREATE POLICY "Admins can read all" ON users
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Products are publicly readable
CREATE POLICY "Products are public" ON products
  FOR SELECT USING (status = 'active');
```

### Realtime Subscriptions

Enable in Supabase dashboard: Database → Replication → Enable for:
- `products` (live inventory updates)
- `orders` (live order tracking)
- `notifications` (real-time alerts)

### File Storage (Images)

Bucket: `product-images`
- Public read access
- Authenticated write access (admin only)
- Max file size: 5MB
- Allowed types: image/webp, image/jpeg, image/png

## 3. Stripe (Payments)

**Dashboard:** `https://dashboard.stripe.com`

### Payment Flow

```
User clicks "Pay" → Create Payment Intent (API)
    ↓
Stripe returns client_secret → Stripe Elements renders
    ↓
User enters card → Stripe.js confirms payment
    ↓
Stripe sends webhook → Server verifies → Order status updates
```

### Webhooks

Configure in Stripe Dashboard → Developers → Webhooks:
- Endpoint: `https://steptrendy.vercel.app/api/webhooks/stripe`
- Events: `payment_intent.succeeded`, `payment_intent.payment_failed`

### Products in Stripe

Create in Stripe Dashboard → Products:
1. **Standard Membership** — ₹0 (free)
2. **Express Shipping** — ₹99
3. **Premium Packaging** — ₹299

## 4. Resend (Transactional Emails)

**Dashboard:** `https://resend.com`

### Email Templates

| Trigger | Template | Priority |
|---------|----------|----------|
| Signup | Welcome Email | High |
| Login OTP | OTP Email | High |
| Order placed | Order Confirmation | High |
| Payment success | Payment Receipt | High |
| Shipping update | Shipment Update | Medium |
| Password reset | Reset Link | High |

### DNS Setup for Custom Domain

1. Add domain in Resend dashboard
2. Add DKIM/SPF records to your DNS
3. Verify domain ownership
4. Use `hello@steptrendy.com` as sender

## 5. Environment Variables

Copy `.env.example` to `.env.local` and fill values:

```bash
# Supabase (get from Project Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx

# Stripe (get from Dashboard → Developers → API keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Resend (get from Dashboard → API Keys)
RESEND_API_KEY=re_xxx
```

## 6. CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with: { node-version: 20 }
      - run: npm ci
        working-directory: frontend
      - run: npm run build
        working-directory: frontend
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

## 7. Performance Optimization

- **Images:** Next.js Image component with WebP format, lazy loading
- **Fonts:** Preloaded via `<link preload>`, `display=swap` for no FOIT
- **API:** Supabase with proper indexing on `(category, status, price)`
- **Caching:** Vercel Edge Cache for public pages, 60s stale-while-revalidate
- **Bundle:** Code splitting by route, dynamic imports for heavy components

## 8. Monitoring & Error Tracking

- **Vercel Analytics:** Built-in, no setup needed
- **Sentry:** For error tracking:
  ```bash
  npm install @sentry/nextjs
  npx @sentry/wizard -i nextjs
  ```
- **Uptime Monitoring:** Vercel Status Dashboard or Upptime

## 9. Local Development

```bash
# Terminal 1: Backend (optional - or use Supabase directly)
cd backend && npm install && node server.js

# Terminal 2: Frontend
cd frontend && npm install && npm run dev
```

Visit `http://localhost:3000`
