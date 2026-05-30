import { useState, useRef, useEffect } from "react";

const C = {
  bg: "#F3F4F6",
  bgMid: "#F8FAFC",
  panel: "#FFFFFF",
  border: "#E5E7EB",
  text: "#111827",
  muted: "#475569",
  orange: "#FF6B2B",
  gold: "#FFB347",
  red: "#DC2626",
  teal: "#14B8A6",
  blue: "#2563EB",
  purple: "#7C3AED",
  green: "#16A34A",
  accent: "#FF6B2B",
};

// ── DISECTIA SISTEMULUI (embedded, simplified) ────────────────────────────────

const STEPS_DATA = [
  {
    id: "sistem", nr: 0, label: "Sistemul", color: "#CBD5E1",
    question: "Ce sistem vrei să diseci?",
    explanation: "Poți analiza orice — școala, un loc de muncă, o echipă, o instituție. Un sistem e orice structură care produce același tip de rezultat, indiferent de cine e înăuntru.",
    hints: ["Școala / universitatea", "Locul meu de muncă", "O echipă din care fac parte", "O instituție cu care interacționez"],
    placeholder: "Ex: Sistemul de învățământ...",
  },
  {
    id: "intrari", nr: 1, label: "Intrări", color: C.blue,
    question: "Ce primește sistemul?",
    explanation: "Tot ce consumă sistemul pentru a funcționa — oameni, timp, bani, energie, informații. Fără acestea, sistemul s-ar opri.",
    hints: ["Oameni (elevi, angajați)", "Timp și energie", "Bani și resurse", "Informații și cunoștințe"],
    placeholder: "Ex: Elevi, profesori, ore de curs, manuale...",
  },
  {
    id: "proces", nr: 2, label: "Proces", color: C.purple,
    question: "Ce face sistemul cu ele?",
    explanation: "Ce se întâmplă efectiv cu intrările. Nu ce ar trebui să se întâmple — ce se întâmplă de fapt.",
    hints: ["Care sunt activitățile zilnice?", "Cum se iau deciziile?", "Ce reguli guvernează comportamentul?"],
    placeholder: "Ex: Predare frontală, memorare, teste, notare...",
  },
  {
    id: "declarate", nr: 3, label: "Ieșiri declarate", color: C.green,
    question: "Ce spune sistemul că produce?",
    explanation: "Promisiunile oficiale ale sistemului — ce scrie în misiune, în discursuri, pe site-ul oficial.",
    hints: ["Ce promite oficial?", "Care e misiunea declarată?", "Ce beneficii sunt promise?"],
    placeholder: "Ex: Gândire critică, cetățeni educați, pregătire pentru viață...",
  },
  {
    id: "reale", nr: 4, label: "Ieșiri reale", color: C.orange,
    question: "Ce produce sistemul de fapt?",
    explanation: "Ce observi efectiv la oamenii care trec prin sistem. Nu judecăți — observații.",
    hints: ["Ce abilități au oamenii care ies?", "Ce comportamente produce?", "Ce rezultate apar constant?"],
    placeholder: "Ex: Abilitate de memorare pe termen scurt, conformism...",
  },
];

