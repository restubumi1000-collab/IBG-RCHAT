NICCA Connect+ v8.2 - User Dropdown

Perubahan:
- Admin KPI memilih user dari dropdown, tidak perlu mengetik User ID.
- Daftar user berasal dari collection Firestore `users`.
- Setiap akun Firebase Authentication otomatis didaftarkan ke `users` saat akun tersebut login ke v8.2.
- Setelah user login minimal sekali, namanya muncul pada dropdown Admin KPI.

PENTING:
Browser/GitHub Pages tidak dapat mengambil daftar seluruh akun Firebase Authentication secara langsung. Itu dibatasi Firebase untuk keamanan. Versi ini memakai mirror collection `users` tanpa server tambahan dan tanpa Cloud Function.

Sesudah upload v8.2 ke GitHub:
1. Copy firestore.rules dari paket ini ke Firebase Console > Firestore Database > Rules.
2. Publish.
3. Login sekali menggunakan setiap user yang ingin dimunculkan pada dropdown.
4. Login kembali sebagai admin Restu > Admin.

Jika ingin semua akun Firebase Authentication langsung muncul bahkan sebelum pernah login, diperlukan backend Firebase Admin SDK / Cloud Function.
