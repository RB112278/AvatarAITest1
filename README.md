# Minimal Voice Chat - HeyGen Interactive Avatar

A minimal Next.js application for real-time voice conversations with HeyGen's Interactive Avatar, designed for language learning.

## Features

- 🎙️ Real-time voice chat with AI avatar
- 🤖 Auto-start avatar session on page load
- 💬 Automatic greeting message
- 🎨 Clean, minimal UI
- 📱 Responsive design (portrait orientation)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
HEYGEN_API_KEY=your_heygen_api_key_here
NEXT_PUBLIC_BASE_API_URL=https://api.heygen.com
```

Get your HeyGen API key from: https://app.heygen.com/settings?nav=Subscriptions%20%26%20API

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000/test-minimal in your browser.

## How It Works

1. Page loads → Avatar session auto-starts
2. "Connecting..." overlay appears
3. Avatar appears (Alessandra)
4. After 1 second, avatar speaks greeting
5. Microphone is active for voice chat
6. Speak naturally - avatar responds in real-time

## Project Structure

```
├── app/
│   ├── api/get-access-token/route.ts  # Token generation API
│   ├── test-minimal/page.tsx          # Test page
│   └── layout.tsx                      # Root layout
├── examples/minimal-voice-chat/
│   ├── MinimalVoiceAvatar.tsx         # Main component
│   ├── useMinimalAvatar.ts            # Custom hook
│   └── index.ts                        # Exports
├── styles/globals.css                  # Global styles
└── .env                                # Environment variables
```

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `HEYGEN_API_KEY`
   - `NEXT_PUBLIC_BASE_API_URL`
4. Deploy!

## Tech Stack

- Next.js 15.3.0
- React 19.1.0
- TypeScript 5.0.4
- HeyGen Streaming Avatar SDK 2.0.13
- Tailwind CSS 3.4.17

## License

MIT
