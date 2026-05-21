import { useState, useEffect } from "react";

const C = {
  bg: "#F3F4F6",
  panel: "#FFFFFF",
  panelBorder: "#E5E7EB",
  text: "#111827",
  muted: "#475569",
  faint: "#F8FAFC",
  intrari: "#2563EB",
  proces: "#7C3AED",
  declarate: "#16A34A",
  reale: "#D97706",
  accent: "#FF6B2B",
  danger: "#DC2626",
  good: "#16A34A",
};

// ─── PRESET SYSTEMS ───────────────────────────────────────────────────────────

const PRESETS = [
  {
    id: "scoala",
    name: "Școala",
    emoji: "📚",
    description: "Sistemul de învățământ tradițional",
    elements: {
      intrari: [
        { id: "elevi", label: "Elevi per clasă", value: 30, min: 5, max: 40, unit: "elevi", impact: "proces" },
        { id: "ore", label: "Ore de curs / zi", value: 6, min: 2, max: 10, unit: "ore", impact: "intrari" },
        { id: "profesori", label: "Calitatea predării", value: 50, min: 0, max: 100, unit: "%", impact: "proces" },
      ],
      proces: [
        { id: "memorare", label: "Memorare vs. Înțelegere", value: 80, min: 0, max: 100, unit: "% memorare", impact: "reale" },
        { id: "evaluare", label: "Frecvența testelor", value: 70, min: 0, max: 100, unit: "% din timp", impact: "reale" },
        { id: "proiecte", label: "Proiecte practice", value: 20, min: 0, max: 100, unit: "% din activitate", impact: "reale" },
      ],
    },
    declared: "Gândire critică, cetățeni educați, pregătire pentru viață",
    computeReal: (el) => {
      const mem = el.memorare ?? 80;
      const eval_ = el.evaluare ?? 70;
      const proj = el.proiecte ?? 20;
      const cls = el.elevi ?? 30;
      const prof = el.profesori ?? 50;
      const gandire = Math.round(100 - mem * 0.6 - eval_ * 0.2 + proj * 0.4 + prof * 0.2);
      const aplicare = Math.round(proj * 0.6 + (100 - mem) * 0.3 + prof * 0.1);
      const stres = Math.round(eval_ * 0.5 + cls * 0.8 + mem * 0.2);
      const conformism = Math.round(mem * 0.4 + eval_ * 0.3 + (100 - proj) * 0.3);
      return [
        { label: "Gândire critică", value: Math.min(100, Math.max(0, gandire)), good: true },
        { label: "Capacitate de aplicare", value: Math.min(100, Math.max(0, aplicare)), good: true },
        { label: "Nivel de stres", value: Math.min(100, Math.max(0, stres)), good: false },
        { label: "Conformism", value: Math.min(100, Math.max(0, conformism)), good: false },
      ];
    },
    computeGap: (outputs) => {
      const gandire = outputs.find(o => o.label === "Gândire critică")?.value ?? 0;
      const aplicare = outputs.find(o => o.label === "Capacitate de aplicare")?.value ?? 0;
      return Math.round(100 - (gandire + aplicare) / 2);
    },
    insight: (el, outputs) => {
      const mem = el.memorare ?? 80;
      const proj = el.proiecte ?? 20;
      if (mem > 70 && proj < 30) return "Sistemul produce reproducere, nu înțelegere. Crește proiectele practice pentru a apropia ieșirile reale de cele declarate.";
      if (proj > 60) return "Bun echilibru. Proiectele practice apropie semnificativ ieșirile reale de promisiunile sistemului.";
      if (el.elevi > 35) return "Clasele prea mari blochează personalizarea. Chiar dacă procesul e bun, impactul per elev scade.";
      return "Fiecare schimbare în sistem produce un efect în cascadă. Nicio modificare nu e izolată.";
    },
  },
  {
    id: "startup",
    name: "Startup",
    emoji: "🚀",
    description: "O echipă mică cu ritm rapid",
    elements: {
      intrari: [
        { id: "echipa", label: "Mărimea echipei", value: 5, min: 1, max: 30, unit: "oameni", impact: "proces" },
        { id: "finantare", label: "Resursă financiară", value: 40, min: 0, max: 100, unit: "%", impact: "intrari" },
        { id: "energie", label: "Energia fondatorilor", value: 90, min: 0, max: 100, unit: "%", impact: "proces" },
      ],
      proces: [
        { id: "viteza", label: "Viteză vs. Calitate", value: 70, min: 0, max: 100, unit: "% viteză", impact: "reale" },
        { id: "focus", label: "Focus pe produs", value: 60, min: 0, max: 100, unit: "%", impact: "reale" },
        { id: "procese", label: "Procese interne", value: 20, min: 0, max: 100, unit: "% structură", impact: "reale" },
      ],
    },
    declared: "Inovație, impact, produs excepțional, cultură de echipă",
    computeReal: (el) => {
      const vit = el.viteza ?? 70;
      const foc = el.focus ?? 60;
      const proc = el.procese ?? 20;
      const en = el.energie ?? 90;
      const fin = el.finantare ?? 40;
      const inovatie = Math.round(foc * 0.5 + en * 0.3 + (100 - vit) * 0.2);
      const calitate = Math.round((100 - vit) * 0.5 + proc * 0.3 + foc * 0.2);
      const burnout = Math.round(en * 0.4 + vit * 0.3 + (100 - fin) * 0.3);
      const haos = Math.round((100 - proc) * 0.5 + vit * 0.3 + (100 - fin) * 0.2);
      return [
        { label: "Inovație reală", value: Math.min(100, Math.max(0, inovatie)), good: true },
        { label: "Calitatea produsului", value: Math.min(100, Math.max(0, calitate)), good: true },
        { label: "Risc de burnout", value: Math.min(100, Math.max(0, burnout)), good: false },
        { label: "Haos organizațional", value: Math.min(100, Math.max(0, haos)), good: false },
      ];
    },
    computeGap: (outputs) => {
      const inov = outputs.find(o => o.label === "Inovație reală")?.value ?? 0;
      const cal = outputs.find(o => o.label === "Calitatea produsului")?.value ?? 0;
      return Math.round(100 - (inov + cal) / 2);
    },
    insight: (el, outputs) => {
      const burnout = outputs.find(o => o.label === "Risc de burnout")?.value ?? 0;
      if (burnout > 70) return "Energie mare + resurse mici = burnout rapid. Sistemul consumă fondatorii înainte să producă impactul promis.";
      if (el.procese < 20) return "Fără procese interne, viteza creează haos. Puțină structură acum salvează mult timp mai târziu.";
      if (el.viteza > 80) return "Viteza mare comprimă calitatea. Startup-urile care livrează rapid dar prost pierd mai mult decât câștigă.";
      return "Echilibrul viteză-calitate-procese e cel mai dificil compromis în orice startup.";
    },
  },
  {
    id: "retea",
    name: "Rețea socială",
    emoji: "📱",
    description: "Platforme precum TikTok, Instagram",
    elements: {
      intrari: [
        { id: "utilizatori", label: "Utilizatori activi", value: 80, min: 0, max: 100, unit: "% engagement", impact: "proces" },
        { id: "continut", label: "Conținut generat", value: 90, min: 0, max: 100, unit: "% volum", impact: "proces" },
        { id: "timp", label: "Timp petrecut / zi", value: 70, min: 0, max: 100, unit: "% din timp liber", impact: "intrari" },
      ],
      proces: [
        { id: "algoritm", label: "Optimizare engagement", value: 90, min: 0, max: 100, unit: "%", impact: "reale" },
        { id: "reclame", label: "Publicitate", value: 80, min: 0, max: 100, unit: "% din venit", impact: "reale" },
        { id: "moderare", label: "Moderare conținut", value: 30, min: 0, max: 100, unit: "%", impact: "reale" },
      ],
    },
    declared: "Conectare umană, informare, comunitate, exprimare liberă",
    computeReal: (el) => {
      const alg = el.algoritm ?? 90;
      const rec = el.reclame ?? 80;
      const mod = el.moderare ?? 30;
      const timp = el.timp ?? 70;
      const conectare = Math.round((100 - alg) * 0.4 + mod * 0.3 + (100 - rec) * 0.3);
      const informare = Math.round(mod * 0.5 + (100 - alg) * 0.3 + (100 - rec) * 0.2);
      const dependenta = Math.round(alg * 0.5 + timp * 0.3 + rec * 0.2);
      const polarizare = Math.round(alg * 0.4 + (100 - mod) * 0.4 + rec * 0.2);
      return [
        { label: "Conectare autentică", value: Math.min(100, Math.max(0, conectare)), good: true },
        { label: "Informare de calitate", value: Math.min(100, Math.max(0, informare)), good: true },
        { label: "Dependență digitală", value: Math.min(100, Math.max(0, dependenta)), good: false },
        { label: "Polarizare socială", value: Math.min(100, Math.max(0, polarizare)), good: false },
      ];
    },
    computeGap: (outputs) => {
      const con = outputs.find(o => o.label === "Conectare autentică")?.value ?? 0;
      const inf = outputs.find(o => o.label === "Informare de calitate")?.value ?? 0;
      return Math.round(100 - (con + inf) / 2);
    },
    insight: (el, outputs) => {
      const dep = outputs.find(o => o.label === "Dependență digitală")?.value ?? 0;
      if (dep > 75) return "Algoritmul e optimizat pentru timp petrecut, nu pentru valoare primită. Ești resursa, nu clientul.";
      if (el.moderare > 60) return "Moderarea ridicată reduce polarizarea dar limitează exprimarea. Compromisul între siguranță și libertate.";
      if (el.algoritm > 80) return "Engagement-ul maxim produce conținut extrem. Algoritmul nu distinge între util și adictiv.";
      return "Rețelele sociale sunt sisteme optimizate pentru atenție, nu pentru bunăstare.";
    },
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function GapBar({ gap, prev }) {
  const improved = prev !== null && gap < prev;
  const worsened = prev !== null && gap > prev;
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 6,
      }}>
        <div style={{ fontSize: 10, letterSpacing: 2, color: C.muted, textTransform: "uppercase", fontFamily: "monospace" }}>
          Distanța față de promisiune
        </div>
        <div style={{
          fontSize: 12, fontFamily: "monospace", fontWeight: "bold",
          color: gap < 30 ? C.good : gap < 60 ? C.accent : C.danger,
        }}>
          {gap}%
          {improved && <span style={{ color: C.good, marginLeft: 6 }}>↓ mai bine</span>}
          {worsened && <span style={{ color: C.danger, marginLeft: 6 }}>↑ mai rău</span>}
        </div>
      </div>
      <div style={{
        height: 8, borderRadius: 4,
        background: C.panelBorder, overflow: "hidden",
      }}>
        <div style={{
          height: "100%", borderRadius: 4,
          width: `${gap}%`,
          background: gap < 30
            ? `linear-gradient(90deg, ${C.good}, #34D399)`
            : gap < 60
              ? `linear-gradient(90deg, ${C.accent}, #F97316)`
              : `linear-gradient(90deg, ${C.danger}, #F97316)`,
          transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
        }} />
      </div>
    </div>
  );
}