function DisectiaEmbedded() {
  const [values, setValues] = useState({ sistem: "", intrari: "", proces: "", declarate: "", reale: "" });
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState("steps");
  const [gap, setGap] = useState("");

  const current = STEPS_DATA[step];
  const allDone = STEPS_DATA.every(s => values[s.id].trim());
  const canNext = values[current?.id]?.trim() !== "";

  const gapColor = gap.length > 10 ? C.orange : C.muted;

  return (
    <div>
      {/* Progress */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, alignItems: "center" }}>
        {STEPS_DATA.map((s, i) => (
          <div key={s.id} style={{
            height: 4, borderRadius: 2, flex: 1,
            background: i <= step && phase === "steps" ? s.color : i < step ? s.color : C.border,
            opacity: i < step ? 0.5 : 1,
            transition: "all 0.3s",
          }} />
        ))}
      </div>

      {phase === "steps" && (
        <div style={{ animation: "fadeUp 0.3s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: current.color }} />
            <div style={{ fontSize: 10, letterSpacing: 2, color: current.color, textTransform: "uppercase", fontFamily: "monospace" }}>{current.label}</div>
          </div>
          <div style={{ fontSize: 16, fontWeight: "700", color: "#fff", marginBottom: 8 }}>{current.question}</div>
          <div style={{ fontSize: 13, color: "#9090AA", lineHeight: 1.7, marginBottom: 12, padding: "10px 14px", background: "#F8FAFC", borderRadius: 10, borderLeft: `2px solid ${current.color}44` }}>{current.explanation}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {current.hints.map((h, i) => <div key={i} style={{ fontSize: 10, color: "#8080AA", background: "rgba(15,23,42,0.03)", border: "1px solid #F8FAFC", borderRadius: 20, padding: "3px 10px" }}>{h}</div>)}
          </div>
          <textarea
            autoFocus
            value={values[current.id]}
            onChange={e => setValues(v => ({ ...v, [current.id]: e.target.value }))}
            placeholder={current.placeholder}
            style={{ width: "100%", minHeight: 80, background: "#F8FAFC", border: `1px solid ${current.color}44`, borderRadius: 10, color: C.text, fontSize: 13, padding: "10px 12px", resize: "vertical", fontFamily: "Georgia, serif", outline: "none", boxSizing: "border-box", lineHeight: 1.6 }}
          />
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} style={{ background: "rgba(15,23,42,0.04)", border: "1px solid #F8FAFC", borderRadius: 10, color: C.muted, fontSize: 13, padding: "10px 16px", cursor: "pointer" }}>←</button>
            )}
            <button onClick={() => step < STEPS_DATA.length - 1 ? setStep(s => s + 1) : setPhase("gap")} disabled={!canNext} style={{ flex: 1, background: canNext ? `linear-gradient(135deg, ${current.color}, ${current.color}AA)` : C.border, border: "none", borderRadius: 10, color: canNext ? "#F3F4F6" : C.muted, fontWeight: "bold", fontSize: 14, padding: "11px", cursor: canNext ? "pointer" : "default", transition: "all 0.3s" }}>
              {step < STEPS_DATA.length - 1 ? "Continuă →" : "Găsește compromisul →"}
            </button>
          </div>
        </div>
      )}

      {phase === "gap" && (
        <div style={{ animation: "fadeUp 0.3s ease" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            <div style={{ background: `${C.green}0A`, border: `1px solid ${C.green}22`, borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: C.green, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6 }}>Declară</div>
              <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.6 }}>{values.declarate.slice(0, 100)}{values.declarate.length > 100 ? "…" : ""}</div>
            </div>
            <div style={{ background: `${C.orange}0A`, border: `1px solid ${C.orange}22`, borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: C.orange, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6 }}>Produce</div>
              <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.6 }}>{values.reale.slice(0, 100)}{values.reale.length > 100 ? "…" : ""}</div>
            </div>
          </div>
          <div style={{ fontSize: 15, fontWeight: "700", color: "#fff", marginBottom: 8 }}>Care e compromisul principal?</div>
          <div style={{ fontSize: 13, color: "#9090AA", lineHeight: 1.7, marginBottom: 12, padding: "10px 14px", background: "#F8FAFC", borderRadius: 10, borderLeft: `2px solid ${C.orange}44` }}>
            Distanța dintre ce declară și ce produce — aceea e compromisul. Nu e o acuzație. E o constrângere de design. Ce sacrifică sistemul pentru a funcționa la scară?
          </div>
          <textarea
            autoFocus
            value={gap}
            onChange={e => setGap(e.target.value)}
            placeholder="Ex: Sistemul sacrifică înțelegerea profundă pentru eficiența evaluării..."
            style={{ width: "100%", minHeight: 80, background: "#F8FAFC", border: `1px solid ${C.orange}44`, borderRadius: 10, color: C.text, fontSize: 13, padding: "10px 12px", resize: "vertical", fontFamily: "Georgia, serif", outline: "none", boxSizing: "border-box", lineHeight: 1.6 }}
          />
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button onClick={() => setPhase("steps")} style={{ background: "rgba(15,23,42,0.04)", border: "1px solid #F8FAFC", borderRadius: 10, color: C.muted, fontSize: 13, padding: "10px 16px", cursor: "pointer" }}>←</button>
            {gap.trim() && (
              <div style={{ flex: 1, padding: "11px 16px", background: `${C.green}12`, border: `1px solid ${C.green}33`, borderRadius: 10, fontSize: 13, color: "#70AA88", fontStyle: "italic" }}>
                Tocmai ai văzut un sistem cu ochii unui gânditor structural.
              </div>
            )}
          </div>
          {gap.trim() && (
            <button onClick={() => { setValues({ sistem: "", intrari: "", proces: "", declarate: "", reale: "" }); setGap(""); setStep(0); setPhase("steps"); }} style={{ marginTop: 10, width: "100%", background: "rgba(15,23,42,0.04)", border: "1px solid #F8FAFC", borderRadius: 10, color: C.muted, fontSize: 12, padding: "10px", cursor: "pointer" }}>← Disecă alt sistem</button>
          )}
        </div>
      )}
    </div>
  );
}

