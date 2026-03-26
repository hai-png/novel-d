import { RequestHandler } from '@cloudflare/pages-plugin-sentry';

export const onRequestPost = async ({ request, env }) => {
  try {
    const body = await request.json();
    const { formData } = body;

    // Get Telegram credentials from Cloudflare environment variables
    // In local development: loaded from .dev.vars
    // In production: loaded from Cloudflare Pages dashboard
    const botToken = env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = env.VITE_TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error('Telegram configuration missing:', { 
        hasBotToken: !!botToken, 
        hasChatId: !!chatId 
      });
      return new Response(
        JSON.stringify({ 
          error: 'Telegram configuration missing',
          message: 'Please configure VITE_TELEGRAM_BOT_TOKEN and VITE_TELEGRAM_CHAT_ID'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Format message for Telegram
    const projectTypeLabel = formData.projectType || 'Not specified';
    const serviceTypeLabel = formData.serviceType || 'Not specified';

    let message = `🎯 *New Quote Request*\n\n`;
    message += `👤 *Name:* ${formData.name}\n`;
    message += `📱 *Phone:* ${formData.phone}\n`;
    if (formData.email) {
      message += `📧 *Email:* ${formData.email}\n`;
    }
    if (formData.company) {
      message += `🏢 *Company:* ${formData.company}\n`;
    }
    message += `\n`;
    message += `📋 *Project Type:* ${projectTypeLabel}\n`;
    message += `🛠️ *Service Type:* ${serviceTypeLabel}\n`;
    message += `\n`;
    message += `📝 *Project Details:*\n${formData.projectDetails}\n\n`;
    if (formData.timeline) {
      message += `⏰ *Timeline:* ${formData.timeline}\n`;
    }
    if (formData.budget) {
      message += `💰 *Budget:* ${formData.budget}\n`;
    }
    if (formData.howDidYouHear) {
      message += `📢 *Source:* ${formData.howDidYouHear}\n`;
    }

    // Send to Telegram
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const telegramData = await telegramResponse.json();

    if (!telegramResponse.ok) {
      console.error('Telegram API Error:', telegramData);
      return new Response(
        JSON.stringify({ error: 'Failed to send to Telegram', details: telegramData }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, messageId: telegramData.result.message_id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing quote request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
