# Quote Form Setup Instructions

## Telegram Setup

### 1. Create a Telegram Bot
1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow the prompts to name your bot and create a username
4. **Copy the bot token** - it will look like: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`

### 2. Get Your Chat ID
1. Open Telegram and search for `@userinfobot`
2. Start a chat and send any message
3. **Copy your Chat ID** - it will be a number like: `123456789`

### 3. Add Bot to Channel (Optional)
If you want to send messages to a channel instead of personal chat:
1. Create a new channel in Telegram
2. Add your bot as an administrator
3. Get the channel ID (will be like: `@yourchannelname` or `-1001234567890`)

## Environment Variables

Update your `.env.local` file with your credentials:

```env
# Telegram Configuration
VITE_TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
VITE_TELEGRAM_CHAT_ID=123456789

# Your email address
VITE_SEND_TO_EMAIL=your_email@example.com

# FormSpree (optional - for email notifications)
VITE_FORMSPREE_ID=your_formspree_id_here
```

## Email Setup (Optional)

### Option 1: FormSpree (Easiest)
1. Go to [formspree.io](https://formspree.io)
2. Sign up for a free account
3. Create a new form
4. Copy your form ID from the form endpoint URL
5. Update `VITE_FORMSPREE_ID` in `.env.local`
6. Uncomment the `sendToEmail()` call in `QuoteForm.tsx` line 185

### Option 2: Your Own Backend
1. Create an API endpoint to handle form submissions
2. Update the `sendToEmail()` function in `QuoteForm.tsx` to call your endpoint
3. Replace the FormSpree URL with your backend URL

## Form Features

✅ **Phone number required** (email is now optional)
✅ **Sends to Telegram** with formatted message
✅ **Sends attachments** to Telegram as documents
✅ **Sends to Email** (when configured)
✅ **Project type selection** (Residential, Commercial, Interior)
✅ **Service type selection** (all 6 services)
✅ **File upload** for blueprints/sketches
✅ **Multi-step form** with progress indicator

## Testing

1. Start the development server: `npm run dev`
2. Navigate to any service page
3. Click "Get a Free Quote for Your Project"
4. Fill out the form and submit
5. Check your Telegram for the notification

## Troubleshooting

- **Not receiving Telegram messages?** Check that your bot token and chat ID are correct
- **Files not uploading?** Make sure files are under 20MB (Telegram limit)
- **Form not submitting?** Check browser console for errors
