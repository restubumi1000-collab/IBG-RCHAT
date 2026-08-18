import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCcrFosvzS-KXkH8gKt98eECn4zvoY3lVs",
  authDomain: "ibg-rchat.firebaseapp.com",
  projectId: "ibg-rchat",
  storageBucket: "ibg-rchat.firebasestorage.app",
  messagingSenderId: "623766599069",
  appId: "1:623766599069:web:651edb5f6dcbb6bdb8ab74"
};

// Semua user baru cukup dibuat di Firebase Authentication memakai format:
// ID "afu" -> email Firebase "afu@users.ibgrchat.app"
// Pengguna di halaman web tetap hanya mengetik ID + password.
const USER_EMAIL_DOMAIN = "users.ibgrchat.app";

// Kompatibilitas akun lama. Alias dapat menunjuk ke akun Firebase lama yang sama.
const LEGACY_USERS = {
  restu: { email: "restubumi1000@gmail.com", name: "Restu" },
  ibong: { email: "restubumi1000@gmail.com", name: "Ibong" },
  susi: { email: "susiyulianti130697@gmail.com", name: "Susi" }
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginView = document.getElementById("loginView");
const chatView = document.getElementById("chatView");
const loginForm = document.getElementById("loginForm");
const messageForm = document.getElementById("messageForm");
const userIdInput = document.getElementById("userId");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("loginError");
const messagesEl = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const logoutBtn = document.getElementById("logoutBtn");
const currentUserLabel = document.getElementById("currentUserLabel");

let unsubscribeMessages = null;

function normalizeId(value = "") {
  return value.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
}

function emailForId(id) {
  const normalizedId = normalizeId(id);
  if (!normalizedId) return "";
  return LEGACY_USERS[normalizedId]?.email || `${normalizedId}@${USER_EMAIL_DOMAIN}`;
}

function identityFromEmail(email = "") {
  const normalizedEmail = email.trim().toLowerCase();

  // Jika email adalah akun lama, gunakan nama default akun lama.
  // Karena Restu dan Ibong menunjuk email sama, pilih Ibong untuk tampilan utama.
  if (normalizedEmail === "restubumi1000@gmail.com") {
    return { id: "ibong", name: "Ibong" };
  }
  if (normalizedEmail === "susiyulianti130697@gmail.com") {
    return { id: "susi", name: "Susi" };
  }

  const suffix = `@${USER_EMAIL_DOMAIN}`;
  if (normalizedEmail.endsWith(suffix)) {
    const id = normalizedEmail.slice(0, -suffix.length);
    return { id, name: id };
  }

  const fallbackId = normalizedEmail.split("@")[0] || "user";
  return { id: fallbackId, name: fallbackId };
}

function displayName(identity) {
  const name = identity?.name || "User";
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function formatTime(timestamp) {
  if (!timestamp?.toDate) return "";
  return timestamp.toDate().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function renderMessage(docSnap, currentUid) {
  const data = docSnap.data();
  const item = document.createElement("div");
  item.className = `message ${data.uid === currentUid ? "mine" : "other"}`;

  const sender = document.createElement("div");
  sender.className = "sender";
  sender.textContent = data.sender || "User";

  const text = document.createElement("div");
  text.className = "text";
  text.textContent = data.text || "";

  const time = document.createElement("div");
  time.className = "time";
  time.textContent = formatTime(data.createdAt);

  item.append(sender, text, time);
  return item;
}

function listenToMessages(user) {
  if (unsubscribeMessages) unsubscribeMessages();

  const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));

  unsubscribeMessages = onSnapshot(
    q,
    (snapshot) => {
      messagesEl.innerHTML = "";
      snapshot.forEach((docSnap) => {
        messagesEl.appendChild(renderMessage(docSnap, user.uid));
      });
      messagesEl.scrollTop = messagesEl.scrollHeight;
    },
    (error) => {
      console.error("Firestore read error:", error);
    }
  );
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginError.textContent = "";

  const id = normalizeId(userIdInput.value);
  const password = passwordInput.value;

  if (!id) {
    loginError.textContent = "Masukkan ID yang valid.";
    return;
  }

  if (!password) {
    loginError.textContent = "Masukkan password.";
    return;
  }

  const email = emailForId(id);

  try {
    await signInWithEmailAndPassword(auth, email, password);
    loginForm.reset();
  } catch (error) {
    console.error("Login error:", error.code, error.message, "email:", email);
    loginError.textContent = "ID atau password salah. Pastikan user sudah dibuat di Firebase Authentication.";
  }
});

messageForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const user = auth.currentUser;
  const text = messageInput.value.trim();
  if (!user || !text) return;

  const identity = identityFromEmail(user.email || "");

  try {
    await addDoc(collection(db, "messages"), {
      text,
      sender: displayName(identity),
      uid: user.uid,
      createdAt: serverTimestamp()
    });

    messageInput.value = "";
    messageInput.focus();
  } catch (error) {
    console.error("Send message error:", error);
    alert("Pesan gagal dikirim. Cek Firestore Rules.");
  }
});

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    const identity = identityFromEmail(user.email || "");
    loginView.classList.add("hidden");
    chatView.classList.remove("hidden");
    currentUserLabel.textContent = `Login sebagai ${displayName(identity)}`;
    listenToMessages(user);
  } else {
    chatView.classList.add("hidden");
    loginView.classList.remove("hidden");
    messagesEl.innerHTML = "";

    if (unsubscribeMessages) {
      unsubscribeMessages();
      unsubscribeMessages = null;
    }
  }
});
