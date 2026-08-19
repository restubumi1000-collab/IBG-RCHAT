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

// Akun lama tetap bisa dipakai tanpa perlu diubah di Firebase.
const LEGACY_USERS = {
  restu: {
    email: "restubumi1000@gmail.com",
    name: "Restu"
  },
  susi: {
    email: "susiyulianti130697@gmail.com",
    name: "Susi"
  }
};

// User baru dibuat di Firebase Authentication dengan pola email berikut:
// ID: andi  -> email Firebase: andi@users.ibgrchat.app
// Di halaman chat, user tetap hanya mengetik ID "andi" + password.
const USER_EMAIL_DOMAIN = "users.ibgrchat.app";

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

function normalizeId(id) {
  return id.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
}

function idToFirebaseEmail(id) {
  const normalizedId = normalizeId(id);
  if (!normalizedId) return "";

  // Pertahankan akun lama Restu/Susi.
  if (LEGACY_USERS[normalizedId]) {
    return LEGACY_USERS[normalizedId].email;
  }

  return `${normalizedId}@${USER_EMAIL_DOMAIN}`;
}

function getIdentityFromEmail(email = "") {
  const normalizedEmail = email.trim().toLowerCase();

  const legacyEntry = Object.entries(LEGACY_USERS).find(
    ([, value]) => value.email.toLowerCase() === normalizedEmail
  );

  if (legacyEntry) {
    const [id, value] = legacyEntry;
    return { id, name: value.name };
  }

  const suffix = `@${USER_EMAIL_DOMAIN}`;
  if (normalizedEmail.endsWith(suffix)) {
    const id = normalizedEmail.slice(0, -suffix.length);
    return {
      id,
      name: id
    };
  }

  // Fallback jika ada akun Firebase lain.
  const fallbackId = normalizedEmail.split("@")[0] || "user";
  return { id: fallbackId, name: fallbackId };
}

function formatDisplayName(identity) {
  if (!identity?.name) return "User";
  return identity.name.charAt(0).toUpperCase() + identity.name.slice(1);
}

function formatTime(timestamp) {
  if (!timestamp?.toDate) return "";
  return timestamp.toDate().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

// Membuat warna yang konsisten dari UID Firebase.
// User yang sama akan selalu mendapatkan warna yang sama tanpa perlu diatur manual.
function memberHue(value = "user") {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash % 360;
}

function applyMemberColor(element, uid = "user") {
  const hue = memberHue(uid);
  element.style.setProperty("--member-bg", `hsl(${hue} 78% 91%)`);
  element.style.setProperty("--member-accent", `hsl(${hue} 58% 38%)`);
  element.style.setProperty("--member-border", `hsl(${hue} 58% 78%)`);
}

function renderMessage(docSnap, currentUid) {
  const data = docSnap.data();

  const item = document.createElement("div");
  item.className = `message ${data.uid === currentUid ? "mine" : "other"}`;
  applyMemberColor(item, data.uid || data.sender || docSnap.id);

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

  const email = idToFirebaseEmail(id);

  try {
    await signInWithEmailAndPassword(auth, email, password);
    loginForm.reset();
  } catch (error) {
    console.error("Login error:", error.code, error.message);
    loginError.textContent = "ID atau password salah.";
  }
});

messageForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const user = auth.currentUser;
  const text = messageInput.value.trim();

  if (!user || !text) return;

  const identity = getIdentityFromEmail(user.email || "");
  const sender = formatDisplayName(identity);

  try {
    await addDoc(collection(db, "messages"), {
      text,
      sender,
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
    const identity = getIdentityFromEmail(user.email || "");

    loginView.classList.add("hidden");
    chatView.classList.remove("hidden");
    currentUserLabel.textContent = `Login sebagai ${formatDisplayName(identity)}`;
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
