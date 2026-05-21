"use client";

import { useState, useEffect, useRef } from "react";

const C = {
  bg: "#F3F4F6",
  panel: "#FFFFFF",
  panelAlt: "#F8FAFC",
  border: "#E5E7EB",
  text: "#111827",
  muted: "#475569",
  orange: "#FF6B2B",
  gold: "#FFB347",
  teal: "#14B8A6",
  purple: "#7C3AED",
  blue: "#2563EB",
  green: "#16A34A",
  red: "#DC2626",
  pink: "#DB2777",
};

// ── LEVELS ────────────────────────────────────────────────────────────────────

const LEVELS = [

  // ── VIZUAL 1-3 ──────────────────────────────────────────────────────────────

  {
    id: 1, type: "visual", category: "Tipare vizuale",
    title: "Ce urmează?",
    instruction: "Identifică tiparele și alege elementul care continuă secvența.",
    questions: [
      {
        sequence: ["🔴", "🔵", "🔴", "🔵", "🔴"],
        options: ["🔵", "🔴", "🟡", "🟢"],
        answer: 0,
        explanation: "Tipar alternant: roșu-albastru se repetă. Urmează albastru.",
      },
      {
        sequence: ["⬜", "⬜", "⬛", "⬜", "⬜", "⬛", "⬜", "⬜"],
        options: ["⬛", "⬜", "🔲", "▪️"],
        answer: 0,
        explanation: "Tipar 2+1: două albe, una neagră. Urmează neagră.",
      },
      {
        sequence: ["1", "2", "4", "8", "16"],
        options: ["24", "32", "18", "20"],
        answer: 1,
        explanation: "Fiecare număr se dublează. 16×2 = 32.",
      },
    ],
  },

  {
    id: 2, type: "visual", category: "Tipare vizuale",
    title: "Secvențe mai complexe",
    instruction: "Tiparele devin mai subtile. Privește cu atenție înainte să răspunzi.",
    questions: [
      {
        sequence: ["🔺", "🔺", "🔻", "🔺", "🔺", "🔻", "🔺", "🔺"],
        options: ["🔺", "🔻", "🔷", "⬡"],
        answer: 1,
        explanation: "Tipar 2+1: două sus, una jos. Urmează jos.",
      },
      {
        sequence: ["A", "C", "E", "G", "I"],
        options: ["J", "K", "L", "M"],
        answer: 1,
        explanation: "Literele alfabetului din 2 în 2. După I urmează K.",
      },
      {
        sequence: ["1", "1", "2", "3", "5", "8", "13"],
        options: ["18", "21", "20", "16"],
        answer: 1,
        explanation: "Fibonacci: fiecare număr e suma celor două anterioare. 8+13=21.",
      },
    ],
  },

  {
    id: 3, type: "visual", category: "Tipare vizuale",
    title: "Tipare în matrice",
    instruction: "Acum tiparul e bidimensional. Privește atât pe orizontală cât și pe verticală.",
    questions: [
      {
        sequence: ["🔴 🔵 🔴", "🔵 🔴 🔵", "🔴 🔵 ?"],
        options: ["🔴", "🔵", "🟡", "🟢"],
        answer: 0,
        explanation: "Pe fiecare rând și coloană se alternează roșu și albastru. Colțul din dreapta jos e roșu.",
        isMatrix: true,
      },
      {
        sequence: ["2 4 6", "3 6 9", "4 8 ?"],
        options: ["10", "12", "14", "16"],
        answer: 1,
        explanation: "Fiecare rând e tabla înmulțirii: ×2, ×3, ×4. 4×3=12.",
        isMatrix: true,
      },
      {
        sequence: ["🐱 🐱 🐶", "🐱 🐶 🐶", "🐶 🐶 ?"],
        options: ["🐱", "🐶", "🐰", "🐸"],
        answer: 1,
        explanation: "Câinii cresc diagonal. Colțul din dreapta jos are câine.",
        isMatrix: true,
      },
    ],
  },

  // ── COMPORTAMENTAL 4-6 ──────────────────────────────────────────────────────

  {
    id: 4, type: "behavioral", category: "Tipare comportamentale",
    title: "Tranziție",
    instruction: "Același mecanism — material diferit. Acum tiparele sunt în comportamente, nu forme.",
    intro: "Tocmai ai antrenat ochiul să vadă ce urmează în secvențe vizuale. Același ochi funcționează și pentru comportamente. Creierul tău nu știe diferența — vede tipare.",
    questions: [
      {
        situation: "Andrei întârzie luni, miercuri și vineri la întâlniri. Marți și joi vine la timp.",
        question: "Ce ziua următoare de întâlnire va întârzia?",
        options: ["Luni — da, va întârzia", "Marți — nu va întârzia", "Nu se poate ști", "Depinde de el"],
        answer: 0,
        explanation: "Tipar zilnic: luni-miercuri-vineri întârzie consistent. E un tipar, nu o coincidență.",
      },
      {
        situation: "Maria acceptă orice cerere de la colegi luni dimineața. Spre sfârșitul săptămânii, refuză aproape tot.",
        question: "Dacă o rogi vineri să te ajute cu ceva urgent, cel mai probabil va...",
        options: ["Accepta — e colegă bună", "Refuza — tipar de final de săptămână", "Depinde de cerere", "Nu se poate prezice"],
        answer: 1,
        explanation: "Tipar temporal: energia și disponibilitatea ei scad spre finalul săptămânii. Vineri = refuz probabil.",
      },
      {
        situation: "De fiecare dată când echipa primește feedback negativ de la șef, Ion devine tăcut și retras timp de 1-2 zile.",
        question: "Azi șeful a criticat dur un proiect. Ce va face Ion?",
        options: ["Va deveni mai vocal să compenseze", "Va deveni tăcut și retras", "Va reacționa diferit de fiecare dată", "Va ignora criticile"],
        answer: 1,
        explanation: "Tipar de răspuns la stres: feedback negativ → retragere. E consecvent, nu contextual.",
      },
    ],
  },

  {
    id: 5, type: "behavioral", category: "Tipare comportamentale",
    title: "Tipare în decizii",
    instruction: "Cum iei decizii și cum le iau alții — urmează tipare la fel de previzibile ca o secvență matematică.",
    questions: [
      {
        situation: "Elena cumpără întotdeauna primul produs pe care îl vede când e grăbită. Când are timp, compară îndelung și alege altceva.",
        question: "Elena e grăbită azi și trebuie să aleagă un laptop. Ce va face?",
        options: ["Va compara toate opțiunile", "Va lua primul care pare ok", "Va amâna decizia", "Va cere sfatul altcuiva"],
        answer: 1,
        explanation: "Tipar decizional sub presiune: grăbită = prima opție. E predictibil pentru că e consistent.",
      },
      {
        situation: "Radu evită orice conversație dificilă în primele ore ale zilei. Seara e mult mai deschis la discuții complicate.",
        question: "Ai o conversație importantă de purtat cu Radu. Când e momentul potrivit?",
        options: ["Dimineața — e mai odihnit", "Seara — tipar de deschidere", "Nu contează momentul", "Când el propune"],
        answer: 1,
        explanation: "Tipar temporal al disponibilității emoționale. Seara = mai deschis. Folosești tiparele pentru a lua decizii mai bune.",
      },
      {
        situation: "Ori de câte ori Ana primește o idee nouă, spune 'da' imediat, dar implementează rar. Când spune 'lasă-mă să mă gândesc', de obicei face.",
        question: "Ana a zis 'da, super idee!' la propunerea ta. Ce probabilitate există să o implementeze?",
        options: ["Mare — a zis da", "Mică — e tipar de 'da' fără acțiune", "Depinde de idee", "50-50"],
        answer: 1,
        explanation: "Tipar de răspuns vs. acțiune: 'da' imediat = entuziasm fără urmărire. 'Mă gândesc' = angajament real.",
      },
    ],
  },

  {
    id: 6, type: "behavioral", category: "Tipare comportamentale",
    title: "Tipare sub presiune",
    instruction: "Presiunea scoate la suprafață tipare profunde. Oamenii reacționează consistent când sunt stresați.",
    questions: [
      {
        situation: "Când lucrurile merg bine, Mihai e colaborativ și ascultă ideile altora. Când apar probleme, devine directiv și controlează totul.",
        question: "Proiectul e în criză. Cum se va comporta Mihai?",
        options: ["Va fi mai deschis ca să rezolve împreună", "Va prelua controlul și va deveni directiv", "Va cere ajutor echipei", "Va fi la fel ca de obicei"],
        answer: 1,
        explanation: "Stresul activează tipare de bază. Sub presiune, oamenii revin la comportamentul default — nu la cel ideal.",
      },
      {
        situation: "Laura e perfectă la deadline-uri când proiectul e al ei. La proiecte ale altora, întârzie constant.",
        question: "Laura lucrează la proiectul tău. Ce aștepți?",
        options: ["Va livra la timp — e profesionistă", "Va întârzia — tipar la proiectele altora", "Depinde de importanță", "Nu se poate ști"],
        answer: 1,
        explanation: "Tipar de ownership: performanța e legată de sentimentul de proprietate, nu de profesionalism general.",
      },
      {
        situation: "Când Dan greșește ceva, primul lui răspuns e mereu să găsească un alt vinovat. Doar după câteva ore acceptă responsabilitatea.",
        question: "Dan a făcut o greșeală serioasă azi. Ce va spune în primele minute?",
        options: ["Își va asuma imediat greșeala", "Va găsi un alt vinovat", "Va tăcea", "Va minimiza greșeala"],
        answer: 1,
        explanation: "Tipar de apărare a ego-ului: prima reacție e defensivă. Asta nu înseamnă că nu va accepta — înseamnă că are nevoie de timp.",
      },
    ],
  },

  // ── SOCIAL 7-9 ──────────────────────────────────────────────────────────────

  {
    id: 7, type: "social", category: "Tipare sociale",
    title: "Dinamici de grup",
    instruction: "Grupurile urmează tipare la fel de previzibile ca indivizii. Uneori chiar mai previzibile.",
    intro: "Ai văzut tipare în comportamente individuale. Acum privim mai larg — cum se comportă grupurile, echipele, organizațiile.",
    questions: [
      {
        situation: "Într-o echipă de 6 persoane, de fiecare dată când se discută o idee nouă, aceleași 2 persoane o susțin și aceleași 2 o critică. Ceilalți 2 urmează întotdeauna majoritatea.",
        question: "O idee nouă are susținerea celor 2 promotori. Ce se va întâmpla?",
        options: ["Va fi respinsă de critici", "Va trece — cei 2 neutri vor urma susținătorii", "Depinde de idee", "Va fi dezbătută îndelung"],
        answer: 1,
        explanation: "Tipar de dinamică de grup: dacă susținătorii sunt mai vocali, cei neutri urmează. 4 vs 2 = idee aprobată.",
      },
      {
        situation: "În fiecare ședință de echipă, primele 10 minute sunt haotice. Dacă cineva spune ceva clar și direct în minutul 12, toată lumea se aliniază rapid.",
        question: "Ești în minutul 8 al ședinței — haos total. Ce faci?",
        options: ["Intervii imediat să oprești haosul", "Aștepți până la minutul 12 și intervii clar", "Lași haosul să se rezolve singur", "Ceri ajutorul moderatorului"],
        answer: 1,
        explanation: "Tipar temporal al grupului: haosul inițial e normal, nu o problemă. Intervenția eficientă vine după ce grupul s-a 'încălzit'.",
      },
      {
        situation: "Ori de câte ori un nou membru intră în grup, primele 2 săptămâni sunt tensionate. Dacă supraviețuiește fără să iasă sau să se conformeze total, devine acceptat complet.",
        question: "Ești noul membru. Ești în ziua 10 și simți tensiunea. Ce faci?",
        options: ["Pleci — nu te integrezi", "Te conformezi total pentru a fi acceptat", "Continui — e tipar normal, nu respingere personală", "Confrunți grupul"],
        answer: 2,
        explanation: "Tipar de integrare în grup: tensiunea inițială e mecanismul de testare, nu respingere. Cine înțelege tiparul nu îl ia personal.",
      },
    ],
  },

  {
    id: 8, type: "social", category: "Tipare sociale",
    title: "Tipare de influență",
    instruction: "Cum se răspândesc ideile, deciziile și comportamentele prin rețele sociale.",
    questions: [
      {
        situation: "Într-un grup de prieteni, când persoana cea mai populară adoptă un comportament nou, în 2 săptămâni 70% din grup îl adoptă. Când o face o persoană mai puțin populară, nimic nu se schimbă.",
        question: "Vrei să introduci un obicei nou în grupul tău. Care e strategia corectă?",
        options: ["Convingi majoritatea direct", "Convingi mai întâi persoana cu cel mai mult status social", "Faci tu primul și aștepți", "Postezi în grupul de WhatsApp"],
        answer: 1,
        explanation: "Tipar de difuzare socială: influența se propagă prin noduri centrale, nu prin masă. Cheia e statusul, nu numărul.",
      },
      {
        situation: "De fiecare dată când un subiect controversat apare în grup, aceleași persoane tac, aceleași persoane vorbesc. Asta se întâmplă indiferent de subiect.",
        question: "Apare un nou subiect controversat. Cine va vorbi primul?",
        options: ["Cel mai informat despre subiect", "Aceleași persoane ca de obicei — tipar de rol", "Cel mai afectat de subiect", "Va fi aleatoriu"],
        answer: 1,
        explanation: "Tipar de rol în grup: oamenii ocupă roluri stabile independent de context. Vorbitorul activ vorbește, tăcutul tace.",
      },
      {
        situation: "O știre falsă circulă în grupul tău. Observi că de fiecare dată când cineva o distribuie, adaugă un comentariu emoțional. Știrile distribuite fără comentariu dispar rapid.",
        question: "Ce face ca o știre falsă să supraviețuiască în grup?",
        options: ["Credibilitatea sursei", "Încărcătura emoțională adăugată", "Numărul de distribuiri", "Lungimea știrii"],
        answer: 1,
        explanation: "Tipar de viralizare: emoția e combustibilul propagării. Faptele singure nu se răspândesc — emoțiile da.",
      },
    ],
  },

  {
    id: 9, type: "social", category: "Tipare sociale",
    title: "Tipare și ego",
    instruction: "Cel mai important tipar social: cum reacționăm când ego-ul e în joc.",
    questions: [
      {
        situation: "Când cineva primește o critică în public, primul răspuns e aproape întotdeauna defensiv — chiar dacă critica e corectă. Același om, aceeași critică în privat, o acceptă ușor.",
        question: "Trebuie să dai feedback dificil unui coleg. Unde îl dai?",
        options: ["În ședință — toată lumea știe și e transparent", "În privat — tiparul arată că acceptarea e mai ușoară", "Pe email — e documentat", "Nu contează contextul"],
        answer: 1,
        explanation: "Tipar de apărare a ego-ului public: publicul activează mecanismul de apărare. Privatul dezactivează nevoia de a 'salva fața'.",
      },
      {
        situation: "Ori de câte ori o persoană din grup obține un succes vizibil, apare o perioadă scurtă de distanțare din partea celorlalți. Apoi lucrurile revin la normal.",
        question: "Tocmai ai primit o promovare. Colegii par mai distanți. Ce se întâmplă?",
        options: ["Te resping — nu le place de tine", "E un tipar normal de recalibrare socială, va trece", "Ai greșit ceva", "Trebuie să te schimbi"],
        answer: 1,
        explanation: "Tipar de recalibrare a statusului: succesul perturbă echilibrul social. Distanțarea temporară e ajustarea, nu respingerea.",
      },
      {
        situation: "Când oamenii iau o decizie în grup și aceasta se dovedește greșită, grupul găsește aproape întotdeauna o cauză externă. Deciziile individuale greșite sunt mai ușor asumate.",
        question: "Echipa ta a luat o decizie proastă împreună. Ce va face grupul?",
        options: ["Va analiza obiectiv ce a mers greșit", "Va găsi o cauză externă — tipar de protejare a identității colective", "Va identifica vinovatul intern", "Va ignora greșeala"],
        answer: 1,
        explanation: "Tipar de protecție a identității colective: grupul funcționează ca un ego amplificat. Vina externă protejează coeziunea.",
      },
    ],
  },

  // ── MIX 10 ──────────────────────────────────────────────────────────────────

  {
    id: 10, type: "mixed", category: "Tipare mixte",
    title: "Același ochi. Materiale diferite.",
    instruction: "Ultimul nivel combină tot. Un singur instrument — forme, comportamente, dinamici sociale.",
    outro: true,
    questions: [
      {
        sequence: ["🔴", "🔵", "🔵", "🔴", "🔵", "🔵", "🔴"],
        question: "Ce urmează în secvență?",
        options: ["🔴", "🔵", "🟡", "🟢"],
        answer: 1,
        explanation: "1 roșu + 2 albaștri se repetă. Urmează albastru.",
      },
      {
        situation: "Cristina e extrem de productivă în prima săptămână a fiecărui proiect. Spre final, productivitatea scade dramatic și livrează sub așteptări.",
        question: "Ești la mijlocul unui proiect cu Cristina. Totul merge bine. Ce faci strategic?",
        options: ["Te relaxezi — merge bine", "Accelerezi acum, cât e în faza de productivitate maximă", "Aștepți să vadă cum evoluează", "Îi delegi mai puțin"],
        answer: 1,
        explanation: "Tipar temporal de performanță: știi că va scădea. Strategia e să valorifici maximul acum.",
      },
      {
        situation: "Într-un grup, când o decizie e luată în unanimitate, implementarea e lentă. Când există o minoritate care rezistă, implementarea e paradoxal mai rapidă.",
        question: "De ce implementarea e mai rapidă când există rezistență?",
        options: ["Rezistența motivează să demonstreze că au dreptate", "Unanimitatea creează complacere — nimeni nu simte urgența", "E o coincidență", "Rezistența ajută la îmbunătățirea deciziei"],
        answer: 1,
        explanation: "Tipar de dinamică a urgenței: unanimitatea dezactivează vigilența. Rezistența o menține activă.",
      },
    ],
  },
];

