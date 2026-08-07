# IBG RCHAT v2

Login yang dipakai:

- ID: restu -> Firebase email: restubumi1000@gmail.com
- ID: susi -> Firebase email: susiyulianti130697@gmail.com

Password tetap menggunakan password masing-masing akun di Firebase Authentication.

## File yang perlu di-upload ke GitHub

- index.html
- style.css
- app.js

Timpa file versi lama dengan file versi ini.

## Firestore Rules

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

## Login

Di halaman web cukup ketik:

restu
atau
susi

Tidak perlu mengetik alamat Gmail.
