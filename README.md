# IBG RCHAT - Multi User (ID + Password)

## Cara login
Pengguna hanya memasukkan **ID** dan **password** di halaman chat.

## Cara menambah user baru
1. Buka Firebase Console.
2. Masuk ke **Authentication > Users > Add user**.
3. Untuk email Firebase, gunakan format:

   `ID@users.ibgrchat.app`

   Contoh:
   - ID chat: `andi`
   - Email yang dibuat di Firebase: `andi@users.ibgrchat.app`
   - Password: tentukan sesuai kebutuhan.

4. Pengguna kemudian login di IBG RCHAT hanya dengan:
   - ID: `andi`
   - Password: password yang dibuat tadi.

Tidak perlu mengedit `app.js` setiap kali menambah user baru.

## Akun lama
Akun `restu` dan `susi` tetap kompatibel dengan email Firebase lama yang sudah dipakai sebelumnya.

## Catatan keamanan
Jangan aktifkan pendaftaran akun publik jika room ini memang bersifat privat. Pastikan Firestore Rules hanya mengizinkan user yang sudah login untuk membaca/menulis pesan.


## Warna member otomatis
Setiap member mendapatkan warna bubble yang berbeda secara otomatis berdasarkan UID Firebase. Warna user akan tetap konsisten setiap kali login dan user baru tidak perlu ditambahkan ke kode.
