# 🚀 Free Deployment Guide - E-commerce Store

This guide will help you deploy your Next.js e-commerce application for free using Vercel and Neon PostgreSQL.

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier)
- Neon PostgreSQL account (free tier)

---

## Quick Start

### 1. Database Setup (Neon PostgreSQL)

1. Create account at [https://neon.tech](https://neon.tech)
2. Create a new project
3. Copy the **Connection String** (starts with `postgresql://...`)
4. Save it for later use

### 2. Generate Authentication Secret

```bash
openssl rand -base64 32
```

Or use: [https://generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)

### 3. Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git push -u origin main
```

### 4. Deploy on Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up/in with GitHub
3. Click **New Project** → Import your repository
4. Add **Environment Variables**:
   - `DATABASE_URL`: Your Neon connection string
   - `AUTH_SECRET`: Generated secret from step 2
   - `NEXTAUTH_URL`: Will be auto-filled
5. Click **Deploy**

### 5. Setup Database & Create Admin User

#### Option A: Run migrations locally

```bash
# Add environment variables to .env
echo 'DATABASE_URL="your-neon-connection-string"' > .env
echo 'AUTH_SECRET="your-generated-secret"' >> .env

# Run migrations
npx prisma migrate deploy
# or
npx prisma db push
```

#### Option B: Use Neon SQL Editor

Copy the schema from `prisma/schema.prisma` and execute it in Neon's SQL Editor.

### 6. Create Super Admin User

Visit: `https://your-project.vercel.app/api/seed`

You'll see:
```json
{
  "success": true,
  "credentials": {
    "email": "admin@store.com",
    "password": "admin123"
  }
}
```

---

## Access Your Application

| Page | URL |
|------|-----|
| **Store** | `https://your-project.vercel.app` |
| **Login** | `https://your-project.vercel.app/api/auth/signin` |
| **Admin Dashboard** | `https://your-project.vercel.app/admin` |
| **Super Admin** | `https://your-project.vercel.app/admin/super` |

**Default Credentials:**
- Email: `admin@store.com`
- Password: `admin123`

⚠️ **Change the password after first login!**

---

## Environment Variables Reference

Create a `.env` file based on `.env.example`:

```bash
# Database
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

# Authentication
AUTH_SECRET="your-random-secret-key"
NEXTAUTH_URL="http://localhost:3000"  # or your production URL
```

---

## Auto-Deployment

Every time you push to GitHub, Vercel will automatically deploy:

```bash
git add .
git commit -m "Update description"
git push
```

Track deployments at: Vercel Dashboard → Deployments

---

## Troubleshooting

### "Application error: a server-side exception has occurred"

**Solution:**
1. Verify `DATABASE_URL` in Vercel Environment Variables
2. Make sure migrations were executed
3. Check Vercel Runtime Logs

### Can't login

**Solution:**
1. Ensure `/api/seed` was executed successfully
2. Verify `AUTH_SECRET` is set in Environment Variables
3. Clear browser cache and try again

### Prisma migration failed

**Solution:**
```bash
rm -rf prisma/migrations
npx prisma db push
```

---

## Free Tier Limits

### Vercel Free:
- ✅ Unlimited personal projects
- ✅ Auto SSL
- ✅ 100 GB bandwidth/month
- ⚠️ 100 hours serverless functions/month

### Neon Free:
- ✅ 500 MB storage
- ✅ 1 project
- ⚠️ Auto-pause after inactivity (resumes on access)

---

## Next Steps

1. **Custom Domain**: Buy a domain and connect it via Vercel
2. **Security**: Change default admin password
3. **Analytics**: Enable Vercel Analytics
4. **Backup**: Regular database exports from Neon

---

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Need help?** Check the Arabic guide (`DEPLOYMENT_GUIDE_AR.md`) for detailed step-by-step instructions with screenshots.
