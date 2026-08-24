NICCA Connect+ v8.6 KPI History

PERUBAHAN UTAMA
- Semua kartu KPI selain Kaizen dapat diklik untuk melihat histori per tanggal.
- Admin menambahkan KPI sebagai kejadian individual: user, jenis KPI, tanggal, jumlah, keterangan.
- Admin dapat edit/hapus riwayat jika salah input.
- Setelah simpan, form otomatis reset namun user yang dipilih tetap dipertahankan.
- Admin dapat memfilter daftar riwayat berdasarkan bulan.
- Total user dihitung otomatis dari kpi_history tahun berjalan sampai hari ini.
- Data bulanan lama dari collection kpi v8.5 masih ikut dihitung agar total lama tidak hilang.
- Kaizen tetap memakai collection kaizen seperti versi sebelumnya.

PENTING
1. Upload semua file versi ini ke GitHub menggantikan versi lama.
2. Copy firestore.rules ke Firebase Console > Firestore Database > Rules lalu Publish.
3. Logout/login ulang dan lakukan Ctrl+F5 setelah GitHub Pages selesai deploy.
4. User harus pernah login minimal sekali agar muncul pada dropdown admin.

CATATAN DATA LAMA
- Riwayat detail hanya tersedia untuk input baru yang dibuat mulai v8.6.
- Angka lama dari v8.5 tetap masuk total, tetapi tidak memiliki tanggal detail karena versi lama menyimpan data sebagai total bulanan.
