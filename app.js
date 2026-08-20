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
  onSnapshot,
  doc, getDoc, setDoc, getDocs, where
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
const togglePassword = document.getElementById("togglePassword");

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

function initials(name = "User") {
  const cleaned = String(name).trim();
  if (!cleaned) return "U";
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return cleaned.slice(0, 1).toUpperCase();
}

function renderMessage(docSnap, currentUid) {
  const data = docSnap.data();
  const mine = data.uid === currentUid;

  const row = document.createElement("div");
  row.className = `message-row ${mine ? "mine" : "other"}`;
  applyMemberColor(row, data.uid || data.sender || docSnap.id);

  const avatar = document.createElement("div");
  avatar.className = "member-avatar";
  avatar.textContent = initials(data.sender || "User");

  const stack = document.createElement("div");
  stack.className = "message-stack";

  const sender = document.createElement("div");
  sender.className = "sender";
  sender.textContent = data.sender || "User";

  const bubble = document.createElement("div");
  bubble.className = "message";

  const text = document.createElement("div");
  text.className = "text";
  text.textContent = data.text || "";

  const time = document.createElement("div");
  time.className = "time";
  time.textContent = formatTime(data.createdAt);

  bubble.append(text, time);
  stack.append(sender, bubble);

  if (mine) {
    row.append(stack, avatar);
  } else {
    row.append(avatar, stack);
  }

  return row;
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

togglePassword?.addEventListener("click", () => {
  const showing = passwordInput.type === "text";
  passwordInput.type = showing ? "password" : "text";
  togglePassword.textContent = showing ? "◉" : "◎";
  togglePassword.setAttribute("aria-label", showing ? "Tampilkan password" : "Sembunyikan password");
});

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
    currentUserLabel.textContent = `${formatDisplayName(identity)} • Online`;
    listenToMessages(user);
    setupKpiUser(user);
  } else {
    chatView.classList.add("hidden");
    loginView.classList.remove("hidden");
    messagesEl.innerHTML = "";
    activeIdentity = null;
    showPanel("chatPanel");

    if (unsubscribeMessages) {
      unsubscribeMessages();
      unsubscribeMessages = null;
    }
  }
});


// ================= KPI MODULE =================
const ADMIN_IDS = ["restu"]; // Tambahkan ID admin lain di sini bila diperlukan.
const panels = ["chatPanel","kpiPanel","kaizenPanel","kaizenDetailPanel","adminPanel"];
const kpiPeriod = document.getElementById("kpiPeriod");
const adminNav = document.getElementById("adminNav");
let activeIdentity = null;

function currentPeriod(){ return new Date().toISOString().slice(0,7); }
function showPanel(id){ panels.forEach(x=>document.getElementById(x)?.classList.toggle("hidden",x!==id)); document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.view===id)); }
document.querySelectorAll(".nav-btn").forEach(b=>b.addEventListener("click",()=>{ showPanel(b.dataset.view); if(b.dataset.view==="kpiPanel" && activeIdentity) loadKPI(activeIdentity.id,kpiPeriod.value); }));

function setKpi(data={}){
  const map={kpiAlpha:"alpha",kpiCuti:"cuti",kpiTerlambat:"terlambat",kpiLdp:"ldp",kpiKecelakaan:"kecelakaanKerja",kpiKomplain:"komplain",kpiProdukNg:"produkNG",kpiLembur:"lembur"};
  Object.entries(map).forEach(([el,key])=>document.getElementById(el).textContent=data[key]??0);
}
async function loadKPI(userId,period){
  setKpi({});
  const snap=await getDoc(doc(db,"kpi",`${normalizeId(userId)}_${period}`));
  if(snap.exists()) setKpi(snap.data());
  await loadKaizen(userId,period);
}
async function loadKaizen(userId,period){
  const normalizedUserId = normalizeId(userId);
  const qk = query(
    collection(db,"kaizen"),
    where("userId","==",normalizedUserId)
  );

  const snap = await getDocs(qk);
  const docs = [];

  snap.forEach(ds => {
    const d = ds.data();
    if (String(d.date || "").slice(0,7) === period) {
      docs.push(d);
    }
  });

  document.getElementById("kpiKaizen").textContent = docs.length;

  const list = document.getElementById("kaizenList");
  list.innerHTML = "";

  if (!docs.length) {
    list.innerHTML = '<div class="kaizen-item muted">Belum ada Kaizen pada periode ini.</div>';
    return;
  }

  docs
    .sort((a,b) => String(b.date || "").localeCompare(String(a.date || "")))
    .forEach(d => {
      const el = document.createElement("div");
      el.className = "kaizen-item";
      const h = document.createElement("h4");
      h.textContent = d.title || "Tanpa judul";
      const p = document.createElement("div");
      p.className = "muted";
      p.textContent = d.date || "";
      el.append(h,p);
      el.onclick = () => showKaizenDetail(d);
      list.append(el);
    });
}
function showKaizenDetail(d){ showPanel("kaizenDetailPanel"); document.getElementById("detailTitle").textContent=d.title||"-"; document.getElementById("detailDate").textContent=d.date||"-"; document.getElementById("detailCategory").textContent=d.category||"-"; document.getElementById("detailStatus").textContent=d.status||"-"; document.getElementById("detailDescription").textContent=d.description||"-"; }
document.getElementById("kaizenCard")?.addEventListener("click",()=>showPanel("kaizenPanel"));
document.getElementById("backKpi")?.addEventListener("click",()=>showPanel("kpiPanel"));
document.getElementById("backKaizen")?.addEventListener("click",()=>showPanel("kaizenPanel"));
kpiPeriod.value=currentPeriod(); kpiPeriod.addEventListener("change",()=>activeIdentity&&loadKPI(activeIdentity.id,kpiPeriod.value));