function OutputBar({ label, value, good }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        marginBottom: 4,
      }}>
        <div style={{ fontSize: 12, color: C.text }}>{label}</div>
        <div style={{
          fontSize: 12, fontFamily: "monospace",
          color: good
            ? (value > 50 ? C.good : C.muted)
            : (value > 50 ? C.danger : C.good),
        }}>{value}%</div>
      </div>
      <div style={{ height: 5, borderRadius: 3, background: C.panelBorder, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 3,
          width: `${value}%`,
          background: good
            ? (value > 50 ? C.good : C.muted)
            : (value > 50 ? C.danger : C.good),
          transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)",
        }} />
      </div>
    </div>
  );
}

function Slider({ item, value, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 6,
      }}>
        <div style={{ fontSize: 12, color: C.text }}>{item.label}</div>
        <div style={{
          fontSize: 12, fontFamily: "monospace",
          color: C.accent, fontWeight: "bold",
        }}>{value} {item.unit}</div>
      </div>
      <input
        type="range"
        min={item.min} max={item.max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{
          width: "100%", accentColor: C.accent,
          cursor: "pointer", height: 4,
        }}
      />
      <div style={{
        display: "flex", justifyContent: "space-between",
        fontSize: 9, color: C.muted, fontFamily: "monospace", marginTop: 2,
      }}>
        <span>{item.min} {item.unit}</span>
        <span>{item.max} {item.unit}</span>
      </div>
    </div>
  );
}

