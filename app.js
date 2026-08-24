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
  doc, getDoc, setDoc, getDocs, where, updateDoc, deleteDoc
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


// ================= KPI MODULE v8.7 =================
const ADMIN_IDS = ["restu"];
const panels = ["chatPanel","kpiPanel","historyPanel","kaizenPanel","kaizenDetailPanel","adminPanel"];
const adminNav = document.getElementById("adminNav");
let activeIdentity = null;
let adminUsers = [];
let editingHistoryId = null;

const KPI_META = {
  alpha: { label: "Alpha", unit: "hari", step: 1 },
  cuti: { label: "Cuti", unit: "hari", step: 1 },
  terlambat: { label: "Terlambat", unit: "kali", step: 1 },
  ldp: { label: "LDP", unit: "kali", step: 1 },
  kecelakaanKerja: { label: "Kecelakaan Kerja", unit: "kasus", step: 1 },
  komplain: { label: "Komplain", unit: "kasus", step: 1 },
  produkNG: { label: "Produk NG", unit: "kasus", step: 1 },
  lembur: { label: "Lembur", unit: "jam", step: 0.5 }
};

async function ensureUserProfile(user) {
  const identity = getIdentityFromEmail(user.email || "");
  const ref = doc(db, "users", user.uid);
  const existing = await getDoc(ref);
  const payload = {
    uid: user.uid,
    id: normalizeId(identity.id),
    name: formatDisplayName(identity),
    email: user.email || "",
    lastLoginAt: serverTimestamp()
  };
  if (!existing.exists()) payload.role = "user";
  await setDoc(ref, payload, { merge: true });
}

function fillUserSelect(selectId, selectedId = "") {
  const select = document.getElementById(selectId);
  if (!select) return;
  select.innerHTML = '<option value="">-- Pilih user --</option>';
  adminUsers.forEach(u => {
    const option = document.createElement("option");
    option.value = u.id;
    option.textContent = `${u.name || u.id} (${u.id})`;
    select.appendChild(option);
  });
  const normalized = normalizeId(selectedId);
  if (normalized && adminUsers.some(u => u.id === normalized)) select.value = normalized;
}

async function loadAdminUsers(selectedId = "") {
  const snap = await getDocs(collection(db, "users"));
  adminUsers = [];
  snap.forEach(ds => {
    const d = ds.data();
    const id = normalizeId(d.id || "");
    if (id) adminUsers.push({ uid: ds.id, id, name: d.name || id, email: d.email || "" });
  });
  adminUsers.sort((a,b) => String(a.name).localeCompare(String(b.name), "id"));
  fillUserSelect("historyUserId", selectedId);
  fillUserSelect("kaizenUserId", selectedId);
}

function localDateParts(){
  const d=new Date();
  const y=d.getFullYear();
  const m=String(d.getMonth()+1).padStart(2,"0");
  const day=String(d.getDate()).padStart(2,"0");
  return {year:String(y), period:`${y}-${m}`, date:`${y}-${m}-${day}`};
}

function showPanel(id){
  panels.forEach(x=>document.getElementById(x)?.classList.toggle("hidden",x!==id));
  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.view===id));
}

document.querySelectorAll(".nav-btn").forEach(b=>b.addEventListener("click",()=>{
  showPanel(b.dataset.view);
  if(b.dataset.view==="kpiPanel" && activeIdentity) loadUserTotals(activeIdentity.id);
  if(b.dataset.view==="adminPanel" && activeIdentity) {
    loadAdminUsers(activeIdentity.id).then(()=>loadAdminHistory()).catch(console.error);
  }
}));

function setKpi(data={}){
  const map={kpiAlpha:"alpha",kpiCuti:"cuti",kpiTerlambat:"terlambat",kpiLdp:"ldp",kpiKecelakaan:"kecelakaanKerja",kpiKomplain:"komplain",kpiProdukNg:"produkNG",kpiLembur:"lembur"};
  Object.entries(map).forEach(([el,key])=>document.getElementById(el).textContent=data[key]??0);
}

function formatAsOfToday(){
  const el=document.getElementById("kpiAsOf");
  if(!el) return;
  el.textContent=`Total s.d. ${new Date().toLocaleDateString("id-ID",{day:"2-digit",month:"long",year:"numeric"})}`;
}

function formatDateId(value=""){
  if(!value) return "-";
  const [y,m,d]=String(value).split("-").map(Number);
  if(!y || !m || !d) return value;
  return new Date(y,m-1,d).toLocaleDateString("id-ID",{day:"2-digit",month:"long",year:"numeric"});
}

async function getHistoryDocsForUser(userId){
  const qh=query(collection(db,"kpi_history"),where("userId","==",normalizeId(userId)));
  const snap=await getDocs(qh);
  return snap.docs.map(ds=>({id:ds.id,...ds.data()}));
}

