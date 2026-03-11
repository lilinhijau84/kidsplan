# 🎨 KidsPlan — Preschool Activity Planner

Web app untuk guru tadika, ibu bapa homeschool, dan preschool owner. Generate aktiviti pembelajaran untuk kanak-kanak 3-6 tahun dengan cepat!

## ✨ Features

- 📋 **Lesson Plan Generator** — Rancangan pengajaran harian lengkap
- 🎮 **Learning Activities** — Aktiviti pembelajaran interaktif
- 📝 **Worksheet Ideas** — Idea lembaran kerja menarik
- ✂️ **Craft Ideas** — Projek kraf tangan kreatif
- 📦 **Theme Packs** — Pakej pembelajaran 5-hari lengkap

### 12 Tema Tersedia
Haiwan, Alam Semula Jadi, Angkasa Lepas, Lautan, Makanan, Pengangkutan, Tubuh Badan, Cuaca, Warna & Bentuk, Keluarga, Nombor, Huruf ABC

### 400+ Content Items
Setiap kali generate/regenerate, content dipilih secara rawak — hasilnya unik setiap kali!

---

## 🚀 Deploy ke Vercel (3 Langkah)

### Langkah 1: Push ke GitHub

```bash
# Buka terminal di folder kidsplan
cd kidsplan

# Init git
git init
git add .
git commit -m "Initial commit - KidsPlan v1.0"

# Buat repo baru di GitHub, kemudian:
git remote add origin https://github.com/USERNAME/kidsplan.git
git branch -M main
git push -u origin main
```

### Langkah 2: Deploy di Vercel

1. Pergi ke [vercel.com](https://vercel.com) — sign up / login dengan GitHub
2. Klik **"Add New Project"**
3. Import repo **kidsplan** dari GitHub
4. Vercel akan auto-detect Vite — tak perlu ubah apa-apa
5. Klik **"Deploy"**
6. Tunggu 1-2 minit — siap! 🎉

### Langkah 3: Custom Domain (Optional)

1. Di Vercel dashboard → Settings → Domains
2. Tambah domain anda, contoh: `kidsplan.com`
3. Update DNS mengikut arahan Vercel

---

## 💻 Development (Local)

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📁 Struktur Projek

```
kidsplan/
├── index.html          # Entry HTML
├── package.json        # Dependencies & scripts
├── vite.config.js      # Vite configuration
├── vercel.json         # Vercel routing config
├── README.md           # Dokumentasi ini
└── src/
    ├── main.jsx        # React entry point
    └── App.jsx         # Main app (semua code di sini)
```

---

## 🛠️ Tech Stack

- **React 18** — UI framework
- **Vite 5** — Build tool (super fast!)
- **Vercel** — Hosting & deployment

---

## 📱 Responsive

Web app ini responsive dan berfungsi baik di:
- 📱 Mobile (iPhone, Android)
- 📟 Tablet (iPad)
- 💻 Desktop

---

Dibina dengan ❤️ untuk pendidik prasekolah Malaysia
