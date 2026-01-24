# 🛍️ E-commerce Store

Modern, full-featured e-commerce platform built with Next.js, Prisma, and NextAuth.

## ✨ Features

- 🔐 **Secure Authentication** - NextAuth with credentials provider
- 👤 **User Management** - Profile management and order tracking
- 🛒 **Shopping Cart** - Real-time cart with session storage
- 📦 **Product Management** - Full CRUD operations for products
- 📊 **Admin Dashboard** - Analytics, orders, and inventory management
- 💳 **Checkout System** - Streamlined checkout process
- 🔍 **Search & Filter** - Category-based filtering and product search
- 🎨 **Modern UI** - Beautiful responsive design with Tailwind CSS
- 🌙 **Dark Mode Support** - Toggle between light and dark themes
- 🔒 **Security Headers** - HTTP security headers and RBAC implementation

## 🚀 Tech Stack

- **Framework:** Next.js 16.1.1 (App Router)
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth v5
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Animations:** Framer Motion
- **Type Safety:** TypeScript
- **Icons:** Lucide React

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/zainAlapdeen22/ecommerce-store.git
cd ecommerce-store
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="your_postgresql_connection_string"
AUTH_SECRET="your_auth_secret_key"
AUTH_URL="http://localhost:3000"
```

4. Run database migrations:
```bash
npx prisma generate
npx prisma db push
```

5. (Optional) Seed the database:
```bash
npm run db:seed
```

6. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see your application.

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:seed` - Seed database with sample data

## 🗂️ Project Structure

```
ecommerce-store/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── categories/        # Category pages
│   ├── products/          # Product pages
│   ├── checkout/          # Checkout flow
│   └── ...
├── components/            # Reusable React components
├── lib/                   # Utility functions and configurations
├── prisma /               # Database schema and migrations
├── actions/               # Server actions
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

## 🔑 Admin Access

To access the admin dashboard:
1. Create a user account
2. Update user role in database to `SUPER_ADMIN`
3. Navigate to `/admin`

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push this repository to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/zainAlapdeen22/ecommerce-store)

### Environment Variables for Production

Make sure to set these in your Vercel project settings:
- `DATABASE_URL` - Your PostgreSQL connection string
- `AUTH_SECRET` - Generate with `openssl rand -base64 32`
- `AUTH_URL` - Your production URL

## 🔒 Security Features

- HTTP security headers (HSTS, XSS Protection, etc.)
- Role-based access control (RBAC)
- Password hashing with bcrypt
- JWT session management
- CSRF protection via NextAuth

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

**Zain Alapdeen**
- GitHub: [@zainAlapdeen22](https://github.com/zainAlapdeen22)

---

Made with ❤️ using Next.js
