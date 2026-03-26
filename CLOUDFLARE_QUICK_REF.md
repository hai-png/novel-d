# 🚀 Cloudflare Pages CTA Setup - Quick Reference

## ⚡ 3-Step Setup

### 1️⃣ Deploy to Cloudflare Pages

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Build and deploy
npm run pages:deploy
```

OR use the **Cloudflare Dashboard**:
1. Go to [Cloudflare Pages](https://dash.cloudflare.com/?to=/:account/pages)
2. Click "Create a project"
3. Connect your GitHub repo
4. Build settings:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`

---

### 2️⃣ Configure Environment Variables

In Cloudflare Dashboard → Pages → Your Project → **Settings** → **Environment Variables**:

| Variable | Value |
|----------|-------|
| `VITE_TELEGRAM_BOT_TOKEN` | Your Telegram bot token |
| `VITE_TELEGRAM_CHAT_ID` | Your Telegram chat ID |
| `VITE_SEND_TO_EMAIL` | Your email address |

---

### 3️⃣ Test the CTA Form

1. Open your deployed site (e.g., `https://your-project.pages.dev`)
2. Navigate to any page with a "Request Quote" button
3. Fill out the form and submit
4. Check your Telegram for the notification

---

## 🧪 Local Testing

```bash
# Build the project
npm run build

# Run local Cloudflare Pages server with Functions support
npm run pages:dev
```

Open `http://localhost:8788` and test the form.

---

## 📁 Files Added for Cloudflare Pages

```
novel-d/
├── functions/
│   └── api/
│       └── quote.ts          # ✅ Serverless function for form submission
├── wrangler.toml             # ✅ Local development config
├── CLOUDFLARE_DEPLOYMENT.md  # ✅ Full deployment guide
├── components/
│   └── QuoteForm.tsx         # ✅ Updated to use Cloudflare Functions
└── package.json              # ✅ Added pages:* scripts
```

---

## 🔧 Troubleshooting

### Form submits but no Telegram notification

✅ Check environment variables in Cloudflare Dashboard
✅ Verify bot token is correct
✅ Ensure bot is added to the chat/channel

### Build fails

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Functions not working locally

```bash
# Make sure Wrangler is installed
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Run with verbose logging
npm run pages:dev -- --log-level=debug
```

---

## 📊 Monitoring

### View Function Logs

1. Cloudflare Dashboard → Pages → Your Project
2. Click **Functions** tab
3. View real-time logs

### Check Deployment Status

1. Cloudflare Dashboard → Pages → Your Project
2. View **Deployments** tab
3. Check build logs and status

---

## 🎯 What Changed?

### Before (Direct Telegram API)
```
User → Frontend → Telegram API ❌ (Exposes bot token)
```

### After (Cloudflare Pages Functions)
```
User → Frontend → Cloudflare Function → Telegram API ✅ (Secure)
```

---

## 📞 Need Help?

- 📖 [Full Guide](./CLOUDFLARE_DEPLOYMENT.md)
- 🔗 [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- 🔗 [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)

---

**Ready to deploy?** Run `npm run pages:deploy` 🚀
