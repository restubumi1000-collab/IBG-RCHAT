NICCA Connect+ v8.7 - Admin History Management

Basis: v8.6 KPI History.

Perubahan utama:
- Admin tetap dapat edit/hapus satu riwayat KPI.
- Admin dapat menghapus SELURUH riwayat KPI untuk user yang dipilih.
- Penghapusan massal wajib mengetik User ID yang sama sebagai konfirmasi.
- Konfirmasi kedua menampilkan jumlah riwayat yang akan dihapus.
- Hanya collection kpi_history yang dihapus; akun user dan Kaizen tidak ikut terhapus.
- Total KPI user diperbarui otomatis setelah penghapusan.
- Filter bulan hanya untuk tampilan; tombol hapus semua tetap menghapus seluruh riwayat user terpilih.

Firestore Rules: gunakan firestore.rules yang disertakan. Tidak ada perubahan permission baru dibanding v8.6.