async function loadUserTotals(userId){
  setKpi({});
  formatAsOfToday();
  const normalizedUserId=normalizeId(userId);
  const now=localDateParts();
  const totals={alpha:0,cuti:0,terlambat:0,ldp:0,kecelakaanKerja:0,komplain:0,produkNG:0,lembur:0};

  // Data lama v8.5 tetap dihitung agar total lama tidak hilang.
  const qkpi=query(collection(db,"kpi"),where("userId","==",normalizedUserId));
  const kpiSnap=await getDocs(qkpi);
  kpiSnap.forEach(ds=>{
    const d=ds.data();
    const period=String(d.period||"");
    if(period.slice(0,4)===now.year && period<=now.period){
      Object.keys(totals).forEach(key=>{ totals[key]+=Number(d[key])||0; });
    }
  });

  // Mulai v8.6 setiap input baru tersimpan sebagai riwayat individual.
  const historyDocs=await getHistoryDocsForUser(normalizedUserId);
  historyDocs.forEach(d=>{
    const date=String(d.date||"");
    if(date && date.slice(0,4)===now.year && date<=now.date && KPI_META[d.type]){
      totals[d.type]+=Number(d.value)||0;
    }
  });

  setKpi(totals);
  await loadAllKaizenToToday(normalizedUserId);
}

async function loadAllKaizenToToday(userId){
  const now=localDateParts();
  const qk=query(collection(db,"kaizen"),where("userId","==",normalizeId(userId)));
  const snap=await getDocs(qk);
  const docs=[];
  snap.forEach(ds=>{
    const d=ds.data();
    const date=String(d.date||"");
    if(date && date.slice(0,4)===now.year && date<=now.date) docs.push(d);
  });
  document.getElementById("kpiKaizen").textContent=docs.length;
  const list=document.getElementById("kaizenList");
  list.innerHTML="";
  if(!docs.length){
    list.innerHTML='<div class="kaizen-item muted">Belum ada Kaizen sampai hari ini.</div>';
    return;
  }
  docs.sort((a,b)=>String(b.date||"").localeCompare(String(a.date||""))).forEach(d=>{
    const el=document.createElement("div");
    el.className="kaizen-item";
    const h=document.createElement("h4"); h.textContent=d.title||"Tanpa judul";
    const p=document.createElement("div"); p.className="muted"; p.textContent=formatDateId(d.date||"");
    el.append(h,p); el.onclick=()=>showKaizenDetail(d); list.append(el);
  });
}

function showKaizenDetail(d){
  showPanel("kaizenDetailPanel");
  document.getElementById("detailTitle").textContent=d.title||"-";
  document.getElementById("detailDate").textContent=formatDateId(d.date||"");
  document.getElementById("detailCategory").textContent=d.category||"-";
  document.getElementById("detailStatus").textContent=d.status||"-";
  document.getElementById("detailDescription").textContent=d.description||"-";
}

document.getElementById("kaizenCard")?.addEventListener("click",()=>showPanel("kaizenPanel"));
document.getElementById("backKpi")?.addEventListener("click",()=>showPanel("kpiPanel"));
document.getElementById("backKaizen")?.addEventListener("click",()=>showPanel("kaizenPanel"));
document.getElementById("backHistoryKpi")?.addEventListener("click",()=>showPanel("kpiPanel"));

// ---------- USER HISTORY ----------
document.querySelectorAll(".history-card").forEach(card=>{
  card.addEventListener("click",()=>openUserHistory(card.dataset.historyType));
});

async function openUserHistory(type){
  if(!activeIdentity || !KPI_META[type]) return;
  showPanel("historyPanel");
  const meta=KPI_META[type];
  document.getElementById("historyTitle").textContent=`Riwayat ${meta.label}`;
  document.getElementById("historySummary").textContent="Memuat...";
  const list=document.getElementById("historyList");
  list.innerHTML='<div class="history-item muted">Memuat riwayat...</div>';
  try{
    const now=localDateParts();
    const docs=(await getHistoryDocsForUser(activeIdentity.id))
      .filter(d=>d.type===type && String(d.date||"").slice(0,4)===now.year && String(d.date||"")<=now.date)
      .sort((a,b)=>String(b.date||"").localeCompare(String(a.date||"")));
    const total=docs.reduce((sum,d)=>sum+(Number(d.value)||0),0);
    document.getElementById("historySummary").textContent=`${docs.length} catatan • total riwayat ${total} ${meta.unit}`;
    list.innerHTML="";
    if(!docs.length){
      list.innerHTML='<div class="history-item muted">Belum ada riwayat detail untuk item ini. Data total lama dari v8.5 tetap dapat muncul di kartu KPI.</div>';
      return;
    }
    docs.forEach(d=>list.appendChild(buildHistoryItem(d,false)));
  }catch(err){
    console.error(err);
    list.innerHTML='<div class="history-item error-text">Gagal memuat histori. Periksa Firestore Rules.</div>';
  }
}

