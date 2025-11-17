# StyleHub E-Commerce Platform

A modern, full-stack e-commerce application built with React, TypeScript, and Supabase.

## 🏗️ Cloud Architecture

### Cloud Service Model: **PaaS (Platform as a Service)**

This project uses a Platform as a Service architecture, providing a complete development and deployment environment in the cloud.

### Technology Stack

**Frontend (PaaS)**
- **Platform**: render
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query (React Query)

**Backend (PaaS)**
- **Platform**: Supabase (PostgreSQL as a Service)
- **Infrastructure**: AWS (Supabase runs on Amazon Web Services)
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth (Email/Password)
- **API**: Auto-generated REST and Real-time APIs

### Why PaaS?
- **No infrastructure management**: No need to manage servers, OS updates, or scaling
- **Built-in features**: Authentication, database, APIs provided out of the box
- **Rapid development**: Focus on application logic, not DevOps
- **Automatic scaling**: Handles traffic spikes automatically
- **Cost-effective**: Pay only for what you use

## 🚀 Migration to Your Own Supabase Project

### Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project (remember your database password!)

### Step 2: Import Database Schema

1. Open your new Supabase project dashboard
2. Go to **SQL Editor** (left sidebar)
3. Copy and run the SQL from `MIGRATION.sql` file in this repo

### Step 3: Update Environment Variables

1. In your Supabase dashboard, go to **Project Settings** → **API**
2. Copy these values:
   - Project URL (looks like: `https://xxxxx.supabase.co`)
   - `anon` public key
   - Project Reference ID

3. Update your `.env` file:
```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

### Step 4: Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Under **Email Auth**:
   - **Confirm email**: Disable (for development/testing)
   - **Enable sign ups**: Enable

## 👤 Adding Admin Users

### Method 1: First Admin (admin@gmail.com)

**Step 1: Sign Up**
1. Go to your app at `/auth`
2. Click "Sign Up" tab
3. Enter:
   - Email: `admin@gmail.com`
   - Password: `admin`
   - Full Name: `Admin User`
4. Click "Sign Up"

**Step 2: Assign Admin Role**
1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Find `admin@gmail.com` and copy the UUID
3. Go to **SQL Editor** and run:
```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('PASTE-UUID-HERE', 'admin');
```

OR use this automatic query:
```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'admin@gmail.com';
```

### Method 2: Add More Admins

For any additional admin users, follow the same process:
1. User signs up via `/auth`
2. Run the SQL query to assign admin role

## 🗄️ Database Access for Admins

### Accessing the Supabase Dashboard

1. **Login**: [https://supabase.com](https://supabase.com)
2. **Select Your Project**
3. **Main Sections**:
   - **Table Editor**: Visual interface to browse/edit data
   - **SQL Editor**: Write and execute custom queries
   - **Authentication**: Manage users and auth settings
   - **Database**: View schema, triggers, and functions

### Database Schema Overview

| Table | Purpose | Access Control |
|-------|---------|----------------|
| `profiles` | User profiles (name, email, phone) | Users see only their own |
| `user_roles` | Admin/user permissions | Users see own, admins manage all |
| `products` | Product catalog | Public read, admin write |
| `cart_items` | Shopping cart data | User-specific only |
| `orders` | Customer orders | Users see own, admins see all |
| `order_items` | Items in each order | Based on order access |
| `addresses` | Shipping addresses | User-specific only |

### Useful Admin Queries

**View All Orders with Customer Info:**
```sql
SELECT 
  o.id,
  o.created_at,
  o.status,
  o.total,
  p.full_name,
  p.email
FROM orders o
JOIN profiles p ON p.id = o.user_id
ORDER BY o.created_at DESC;
```

**Check Low Stock Products:**
```sql
SELECT 
  name, 
  stock, 
  price, 
  category
FROM products
WHERE stock < 10 AND is_active = true
ORDER BY stock ASC;
```

**List All Admin Users:**
```sql
SELECT 
  p.full_name,
  p.email,
  ur.role,
  p.created_at
