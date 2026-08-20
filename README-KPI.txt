NICCA Connect+ v8 - KPI

Fitur:
- Chat lama tetap ada
- My KPI: Kaizen, Alpha, Cuti, Terlambat, LDP, Kecelakaan Kerja, Komplain, Produk NG, Lembur
- Kaizen dapat diklik untuk melihat judul dan detail
- Admin KPI untuk input data dan tambah Kaizen
- ID "restu" diset sebagai admin awal agar langsung dapat digunakan

PENTING:
1. Upload/replace index.html, style.css, app.js dan file aset ke GitHub seperti biasa.
2. Di Firebase Console > Firestore Database > Rules, ganti rules dengan isi firestore.rules lalu Publish.
3. Data KPI otomatis disimpan di collection "kpi".
4. Data Kaizen otomatis disimpan di collection "kaizen".
5. Untuk admin tambahan, buat document users/{FIREBASE_UID} dengan field role = "admin", atau tambahkan ID ke ADMIN_IDS di app.js dan sesuaikan Firestore Rules.
