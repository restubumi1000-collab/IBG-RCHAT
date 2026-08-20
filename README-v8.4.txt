NICCA Connect+ v8.4 - KPI Total Tahun Berjalan

Perubahan dari v8.2:
- User biasa tidak memiliki pilihan periode pada halaman My KPI.
- User hanya melihat total kumulatif tahun berjalan sampai hari ini.
- KPI dihitung dari seluruh dokumen bulanan milik user dari Januari sampai bulan berjalan.
- Kaizen dihitung dari seluruh Kaizen user pada tahun berjalan dengan tanggal <= hari ini.
- Admin tetap memilih user dan periode bulanan untuk input/edit KPI.
- Saat admin memilih user/periode, data KPI bulan tersebut otomatis dimuat ke form.
- Daftar user tetap berasal dari collection users Firestore dan terisi otomatis setelah user pernah login.

Catatan:
Karena database direncanakan di-reset setiap tahun, tampilan user fokus pada total tahun berjalan.
Gunakan firestore.rules yang disertakan dan Publish di Firebase Console.