const TYPE_COLORS = {
  visual: C.blue,
  behavioral: C.orange,
  social: C.purple,
  mixed: C.gold,
};

const TYPE_LABELS = {
  visual: "Vizual",
  behavioral: "Comportamental",
  social: "Social",
  mixed: "Mixt",
};

function ProgressBar({ current, total, color }) {
  return (
    <div style={{ height: 4, borderRadius: 2, background: C.border, overflow: "hidden", marginBottom: 20 }}>
      <div style={{
        height: "100%", borderRadius: 2,
        width: `${(current / total) * 100}%`,
        background: color,
        transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: `0 0 8px ${color}55`,
      }} />
    </div>
  );
}

function ScoreDisplay({ score, total }) {
  const pct = Math.round((score / total) * 100);
  return (
    <span style={{
      fontSize: 12, fontFamily: "monospace",
      color: pct > 70 ? C.green : pct > 40 ? C.gold : C.red,
    }}>{score}/{total}</span>
  );
}

export default function PatternGame() {
  const [phase, setPhase] = useState("intro"); // intro | playing | levelup | outro
  const [levelIdx, setLevelIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [levelScores, setLevelScores] = useState({});
  const [streak, setStreak] = useState(0);
  const [showStreak, setShowStreak] = useState(false);

  const level = LEVELS[levelIdx];
  const question = level?.questions[questionIdx];
  const typeColor = TYPE_COLORS[level?.type] || C.gold;

  const totalQuestions = LEVELS.reduce((s, l) => s + l.questions.length, 0);

  function handleSelect(idx) {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
    const correct = idx === question.answer;
    const newScore = correct ? score + 1 : score;
    const newTotal = totalAnswered + 1;
    setScore(newScore);
    setTotalAnswered(newTotal);

    const newStreak = correct ? streak + 1 : 0;
    setStreak(newStreak);
    if (newStreak > 0 && newStreak % 3 === 0) {
      setShowStreak(true);
      setTimeout(() => setShowStreak(false), 2000);
    }

    setLevelScores(prev => ({
      ...prev,
      [level.id]: (prev[level.id] || 0) + (correct ? 1 : 0),
    }));
  }

  function handleNext() {
    setSelected(null);
    setRevealed(false);
    if (questionIdx < level.questions.length - 1) {
      setQuestionIdx(questionIdx + 1);
    } else {
      if (levelIdx < LEVELS.length - 1) {
        setPhase("levelup");
      } else {
        setPhase("outro");
      }
    }
  }

  function startNextLevel() {
    setLevelIdx(l => l + 1);
    setQuestionIdx(0);
    setSelected(null);
    setRevealed(false);
    setPhase("playing");
  }

  // ── INTRO ──
  if (phase === "intro") return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      fontFamily: "'Georgia', serif", color: C.text,
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "32px 16px 60px",
    }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}} @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.7;transform:scale(0.92)}}`}</style>
      <div style={{ maxWidth: 480, width: "100%", animation: "fadeUp 0.5s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 10, letterSpacing: 5, color: C.blue, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 10 }}>
            Lecția 3 · Pattern Recognition
          </div>
          <h1 style={{
            fontSize: "clamp(24px, 6vw, 40px)", fontWeight: 700, margin: "0 0 12px",
            background: C.accent || C.orange,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            lineHeight: 1.2,
          }}>Antrenamentul de Tipare</h1>
          <p style={{ fontSize: 14, color: C.muted, margin: 0, lineHeight: 1.7 }}>
            Același ochi care vede tipare în forme vede tipare în oameni și societate.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
          {[
            { color: C.blue, label: "Nivelurile 1-3", desc: "Tipare vizuale — forme, culori, secvențe", emoji: "🔷" },
            { color: C.orange, label: "Nivelurile 4-6", desc: "Tipare comportamentale — decizii, reacții, obiceiuri", emoji: "⚡" },
            { color: C.purple, label: "Nivelurile 7-9", desc: "Tipare sociale — grupuri, influență, dinamici", emoji: "🌐" },
            { color: C.gold, label: "Nivelul 10", desc: "Mixt — același instrument, toate materialele", emoji: "🐉" },
          ].map((item, i) => (
            <div key={i} style={{
              background: C.panel, border: `1px solid ${item.color}22`,
              borderRadius: 14, padding: "14px 18px",
              display: "flex", gap: 14, alignItems: "center",
            }}>
              <div style={{ fontSize: 24, flexShrink: 0 }}>{item.emoji}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: "bold", color: item.color, marginBottom: 3 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          background: `${C.blue}0A`, border: `1px solid ${C.blue}22`,
          borderRadius: 14, padding: "14px 18px", marginBottom: 24,
          fontSize: 13, color: "#8090AA", fontStyle: "italic", lineHeight: 1.7,
        }}>
          {totalQuestions} întrebări · 10 niveluri · ~15 minute
        </div>

        <button onClick={() => setPhase("playing")} style={{
          width: "100%",
          background: C.blue,
          border: "none", borderRadius: 16,
          color: "#F3F4F6", fontWeight: "bold", fontSize: 16,
          padding: "18px", cursor: "pointer",
          boxShadow: `0 6px 28px ${C.blue}44`,
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}>Începe antrenamentul →</button>
      </div>
    </div>
  );

  // ── LEVEL UP ──
  if (phase === "levelup") {
    const nextLevel = LEVELS[levelIdx + 1];
    const isTransition = nextLevel && nextLevel.intro;
    return (
      <div style={{
        minHeight: "100vh",
        background: C.bg,
        fontFamily: "'Georgia', serif", color: C.text,
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "32px 20px",
      }}>
        <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <div style={{ maxWidth: 480, width: "100%", textAlign: "center", animation: "fadeUp 0.4s ease" }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>
            {levelScores[level.id] === level.questions.length ? "🔥" : levelScores[level.id] >= 2 ? "✨" : "💪"}
          </div>
          <div style={{
            fontSize: 12, letterSpacing: 3, color: typeColor,
            textTransform: "uppercase", fontFamily: "monospace", marginBottom: 10,
          }}>Nivel {level.id} completat</div>
          <div style={{ fontSize: 18, fontWeight: "700", color: C.text, marginBottom: 8 }}>
            {levelScores[level.id]}/{level.questions.length} corecte
          </div>

          {isTransition && nextLevel && (
            <div style={{
              background: C.panel, border: `1px solid ${TYPE_COLORS[nextLevel.type]}33`,
              borderRadius: 18, padding: "22px 22px", margin: "20px 0",
              textAlign: "left",
            }}>
              <div style={{
                fontSize: 12, letterSpacing: 2, color: TYPE_COLORS[nextLevel.type],
                textTransform: "uppercase", fontFamily: "monospace", marginBottom: 10,
              }}>Tranziție</div>
              <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.8 }}>
                {nextLevel.intro}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 24 }}>
            <div style={{
              padding: "10px 20px",
              background: `${TYPE_COLORS[nextLevel?.type] || C.gold}15`,
              border: `1px solid ${TYPE_COLORS[nextLevel?.type] || C.gold}33`,
              borderRadius: 12,
              fontSize: 12, color: TYPE_COLORS[nextLevel?.type] || C.gold,
              fontFamily: "monospace",
            }}>
              Urmează: {nextLevel?.category}
            </div>
          </div>

          <button onClick={startNextLevel} style={{
            marginTop: 20, width: "100%",
            background: TYPE_COLORS[nextLevel?.type] || C.gold,
            border: "none", borderRadius: 14,
            color: "#F3F4F6", fontWeight: "bold", fontSize: 15,
            padding: "16px", cursor: "pointer",
            boxShadow: `0 6px 24px ${TYPE_COLORS[nextLevel?.type] || C.gold}33`,
          }}>Continuă →</button>
        </div>
      </div>
    );
  }

  // ── OUTRO ──
  if (phase === "outro") {
    const pct = Math.round((score / totalQuestions) * 100);
    return (
      <div style={{
        minHeight: "100vh",
        background: C.bg,
        fontFamily: "'Georgia', serif", color: C.text,
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "32px 16px 60px",
      }}>
        <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <div style={{ maxWidth: 480, width: "100%", animation: "fadeUp 0.5s ease" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>🐉</div>
            <h1 style={{
              fontSize: "clamp(22px, 5vw, 32px)", fontWeight: 700, margin: "0 0 10px",
              background: C.accent || C.orange,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Antrenament complet</h1>
            <div style={{
              fontSize: 42, fontWeight: "900", color: pct > 70 ? C.green : pct > 40 ? C.gold : C.orange,
              fontFamily: "monospace", textShadow: "none",
            }}>{pct}%</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{score} din {totalQuestions} corecte</div>
          </div>

          {/* Per-level breakdown */}
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 18, padding: "22px", marginBottom: 16 }}>
            <div style={{ fontSize: 12, letterSpacing: 2, color: C.muted, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 16 }}>
              Pe categorii
            </div>
            {["visual", "behavioral", "social", "mixed"].map(type => {
              const typeLevels = LEVELS.filter(l => l.type === type);
              const typeTotal = typeLevels.reduce((s, l) => s + l.questions.length, 0);
              const typeScore = typeLevels.reduce((s, l) => s + (levelScores[l.id] || 0), 0);
              const typePct = typeTotal > 0 ? Math.round((typeScore / typeTotal) * 100) : 0;
              const col = TYPE_COLORS[type];
              return (
                <div key={type} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: col }}>{TYPE_LABELS[type]}</span>
                    <span style={{ fontSize: 12, fontFamily: "monospace", color: typePct > 70 ? C.green : typePct > 40 ? C.gold : C.red }}>{typeScore}/{typeTotal}</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 3, background: C.border, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 3, width: `${typePct}%`, background: color, transition: "width 0.6s" }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* The lesson */}
          <div style={{
            background: C.panel,
            border: `1px solid ${C.gold}33`,
            borderRadius: 18, padding: "24px 22px", marginBottom: 20,
          }}>
            <div style={{ fontSize: 12, letterSpacing: 2, color: C.gold, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 12 }}>
              Lecția din spatele jocului
            </div>
            <p style={{ fontSize: 14, color: "#B0A890", lineHeight: 1.8, margin: "0 0 14px" }}>
              Ai folosit exact același instrument pentru forme geometrice, decizii umane și dinamici de grup.
            </p>
            <p style={{ fontSize: 14, color: "#B0A890", lineHeight: 1.8, margin: "0 0 14px" }}>
              Creierul tău nu a schimbat nimic între nivel 1 și nivel 10. A văzut tipare — indiferent de material.
            </p>
            <p style={{ fontSize: 14, color: C.text, lineHeight: 1.8, margin: 0, fontWeight: "600" }}>
              Asta e pattern recognition. Nu e un talent înnăscut. E un mușchi. Și tocmai l-ai antrenat.
            </p>
          </div>

          <button onClick={() => {
            setPhase("intro"); setLevelIdx(0); setQuestionIdx(0);
            setSelected(null); setRevealed(false); setScore(0);
            setTotalAnswered(0); setLevelScores({}); setStreak(0);
          }} style={{
            width: "100%", background: "#FFFFFF",
            border: `1px solid ${C.border}`, borderRadius: 14,
            color: C.muted, fontSize: 13, padding: "14px", cursor: "pointer",
          }}>↺ Joacă din nou</button>
        </div>
      </div>
    );
  }

  // ── PLAYING ──
  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      fontFamily: "'Georgia', serif", color: C.text,
      padding: "20px 16px 60px",
    }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes correct{0%{transform:scale(1)}50%{transform:scale(1.03)}100%{transform:scale(1)}}
        @keyframes streakPop{0%{opacity:0;transform:scale(0.5) translateY(10px)}50%{opacity:1;transform:scale(1.1) translateY(-5px)}100%{opacity:0;transform:scale(1) translateY(-20px)}}
      `}</style>

      <div style={{ maxWidth: 520, margin: "0 auto" }}>

        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{
            fontSize: 9, letterSpacing: 2, color: typeColor,
            textTransform: "uppercase", fontFamily: "monospace",
            padding: "4px 10px", border: `1px solid ${typeColor}33`,
            borderRadius: 20, background: `${typeColor}0A`,
          }}>
            {level.category}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <ScoreDisplay score={score} total={totalAnswered} />
            {streak >= 2 && (
              <div style={{
                fontSize: 10, color: C.gold, fontFamily: "monospace",
                padding: "3px 8px", background: `${C.gold}15`,
                border: `1px solid ${C.gold}33`, borderRadius: 10,
              }}>🔥 {streak}</div>
            )}
          </div>
        </div>

        <ProgressBar
          current={levelIdx * 3 + questionIdx + 1}
          total={totalQuestions}
          color={typeColor}
        />

        {/* Streak notification */}
        {showStreak && (
          <div style={{
            position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)",
            background: `${C.gold}EE`, borderRadius: 20, padding: "10px 20px",
            fontSize: 14, fontWeight: "bold", color: "#F3F4F6",
            animation: "streakPop 2s ease forwards",
            zIndex: 100, pointerEvents: "none",
          }}>🔥 {streak} la rând!</div>
        )}

        {/* Level header */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, letterSpacing: 2, color: C.muted, fontFamily: "monospace", marginBottom: 4 }}>
            Nivel {level.id} · {questionIdx + 1}/{level.questions.length}
          </div>
          <div style={{ fontSize: 16, fontWeight: "700", color: C.text }}>{level.title}</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 4, lineHeight: 1.6 }}>{level.instruction}</div>
        </div>

        {/* Question card */}
        <div style={{
          background: C.panel, border: `1px solid ${typeColor}22`,
          borderRadius: 20, padding: "22px 22px",
          marginBottom: 14,
          boxShadow: `0 0 30px ${typeColor}08`,
          animation: "fadeUp 0.3s ease",
          key: `${levelIdx}-${questionIdx}`,
        }}>

          {/* Sequence */}
          {question.sequence && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: C.muted, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 10 }}>Secvența</div>
              {question.isMatrix ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {question.sequence.map((row, i) => (
                    <div key={i} style={{
                      fontSize: "clamp(16px, 4vw, 22px)",
                      background: "#FFFFFF", borderRadius: 10,
                      padding: "10px 14px", letterSpacing: 4,
                      fontFamily: "monospace", color: C.text,
                      textAlign: "center",
                    }}>{row}</div>
                  ))}
                </div>
              ) : (
                <div style={{
                  display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center",
                  background: "#FFFFFF", borderRadius: 12, padding: "14px 16px",
                }}>
                  {question.sequence.map((item, i) => (
                    <span key={i} style={{
                      fontSize: "clamp(18px, 5vw, 26px)",
                      padding: "4px 6px",
                      background: `${typeColor}10`,
                      border: `1px solid ${typeColor}22`,
                      borderRadius: 8,
                      fontFamily: "monospace",
                    }}>{item}</span>
                  ))}
                  <span style={{
                    fontSize: "clamp(18px, 5vw, 26px)",
                    padding: "4px 12px",
                    background: `${typeColor}20`,
                    border: `2px dashed ${typeColor}66`,
                    borderRadius: 8, color: typeColor,
                    fontFamily: "monospace",
                  }}>?</span>
                </div>
              )}
            </div>
          )}

          {/* Situation */}
          {question.situation && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: C.muted, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8 }}>Situația</div>
              <div style={{
                fontSize: 13, color: "#475569", lineHeight: 1.8,
                padding: "14px 16px",
                background: "#FFFFFF",
                borderRadius: 12,
                borderLeft: `3px solid ${typeColor}55`,
                fontStyle: "italic",
              }}>{question.situation}</div>
            </div>
          )}

          {/* Question */}
          <div style={{ fontSize: 15, fontWeight: "600", color: C.text, lineHeight: 1.5, marginBottom: 16 }}>
            {question.question || "Ce urmează?"}
          </div>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {question.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = i === question.answer;
              const showCorrect = revealed && isCorrect;
              const showWrong = revealed && isSelected && !isCorrect;

              return (
                <div
                  key={i}
                  onClick={() => handleSelect(i)}
                  style={{
                    padding: "12px 16px", borderRadius: 12,
                    border: `1px solid ${showCorrect ? C.green : showWrong ? C.red : isSelected ? typeColor : C.border}`,
                    background: showCorrect ? `${C.green}12` : showWrong ? `${C.red}10` : isSelected ? `${typeColor}10` : "#FFFFFF",
                    cursor: revealed ? "default" : "pointer",
                    transition: "all 0.2s",
                    display: "flex", alignItems: "center", gap: 10,
                    animation: showCorrect ? "correct 0.4s ease" : "none",
                    boxShadow: showCorrect ? `0 0 16px ${C.green}22` : "none",
                  }}
                >
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                    border: `2px solid ${showCorrect ? C.green : showWrong ? C.red : isSelected ? typeColor : C.border}`,
                    background: showCorrect ? C.green : showWrong ? C.red : isSelected ? typeColor : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, color: "#F3F4F6", fontWeight: "bold",
                    transition: "all 0.2s",
                  }}>
                    {showCorrect ? "✓" : showWrong ? "×" : String.fromCharCode(65 + i)}
                  </div>
                  <span style={{
                    fontSize: 13, lineHeight: 1.5,
                    color: showCorrect ? "#90EE90" : showWrong ? "#EE9090" : C.text,
                  }}>{opt}</span>
                </div>
              );
            })}
          </div>

          {/* Explanation */}
          {revealed && (
            <div style={{
              marginTop: 16, padding: "14px 16px",
              background: selected === question.answer ? `${C.green}08` : `${C.red}08`,
              border: `1px solid ${selected === question.answer ? C.green : C.red}22`,
              borderRadius: 12, animation: "fadeUp 0.3s ease",
            }}>
              <div style={{
                fontSize: 12, letterSpacing: 2,
                color: selected === question.answer ? C.green : C.red,
                textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6,
              }}>
                {selected === question.answer ? "✓ Correct" : "× Răspuns incorect"}
              </div>
              <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>
                {question.explanation}
              </div>
            </div>
          )}
        </div>

        {/* Next button */}
        {revealed && (
          <button
            onClick={handleNext}
            style={{
              width: "100%",
              background: typeColor,
              border: "none", borderRadius: 14,
              color: "#F3F4F6", fontWeight: "bold", fontSize: 15,
              padding: "16px", cursor: "pointer",
              boxShadow: `0 6px 24px ${typeColor}33`,
              animation: "fadeUp 0.3s ease",
            }}>
            {questionIdx < level.questions.length - 1
              ? "Următoarea întrebare →"
              : levelIdx < LEVELS.length - 1
                ? "Nivel următor →"
                : "Vezi rezultatele →"}
          </button>
        )}

        {/* Level dots */}
        <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
          {LEVELS.map((l, i) => {
            const done = i < levelIdx;
            const active = i === levelIdx;
            const col = TYPE_COLORS[l.type];
            return (
              <div key={l.id} style={{
                width: active ? 20 : 8, height: 8, borderRadius: 4,
                background: done ? col : active ? col : C.border,
                opacity: done ? 0.6 : 1,
                transition: "all 0.3s",
                boxShadow: active ? `0 0 8px ${col}66` : "none",
              }} />
            );
          })}
        </div>

        <div style={{ marginTop: 32, textAlign: "center", fontSize: 9, color: "#10101A", letterSpacing: 3, textTransform: "uppercase", fontFamily: "monospace" }}>
          Structural Intelligence · Pattern Recognition · Joc
        </div>
      </div>
    </div>
  );
}
