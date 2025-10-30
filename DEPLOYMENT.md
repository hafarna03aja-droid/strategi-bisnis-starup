# Pre-Deployment Checklist

Sebelum melakukan deployment ke Vercel, pastikan hal-hal berikut sudah dilakukan:

## ✅ Code & Configuration
- [ ] Semua code sudah di-commit dan push ke repository
- [ ] `package.json` sudah diupdate dengan dependencies yang benar
- [ ] `vite.config.ts` sudah dikonfigurasi untuk production build
- [ ] `vercel.json` sudah ada dan dikonfigurasi dengan benar
- [ ] Environment variables sudah didefinisikan

## ✅ Environment Variables
- [ ] `GEMINI_API_KEY` sudah disiapkan
- [ ] File `.env.example` sudah dibuat sebagai template
- [ ] File `.env` tidak di-commit ke repository (ada di .gitignore)

## ✅ Build & Testing
- [ ] `npm run build` berjalan tanpa error
- [ ] `npm run preview` berjalan dan aplikasi dapat diakses
- [ ] Semua fitur utama berfungsi dengan baik
- [ ] Tidak ada console errors di browser

## ✅ Vercel Setup
- [ ] Akun Vercel sudah dibuat
- [ ] Vercel CLI sudah diinstall (`npm i -g vercel`)
- [ ] Sudah login ke Vercel (`vercel login`)

## ✅ Deployment Steps

### Option 1: Via Vercel CLI
1. Run `vercel` di terminal
2. Follow the prompts
3. Set environment variables di Vercel dashboard
4. Run `vercel --prod` untuk production deployment

### Option 2: Via GitHub Integration
1. Push code ke GitHub
2. Connect repository ke Vercel
3. Set environment variables di project settings
4. Auto-deploy akan berjalan

## ✅ Post-Deployment
- [ ] Aplikasi dapat diakses via URL Vercel
- [ ] Semua fitur berfungsi di production
- [ ] Environment variables sudah terset dengan benar
- [ ] Custom domain (opsional) sudah dikonfigurasi

## 🔧 Troubleshooting

### Build Errors
- Check `npm run build` output untuk error details
- Pastikan semua dependencies sudah diinstall
- Periksa TypeScript errors

### Environment Variables
- Pastikan nama variable sama persis dengan yang digunakan di code
- Restart deployment setelah menambah/mengubah env vars

### Runtime Errors
- Check Vercel Function Logs di dashboard
- Periksa browser console untuk client-side errors