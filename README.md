# smpn17kotategal

Website Pusat Data Informasi Jitu untuk SMPN 17 Tegal.

## Setup

```bash
npm install
```

## Run locally

```bash
npm run dev
```

## Build production

```bash
npm run build
```

## Teknologi

- Next.js
- Tailwind CSS
- Supabase
- Framer Motion
- Recharts

## Catatan

- `jsconfig.json` sudah dikonfigurasi dengan alias `@/*`
- `styles/globals.css` berisi setup Tailwind dan global reset
- `components/ui/*` sekarang tersedia untuk komponen UI dasar
- Gunakan `.env.local` untuk `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Environment

Salin `.env.example` ke `.env.local` dan tambahkan nilai Supabase Anda.
