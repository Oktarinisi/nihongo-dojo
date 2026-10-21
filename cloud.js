import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const btn = document.getElementById("ac");
if (firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("ISI")) {
  const app = initializeApp(firebaseConfig), auth = getAuth(app), db = getFirestore(app);
  let user = null, timer;
  const U = (a, b) => [...new Set([...(a || []), ...(b || [])])];
  const keys = (a, b) => U(Object.keys(a || {}), Object.keys(b || {}));
  const merge = (a, b) => ({
    xp: Math.max(a.xp || 0, b.xp || 0),
    best: Object.fromEntries(keys(a.best, b.best).map(k => [k, Math.max((a.best || {})[k] || 0, (b.best || {})[k] || 0)])),
    known: Object.fromEntries(keys(a.known, b.known).map(k => [k, U((a.known || {})[k], (b.known || {})[k])])),
    plan: U(a.plan, b.plan),
    days: U(a.days, b.days).sort(),
    hist: [...(a.hist || []), ...(b.hist || [])].filter((x, i, r) => r.findIndex(y => y.t === x.t) === i).sort((x, y) => x.t - y.t).slice(-100),
    snd: a.snd !== false
  });
  const push = s => { if (!user) return; clearTimeout(timer); timer = setTimeout(() => setDoc(doc(db, "users", user.uid), { data: s, name: user.displayName || "", updatedAt: serverTimestamp() }).catch(() => {}), 800); };
  window.onSave = push;
  const ui = () => { btn.hidden = false; btn.textContent = user ? "Keluar (" + (user.displayName || "akun").split(" ")[0] + ")" : "Masuk Google"; };
  onAuthStateChanged(auth, async u => {
    user = u; ui();
    if (!u) return;
    try {
      const snap = await getDoc(doc(db, "users", u.uid)), local = window.getState();
      window.setState(snap.exists() ? merge(local, snap.data().data || {}) : local);
      push(window.getState());
    } catch (e) {}
  });
  btn.onclick = async () => {
    if (user) { await signOut(auth); window.setState({}); return; }
    const p = new GoogleAuthProvider();
    try { await signInWithPopup(auth, p); }
    catch (e) { if (e.code === "auth/popup-blocked") signInWithRedirect(auth, p); }
  };
  ui();
}
