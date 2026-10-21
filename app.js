const R="a i u e o ka ki ku ke ko sa shi su se so ta chi tsu te to na ni nu ne no ha hi fu he ho ma mi mu me mo ya yu yo ra ri ru re ro wa wo n".split(" ");
const H=[..."あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん"];
const K=[..."アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン"];
const v=s=>s.split(";").map(x=>{const p=x.split(",");return[p[0],p[2],p[1]]});
const S={
 hira:{n:"Hiragana",d:H.map((c,i)=>[c,R[i],""])},
 kata:{n:"Katakana",d:K.map((c,i)=>[c,R[i],""])},
 salam:{n:"Salam",d:v("おはようございます,ohayou gozaimasu,Selamat pagi;こんにちは,konnichiwa,Selamat siang;こんばんは,konbanwa,Selamat malam;ありがとう,arigatou,Terima kasih;どういたしまして,dou itashimashite,Sama-sama;すみません,sumimasen,Permisi / maaf;ごめんなさい,gomennasai,Maaf;はじめまして,hajimemashite,Salam kenal;さようなら,sayounara,Selamat tinggal;いただきます,itadakimasu,Selamat makan;おやすみなさい,oyasuminasai,Selamat tidur")},
 angka:{n:"Angka",d:v("いち,ichi,1;に,ni,2;さん,san,3;よん,yon,4;ご,go,5;ろく,roku,6;なな,nana,7;はち,hachi,8;きゅう,kyuu,9;じゅう,juu,10;ひゃく,hyaku,100;せん,sen,1.000")},
 kosa:{n:"Kosakata",d:v("わたし,watashi,saya;ともだち,tomodachi,teman;せんせい,sensei,guru;がくせい,gakusei,pelajar;みず,mizu,air;ごはん,gohan,nasi;ほん,hon,buku;いぬ,inu,anjing;ねこ,neko,kucing;いえ,ie,rumah;がっこう,gakkou,sekolah;えき,eki,stasiun;くるま,kuruma,mobil;たべます,tabemasu,makan;のみます,nomimasu,minum;いきます,ikimasu,pergi;みます,mimasu,melihat;おおきい,ookii,besar;ちいさい,chiisai,kecil;おいしい,oishii,enak")},
 kanji:{n:"Kanji",d:v("日,nichi / hi,hari / matahari;月,getsu / tsuki,bulan;火,ka / hi,api;水,sui / mizu,air;木,moku / ki,pohon;金,kin / kane,emas / uang;土,do / tsuchi,tanah;人,jin / hito,orang;大,dai / ookii,besar;小,shou / chiisai,kecil;山,san / yama,gunung;川,kawa,sungai;口,kou / kuchi,mulut;目,me,mata;手,te,tangan;上,ue,atas;下,shita,bawah;中,naka,tengah;本,hon,buku / asal;学,gaku,belajar")},
 gram:{n:"Tata bahasa",d:v("は,wa,penanda topik;を,o,penanda objek;に,ni,ke / pada;で,de,di / dengan;の,no,milik;も,mo,juga;と,to,dan / bersama;か,ka,tanda tanya;です,desu,adalah;ます,masu,akhiran kata kerja;ません,masen,tidak (kata kerja);ました,mashita,sudah (lampau)")}
};
const MD={learn:"Belajar",card:"Kartu",quiz:"Kuis",table:"Tabel",plan:"Jadwal"};
let st={xp:0,best:{},known:{},plan:[],snd:true},cur="hira",mode="learn",deck=[],flip=false,qz=null;
try{const s=JSON.parse(localStorage.getItem("nihongo")||"null");if(s)st=Object.assign(st,s)}catch(e){}
const save=()=>{try{localStorage.setItem("nihongo",JSON.stringify(st))}catch(e){}};
const $=id=>document.getElementById(id);
const sh=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
let AC;
const sfx=ok=>{if(!st.snd)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();(ok===2?[523,659,784,1047]:ok?[660,880]:[220,165]).forEach((f,i)=>{const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime+i*.11;o.type=ok?"triangle":"sawtooth";o.frequency.value=f;g.gain.setValueAtTime(.12,t);g.gain.exponentialRampToValueAtTime(.001,t+.2);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+.22)})}catch(e){}};
const say=t=>{if(!st.snd)return;try{const u=new SpeechSynthesisUtterance(t);u.lang="ja-JP";u.rate=.8;const j=speechSynthesis.getVoices().find(x=>x.lang&&x.lang.replace("_","-").startsWith("ja"));if(j)u.voice=j;speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}};
const kn=()=>st.known[cur]||(st.known[cur]=[]);
function head(){
 const l=Math.floor(st.xp/100)+1;
 $("xp").textContent="⭐ "+st.xp+" XP";
 $("sn").textContent=st.snd?"🔊":"🔇";
 $("lb").style.width=(st.xp%100)+"%";
 $("lt").textContent="Level "+l+" · "+(100-st.xp%100)+" XP lagi ke level "+(l+1);
 $("sets").innerHTML=Object.keys(S).map(k=>`<button class="chip" aria-pressed="${k==cur}" onclick="setSet('${k}')">${S[k].n}</button>`).join("");
 $("modes").innerHTML=Object.keys(MD).map(k=>`<button aria-pressed="${k==mode}" onclick="setMode('${k}')">${MD[k]}</button>`).join("");
}
function addXp(n){const l=Math.floor(st.xp/100);st.xp+=n;if(Math.floor(st.xp/100)>l)setTimeout(()=>sfx(2),450);save();head()}
function setSet(k){cur=k;qz=null;deck=[];render()}
function setMode(m){mode=m;qz=null;deck=[];render()}
function render(){head();({learn,card,quiz,table,plan})[mode]()}
const cls=t=>t.length>4?" long":"";
const ex=(j,s)=>`<div class="ex" onclick="say('${j}')">${j}<small>${s} · ketuk untuk mendengar</small></div>`;
const L={
hira:`<h2>Hiragana</h2><p>Huruf dasar untuk kata asli Jepang dan akhiran tata bahasa. Ada 46 huruf dan satu huruf mewakili satu suku kata.</p><ul><li>Tiap baris mengikuti bunyi a, i, u, e, o: か ka, き ki, く ku, け ke, こ ko.</li><li>は dibaca <b>wa</b> dan を dibaca <b>o</b> saat menjadi partikel.</li><li>Tanda ゛ mengubah bunyi: か jadi が (ga), は jadi ば (ba).</li></ul>${ex("さくら","sakura, bunga sakura")}${ex("ありがとう","arigatou, terima kasih")}`,
kata:`<h2>Katakana</h2><p>Dipakai untuk kata serapan, nama asing, dan penekanan. Bunyinya sama dengan hiragana, hanya bentuknya berbeda.</p><ul><li>Tanda panjang ー memanjangkan vokal: コーヒー (koohii).</li><li>Yang sering tertukar: シ (shi) dengan ツ (tsu), dan ソ (so) dengan ン (n). Lihat arah goresannya.</li></ul>${ex("コーヒー","koohii, kopi")}${ex("インドネシア","indoneshia, Indonesia")}`,
salam:`<h2>Salam</h2><p>Ungkapan sehari-hari. Tambahan ございます membuatnya lebih sopan, misalnya おはよう (santai) dan おはようございます (sopan).</p><ul><li>いただきます diucapkan sebelum makan, ごちそうさまでした setelah makan.</li><li>すみません bisa berarti permisi, maaf, atau terima kasih yang sungkan.</li></ul>${ex("はじめまして。わたしは アリ です。","Salam kenal. Saya Ali.")}`,
angka:`<h2>Angka</h2><p>Angka Jepang teratur. Setelah hafal 1 sampai 10, angka lain tinggal digabung.</p><ul><li>11 = じゅういち (10+1), 20 = にじゅう (2×10), 35 = さんじゅうご.</li><li>Ada dua bacaan: 4 = よん/し, 7 = なな/しち, 9 = きゅう/く. Untuk jam, pakai よじ, しちじ, くじ.</li><li>Jam memakai じ, menit memakai ふん atau ぷん.</li></ul>${ex("さんじ はん です","sekarang jam 3.30")}`,
kosa:`<h2>Kosakata</h2><p>Hafalkan kata dalam kalimat, bukan kata lepas, supaya ingat cara memakainya.</p><ul><li>Kata kerja berakhiran ます adalah bentuk sopan: たべます (makan), のみます (minum).</li><li>Kata sifat い berakhiran い (おおきい), kata sifat な memakai な sebelum kata benda (きれいな はな).</li></ul>${ex("みずを のみます","Saya minum air")}${ex("ねこは ちいさい です","Kucing itu kecil")}`,
kanji:`<h2>Kanji</h2><p>Huruf yang mewakili makna. Tiap kanji punya bacaan onyomi (dari Tiongkok) dan kunyomi (asli Jepang).</p><ul><li>日 dibaca にち di 日曜日 (Minggu) dan ひ di 日 (hari).</li><li>Pelajari lewat kata yang memakainya, jangan sebagai huruf lepas.</li><li>Perhatikan urutan goresan: atas ke bawah, kiri ke kanan.</li></ul>${ex("にほんじん","日本人, orang Jepang")}${ex("げつようび","月曜日, hari Senin")}`,
gram:`<h2>Tata bahasa dasar</h2><p>Pola inti: <b>A は B です</b> (A adalah B). Kata kerja diletakkan di akhir kalimat.</p><ul><li><b>は</b> (wa) menandai topik, <b>を</b> (o) menandai objek, <b>に</b> menunjukkan tujuan atau waktu, <b>で</b> menunjukkan tempat aksi.</li><li>Kata kerja: たべます (makan), たべません (tidak makan), たべました (sudah makan), たべませんでした (tidak makan kemarin).</li><li>Tambahkan <b>か</b> di akhir kalimat untuk bertanya.</li></ul>${ex("わたしは がくせい です","Saya adalah pelajar")}${ex("がっこうで ほんを よみます","Saya membaca buku di sekolah")}`
};
const P=[["Minggu 1–2","Hiragana","Hafal 46 huruf dan baca kata sederhana"],["Minggu 3–4","Katakana dan salam","Hafal katakana, bisa memperkenalkan diri"],["Minggu 5–8","Tata bahasa 1","です, partikel dasar, kata kerja ます, angka dan waktu"],["Minggu 9–12","Tata bahasa 2","Kata sifat い/な, bentuk lampau dan negatif, 300 kata"],["Minggu 13–16","Tata bahasa 3","Bentuk て, ajakan dan permintaan, 550 kata, 40 kanji"],["Minggu 17–20","Penguatan","800 kata, 100 kanji, latihan membaca"],["Minggu 21–24","Persiapan ujian","Latihan menyimak, soal JLPT N5, simulasi"]];
function learn(){$("view").innerHTML=`<div class="panel lesson">${L[cur]}<div class="btns" style="justify-content:flex-start"><button class="btn" onclick="setMode('card')">Latihan kartu</button><button class="btn alt" onclick="setMode('quiz')">Coba kuis</button></div></div>`}
function plan(){
 const p=st.plan,pc=Math.round(p.length/P.length*100);
 $("view").innerHTML=`<div class="panel lesson"><h2>Jadwal 24 minggu</h2><p class="hint">Centang tahap yang sudah selesai. Progres: ${p.length} dari ${P.length} tahap (${pc}%).</p><div class="prog"><i style="width:${pc}%"></i></div>${P.map((x,i)=>`<label class="ph${p.includes(i)?" d":""}"><input type="checkbox" ${p.includes(i)?"checked":""} onchange="tp(${i})"><span><b>${x[0]}: ${x[1]}</b><small>${x[2]}</small></span></label>`).join("")}<h2 style="margin-top:18px">Rutinitas harian (60 menit)</h2><ul><li>15 menit: ulang kartu yang belum hafal</li><li>25 menit: baca materi baru di tab Belajar</li><li>10 menit: satu ronde kuis</li><li>10 menit: ucapkan keras-keras dan tulis tangan</li></ul><p>Sabtu: ulangi semua materi minggu ini. Minggu: main kuis semua materi dan catat skor terbaikmu.</p></div>`}
