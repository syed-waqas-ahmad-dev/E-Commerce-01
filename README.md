# World-Shop E-Commerce Platform

A modern full-stack e-commerce web application built with React, TypeScript, Tailwind CSS, Supabase, and Stripe integration.

## Features

* User Authentication (Email & Google OAuth)
* Secure Supabase Backend
* Admin Dashboard
* Product Management
* Shopping Cart
* Wishlist System
* Order Management
* Responsive Design
* Role-Based Access Control
* Stripe Payment Integration
* Protected Routes
* Modern UI/UX

---

# Tech Stack

## Frontend

* React
* TypeScript
* Tailwind CSS
* React Router DOM
* ShadCN UI
* Lucide React Icons

## Backend

* Supabase
* PostgreSQL
* Row Level Security (RLS)
* Supabase Auth

## Payments

* Stripe

---

# Project Structure

```bash
src/
 ├── components/
 ├── pages/
 ├── contexts/
 ├── layouts/
 ├── hooks/
 ├── db/
 ├── lib/
 └── routes/
```

---

# Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

# Installation

Clone the repository:

```bash
git clone https://github.com/your-username/E-Commerce-01.git
```

Move into the project directory:

```bash
cd E-Commerce-01
```

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm run dev
```

---

# Supabase Setup

1. Create a Supabase project
2. Run the SQL schema
3. Configure Authentication
4. Disable Email Confirmation
5. Add RLS Policies
6. Configure Google OAuth (Optional)

---

# Admin Setup

After creating an account:

1. Open Supabase Table Editor
2. Go to `profiles` table
3. Change role:

```txt
user → admin
```

---

# Build for Production

```bash
pnpm run build
```

---

# Deployment

Recommended platforms:

* Vercel
* Netlify

Add environment variables in deployment settings before deploying.

---

# Security Features

* Row Level Security (RLS)
* Protected Admin Routes
* Secure Authentication
* JWT Session Management
* Supabase Policies

---

# Future Improvements

* Product Reviews
* Coupon System
* Multi-Vendor Support
* Analytics Dashboard
* Real-Time Notifications
* Mobile App Version

---

# Author

Syed Waqas Ahmad

* Software Engineer
* Frontend Web Developer

GitHub:
https://github.com/syed-waqas-ahmad-dev

---

# License

This project is licensed under the MIT License.

---

# Screenshots

Add your screenshots here after deployment.

Example:

```md
![Homepage](./screenshots/home.png)
```

---

# Support

If you like this project, consider giving it a star on GitHub.
