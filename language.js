/* NICCA Connect+ v9.0 - UI-only translations. Firestore values and user content stay unchanged. */
(() => {
  'use strict';
  const rows = [
    ['LOGIN','ログイン','LOGIN'],['Tampilkan password','パスワードを表示','Show password'],['Sembunyikan password','パスワードを隠す','Hide password'],
    ['Online','オンライン','Online'],['General Chat','全体チャット','General Chat'],['Type a message...','メッセージを入力...','Type a message...'],
    ['Tarik untuk refresh','下に引いて更新','Pull to refresh'],['Lepaskan untuk refresh','離して更新','Release to refresh'],['Memperbarui...','更新中...','Refreshing...'],['Gagal memperbarui','更新に失敗しました','Refresh failed'],
    ['My KPI','自分のKPI','My KPI'],['Total sampai hari ini','本日までの合計','Total through today'],['Lihat histori ›','履歴を見る ›','View history ›'],
    ['hari • lihat histori ›','日 • 履歴を見る ›','days • view history ›'],['kali • lihat histori ›','回 • 履歴を見る ›','times • view history ›'],['kasus • lihat histori ›','件 • 履歴を見る ›','cases • view history ›'],['jam • lihat histori ›','時間 • 履歴を見る ›','hours • view history ›'],
    ['Kaizen','改善提案','Kaizen'],['Alpha','無断欠勤','Unexcused Absence'],['Cuti','休暇','Leave'],['Terlambat','遅刻','Late Arrival'],['LDP','早退','Early Leave'],['Kecelakaan Kerja','労働災害','Workplace Accident'],['Komplain','クレーム','Complaint'],['Produk NG','不良品','Defective Products'],['Lembur','残業','Overtime'],
    ['hari','日','days'],['kali','回','times'],['kasus','件','cases'],['jam','時間','hours'],
    ['Riwayat KPI','KPI履歴','KPI History'],['Daftar Kaizen','改善提案一覧','Kaizen List'],['Tanggal','日付','Date'],['Kategori','カテゴリー','Category'],['Status','ステータス','Status'],['Deskripsi','説明','Description'],
    ['Admin KPI History','管理者 KPI履歴','Admin KPI History'],['Tambah kejadian berdasarkan tanggal. Total user dihitung otomatis.','日付ごとに記録を追加します。ユーザーの合計は自動計算されます。','Add records by date. User totals are calculated automatically.'],
    ['Tambah Riwayat KPI','KPI履歴を追加','Add KPI Record'],['Edit Riwayat KPI','KPI履歴を編集','Edit KPI Record'],['Pilih User','ユーザーを選択','Select User'],['Memuat daftar user...','ユーザー一覧を読み込み中...','Loading users...'],['-- Pilih user --','-- ユーザーを選択 --','-- Select user --'],['Jenis KPI','KPIの種類','KPI Type'],['Jumlah (','数量 (','Amount ('],['Jumlah','数量','Amount'],['Keterangan','備考','Notes'],['Simpan Riwayat','履歴を保存','Save Record'],['Simpan Perubahan','変更を保存','Save Changes'],['Batal Edit','編集をキャンセル','Cancel Edit'],
    ['Riwayat User','ユーザー履歴','User History'],['Edit atau hapus jika ada salah input.','入力ミスがあれば編集または削除してください。','Edit or delete incorrect entries.'],['Filter Bulan','月で絞り込み','Filter Month'],['Tambah Kaizen','改善提案を追加','Add Kaizen'],['Edit Kaizen','改善提案を編集','Edit Kaizen'],['Judul','タイトル','Title'],['Riwayat Kaizen User','ユーザーの改善提案履歴','User Kaizen History'],['Pilih user di atas. Admin dapat edit atau hapus satu Kaizen.','上でユーザーを選択してください。管理者は各改善提案を編集・削除できます。','Select a user above. Admin can edit or delete individual Kaizen entries.'],
    ['Import Excel','Excelインポート','Import Excel'],['Pilih template KPI Excel, pilih tanggal, cek preview, lalu konfirmasi untuk mengirim data valid ke Firestore.','KPI Excelテンプレートを選択し、日付とプレビューを確認してからFirestoreに登録します。','Select a KPI Excel template, choose a date, review the preview, then confirm valid data for Firestore.'],
    ['📄 Pilih File Excel','📄 Excelファイルを選択','📄 Choose Excel File'],['Bersihkan','クリア','Clear'],['Tanggal Preview / Import','プレビュー・インポート日付','Preview / Import Date'],['Hanya baris pada tanggal yang dipilih yang akan ditampilkan.','選択した日付の行のみ表示されます。','Only rows matching the selected date will be displayed.'],['Preview KPI_INPUT','KPI_INPUTプレビュー','KPI_INPUT Preview'],['Nama','名前','Name'],['Input_By','入力者','Entered By'],['Data duplikat dari Excel akan dilewati otomatis. Untuk Kaizen, Jumlah harus 1 dan Keterangan digunakan sebagai judul Kaizen.','Excelの重複データは自動的にスキップします。改善提案は数量を1とし、備考をタイトルとして使用します。','Duplicate Excel records are skipped automatically. For Kaizen, Amount must be 1 and Notes is used as the title.'],['✅ Konfirmasi Import ke Firestore','✅ Firestoreへのインポートを確定','✅ Confirm Import to Firestore'],
    ['Belum ada Kaizen sampai hari ini.','本日までの改善提案はありません。','No Kaizen records through today.'],['Tanpa judul','タイトルなし','Untitled'],['Tanpa kategori','カテゴリーなし','Uncategorized'],['Memuat...','読み込み中...','Loading...'],['Memuat riwayat...','履歴を読み込み中...','Loading history...'],['Memuat riwayat Kaizen...','改善提案履歴を読み込み中...','Loading Kaizen history...'],['Belum ada riwayat KPI untuk filter ini.','この条件のKPI履歴はありません。','No KPI history for this filter.'],['Belum ada Kaizen untuk user ini.','このユーザーの改善提案はありません。','No Kaizen records for this user.'],['Pilih user untuk melihat riwayat.','履歴を表示するユーザーを選択してください。','Select a user to view history.'],['Pilih user untuk melihat riwayat Kaizen.','改善提案履歴を表示するユーザーを選択してください。','Select a user to view Kaizen history.'],['Belum ada riwayat detail untuk item ini. Data total lama dari v8.5 tetap dapat muncul di kartu KPI.','この項目の詳細履歴はありません。v8.5の過去の合計はKPIカードに表示される場合があります。','No detailed history for this item. Legacy v8.5 totals may still appear on the KPI card.'],
    ['Gagal memuat histori. Periksa Firestore Rules.','履歴を読み込めません。Firestoreルールを確認してください。','Failed to load history. Check Firestore Rules.'],['Gagal memuat riwayat admin.','管理者履歴を読み込めません。','Failed to load admin history.'],['Gagal memuat riwayat Kaizen.','改善提案履歴を読み込めません。','Failed to load Kaizen history.'],['Riwayat berhasil diperbarui.','履歴を更新しました。','Record updated.'],['Riwayat berhasil ditambahkan. Form sudah direset.','履歴を追加しました。フォームをリセットしました。','Record added. Form has been reset.'],['Riwayat berhasil dihapus.','履歴を削除しました。','Record deleted.'],['Kaizen berhasil diperbarui.','改善提案を更新しました。','Kaizen updated.'],['Kaizen berhasil ditambahkan.','改善提案を追加しました。','Kaizen added.'],['Kaizen berhasil dihapus.','改善提案を削除しました。','Kaizen deleted.'],
    ['Pilih user, jenis KPI, dan tanggal.','ユーザー、KPIの種類、日付を選択してください。','Select a user, KPI type and date.'],['Jumlah harus lebih dari 0.','数量は0より大きくしてください。','Amount must be greater than zero.'],['ID atau password salah.','IDまたはパスワードが正しくありません。','Incorrect ID or password.'],['Masukkan ID yang valid.','有効なIDを入力してください。','Enter a valid ID.'],['Pesan gagal dikirim. Cek Firestore Rules.','送信に失敗しました。Firestoreルールを確認してください。','Message could not be sent. Check Firestore Rules.'],
    ['✏️ Edit','✏️ 編集','✏️ Edit'],['🗑️ Hapus','🗑️ 削除','🗑️ Delete'],['❌ Error','❌ エラー','❌ Error'],['✅ Valid','✅ 有効','✅ Valid'],['Pilih tanggal yang ingin dipreview.','プレビューする日付を選択してください。','Select a preview date.'],['Membaca file Excel...','Excelファイルを読み込み中...','Reading Excel file...'],['Library Excel gagal dimuat. Periksa koneksi internet.','Excelライブラリを読み込めません。インターネット接続を確認してください。','Excel library failed to load. Check your connection.'],['Hanya admin yang dapat import Excel.','Excelをインポートできるのは管理者のみです。','Only admins can import Excel.'],['Tidak ada data untuk di-import.','インポートするデータがありません。','No data to import.'],['Mengimport...','インポート中...','Importing...'],['Perbaiki data sebelum import','インポート前にデータを修正','Fix data before importing'],['Data duplikat akan dilewati otomatis.','重複データは自動的にスキップされます。','Duplicate data will be skipped automatically.'],['Logout','ログアウト','Logout']
  ];
  const translations = Object.fromEntries(rows.map(([id,ja,en])=>[id,{id,ja,en}]));
  const locale = {id:'id-ID',ja:'ja-JP',en:'en-US'};
  let lang = ['id','ja','en'].includes(localStorage.getItem('nicca_ui_language')) ? localStorage.getItem('nicca_ui_language') : 'id';
  const originals = new WeakMap();
  const rendered = new WeakMap();
  const skip = '#messages, #messageInput, #userId, #password, #detailTitle, #detailDescription, #detailCategory, #historyNote, .history-note, .sender, .message, .member-avatar, #kaizenList .kaizen-item h4, #adminKaizenList .kaizen-item h4, #excelPreviewBody td, #historyUserId option:not(:first-child), #kaizenUserId option:not(:first-child)';
  function translate(source) {
    if (!source) return source;
    if (translations[source]) return translations[source][lang];
    // Dynamic UI sentences: preserve numbers, IDs, and Firestore category keys.
    const rules = [
      [/^Total s\.d\. (.+)$/,(m,d)=>({ja:`${d}までの合計`,en:`Total through ${d}`,id:m})[lang]],
      [/^Riwayat (.+)$/,(m,x)=>({ja:`${translate(x)}の履歴`,en:`${translate(x)} History`,id:m})[lang]],
      [/^(\d+) catatan • total riwayat (.+)$/,(m,n,v)=>({ja:`${n}件の記録 • 履歴合計 ${v}`,en:`${n} records • history total ${v}`,id:m})[lang]],
      [/^(\d+) baris • (\d+) valid • (\d+) error$/,(m,a,b,c)=>({ja:`${a}行 • 有効 ${b} • エラー ${c}`,en:`${a} rows • ${b} valid • ${c} errors`,id:m})[lang]],
      [/^(\d+) baris ditemukan untuk (.+)\.$/,(m,n,d)=>({ja:`${d}のデータが${n}行見つかりました。`,en:`${n} rows found for ${d}.`,id:m})[lang]],
      [/^Import (\d+) Data ke Firestore$/,(m,n)=>({ja:`${n}件をFirestoreにインポート`,en:`Import ${n} records to Firestore`,id:m})[lang]],
      [/^([\d.,]+) (hari|kali|kasus|jam)$/,(m,n,u)=>`${n} ${translate(u)}`],
      [/^(.+) • Online$/,(m,n)=>`${n} • ${translate('Online')}`]
    ];
    for(const [re,fn] of rules){const match=source.match(re);if(match)return fn(...match);}
    return source;
  }
  function excluded(el) { return !el || !!el.closest(skip) || ['SCRIPT','STYLE','NOSCRIPT'].includes(el.tagName); }
  function updateText(node) {
    const parent=node.parentElement;
    if(excluded(parent)) return;
    const current=node.nodeValue;
    if(!current?.trim()) return;
    const prev=rendered.get(node);
    if(!originals.has(node) || (prev !== undefined && current !== prev)) originals.set(node,current);
    const base=originals.get(node);
    const trim=base.trim();
    const output=translate(trim);
    const result=base.replace(trim,output);
    rendered.set(node,result);
    if(current!==result) node.nodeValue=result;
  }
  function updateAttributes(el) {
    if(excluded(el))return;
    for(const attr of ['placeholder','aria-label','title']) {
      if(!el.hasAttribute(attr))continue;
      const key=`niccaSource${attr.replace(/-([a-z])/g,(_,x)=>x.toUpperCase())}`;
      if(!el.dataset[key]) el.dataset[key]=el.getAttribute(attr);
      const source=el.dataset[key];
      const result=translate(source);
      if(el.getAttribute(attr)!==result)el.setAttribute(attr,result);
    }
  }
  function scan(root) {
    if(root.nodeType===Node.TEXT_NODE){updateText(root);return;}
    if(root.nodeType!==Node.ELEMENT_NODE || excluded(root))return;
    updateAttributes(root);
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT);
    while(walker.nextNode()) {
      if(walker.currentNode.nodeType===Node.TEXT_NODE) updateText(walker.currentNode);
      else updateAttributes(walker.currentNode);
    }
  }
  function applyLanguage() {
    document.documentElement.lang=lang;
    document.querySelectorAll('#languageSelect,#loginLanguageSelect').forEach(s=>s.value=lang);
    scan(document.body);
  }
  function setLanguage(value) {
    if(!['id','ja','en'].includes(value))return;
    lang=value;
    localStorage.setItem('nicca_ui_language',lang);
    applyLanguage();
    document.dispatchEvent(new CustomEvent('nicca-language-changed',{detail:{lang}}));
  }
  document.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('#languageSelect,#loginLanguageSelect').forEach(el=>el.addEventListener('change',e=>setLanguage(e.target.value)));
    applyLanguage();
    const observer=new MutationObserver(records=>{
      for(const record of records) {
        if(record.type==='characterData')updateText(record.target);
        else if(record.type==='childList')for(const node of record.addedNodes)scan(node);
      }
    });
    observer.observe(document.body,{subtree:true,childList:true,characterData:true});
  });
  window.niccaI18n={get language(){return lang},t:translate,setLanguage,locale:()=>locale[lang]};
})();
