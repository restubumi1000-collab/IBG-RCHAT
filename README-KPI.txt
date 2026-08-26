NICCA Connect+ v8.1 KPI Fix

Perbaikan dari v8:
- Identitas user tidak lagi ter-reset saat listener chat menerima update.
- Query Kaizen dibuat tanpa composite index tambahan Firestore.
- Jumlah dan daftar Kaizen langsung diperbarui setelah admin menambahkan Kaizen untuk user yang sedang login.
- Pesan error Kaizen menampilkan kode error yang lebih jelas.

Firestore Rules tetap harus mengizinkan admin membuat/mengubah collection kpi dan kaizen.
