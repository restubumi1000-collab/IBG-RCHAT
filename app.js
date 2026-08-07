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

const USERS = {
  restu: {
    email: "restubumi1000@gmail.com",
    name: "Restu"
  },
  susi: {
    email: "susiyulianti130697@gmail.com",
    name: "Susi"
  }
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

function normalizeId(id) {
  return id.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
}

function getUserById(id) {
  return USERS[normalizeId(id)] || null;
}

function getUserByEmail(email = "") {
  return Object.entries(USERS).find(([, value]) => value.email === email)?.[1] || null;
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

  unsubscribeMessages = onSnapshot(q, (snapshot) => {
    messagesEl.innerHTML = "";
    snapshot.forEach((docSnap) => {
      messagesEl.appendChild(renderMessage(docSnap, user.uid));
    });
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }, (error) => {
    console.error("Firestore read error:", error);
  });
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginError.textContent = "";

  const id = normalizeId(userIdInput.value);
  const password = passwordInput.value;
  const mappedUser = getUserById(id);

  if (!mappedUser) {
    loginError.textContent = "ID tidak terdaftar. Gunakan restu atau susi.";
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, mappedUser.email, password);
    loginForm.reset();
  } catch (error) {
    console.error("Login error:", error.code, error.message);
    loginError.textContent = "Password salah atau akun Firebase belum sesuai.";
  }
});

messageForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const user = auth.currentUser;
  const text = messageInput.value.trim();

  if (!user || !text) return;

  const mappedUser = getUserByEmail(user.email);
  const sender = mappedUser?.name || "User";

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
    const mappedUser = getUserByEmail(user.email);

    loginView.classList.add("hidden");
    chatView.classList.remove("hidden");
    currentUserLabel.textContent = `Login sebagai ${mappedUser?.name || "User"}`;
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