// ── SIMULATOR (embedded, simplified) ─────────────────────────────────────────

const PRESETS_SIMPLE = [
  {
    id: "scoala", name: "Școala", emoji: "📚",
    sliders: [
      { id: "memorare", label: "Memorare vs. Înțelegere", value: 80, min: 0, max: 100, unit: "% memorare" },
      { id: "proiecte", label: "Proiecte practice", value: 20, min: 0, max: 100, unit: "%" },
      { id: "elevi", label: "Elevi per clasă", value: 30, min: 5, max: 40, unit: "elevi" },
    ],
    compute: (v) => {
      const gandire = Math.min(100, Math.max(0, Math.round(100 - (v.memorare||80)*0.6 + (v.proiecte||20)*0.4)));
      const stres = Math.min(100, Math.max(0, Math.round((v.elevi||30)*0.8 + (v.memorare||80)*0.2)));
      const gap = Math.round(100 - gandire);
      return { gandire, stres, gap };
    },
    outputs: ["Gândire critică", "Nivel de stres"],
    insight: (v) => v.memorare > 70 ? "Memorarea ridicată comprimă gândirea critică. Crește proiectele pentru a apropia ce se face de ce se promite." : "Echilibru bun. Proiectele practice fac diferența.",
  },
  {
    id: "startup", name: "Startup", emoji: "🚀",
    sliders: [
      { id: "viteza", label: "Viteză vs. Calitate", value: 70, min: 0, max: 100, unit: "% viteză" },
      { id: "procese", label: "Procese interne", value: 20, min: 0, max: 100, unit: "%" },
      { id: "energie", label: "Energia echipei", value: 90, min: 0, max: 100, unit: "%" },
    ],
    compute: (v) => {
      const calitate = Math.min(100, Math.max(0, Math.round((100-(v.viteza||70))*0.5 + (v.procese||20)*0.3)));
      const burnout = Math.min(100, Math.max(0, Math.round((v.energie||90)*0.4 + (v.viteza||70)*0.3)));
      const gap = Math.round(100 - calitate);
      return { calitate, burnout, gap };
    },
    outputs: ["Calitatea produsului", "Risc burnout"],
    insight: (v) => v.burnout > 70 ? "Energie mare + viteză mare = burnout rapid. Sistemul consumă oamenii înainte să producă impactul promis." : "Echilibru sustenabil.",
  },
];

