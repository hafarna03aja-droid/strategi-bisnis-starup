<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Perencana Strategi Startup

Aplikasi web untuk membantu merencanakan strategi bisnis startup menggunakan AI (Google Gemini).

View your app in AI Studio: https://ai.studio/apps/drive/1r91y_-A1wC5X6HNFOtDB6dXvhGxgdfBG

## Run Locally

**Prerequisites:**  Node.js (v18 atau lebih tinggi)

1. Clone repository:
   ```bash
   git clone <repository-url>
   cd strategi-bisnis-starup
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set environment variables:
   - Copy `.env.example` ke `.env.local`
   - Set `GEMINI_API_KEY` dengan API key Gemini Anda

4. Run the app:
   ```bash
   npm run dev
   ```

## Deploy to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Set environment variables di Vercel dashboard:
   - Go to your project settings
   - Add `GEMINI_API_KEY` dengan value API key Anda

### Option 2: Deploy via GitHub Integration

1. Push code ke GitHub repository
2. Connect repository ke Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
3. Set environment variables:
   - Add `GEMINI_API_KEY` di project settings
4. Deploy otomatis akan berjalan

## Environment Variables

Untuk production deployment, set variabel berikut di Vercel dashboard:

- `GEMINI_API_KEY`: Your Google Gemini API key

## Tech Stack

- React 19
- TypeScript
- Vite
- Google Gemini AI
- Vercel (deployment)

## Features

- Input informasi bisnis startup
- Analisis AI menggunakan Google Gemini
- Export hasil analisis ke PDF/DOCX
- Chatbot untuk konsultasi lanjutan
- Executive Summary
- Responsive design