// ─── CUSTOM SYSTEM ────────────────────────────────────────────────────────────

const CUSTOM_SLIDERS = [
  { id: "resurse", label: "Resurse disponibile", min: 0, max: 100, unit: "%", defaultVal: 50 },
  { id: "calitate_proces", label: "Calitatea procesului", min: 0, max: 100, unit: "%", defaultVal: 50 },
  { id: "transparenta", label: "Transparență / comunicare", min: 0, max: 100, unit: "%", defaultVal: 50 },
  { id: "flexibilitate", label: "Flexibilitate / adaptare", min: 0, max: 100, unit: "%", defaultVal: 50 },
  { id: "presiune", label: "Presiune externă", min: 0, max: 100, unit: "%", defaultVal: 50 },
];

function computeCustom(vals, declared, real) {
  const r = vals.resurse ?? 50;
  const cp = vals.calitate_proces ?? 50;
  const tr = vals.transparenta ?? 50;
  const fl = vals.flexibilitate ?? 50;
  const pr = vals.presiune ?? 50;
  const performance = Math.round(r * 0.3 + cp * 0.4 + fl * 0.2 + tr * 0.1);
  const satisfactie = Math.round(tr * 0.35 + fl * 0.3 + cp * 0.2 + r * 0.15);
  const stres = Math.round(pr * 0.5 + (100 - r) * 0.3 + (100 - fl) * 0.2);
  const gap = Math.round(100 - (performance + satisfactie) / 2);
  return { performance, satisfactie, stres, gap };
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function SimulatorSisteme() {
  const [mode, setMode] = useState("intro"); // intro | preset | custom
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [sliderVals, setSliderVals] = useState({});
  const [prevGap, setPrevGap] = useState(null);
  const [customVals, setCustomVals] = useState({ resurse: 50, calitate_proces: 50, transparenta: 50, flexibilitate: 50, presiune: 50 });
  const [customTexts, setCustomTexts] = useState({ sistem: "", declarat: "", real: "" });
  const [customPhase, setCustomPhase] = useState("setup"); // setup | simulate

  const preset = selectedPreset ? PRESETS.find(p => p.id === selectedPreset) : null;

  useEffect(() => {
    if (preset) {
      const init = {};
      [...preset.elements.intrari, ...preset.elements.proces].forEach(el => {
        init[el.id] = el.value;
      });
      setSliderVals(init);
      setPrevGap(null);
    }
  }, [selectedPreset]);

  const outputs = preset ? preset.computeReal(sliderVals) : [];
  const gap = preset ? preset.computeGap(outputs) : 0;
  const insight = preset ? preset.insight(sliderVals, outputs) : "";

  function handleSlider(id, val) {
    setPrevGap(gap);
    setSliderVals(prev => ({ ...prev, [id]: val }));
  }

  function handleCustomSlider(id, val) {
    setCustomVals(prev => ({ ...prev, [id]: val }));
  }

  const customResult = computeCustom(customVals, customTexts.declarat, customTexts.real);

  // ── INTRO ──
  if (mode === "intro") return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 15% 15%, #0D1F3C 0%, ${C.bg} 60%)`,
      fontFamily: "'Georgia', serif",
      color: C.text,
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "32px 16px 60px",
    }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 10, letterSpacing: 5, color: C.accent, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 10 }}>
          Young Dragons Academy · Modul 1 · Lecția 2+
        </div>
        <h1 style={{
          fontSize: "clamp(22px, 5vw, 36px)", fontWeight: 700, margin: "0 0 10px",
          background: `linear-gradient(135deg, #fff 0%, ${C.accent} 100%)`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>Simulatorul de Sisteme</h1>
        <p style={{ fontSize: 14, color: "#475569", maxWidth: 400, margin: "0 auto", lineHeight: 1.7 }}>
          Orice sistem face compromisuri. Dar ce se întâmplă dacă schimbi un element?
          Experimentează și vezi cum se propagă efectele.
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: 480, display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Preset option */}
        <div
          onClick={() => setMode("preset")}
          style={{
            background: C.panel, border: `1px solid ${C.intrari}44`,
            borderRadius: 18, padding: "22px 24px", cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = C.intrari}
          onMouseLeave={e => e.currentTarget.style.borderColor = `${C.intrari}44`}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>🎮</div>
          <div style={{ fontSize: 16, fontWeight: "bold", color: "#fff", marginBottom: 6 }}>
            Sisteme gata construite
          </div>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
            Experimentează cu sisteme cunoscute — Școala, Startup, Rețea socială. Înțelege logica înainte să o aplici pe situația ta.
          </div>
          <div style={{
            marginTop: 14, fontSize: 11, color: C.intrari,
            fontFamily: "monospace", letterSpacing: 1,
          }}>Recomandat pentru început →</div>
        </div>

        {/* Custom option */}
        <div
          onClick={() => setMode("custom")}
          style={{
            background: C.panel, border: `1px solid ${C.accent}44`,
            borderRadius: 18, padding: "22px 24px", cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = C.accent}
          onMouseLeave={e => e.currentTarget.style.borderColor = `${C.accent}44`}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>⚡</div>
          <div style={{ fontSize: 16, fontWeight: "bold", color: "#fff", marginBottom: 6 }}>
            Sistemul meu
          </div>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
            Introdu un sistem din viața ta și simulează ce se întâmplă când schimbi elementele lui. Cel mai personal și relevant mod de a învăța.
          </div>
          <div style={{
            marginTop: 14, fontSize: 11, color: C.accent,
            fontFamily: "monospace", letterSpacing: 1,
          }}>Cel mai util pe termen lung →</div>
        </div>
      </div>

      <div style={{ marginTop: 40, fontSize: 9, color: "#F8FAFC", letterSpacing: 3, textTransform: "uppercase", fontFamily: "monospace" }}>
        Structural Intelligence · Simulatorul de Sisteme
      </div>
    </div>
  );

  // ── PRESET SELECTOR ──
  if (mode === "preset" && !selectedPreset) return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 15% 15%, #0D1F3C 0%, ${C.bg} 60%)`,
      fontFamily: "'Georgia', serif", color: C.text,
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "28px 16px 60px",
    }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <button onClick={() => setMode("intro")} style={{
          background: "none", border: "none", color: C.muted,
          fontSize: 12, cursor: "pointer", fontFamily: "monospace",
          letterSpacing: 1, marginBottom: 16,
        }}>← înapoi</button>
        <div style={{ fontSize: 10, letterSpacing: 4, color: C.accent, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8 }}>
          Alege un sistem
        </div>
        <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>
          Cu care vrei să experimentezi?
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: 480, display: "flex", flexDirection: "column", gap: 12 }}>
        {PRESETS.map(p => (
          <div key={p.id} onClick={() => setSelectedPreset(p.id)} style={{
            background: C.panel, border: `1px solid ${C.panelBorder}`,
            borderRadius: 16, padding: "18px 20px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 16,
            transition: "all 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.accent}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.panelBorder}
          >
            <div style={{ fontSize: 32 }}>{p.emoji}</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: "bold", color: "#fff", marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{p.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── PRESET SIMULATOR ──
  if (mode === "preset" && preset) return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 15% 15%, #0D1F3C 0%, ${C.bg} 60%)`,
      fontFamily: "'Georgia', serif", color: C.text,
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "24px 16px 60px",
    }}>
      {/* Header */}
      <div style={{ width: "100%", maxWidth: 480, marginBottom: 20 }}>
        <button onClick={() => setSelectedPreset(null)} style={{
          background: "none", border: "none", color: C.muted,
          fontSize: 12, cursor: "pointer", fontFamily: "monospace", letterSpacing: 1,
        }}>← sisteme</button>
        <div style={{ textAlign: "center", marginTop: 8 }}>
          <div style={{ fontSize: 32, marginBottom: 4 }}>{preset.emoji}</div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: "bold", color: "#fff" }}>{preset.name}</h2>
          <div style={{ fontSize: 11, color: C.muted, fontFamily: "monospace", letterSpacing: 1, marginTop: 4 }}>
            Modifică elementele și observă efectele
          </div>
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: 480, display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Declared */}
        <div style={{
          background: `${C.declarate}0D`, border: `1px solid ${C.declarate}33`,
          borderRadius: 14, padding: "14px 16px",
        }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: C.declarate, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6 }}>◎ Ce declară sistemul</div>
          <div style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6 }}>{preset.declared}</div>
        </div>

        {/* Gap bar */}
        <div style={{ background: C.panel, border: `1px solid ${C.panelBorder}`, borderRadius: 14, padding: "16px 18px" }}>
          <GapBar gap={gap} prev={prevGap} />

          {/* Outputs */}
          <div style={{ fontSize: 9, letterSpacing: 2, color: C.muted, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 12 }}>◉ Ce produce de fapt</div>
          {outputs.map(o => <OutputBar key={o.label} {...o} />)}
        </div>

        {/* Insight */}
        <div style={{
          background: `${C.accent}0D`, border: `1px solid ${C.accent}33`,
          borderRadius: 14, padding: "14px 16px",
          fontSize: 13, color: "#94A3B8", lineHeight: 1.7, fontStyle: "italic",
        }}>
          💡 {insight}
        </div>

        {/* Sliders — Intrări */}
        <div style={{ background: C.panel, border: `1px solid ${C.intrari}33`, borderRadius: 14, padding: "18px 18px" }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: C.intrari, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 16 }}>→ Modifică intrările</div>
          {preset.elements.intrari.map(el => (
            <Slider key={el.id} item={el} value={sliderVals[el.id] ?? el.value} onChange={v => handleSlider(el.id, v)} />
          ))}
        </div>

        {/* Sliders — Proces */}
        <div style={{ background: C.panel, border: `1px solid ${C.proces}33`, borderRadius: 14, padding: "18px 18px" }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: C.proces, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 16 }}>⟳ Modifică procesul</div>
          {preset.elements.proces.map(el => (
            <Slider key={el.id} item={el} value={sliderVals[el.id] ?? el.value} onChange={v => handleSlider(el.id, v)} />
          ))}
        </div>

        {/* Reset + go custom */}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => {
            const init = {};
            [...preset.elements.intrari, ...preset.elements.proces].forEach(el => { init[el.id] = el.value; });
            setSliderVals(init); setPrevGap(null);
          }} style={{
            flex: 1, background: "rgba(15,23,42,0.04)", border: "1px solid #F8FAFC",
            borderRadius: 10, color: C.muted, fontSize: 13, padding: "10px", cursor: "pointer",
          }}>↺ Reset</button>
          <button onClick={() => { setMode("custom"); setSelectedPreset(null); }} style={{
            flex: 2,
            background: `linear-gradient(135deg, ${C.accent}, #F97316)`,
            border: "none", borderRadius: 10,
            color: "#F3F4F6", fontWeight: "bold", fontSize: 13,
            padding: "10px 16px", cursor: "pointer",
          }}>Simulează sistemul meu →</button>
        </div>
      </div>
    </div>
  );

  // ── CUSTOM ──
  if (mode === "custom") return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 15% 15%, #0D1F3C 0%, ${C.bg} 60%)`,
      fontFamily: "'Georgia', serif", color: C.text,
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "24px 16px 60px",
    }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        <button onClick={() => { setMode("intro"); setCustomPhase("setup"); }} style={{
          background: "none", border: "none", color: C.muted,
          fontSize: 12, cursor: "pointer", fontFamily: "monospace", letterSpacing: 1, marginBottom: 16,
        }}>← înapoi</button>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: C.accent, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8 }}>Sistemul meu</div>
          <h2 style={{ margin: 0, fontSize: 22, color: "#fff" }}>Simulează realitatea ta</h2>
        </div>

        {customPhase === "setup" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { id: "sistem", label: "Ce sistem analizezi?", placeholder: "Ex: Echipa mea de la facultate, locul meu de muncă...", explanation: "Numește sistemul concret din viața ta pe care vrei să îl înțelegi mai bine." },
              { id: "declarat", label: "Ce declară că produce?", placeholder: "Ex: Colaborare, creștere profesională, rezultate bune...", explanation: "Ce promite oficial sistemul? Ce spun cei care îl conduc că vei obține?" },
              { id: "real", label: "Ce produce de fapt?", placeholder: "Ex: Competiție, stres, rezultate mediocre...", explanation: "Ce observi efectiv că se întâmplă? Fii sincer — nu e o acuzație, e o observație." },
            ].map(f => (
              <div key={f.id} style={{ background: C.panel, border: `1px solid ${C.panelBorder}`, borderRadius: 14, padding: "18px 18px" }}>
                <div style={{ fontSize: 14, fontWeight: "600", color: "#fff", marginBottom: 6 }}>{f.label}</div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, marginBottom: 10 }}>{f.explanation}</div>
                <textarea
                  value={customTexts[f.id]}
                  onChange={e => setCustomTexts(prev => ({ ...prev, [f.id]: e.target.value }))}
                  placeholder={f.placeholder}
                  style={{
                    width: "100%", minHeight: 70,
                    background: "#F8FAFC", border: `1px solid ${C.accent}33`,
                    borderRadius: 10, color: C.text, fontSize: 13,
                    padding: "10px 12px", resize: "vertical",
                    fontFamily: "Georgia, serif", outline: "none", boxSizing: "border-box", lineHeight: 1.6,
                  }}
                />
              </div>
            ))}

            <button
              onClick={() => setCustomPhase("simulate")}
              disabled={!customTexts.sistem.trim() || !customTexts.declarat.trim() || !customTexts.real.trim()}
              style={{
                background: customTexts.sistem && customTexts.declarat && customTexts.real
                  ? `linear-gradient(135deg, ${C.accent}, #F97316)` : "#F8FAFC",
                border: "none", borderRadius: 12,
                color: customTexts.sistem && customTexts.declarat && customTexts.real ? "#F3F4F6" : C.muted,
                fontWeight: "bold", fontSize: 15,
                padding: "14px", cursor: "pointer",
                transition: "all 0.3s",
              }}>
              Simulează schimbările →
            </button>
          </div>
        )}

        {customPhase === "simulate" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* System label */}
            <div style={{
              background: `${C.accent}0D`, border: `1px solid ${C.accent}33`,
              borderRadius: 14, padding: "14px 18px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: 9, letterSpacing: 2, color: C.accent, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 4 }}>Sistemul tău</div>
                <div style={{ fontSize: 14, color: "#fff", fontWeight: "600" }}>{customTexts.sistem}</div>
              </div>
              <button onClick={() => setCustomPhase("setup")} style={{
                background: "none", border: "1px solid #F8FAFC", borderRadius: 8,
                color: C.muted, fontSize: 11, padding: "6px 12px", cursor: "pointer",
              }}>Editează</button>
            </div>

            {/* Declared vs Real */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ background: `${C.declarate}0D`, border: `1px solid ${C.declarate}33`, borderRadius: 12, padding: "12px 14px" }}>
                <div style={{ fontSize: 9, letterSpacing: 1, color: C.declarate, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6 }}>◎ Declară</div>
                <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.6 }}>{customTexts.declarat}</div>
              </div>
              <div style={{ background: `${C.reale}0D`, border: `1px solid ${C.reale}33`, borderRadius: 12, padding: "12px 14px" }}>
                <div style={{ fontSize: 9, letterSpacing: 1, color: C.reale, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6 }}>◉ Produce</div>
                <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.6 }}>{customTexts.real}</div>
              </div>
            </div>

            {/* Results */}
            <div style={{ background: C.panel, border: `1px solid ${C.panelBorder}`, borderRadius: 14, padding: "18px 18px" }}>
              <GapBar gap={customResult.gap} prev={null} />
              <div style={{ fontSize: 9, letterSpacing: 2, color: C.muted, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 12 }}>Indicatori estimați</div>
              <OutputBar label="Performanță generală" value={customResult.performance} good={true} />
              <OutputBar label="Satisfacție / bunăstare" value={customResult.satisfactie} good={true} />
              <OutputBar label="Nivel de stres" value={customResult.stres} good={false} />
            </div>

            {/* Custom sliders */}
            <div style={{ background: C.panel, border: `1px solid ${C.proces}33`, borderRadius: 14, padding: "18px 18px" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: C.proces, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6 }}>Ce se întâmplă dacă schimbi...</div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 16, lineHeight: 1.6 }}>
                Modifică fiecare element și observă cum se schimbă distanța față de promisiune.
              </div>
              {CUSTOM_SLIDERS.map(sl => (
                <Slider key={sl.id} item={{ ...sl, value: sl.defaultVal, min: 0, max: 100 }}
                  value={customVals[sl.id]} onChange={v => handleCustomSlider(sl.id, v)} />
              ))}
            </div>

            {/* Dynamic insight */}
            <div style={{
              background: `${C.accent}0D`, border: `1px solid ${C.accent}33`,
              borderRadius: 14, padding: "14px 16px",
              fontSize: 13, color: "#94A3B8", lineHeight: 1.7, fontStyle: "italic",
            }}>
              💡 {customResult.gap < 25
                ? "Sistemul tău funcționează aproape de promisiunile lui. Distanța e mică — fie sistemul e bine construit, fie așteptările sunt realiste."
                : customResult.gap < 55
                  ? "Există o distanță moderată. Identifică elementul cu cel mai mare impact și testează ce se întâmplă dacă îl modifici."
                  : "Distanța e mare. Sistemul produce ceva semnificativ diferit față de ce promite. Întreabă-te: ce compensează acest cost pentru tine personal?"}
            </div>

            <button onClick={() => {
              setCustomVals({ resurse: 50, calitate_proces: 50, transparenta: 50, flexibilitate: 50, presiune: 50 });
            }} style={{
              background: "rgba(15,23,42,0.04)", border: "1px solid #F8FAFC",
              borderRadius: 10, color: C.muted, fontSize: 13, padding: "10px", cursor: "pointer",
            }}>↺ Reset slidere</button>
          </div>
        )}
      </div>

      <div style={{ marginTop: 40, fontSize: 9, color: "#F8FAFC", letterSpacing: 3, textTransform: "uppercase", fontFamily: "monospace" }}>
        Structural Intelligence · Simulatorul de Sisteme
      </div>
    </div>
  );
}