function tp(i){const p=st.plan,j=p.indexOf(i);if(j<0){p.push(i);sfx(1)}else p.splice(j,1);save();plan()}
function card(){
 const d=S[cur].d,k=kn();
 if(!deck.length)deck=sh(d.map((_,i)=>i).filter(i=>!k.includes(i)));
 const pct=Math.round(k.length/d.length*100);
 let h=`<div class="panel"><div class="top"><span>Hafal ${k.length} dari ${d.length}</span><span>${pct}%</span></div><div class="prog"><i style="width:${pct}%"></i></div>`;
 if(!deck.length){
  h+=`<div class="big">🎉</div><h2>Semua kartu ${S[cur].n} sudah hafal!</h2><p class="hint">Coba mode Kuis untuk menguji ingatanmu, atau ulang dari awal.</p><div class="btns"><button class="btn" onclick="setMode('quiz')">Main kuis</button><button class="btn alt" onclick="resetK()">Ulangi kartu</button></div></div>`;
  $("view").innerHTML=h;return;
 }
 const it=d[deck[0]];
 h+=flip?`<button class="seal back" onclick="flipC()" aria-label="Balik kartu">${it[1]}${it[2]?`<small>${it[2]}</small>`:""}</button>`
        :`<button class="seal${cls(it[0])}" onclick="flipC()" aria-label="Balik kartu">${it[0]}</button>`;
 h+=`<p class="hint">${flip?"Sudah ingat?":"Ketuk kartu untuk melihat jawabannya"}</p><div class="btns"><button class="btn alt" onclick="say('${it[0]}')">🔊 Dengar</button>`;
 if(flip)h+=`<button class="btn alt" onclick="nextC(0)">Belum</button><button class="btn ok" onclick="nextC(1)">Hafal ✓</button>`;
 $("view").innerHTML=h+`</div></div>`;
}
function flipC(){flip=!flip;if(flip)say(S[cur].d[deck[0]][0]);card()}
function nextC(ok){const i=deck.shift();if(ok){const k=kn();if(!k.includes(i)){k.push(i);addXp(5)}}else deck.push(i);flip=false;save();card()}
function resetK(){st.known[cur]=[];save();deck=[];card()}
function quiz(){
 const d=S[cur].d;
 if(!qz)qz={n:0,sc:0,combo:0,items:sh(d).slice(0,10),done:false,lock:false};
 if(qz.n>=qz.items.length){
  const best=Math.max(st.best[cur]||0,qz.sc);st.best[cur]=best;save();
  const stars=qz.sc>=9?"🌸🌸🌸":qz.sc>=6?"🌸🌸":"🌸";
  $("view").innerHTML=`<div class="panel"><div class="big">${stars}</div><h2>Skor ${qz.sc} / ${qz.items.length}</h2><p class="hint">Skor terbaik ${S[cur].n}: ${best}. ${qz.sc>=9?"Luar biasa!":qz.sc>=6?"Bagus, sedikit lagi sempurna.":"Tidak apa-apa, ulangi kartunya lalu coba lagi."}</p><div class="btns"><button class="btn" onclick="qz=null;quiz()">Main lagi</button><button class="btn alt" onclick="setMode('card')">Belajar kartu</button></div></div>`;
  return;
 }
 const it=qz.items[qz.n];
 const wr=sh([...new Set(d.map(x=>x[1]))].filter(x=>x!==it[1])).slice(0,3);
 qz.opts=sh([it[1],...wr]);
 $("view").innerHTML=`<div class="panel"><div class="top"><span>Soal ${qz.n+1} / ${qz.items.length}</span><span>🔥 Kombo ${qz.combo} · Skor ${qz.sc}</span></div><div class="prog"><i style="width:${qz.n/qz.items.length*100}%"></i></div><div class="q${cls(it[0])}">${it[0]}</div><div class="hint">${cur=="hira"||cur=="kata"?"Bagaimana cara membacanya?":"Apa artinya?"}</div><div class="opts">${qz.opts.map((o,i)=>`<button class="opt" onclick="ans(${i})">${o}</button>`).join("")}</div><div class="btns"><button class="btn alt" onclick="say('${it[0]}')">🔊 Dengar</button></div></div>`;
 qz.lock=false;
}
function ans(i){
 if(qz.lock)return;qz.lock=true;
 const it=qz.items[qz.n],bs=document.querySelectorAll(".opt"),ok=qz.opts[i]===it[1];
 bs.forEach((b,j)=>{if(qz.opts[j]===it[1])b.classList.add("ok")});
 if(ok){qz.sc++;qz.combo++;sfx(1);addXp(10+Math.min(qz.combo,5)*2)}else{bs[i].classList.add("bad");qz.combo=0;sfx(0)}
 setTimeout(()=>{qz.n++;quiz()},ok?700:1300);
}
function table(){
 const d=S[cur].d,k=kn();
 $("view").innerHTML=`<p class="hint">Ketuk kotak untuk mendengar pelafalannya. Kotak hijau berarti sudah kamu hafal.</p><div class="grid">${d.map((x,i)=>`<button class="cell${k.includes(i)?" k":""}" onclick="say('${x[0]}')"><b>${x[0].length>3?`<span style="font-size:1rem;color:inherit">${x[0]}</span>`:x[0]}</b><span>${x[1]}${x[2]?"<br>"+x[2]:""}</span></button>`).join("")}</div>`;
}
$("th").onclick=()=>{const r=document.documentElement,dark=r.dataset.theme?r.dataset.theme=="dark":matchMedia("(prefers-color-scheme:dark)").matches;r.dataset.theme=dark?"light":"dark"};
$("sn").onclick=()=>{st.snd=!st.snd;save();head();sfx(1)};
try{speechSynthesis.getVoices();speechSynthesis.onvoiceschanged=()=>{}}catch(e){}
render();

if('serviceWorker' in navigator&&location.protocol.startsWith('http')){addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}))}
