# 🤖 WhatsApp Bot with AI Integration

A fun WhatsApp bot integrated with Generative AI chatbots (Google Gemini & Groq AI). This bot provides various features including AI-powered conversations, sticker creation, group management, and entertainment commands. Built with Node.js and whatsapp-web.js, it brings automation and AI capabilities directly to your WhatsApp chats.

## ✨ Features

### 🧠 AI Integration
- **Google Gemini AI** - Advanced AI conversations using Gemini 2.5 Flash model
- **Groq AI** - Fast AI responses powered by GPT-OSS model
- Smart context-aware responses

### 🎨 Media & Stickers
- **Sticker Maker** - Convert images to WhatsApp stickers
- **Media Info** - Get detailed information about media files

### 👥 Group Management
- Change group description
- Update group subject/name
- View detailed group information
- Delete bot messages (quote-based)

### 🎭 Entertainment
- Random jokes
- Motivational quotes
- Sarcastic responses
- Waifu character generator

### ⚙️ Utility Commands
- Echo messages
- Timer/reminder functionality
- Typing & recording indicators
- Message forwarding (send to specific number)
- Spam command (max 15 messages)
- Date and time information

### 💬 Communication
- Submit suggestions to bot owner
- Request custom quotes
- Get quote information from replied messages

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Main Library**: whatsapp-web.js
- **AI APIs**: 
  - Google Gemini API (Google AI)
  - Groq API
- **Browser Automation**: Puppeteer (with Brave Browser)

## 📦 Dependencies

```json
{
  "@google/genai": "^2.10.0",
  "dotenv": "^17.4.2",
  "groq-sdk": "^1.3.0",
  "qrcode-terminal": "^0.12.0",
  "whatsapp-web.js": "github:wwebjs/whatsapp-web.js"
}
```

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Brave Browser or Chromium installed

### Clone the Repository

```bash
git clone https://github.com/yourusername/botwa.git
cd botwa
```

### Install Dependencies

```bash
npm install
```

## 🔑 Setup API Keys

### 1. Create Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

### 2. Get Your API Keys

#### Google Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key"
4. Copy your API key

#### Groq API Key
1. Visit [Groq Console](https://console.groq.com/keys)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy your API key

### 3. Configure Environment Variables

Edit the `.env` file and add your API keys:

```env
# API Keys
GOOGLE_API_KEY=your_google_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

⚠️ **Important**: Never commit your `.env` file to Git. It's already included in `.gitignore`.

## 🏃 Run the Bot

### Start the Bot

```bash
node app.js
```

### First Time Setup

1. When you run the bot for the first time, a QR code will appear in the terminal
2. Open WhatsApp on your phone
3. Go to **Settings** → **Linked Devices** → **Link a Device**
4. Scan the QR code displayed in the terminal
5. Wait for "Client is ready!" message

### Keep Bot Running (Production)

Using PM2 (recommended):

```bash
# Install PM2 globally
npm install -g pm2

# Start bot with PM2
pm2 start app.js --name "whatsapp-bot"

# View logs
pm2 logs whatsapp-bot

# Stop bot
pm2 stop whatsapp-bot

# Restart bot
pm2 restart whatsapp-bot
```

## 📖 Usage

### Public Commands

All users can use these commands:

```
!help              - Display all available commands
!ping              - Bot responds with "pong"
!date              - Show current date and time
!echo [text]       - Echo your message
!ai [question]     - Ask Groq AI a question
!aigemini [question] - Ask Google Gemini AI
!jokes             - Get a random joke
!quotes            - Get motivational quotes
!sarkas            - Get sarcastic responses
!sticker           - Convert image to sticker (send image with caption "!sticker")
!timer [seconds]   - Set a timer reminder
!saran [message]   - Send suggestion to bot owner
!reqquotes [text]  - Request custom quotes
```

### Group Commands

These commands work only in group chats:

```
!groupinfo         - Show group information
!desc [text]       - Change group description
!subject [name]    - Change group name
!mediainfo         - Get media file information (reply to media)
!delete            - Delete bot message (quote bot's message)
!quoteinfo         - Get info about quoted message
```

### Private Commands

Commands prefixed with `!me-` (for bot owner):

```
!me-tes            - Test command
!me-[command]      - Access any public command privately
```

### Examples

```
User: !ai What is the capital of Indonesia?
Bot: The capital of Indonesia is Jakarta...

User: !jokes
Bot: Kenapa ayam menyeberang jalan? Karena di seberang ada KFC 😂

User: !timer 10
Bot: Reminder will start in 10 seconds

User: !sticker
(Send image with this caption to create sticker)
```

## 📁 Project Structure

```
botwa/
├── app.js              # Main bot application
├── .env                # Environment variables (not committed)
├── .env.example        # Environment template
├── .gitignore          # Git ignore rules
├── package.json        # Project dependencies
├── README.md           # Documentation
└── res/
    └── quotes.json     # Quotes database
```

## 🔒 Security Notes

- API keys are stored in `.env` file and never committed to Git
- WhatsApp session data is stored locally in `.wwebjs_auth/`
- Bot uses LocalAuth strategy for persistent sessions
- Always keep your API keys confidential

## 🐛 Troubleshooting

### QR Code Not Appearing
- Make sure you have a stable internet connection
- Check if Brave Browser is installed at `/usr/bin/brave-browser`
- Try changing `executablePath` in `app.js` to your Chrome/Chromium path

### Bot Not Responding
- Verify your API keys are correctly set in `.env`
- Check bot logs for error messages
- Ensure WhatsApp Web is not open in another browser

### Module Not Found Errors
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then run `npm install`

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 👨‍💻 Author

**southampere28**

---

⭐ If you find this bot useful, please consider giving it a star on GitHub!

---

**Disclaimer**: This bot is for educational purposes. Use responsibly and respect WhatsApp's Terms of Service.
