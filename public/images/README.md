# Folder untuk Gambar Armada

Folder ini menyimpan semua gambar untuk armada yang ditampilkan di LandingPage.

## 📝 Struktur File

```
images/
├── cdd.jpg          # Gambar untuk armada CDD (Angkutan Barang)
├── fuso.jpg         # Gambar untuk armada Fuso (Angkutan Barang)
├── avanza.jpg       # Gambar untuk armada Avanza (Angkut Sampah)
├── canter.jpg       # Gambar untuk armada Canter (Angkut Sampah)
├── innova.jpg       # Gambar untuk armada Innova (Sewa Kendaraan)
└── elf.jpg          # Gambar untuk armada Elf (Sewa Kendaraan)
```

## 🖼️ Spesifikasi Gambar

- **Format**: JPG, PNG
- **Ukuran Rekomendasi**: 400x250 px
- **Quality**: 80-90%
- **Max Size**: 500KB per file

## 📤 Cara Upload

1. **Copy gambar** ke folder ini sesuai struktur di atas
2. **Jalankan migration**: `php artisan migrate`
3. **Jalankan seeder**: `php artisan db:seed --class=ArmadaSeeder`
4. **Reload** halaman landing page

## ✅ Checklist

- [ ] Buat/Copy gambar armada
- [ ] Simpan dengan nama file sesuai struktur di atas
- [ ] Jalankan `php artisan migrate`
- [ ] Jalankan `php artisan db:seed --class=ArmadaSeeder`
- [ ] Cek LandingPage - gambar seharusnya muncul

## 🔍 Troubleshooting

**Gambar tidak muncul di LandingPage?**
1. Cek nama file cocok dengan yang di database (field `gambar`)
2. Pastikan file ada di folder ini
3. Check browser console untuk error (F12)

**Path tidak ketemu?**
- URL path: `/images/nama-file.jpg`
- Check di browser: `http://localhost:8000/images/cdd.jpg`
