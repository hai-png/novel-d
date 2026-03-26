#!/usr/bin/env node

/**
 * Test Telegram Bot Credentials
 * 
 * This script tests if your Telegram bot token and chat ID are working.
 * Run with: node test-telegram.js
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
function loadEnv() {
  try {
    const envPath = join(__dirname, '.env');
    const envContent = readFileSync(envPath, 'utf-8');
    const env = {};
    
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        if (!value.startsWith('#') && !value.startsWith('your_')) {
          env[key.trim()] = value;
        }
      }
    });
    
    return env;
  } catch (error) {
    console.error('❌ Error reading .env file:', error.message);
    return {};
  }
}

async function testTelegramBot() {
  console.log('🔍 Testing Telegram Bot Credentials...\n');
  
  const env = loadEnv();
  const botToken = env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = env.VITE_TELEGRAM_CHAT_ID;
  
  // Check if credentials exist
  if (!botToken || botToken === 'your_bot_token_here') {
    console.error('❌ VITE_TELEGRAM_BOT_TOKEN not found in .env file');
    console.log('\n📝 To get your bot token:');
    console.log('   1. Open Telegram and search for @BotFather');
    console.log('   2. Send /newbot command');
    console.log('   3. Follow the prompts to create a bot');
    console.log('   4. Copy the token and add it to your .env file\n');
    process.exit(1);
  }
  
  if (!chatId || chatId === 'your_chat_id_here') {
    console.error('❌ VITE_TELEGRAM_CHAT_ID not found in .env file');
    console.log('\n📝 To get your chat ID:');
    console.log('   1. Open Telegram and search for @userinfobot');
    console.log('   2. Start the bot or send /start');
    console.log('   3. Copy your User ID and add it to your .env file\n');
    process.exit(1);
  }
  
  console.log('✅ Found credentials in .env file');
  console.log(`   Bot Token: ${botToken.substring(0, 20)}...`);
  console.log(`   Chat ID: ${chatId}\n`);
  
  // Test bot token by getting bot info
  console.log('📡 Testing bot token...');
  try {
    const botInfoResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/getMe`
    );
    const botInfo = await botInfoResponse.json();
    
    if (!botInfoResponse.ok) {
      console.error('❌ Invalid bot token!');
      console.error(`   Error: ${botInfo.description || 'Unknown error'}`);
      console.log('\n💡 Make sure you copied the token correctly from @BotFather');
      process.exit(1);
    }
    
    console.log('✅ Bot token is valid!');
    console.log(`   Bot Name: @${botInfo.result.username}`);
    console.log(`   Bot Name: ${botInfo.result.first_name}\n`);
    
    // Test sending a message
    console.log('📬 Testing message sending...');
    const messageText = `✅ *Test Message*\n\nThis is a test message from your Novel-D website!\n\nIf you're seeing this, your Telegram integration is working correctly! 🎉`;
    
    const sendMessageResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: messageText,
          parse_mode: 'Markdown',
        }),
      }
    );
    
    const sendMessageResult = await sendMessageResponse.json();
    
    if (!sendMessageResponse.ok) {
      console.error('❌ Failed to send message!');
      console.error(`   Error: ${sendMessageResult.description || 'Unknown error'}`);
      console.log('\n💡 Possible issues:');
      console.log('   - Chat ID is incorrect');
      console.log('   - Bot hasn\'t been started by the user');
      console.log('   - Bot was blocked by the user');
      process.exit(1);
    }
    
    console.log('✅ Message sent successfully!');
    console.log(`   Message ID: ${sendMessageResult.result.message_id}`);
    console.log('\n🎉 All tests passed! Your Telegram integration is working!\n');
    console.log('💡 Next steps:');
    console.log('   1. Check your Telegram for the test message');
    console.log('   2. Test the quote form on your website');
    console.log('   3. Deploy to Cloudflare Pages (credentials will be used automatically)\n');
    
  } catch (error) {
    console.error('❌ Error testing Telegram bot:', error.message);
    console.log('\n💡 Make sure you have an internet connection');
    process.exit(1);
  }
}

// Run the test
testTelegramBot();
