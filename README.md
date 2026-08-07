# IBG RCHAT

Aplikasi chat room sederhana untuk 2 pengguna menggunakan Firebase Authentication + Cloud Firestore.

## Penting: format akun Firebase

Aplikasi mengubah ID menjadi email internal:

- ID `restu` -> `restu@ibg-rchat.local`
- ID `partner` -> `partner@ibg-rchat.local`

Jadi akun yang dibuat di Firebase Authentication harus mengikuti format tersebut.

## Firestore Rules

Gunakan:

```text
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{messageId} {
      allow read, create: if request.auth != null;
      allow update, delete: if false;
    }
  }
}
```

## Cara menjalankan

Jangan membuka index.html langsung dengan file:// jika browser bermasalah dengan module imports.
Gunakan GitHub Pages atau local web server.

## GitHub Pages

Upload:
- index.html
- style.css
- app.js

Lalu aktifkan GitHub Pages dari repository Settings > Pages.

Setelah URL GitHub Pages jadi, tambahkan domain GitHub Pages kamu ke:

Firebase Console > Authentication > Settings > Authorized domains

Contoh:
username.github.io

Jangan menambahkan https:// dan jangan menambahkan path repository.