function buildHistoryItem(d, adminMode=false){
  const meta=KPI_META[d.type]||{label:d.type||"KPI",unit:d.unit||""};
  const item=document.createElement("div");
  item.className="history-item";
  const top=document.createElement("div"); top.className="history-item-top";
  const left=document.createElement("div");
  const title=document.createElement("h4"); title.textContent=adminMode?meta.label:formatDateId(d.date);
  const date=document.createElement("div"); date.className="muted"; date.textContent=adminMode?formatDateId(d.date):`${Number(d.value)||0} ${d.unit||meta.unit}`;
  left.append(title,date);
  const badge=document.createElement("div"); badge.className="history-value"; badge.textContent=`${Number(d.value)||0} ${d.unit||meta.unit}`;
  top.append(left,badge);
  item.append(top);
  if(d.note){ const note=document.createElement("p"); note.className="history-note"; note.textContent=d.note; item.append(note); }
  if(adminMode){
    const actions=document.createElement("div"); actions.className="history-actions";
    const edit=document.createElement("button"); edit.className="back-btn small-btn"; edit.type="button"; edit.textContent="✏️ Edit"; edit.onclick=()=>startEditHistory(d);
    const del=document.createElement("button"); del.className="danger-btn small-btn"; del.type="button"; del.textContent="🗑️ Hapus"; del.onclick=()=>removeHistory(d);
    actions.append(edit,del); item.append(actions);
  }
  return item;
}

// ---------- ADMIN HISTORY ----------
function selectedUserRecord(){
  const id=normalizeId(document.getElementById("historyUserId")?.value||"");
  return adminUsers.find(u=>u.id===id)||null;
}

function updateHistoryTypeUI(){
  const type=document.getElementById("historyType").value;
  const meta=KPI_META[type]||KPI_META.alpha;
  document.getElementById("historyUnitLabel").textContent=meta.unit;
  const value=document.getElementById("historyValue");
  value.step=String(meta.step);
  if(!editingHistoryId && Number(value.value)===0) value.value="1";
}

document.getElementById("historyType")?.addEventListener("change",updateHistoryTypeUI);
document.getElementById("historyUserId")?.addEventListener("change",()=>{ cancelEditHistory(); loadAdminHistory(); });
document.getElementById("historyMonthFilter")?.addEventListener("change",loadAdminHistory);
document.getElementById("historyAdminForm")?.addEventListener("submit",async e=>{
  e.preventDefault();
  const status=document.getElementById("adminHistoryStatus");
  const user=selectedUserRecord();
  const type=document.getElementById("historyType").value;
  const meta=KPI_META[type];
  const date=document.getElementById("historyDate").value;
  const value=Number(document.getElementById("historyValue").value)||0;
  const note=document.getElementById("historyNote").value.trim();
  if(!user || !meta || !date){ status.textContent="Pilih user, jenis KPI, dan tanggal."; return; }
  if(value<=0){ status.textContent="Jumlah harus lebih dari 0."; return; }
  const payload={userId:user.id,ownerUid:user.uid,type,date,value,unit:meta.unit,note,updatedAt:serverTimestamp()};
  try{
    if(editingHistoryId){
      await updateDoc(doc(db,"kpi_history",editingHistoryId),payload);
      status.textContent="Riwayat berhasil diperbarui.";
    }else{
      await addDoc(collection(db,"kpi_history"),{...payload,createdBy:activeIdentity?.id||"admin",createdByUid:auth.currentUser?.uid||"",createdAt:serverTimestamp()});
      status.textContent="Riwayat berhasil ditambahkan. Form sudah direset.";
    }
    const keepUser=user.id;
    resetHistoryForm(keepUser);
    await loadAdminHistory();
    if(activeIdentity && keepUser===normalizeId(activeIdentity.id)) await loadUserTotals(activeIdentity.id);
  }catch(err){
    console.error(err);
    status.textContent=`Gagal menyimpan riwayat: ${err.code||err.message||"unknown error"}`;
  }
});

document.getElementById("cancelEditHistoryBtn")?.addEventListener("click",()=>cancelEditHistory());