FROM user_roles ur
JOIN profiles p ON p.id = ur.user_id
WHERE ur.role = 'admin'
ORDER BY p.created_at;
```

**Sales Report (Daily):**
```sql
SELECT 
  DATE(created_at) as order_date,
  COUNT(*) as total_orders,
  SUM(total) as daily_revenue,
  COUNT(DISTINCT user_id) as unique_customers
FROM orders
WHERE status NOT IN ('cancelled')
GROUP BY DATE(created_at)
ORDER BY order_date DESC
LIMIT 30;
```

**Popular Products:**
```sql
SELECT 
  p.name,
  p.category,
  COUNT(oi.id) as times_ordered,
  SUM(oi.quantity) as total_quantity_sold,
  SUM(oi.price * oi.quantity) as total_revenue
FROM products p
JOIN order_items oi ON oi.product_id = p.id
GROUP BY p.id, p.name, p.category
ORDER BY times_ordered DESC
LIMIT 10;
```

## 🎨 Admin Dashboard Features

Access the admin panel at `/admin` (requires admin role).

### Product Management
- ✅ Add new products with images
- ✅ Edit product details (name, price, description, stock)
- ✅ Delete products
- ✅ Manage inventory levels
- ✅ Set product categories (Men, Women, Kids)

### Order Management
- ✅ View all customer orders
- ✅ See order items and customer details
- ✅ Update order status:
  - **Pending** → **Processing** (Approve)
  - **Processing** → **Shipped** → **Delivered**
  - **Pending** → **Cancelled** (Reject)

## 🔒 Security Features

### Row Level Security (RLS)
- All tables have RLS enabled
- Policies enforce data access based on user authentication
- Admin privileges verified via `has_role()` database function
- Prevents unauthorized data access and SQL injection

### Authentication Security
- Supabase Auth handles password hashing (bcrypt)
- JWT-based session management
- Secure token refresh mechanism
- Email verification support (optional)

### Admin Authorization
- Admin role stored in separate `user_roles` table
- Server-side validation using security definer functions
- No client-side role checking (prevents privilege escalation)

## 📦 Deployment

### Local Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deploy to Vercel/Render/Netlify

**Option 1: Via GitHub (Recommended for Academic Submission)**
1. Push code to GitHub
2. Connect repository to deployment platform
3. Add environment variables (see below)
4. Deploy

**Option 2: Manual Deploy**
1. Build locally: `npm run build`
2. Upload `dist` folder to hosting platform

### Required Environment Variables
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

Get these values from: **Supabase Dashboard** → **Settings** → **API**

## 🧪 Testing the Application

### As a Customer:
1. Sign up at `/auth`
2. Browse products at `/products/:category`
3. Add items to cart
4. Place an order at `/cart`
5. View orders in profile at `/profile`

### As an Admin:
1. Sign in with admin credentials
2. Access admin dashboard at `/admin`
3. Manage products and orders
4. View customer information

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TanStack Query Docs](https://tanstack.com/query/latest)

## 🎓 For Academic Submission

### Cloud Computing Aspects:
- **Service Model**: PaaS (Platform as a Service)
- **Cloud Provider**: Supabase (built on AWS infrastructure)
- **Components**:
  - Database: PostgreSQL (managed)
  - Authentication: Supabase Auth
  - APIs: Auto-generated REST APIs
  - Storage: File storage (Supabase Storage)
  - Hosting: Lovable/Vercel/Render

### Technical Highlights:
- Full-stack application with modern architecture
- Secure authentication and authorization
- Database design with proper relationships
- Row-level security for data protection
- RESTful API integration
- Responsive UI with component library

---

**Project**: E-Commerce Platform (StyleHub)  
**Cloud Model**: PaaS  
**Provider**: Supabase (AWS-based)  
**Tech Stack**: React + TypeScript + PostgreSQL