function SimulatorEmbedded() {
  const [selected, setSelected] = useState(null);
  const [vals, setVals] = useState({});

  const preset = PRESETS_SIMPLE.find(p => p.id === selected);

  useEffect(() => {
    if (preset) {
      const init = {};
      preset.sliders.forEach(s => { init[s.id] = s.value; });
      setVals(init);
    }
  }, [selected]);

  const result = preset ? preset.compute(vals) : null;

  if (!selected) return (
    <div>
      <div style={{ fontSize: 13, color: C.muted, marginBottom: 16, fontStyle: "italic" }}>Alege un sistem pentru a experimenta:</div>
      <div style={{ display: "flex", gap: 10 }}>
        {PRESETS_SIMPLE.map(p => (
          <div key={p.id} onClick={() => setSelected(p.id)} style={{ flex: 1, background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 16px", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.orange}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{p.emoji}</div>
            <div style={{ fontSize: 13, fontWeight: "bold", color: "#fff" }}>{p.name}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ animation: "fadeUp 0.3s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: "bold", color: "#fff" }}>{preset.emoji} {preset.name}</div>
        <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: C.muted, fontSize: 12, cursor: "pointer", fontFamily: "monospace" }}>← înapoi</button>
      </div>

      {/* Gap bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: C.muted, textTransform: "uppercase", fontFamily: "monospace" }}>Distanța față de promisiune</div>
          <div style={{ fontSize: 12, fontFamily: "monospace", color: result.gap < 30 ? C.green : result.gap < 60 ? C.gold : C.red, fontWeight: "bold" }}>{result.gap}%</div>
        </div>
        <div style={{ height: 8, borderRadius: 4, background: C.border, overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: 4, width: `${result.gap}%`, background: result.gap < 30 ? C.green : result.gap < 60 ? C.gold : C.red, transition: "width 0.5s" }} />
        </div>
      </div>

      {/* Outputs */}
      {preset.outputs.map((label, i) => {
        const keys = Object.keys(result).filter(k => k !== "gap");
        const val = result[keys[i]] || 0;
        const isGood = i === 0;
        const color = isGood ? (val > 50 ? C.green : C.muted) : (val > 50 ? C.red : C.green);
        return (
          <div key={label} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: C.text }}>{label}</span>
              <span style={{ fontSize: 12, fontFamily: "monospace", color }}>{val}%</span>
            </div>
            <div style={{ height: 5, borderRadius: 3, background: C.border, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 3, width: `${val}%`, background: color, transition: "width 0.4s" }} />
            </div>
          </div>
        );
      })}

      {/* Insight */}
      <div style={{ margin: "16px 0", padding: "12px 14px", background: `${C.orange}08`, border: `1px solid ${C.orange}22`, borderRadius: 10, fontSize: 12, color: "#94A3B8", fontStyle: "italic", lineHeight: 1.7 }}>
        {preset.insight(vals)}
      </div>

      {/* Sliders */}
      <div style={{ fontSize: 9, letterSpacing: 2, color: C.muted, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 14 }}>Modifică elementele</div>
      {preset.sliders.map(sl => (
        <div key={sl.id} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: C.text }}>{sl.label}</span>
            <span style={{ fontSize: 12, fontFamily: "monospace", color: C.orange }}>{vals[sl.id] || sl.value} {sl.unit}</span>
          </div>
          <input type="range" min={sl.min} max={sl.max} value={vals[sl.id] || sl.value}
            onChange={e => setVals(v => ({ ...v, [sl.id]: Number(e.target.value) }))}
            style={{ width: "100%", accentColor: C.orange, cursor: "pointer" }} />
        </div>
      ))}
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

const SECTIONS = ["intro", "concept", "exemplu", "instrument1", "instrument2", "concluzie"];

export default function Lectia2() {
  const [activeSection, setActiveSection] = useState(0);
  const [readSections, setReadSections] = useState(new Set([0]));
  const [showTool1, setShowTool1] = useState(false);
  const [showTool2, setShowTool2] = useState(false);
  const tool1Ref = useRef(null);
  const tool2Ref = useRef(null);

  function markRead(i) {
    setReadSections(prev => new Set([...prev, i]));
    if (i < SECTIONS.length - 1) setActiveSection(i + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const progress = Math.round((readSections.size / SECTIONS.length) * 100);

  return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 25% 10%, #1A0A2E 0%, ${C.bg} 55%)`,
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: C.text,
    }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
        textarea:focus, input:focus { outline: none; }
      `}</style>

      {/* Top nav */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: `${C.bg}EE`, backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.border}`,
        padding: "12px 20px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: C.muted, textTransform: "uppercase", fontFamily: "monospace", flexShrink: 0 }}>Școala Valasi</div>
        <div style={{ flex: 1, height: 3, borderRadius: 2, background: C.border, overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: 2, width: `${progress}%`, background: `linear-gradient(90deg, ${C.orange}, ${C.gold})`, transition: "width 0.5s" }} />
        </div>
        <div style={{ fontSize: 10, color: C.muted, fontFamily: "monospace", flexShrink: 0 }}>{progress}%</div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 20px 80px" }}>

        {/* Hero */}
        <div style={{ padding: "48px 0 32px", animation: "fadeUp 0.6s ease" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: C.orange, textTransform: "uppercase", fontFamily: "monospace", padding: "3px 10px", border: `1px solid ${C.orange}44`, borderRadius: 20 }}>Modul 1</div>
            <div style={{ fontSize: 9, letterSpacing: 3, color: C.muted, textTransform: "uppercase", fontFamily: "monospace", padding: "3px 10px", border: `1px solid ${C.border}`, borderRadius: 20 }}>Inteligență Structurală</div>
            <div style={{ fontSize: 9, letterSpacing: 3, color: C.muted, textTransform: "uppercase", fontFamily: "monospace", padding: "3px 10px", border: `1px solid ${C.border}`, borderRadius: 20 }}>Lecția 2 din 3</div>
          </div>
          <h1 style={{
            fontSize: "clamp(22px, 5vw, 38px)", fontWeight: 700, margin: "0 0 16px",
            lineHeight: 1.2, letterSpacing: "-0.02em",
            background: `linear-gradient(135deg, #fff 0%, ${C.gold} 100%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>De ce școala te-a învățat să reproduci, nu să înțelegi</h1>
          <p style={{ fontSize: 15, color: "#8888BB", lineHeight: 1.8, margin: 0 }}>
            Orice sistem face un compromis între ce e valoros și ce e măsurabil. Dacă înțelegi asta, nu mai ești prizonierul niciunui sistem fără să știi.
          </p>
        </div>

        {/* Section navigator */}
        <div style={{ display: "flex", gap: 6, marginBottom: 32, flexWrap: "wrap" }}>
          {[
            { label: "Introducere" }, { label: "Conceptul" }, { label: "Exemplul" },
            { label: "Disecția" }, { label: "Simulatorul" }, { label: "Concluzia" },
          ].map((s, i) => {
            const isRead = readSections.has(i);
            const isActive = activeSection === i;
            return (
              <button key={i} onClick={() => setActiveSection(i)} style={{
                fontSize: 10, padding: "5px 12px", borderRadius: 20, cursor: "pointer",
                fontFamily: "monospace", letterSpacing: 1, textTransform: "uppercase",
                border: isActive ? `1px solid ${C.orange}` : `1px solid ${C.border}`,
                background: isActive ? `${C.orange}15` : "transparent",
                color: isActive ? C.orange : isRead ? C.muted : "#475569",
                transition: "all 0.2s",
              }}>
                {isRead && !isActive ? "✓ " : ""}{s.label}
              </button>
            );
          })}
        </div>

        {/* INTRO */}
        {activeSection === 0 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ background: `linear-gradient(135deg, #F3F4F6 0%, #FFF7ED 100%)`, border: `1px solid ${C.border}`, borderRadius: 20, padding: "28px", marginBottom: 20 }}>
              <p style={{ fontSize: 15, lineHeight: 1.9, color: C.text, margin: "0 0 16px" }}>
                Ai luat vreodată o notă bună la un test și a doua zi nu mai știai nimic din ce ai învățat?
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.9, color: "#9090BB", margin: 0 }}>
                Nu e vina ta. E designul sistemului.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 24 }}>
              {[
                { icon: "📖", label: "5 minute", desc: "să citești lecția" },
                { icon: "⚙️", label: "2 instrumente", desc: "să diseci și să simulezi" },
                { icon: "🐉", label: "1 principiu", desc: "ce e valoros vs. ce e măsurabil" },
              ].map((item, i) => (
                <div key={i} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: "bold", color: "#fff", marginBottom: 3 }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{item.desc}</div>
                </div>
              ))}
            </div>
            <button onClick={() => markRead(0)} style={{ width: "100%", background: `linear-gradient(135deg, ${C.orange}, ${C.gold})`, border: "none", borderRadius: 14, color: "#F3F4F6", fontWeight: "bold", fontSize: 15, padding: "16px", cursor: "pointer", boxShadow: `0 6px 24px ${C.orange}44` }}>
              Începe lecția →
            </button>
          </div>
        )}

        {/* CONCEPT */}
        {activeSection === 1 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: C.orange, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 16 }}>Conceptul</div>
            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 18, padding: "24px", marginBottom: 16 }}>
              <p style={{ fontSize: 15, lineHeight: 1.9, color: C.text, margin: "0 0 20px" }}>
                Orice sistem face un compromis între <strong style={{ color: C.orange }}>ce e valoros</strong> și <strong style={{ color: C.teal }}>ce e măsurabil.</strong>
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.9, color: "#9090BB", margin: "0 0 20px" }}>
                Școala și-a dorit să producă oameni care gândesc. Dar a trebuit să evalueze milioane de elevi, în mod egal, cu resurse limitate. Și a găsit soluția ei: <strong style={{ color: "#fff" }}>testul cu răspuns corect.</strong>
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.9, color: "#9090BB", margin: 0 }}>
                Problema e că înțelegerea reală nu are un singur răspuns corect. E greu de notat. Deci sistemul a ales ce putea măsura — memorarea — și a optimizat pentru asta.
              </p>
            </div>
            <div style={{ background: `${C.orange}0D`, border: `1px solid ${C.orange}33`, borderRadius: 14, padding: "18px", marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: "bold", color: "#fff", marginBottom: 8 }}>Prima lege a sistemelor pe care școala nu ți-a predat-o:</div>
              <div style={{ fontSize: 14, color: "#B0B0CC", lineHeight: 1.8, fontStyle: "italic" }}>Orice sistem tinde să optimizeze pentru ce poate măsura, nu pentru ce contează cu adevărat.</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div style={{ background: C.panel, border: `1px solid ${C.red}33`, borderRadius: 14, padding: "16px" }}>
                <div style={{ fontSize: 10, letterSpacing: 2, color: C.red, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8 }}>Ce măsoară</div>
                <div style={{ fontSize: 13, color: "#9090AA", lineHeight: 1.7 }}>Reproducerea informației în condiții de stres și timp limitat.</div>
              </div>
              <div style={{ background: C.panel, border: `1px solid ${C.teal}33`, borderRadius: 14, padding: "16px" }}>
                <div style={{ fontSize: 10, letterSpacing: 2, color: C.teal, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8 }}>Ce promite</div>
                <div style={{ fontSize: 13, color: "#9090AA", lineHeight: 1.7 }}>Gândire critică, cetățeni educați, pregătire pentru viață.</div>
              </div>
            </div>
            <button onClick={() => markRead(1)} style={{ width: "100%", background: `linear-gradient(135deg, ${C.orange}, ${C.gold})`, border: "none", borderRadius: 14, color: "#F3F4F6", fontWeight: "bold", fontSize: 15, padding: "16px", cursor: "pointer", boxShadow: `0 6px 24px ${C.orange}44` }}>
              Am înțeles — arată-mi exemplul →
            </button>
          </div>
        )}

        {/* EXEMPLU */}
        {activeSection === 2 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: C.orange, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 16 }}>Exemplul real</div>
            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 18, padding: "24px", marginBottom: 16 }}>
              <p style={{ fontSize: 14, color: C.muted, fontStyle: "italic", margin: "0 0 20px", lineHeight: 1.7 }}>Doi studenți învață același capitol de istorie.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ background: `${C.red}0A`, border: `1px solid ${C.red}22`, borderRadius: 14, padding: "18px" }}>
                  <div style={{ fontSize: 10, letterSpacing: 2, color: C.red, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8 }}>Studentul A</div>
                  <p style={{ fontSize: 13, color: "#9090AA", lineHeight: 1.7, margin: 0 }}>Memorează datele, numele, evenimentele. Ia 10. Uită totul în trei săptămâni.</p>
                </div>
                <div style={{ background: `${C.teal}0A`, border: `1px solid ${C.teal}22`, borderRadius: 14, padding: "18px" }}>
                  <div style={{ fontSize: 10, letterSpacing: 2, color: C.teal, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8 }}>Studentul B</div>
                  <p style={{ fontSize: 13, color: "#9090AA", lineHeight: 1.7, margin: 0 }}>Înțelege de ce s-a întâmplat acel eveniment, ce forțe l-au produs. Ia 7. Nu uită niciodată.</p>
                </div>
              </div>
            </div>
            <div style={{ background: `${C.orange}0D`, border: `1px solid ${C.orange}33`, borderRadius: 14, padding: "18px", marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: "bold", color: "#fff", marginBottom: 6 }}>Sistemul l-a recompensat pe primul. Viața îl va recompensa pe al doilea.</div>
              <div style={{ fontSize: 13, color: "#9090AA", lineHeight: 1.7 }}>Nu pentru că viața e corectă — ci pentru că viața nu îți dă teste cu variante. Îți dă situații noi în care trebuie să înțelegi, nu să reproduci.</div>
            </div>
            <button onClick={() => markRead(2)} style={{ width: "100%", background: `linear-gradient(135deg, ${C.orange}, ${C.gold})`, border: "none", borderRadius: 14, color: "#F3F4F6", fontWeight: "bold", fontSize: 15, padding: "16px", cursor: "pointer", boxShadow: `0 6px 24px ${C.orange}44` }}>
              Înțeleg — disec un sistem →
            </button>
          </div>
        )}

        {/* INSTRUMENT 1 */}
        {activeSection === 3 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: C.orange, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 16 }}>Instrumentul 1 — Disecția Sistemului</div>
            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 18, padding: "22px", marginBottom: 20 }}>
              <p style={{ fontSize: 14, color: "#9090AA", lineHeight: 1.8, margin: "0 0 16px" }}>
                Aplică cadrul pe orice sistem din viața ta. Identifică ce intră, ce se întâmplă, ce promite și ce produce de fapt. Distanța dintre ultimele două e compromisul sistemului.
              </p>
              {!showTool1 ? (
                <button onClick={() => { setShowTool1(true); setTimeout(() => tool1Ref.current?.scrollIntoView({ behavior: "smooth" }), 100); }} style={{ width: "100%", background: `linear-gradient(135deg, ${C.orange}, ${C.gold})`, border: "none", borderRadius: 14, color: "#F3F4F6", fontWeight: "bold", fontSize: 15, padding: "16px", cursor: "pointer" }}>
                  Deschide Disecția Sistemului →
                </button>
              ) : (
                <button onClick={() => markRead(3)} style={{ width: "100%", background: "rgba(15,23,42,0.04)", border: `1px solid ${C.border}`, borderRadius: 14, color: C.muted, fontSize: 13, padding: "14px", cursor: "pointer" }}>
                  Am completat disecția — mergi la Simulator →
                </button>
              )}
            </div>
            {showTool1 && (
              <div ref={tool1Ref} style={{ background: C.panel, border: `1px solid ${C.orange}44`, borderRadius: 20, padding: "24px", animation: "fadeUp 0.4s ease" }}>
                <div style={{ fontSize: 10, letterSpacing: 3, color: C.orange, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 20 }}>Disecția Sistemului</div>
                <DisectiaEmbedded />
              </div>
            )}
          </div>
        )}

        {/* INSTRUMENT 2 */}
        {activeSection === 4 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: C.orange, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 16 }}>Instrumentul 2 — Simulatorul de Sisteme</div>
            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 18, padding: "22px", marginBottom: 20 }}>
              <p style={{ fontSize: 14, color: "#9090AA", lineHeight: 1.8, margin: "0 0 16px" }}>
                Acum experimentează. Modifică elementele unui sistem și vezi în timp real cum se propagă efectele. Nu există schimbare fără consecință — și asta e lecția.
              </p>
              {!showTool2 ? (
                <button onClick={() => { setShowTool2(true); setTimeout(() => tool2Ref.current?.scrollIntoView({ behavior: "smooth" }), 100); }} style={{ width: "100%", background: `linear-gradient(135deg, ${C.orange}, ${C.gold})`, border: "none", borderRadius: 14, color: "#F3F4F6", fontWeight: "bold", fontSize: 15, padding: "16px", cursor: "pointer" }}>
                  Deschide Simulatorul →
                </button>
              ) : (
                <button onClick={() => markRead(4)} style={{ width: "100%", background: "rgba(15,23,42,0.04)", border: `1px solid ${C.border}`, borderRadius: 14, color: C.muted, fontSize: 13, padding: "14px", cursor: "pointer" }}>
                  Am experimentat — mergi la concluzie →
                </button>
              )}
            </div>
            {showTool2 && (
              <div ref={tool2Ref} style={{ background: C.panel, border: `1px solid ${C.orange}44`, borderRadius: 20, padding: "24px", animation: "fadeUp 0.4s ease" }}>
                <div style={{ fontSize: 10, letterSpacing: 3, color: C.orange, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 20 }}>Simulatorul de Sisteme</div>
                <SimulatorEmbedded />
              </div>
            )}
          </div>
        )}

        {/* CONCLUZIE */}
        {activeSection === 5 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: C.orange, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 16 }}>Concluzia</div>
            <div style={{ background: `linear-gradient(135deg, #F3F4F6 0%, #FFF7ED 100%)`, border: `1px solid ${C.orange}55`, borderRadius: 20, padding: "28px", marginBottom: 20, boxShadow: `0 8px 24px rgba(15,23,42,0.08)` }}>
              <p style={{ fontSize: 18, lineHeight: 1.8, color: "#fff", fontStyle: "italic", margin: "0 0 20px", textAlign: "center" }}>
                "Când înveți să vezi distanța dintre ce declară un sistem și ce produce de fapt — nu mai ești niciodată prizonierul lui fără să știi."
              </p>
              <div style={{ width: 40, height: 2, background: `linear-gradient(90deg, ${C.orange}, ${C.gold})`, margin: "0 auto" }} />
            </div>
            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px", marginBottom: 20 }}>
              <div style={{ fontSize: 11, letterSpacing: 2, color: C.muted, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 14 }}>Ce ai învățat în această lecție</div>
              {[
                "De ce orice sistem face un compromis între ce e valoros și ce e măsurabil",
                "Cum să diseci orice sistem — intrări, proces, ieșiri declarate vs. reale",
                "Că înțelegând compromisul unui sistem poți naviga în el mai inteligent",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                  <div style={{ color: C.orange, fontSize: 14, flexShrink: 0, marginTop: 1 }}>✓</div>
                  <div style={{ fontSize: 13, color: "#9090AA", lineHeight: 1.6 }}>{item}</div>
                </div>
              ))}
            </div>

            {/* Next lesson */}
            <div style={{ background: `linear-gradient(135deg, #F3F4F6 0%, #FFF7ED 100%)`, border: `1px solid ${C.teal}33`, borderRadius: 18, padding: "22px", marginBottom: 20 }}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: C.teal, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 10 }}>Lecția 3 — ce urmează</div>
              <div style={{ fontSize: 15, fontWeight: "bold", color: "#fff", marginBottom: 8 }}>Pattern Recognition</div>
              <div style={{ fontSize: 13, color: "#7090AA", lineHeight: 1.7 }}>Cum antrenezi ochiul să vadă ce urmează înainte să se întâmple — în forme, în comportamente, în dinamici sociale.</div>
            </div>

            <button onClick={() => markRead(5)} style={{ width: "100%", background: `linear-gradient(135deg, ${C.teal}, #2DD4BF)`, border: "none", borderRadius: 14, color: "#F3F4F6", fontWeight: "bold", fontSize: 15, padding: "16px", cursor: "pointer", boxShadow: `0 6px 24px ${C.teal}44` }}>
              Mergi la Lecția 3 →
            </button>
          </div>
        )}

        {progress === 100 && (
          <div style={{ marginTop: 32, background: `linear-gradient(135deg, ${C.orange}15, ${C.gold}08)`, border: `1px solid ${C.gold}44`, borderRadius: 18, padding: "24px", textAlign: "center", animation: "fadeUp 0.4s ease" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🐉</div>
            <div style={{ fontSize: 16, fontWeight: "bold", color: "#fff", marginBottom: 8 }}>Lecția 2 completată</div>
            <div style={{ fontSize: 13, color: "#9090AA", lineHeight: 1.7 }}>Dragonul tău vede acum compromisurile sistemelor. Nimeni nu îl mai poate ține prizonier fără să știe.</div>
          </div>
        )}
      </div>
    </div>
  );
}