function resetHistoryForm(keepUser=""){
  editingHistoryId=null;
  document.getElementById("historyFormTitle").textContent="Tambah Riwayat KPI";
  document.getElementById("saveHistoryBtn").textContent="Simpan Riwayat";
  document.getElementById("cancelEditHistoryBtn").classList.add("hidden");
  document.getElementById("historyAdminForm").reset();
  document.getElementById("historyUserId").value=normalizeId(keepUser);
  document.getElementById("historyDate").value=localDateParts().date;
  document.getElementById("historyType").value="alpha";
  document.getElementById("historyValue").value="1";
  updateHistoryTypeUI();
}

function cancelEditHistory(){
  const keep=document.getElementById("historyUserId")?.value||activeIdentity?.id||"";
  resetHistoryForm(keep);
  document.getElementById("adminHistoryStatus").textContent="";
}

function startEditHistory(d){
  editingHistoryId=d.id;
  document.getElementById("historyFormTitle").textContent="Edit Riwayat KPI";
  document.getElementById("saveHistoryBtn").textContent="Simpan Perubahan";
  document.getElementById("cancelEditHistoryBtn").classList.remove("hidden");
  document.getElementById("historyUserId").value=normalizeId(d.userId||"");
  document.getElementById("historyType").value=d.type||"alpha";
  document.getElementById("historyDate").value=d.date||localDateParts().date;
  document.getElementById("historyValue").value=Number(d.value)||1;
  document.getElementById("historyNote").value=d.note||"";
  updateHistoryTypeUI();
  document.getElementById("historyAdminForm").scrollIntoView({behavior:"smooth",block:"start"});
}

async function removeHistory(d){
  if(!confirm(`Hapus riwayat ${KPI_META[d.type]?.label||d.type} tanggal ${formatDateId(d.date)}?`)) return;
  const status=document.getElementById("adminHistoryStatus");
  try{
    await deleteDoc(doc(db,"kpi_history",d.id));
    status.textContent="Riwayat berhasil dihapus.";
    if(editingHistoryId===d.id) cancelEditHistory();
    await loadAdminHistory();
    if(activeIdentity && normalizeId(d.userId)===normalizeId(activeIdentity.id)) await loadUserTotals(activeIdentity.id);
  }catch(err){
    console.error(err);
    status.textContent=`Gagal menghapus: ${err.code||err.message||"unknown error"}`;
  }
}



async function loadAdminHistory(){
  const list=document.getElementById("adminHistoryList");
  if(!list) return;
  const userId=normalizeId(document.getElementById("historyUserId")?.value||"");
  if(!userId){ list.innerHTML='<div class="muted">Pilih user untuk melihat riwayat.</div>'; return; }
  list.innerHTML='<div class="muted">Memuat...</div>';
  try{
    let docs=await getHistoryDocsForUser(userId);
    const month=document.getElementById("historyMonthFilter")?.value||"";
    if(month) docs=docs.filter(d=>String(d.date||"").startsWith(month));
    docs.sort((a,b)=>String(b.date||"").localeCompare(String(a.date||"")));
    list.innerHTML="";
    if(!docs.length){ list.innerHTML='<div class="muted">Belum ada riwayat KPI untuk filter ini.</div>'; return; }
    docs.forEach(d=>list.appendChild(buildHistoryItem(d,true)));
  }catch(err){
    console.error(err);
    list.innerHTML='<div class="error-text">Gagal memuat riwayat admin.</div>';
  }
}

// ---------- KAIZEN ADMIN ----------
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
    if (activeIdentity && kaizenUserId === normalizeId(activeIdentity.id)) await loadUserTotals(activeIdentity.id);
    e.target.reset();
    document.getElementById("kaizenUserId").value = kaizenUserId;
    document.getElementById("kaizenDate").value = localDateParts().date;
  } catch(err) {
    console.error(err);
    status.textContent = `Gagal menambah Kaizen: ${err.code || err.message || "unknown error"}`;
  }
});

async function setupKpiUser(user){
  activeIdentity=getIdentityFromEmail(user.email||"");
  document.getElementById("historyDate").value=localDateParts().date;
  document.getElementById("kaizenDate").value=localDateParts().date;
  updateHistoryTypeUI();
  try { await ensureUserProfile(user); } catch (e) { console.warn("User profile could not be registered", e); }
  let isAdmin=ADMIN_IDS.includes(activeIdentity.id);
  try{
    const profile=await getDoc(doc(db,"users",user.uid));
    if(profile.exists() && profile.data().role==="admin") isAdmin=true;
  }catch(e){ console.warn("Profile role not available",e); }
  adminNav.classList.toggle("hidden",!isAdmin);
  if(isAdmin){
    try {
      await loadAdminUsers(activeIdentity.id);
      resetHistoryForm(activeIdentity.id);
      await loadAdminHistory();
    } catch (e) { console.error("Failed loading user list", e); }
  }
  loadUserTotals(activeIdentity.id).catch(console.error);
}

