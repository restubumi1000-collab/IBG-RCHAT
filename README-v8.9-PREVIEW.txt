NICCA Connect+ v8.9 Preview — Excel Import Step 2

Added:
- Admin Excel file picker (.xlsx/.xls)
- Reads sheet KPI_INPUT
- Preview table before Firestore
- Validation: User_ID, date, category, amount
- Invalid rows highlighted
- No Excel data is written to Firestore in this version

Expected columns:
User_ID, Nama, Tanggal, Kategori, Jumlah, Keterangan, Input_By

Supported categories in preview:
Kaizen, Cuti, Terlambat, LDP, Alpha, Produk NG, Komplain, Lembur, Kecelakaan Kerja

NOTE:
Kaizen currently uses a separate Firestore collection in v8.8. Import behavior for Kaizen will be handled carefully in the next step before Firestore writing is enabled.
