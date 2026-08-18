# IBG RCHAT - Multi User ID + Password

## Menambah user baru
1. Buka Firebase Console -> Authentication -> Users.
2. Klik Add user.
3. Gunakan email dengan format: ID@users.ibgrchat.app
   Contoh: afu@users.ibgrchat.app
4. Buat password.
5. Selesai. Tidak perlu mengedit app.js lagi.

## Cara login
Jika akun Firebase adalah `afu@users.ibgrchat.app`, pengguna cukup memasukkan:
- ID: `afu`
- Password: password Firebase akun tersebut

## Akun lama
Akun lama Restu/Ibong dan Susi tetap didukung melalui mapping legacy.

## Penting saat upload ke GitHub Pages
Upload/ganti minimal file berikut:
- index.html
- app.js
- style.css

`index.html` memakai `app.js?v=4` agar browser tidak terus memakai app.js versi lama dari cache.
Jika setelah upload halaman masih versi lama, lakukan hard refresh (Ctrl+F5).