function num(id){ return Number(document.getElementById(id).value)||0; }
document.getElementById("kpiAdminForm")?.addEventListener("submit",async e=>{ e.preventDefault(); const uid=normalizeId(document.getElementById("adminUserId").value), period=document.getElementById("adminPeriod").value, status=document.getElementById("adminKpiStatus"); try{ await setDoc(doc(db,"kpi",`${uid}_${period}`),{userId:uid,period,alpha:num("adminAlpha"),cuti:num("adminCuti"),terlambat:num("adminTerlambat"),ldp:num("adminLdp"),kecelakaanKerja:num("adminKecelakaan"),komplain:num("adminKomplain"),produkNG:num("adminProdukNg"),lembur:num("adminLembur"),updatedAt:serverTimestamp()},{merge:true}); status.textContent="KPI berhasil disimpan."; }catch(err){ console.error(err); status.textContent="Gagal menyimpan. Periksa Firestore Rules."; } });
document.getElementById("kaizenAdminForm")?.addEventListener("submit", async e => {
  e.preventDefault();
  const status = document.getElementById("adminKaizenStatus");
  const kaizenUserId = normalizeId(document.getElementById("kaizenUserId").value);
  const kaizenDate = document.getElementById("kaizenDate").value;

  try {
    await addDoc(collection(db,"kaizen"), {
      userId: kaizenUserId,
      date: kaizenDate,
      title: document.getElementById("kaizenTitle").value.trim(),
      category: document.getElementById("kaizenCategory").value.trim(),
      status: document.getElementById("kaizenStatus").value,
      description: document.getElementById("kaizenDescription").value.trim(),
      createdAt: serverTimestamp()
    });

    status.textContent = "Kaizen berhasil ditambahkan.";

    // Langsung perbarui angka/list jika Kaizen ditambahkan untuk user yang sedang login.
    if (activeIdentity && kaizenUserId === normalizeId(activeIdentity.id)) {
      const period = kaizenDate.slice(0,7);
      kpiPeriod.value = period;
      await loadKaizen(activeIdentity.id, period);
    }

    e.target.reset();
    document.getElementById("kaizenUserId").value = kaizenUserId;
    document.getElementById("kaizenDate").value = new Date().toISOString().slice(0,10);
  } catch(err) {
    console.error(err);
    status.textContent = `Gagal menambah Kaizen: ${err.code || err.message || "unknown error"}`;
  }
});

async function setupKpiUser(user){
  activeIdentity=getIdentityFromEmail(user.email||"");
  kpiPeriod.value=currentPeriod(); document.getElementById("adminPeriod").value=currentPeriod(); document.getElementById("kaizenDate").value=new Date().toISOString().slice(0,10);
  let isAdmin=ADMIN_IDS.includes(activeIdentity.id);
  try{ const profile=await getDoc(doc(db,"users",user.uid)); if(profile.exists() && profile.data().role==="admin") isAdmin=true; }catch(e){ console.warn("Profile role not available",e); }
  adminNav.classList.toggle("hidden",!isAdmin);
  if(isAdmin){ document.getElementById("adminUserId").value=activeIdentity.id; document.getElementById("kaizenUserId").value=activeIdentity.id; }
  loadKPI(activeIdentity.id,kpiPeriod.value).catch(console.error);
}
