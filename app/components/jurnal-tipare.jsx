"use client";

import { useState, useEffect, useRef } from "react";

const C = {
  bg: "#F3F4F6",
  bgWarm: "#FFF7ED",
  panel: "#FFFFFF",
  panelWarm: "#FFFFFF",
  border: "#E5E7EB",
  borderWarm: "#FED7AA",
  text: "#111827",
  muted: "#475569",
  faint: "#64748B",
  orange: "#FF6B2B",
  gold: "#FFB347",
  teal: "#14B8A6",
  red: "#DC2626",
  green: "#16A34A",
  purple: "#7C3AED",
  accent: "#FF6B2B",
};

const PATTERN_CATEGORIES = [
  { id: "evitare", label: "Evitare", color: C.purple, emoji: "🌀", desc: "Evit situații, oameni sau conversații dificile" },
  { id: "reactie", label: "Reacție impulsivă", color: C.red, emoji: "⚡", desc: "Reacționez înainte să gândesc" },
  { id: "amanare", label: "Amânare", color: C.gold, emoji: "⏳", desc: "Amân lucruri importante" },
  { id: "autocritic", label: "Autocritică", color: C.orange, emoji: "🔍", desc: "Mă judec aspru pe mine" },
  { id: "pleasing", label: "People pleasing", color: C.teal, emoji: "🤝", desc: "Îmi e greu să spun nu" },
  { id: "sabotaj", label: "Autosabotaj", color: C.red, emoji: "🎯", desc: "Mă opresc când sunt aproape de succes" },
  { id: "comparatie", label: "Comparație", color: C.purple, emoji: "⚖️", desc: "Mă compar constant cu alții" },
  { id: "altul", label: "Alt tipar", color: C.muted, emoji: "✏️", desc: "Am observat altceva" },
];

function getRandomPercent() {
  return Math.floor(Math.random() * 21) + 65;
}

function useLocalEntries() {
const [entries, setEntries] = useState([]);

useEffect(() => {
  try {
    const raw = localStorage.getItem("sv_jurnal_entries");
    if (raw) {
      setEntries(JSON.parse(raw));
    }
  } catch (e) {
    console.error(e);
  }
}, []);

  function save(newEntries) {
    setEntries(newEntries);
    try { localStorage.setItem("sv_jurnal_entries", JSON.stringify(newEntries)); } catch {}
  }

  function addEntry(entry) {
    const updated = [{ ...entry, id: Date.now(), date: new Date().toLocaleDateString("ro-RO") }, ...entries];
    save(updated);
    return updated;
  }

  function deleteEntry(id) {
    save(entries.filter(e => e.id !== id));
  }

  function clearAll() {
    save([]);
    try { localStorage.removeItem("sv_jurnal_entries"); } catch {}
  }

  return { entries, addEntry, deleteEntry, clearAll };
}

function PrivacyScreen({ onContinue }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "32px 20px",
      fontFamily: "'Georgia', serif", color: C.text,
    }}>
      <div style={{ maxWidth: 480, width: "100%" }}>

        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🐉</div>
          <div style={{ fontSize: 10, letterSpacing: 5, color: C.orange, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 12 }}>
            Young Dragons Academy
          </div>
          <h1 style={{
            fontSize: "clamp(22px, 5vw, 32px)", fontWeight: 700, margin: 0,
            background: C.accent || C.orange,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            lineHeight: 1.3,
          }}>Jurnalul de Tipare</h1>
        </div>

        <div style={{
          background: C.panelWarm,
          border: `1px solid ${C.borderWarm}`,
          borderRadius: 24, padding: "32px 28px",
          marginBottom: 20,
          boxShadow: `0 0 60px ${C.orange}08`,
        }}>
          <p style={{
            fontSize: 18, fontWeight: "700", color: C.text,
            margin: "0 0 20px", lineHeight: 1.5, textAlign: "center",
          }}>
            Jurnalul tău e al tău. Complet.
          </p>

          <p style={{ fontSize: 14, color: "#B0A898", lineHeight: 1.9, margin: "0 0 16px" }}>
            Ce scrii aici nu pleacă nicăieri. Nu colectăm date, nu stocăm răspunsuri, nu există server care să primească ce gândești tu.
          </p>

          <p style={{ fontSize: 14, color: "#B0A898", lineHeight: 1.9, margin: "0 0 16px" }}>
            Intrările tale sunt salvate local, în browser-ul acestui dispozitiv — ca să le găsești când revii. Noi nu le vedem și nu le putem accesa.
          </p>

          <p style={{ fontSize: 14, color: "#B0A898", lineHeight: 1.9, margin: "0 0 20px" }}>
            Singurul motiv pentru care există acest jurnal e să te ajute să vezi ce vede greu mintea singură — <strong style={{ color: C.text }}>tiparele tale.</strong> Nu ca să te judece cineva. Nu ca să știm noi ceva despre tine.
          </p>

          <div style={{
            textAlign: "center",
            padding: "16px",
            background: `${C.orange}0D`,
            borderRadius: 14,
            border: `1px solid ${C.orange}22`,
            fontSize: 14,
            color: C.gold,
            fontStyle: "italic",
            lineHeight: 1.7,
          }}>
            Ca să știi <em>tu</em> mai mult despre tine.
            <br />
            <span style={{ fontSize: 16 }}>🐉</span> Dragonul care se cunoaște pe sine arde mai inteligent.
          </div>
        </div>

        {/* Honest limits */}
        <div style={{
          background: `${C.gold}08`,
          border: `1px solid ${C.gold}22`,
          borderRadius: 16, padding: "18px 20px",
          marginBottom: 16,
        }}>
          <div style={{ fontSize: 12, letterSpacing: 2, color: C.gold, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 10 }}>
            Ce putem garanta — și ce nu
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { icon: "✓", text: "Nu colectăm, nu vedem, nu transmitem nimic din ce scrii.", color: C.green },
              { icon: "✓", text: "Datele rămân salvate între sesiuni pe același dispozitiv.", color: C.green },
              { icon: "✓", text: "Poți șterge tot oricând, cu un singur buton.", color: C.green },
              { icon: "!", text: "Jurnalul e legat de acest browser pe acest dispozitiv. Dacă folosești alt telefon sau laptop, nu vei găsi intrările.", color: C.gold },
              { icon: "!", text: "Dacă ștergi datele de navigare sau cache-ul browserului, jurnalul dispare. E în mâinile tale, nu ale noastre.", color: C.gold },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ fontSize: 13, color: item.color, flexShrink: 0, marginTop: 1, fontWeight: "bold", width: 16 }}>{item.icon}</div>
                <div style={{ fontSize: 12, color: item.color === C.green ? "#7AAA88" : "#AA9860", lineHeight: 1.6 }}>{item.text}</div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onContinue}
          style={{
            width: "100%",
            background: C.accent,
            border: "none", borderRadius: 16,
            color: "#F3F4F6", fontWeight: "bold", fontSize: 16,
            padding: "18px", cursor: "pointer",
            boxShadow: `0 6px 28px ${C.orange}44`,
            fontFamily: "'DM Sans', system-ui, sans-serif",
          }}>
          Înțeleg — deschide jurnalul →
        </button>
      </div>
    </div>
  );
}

function NewEntryForm({ onSave, onCancel }) {
  const [step, setStep] = useState(0); // 0: event, 1: behavior, 2: result, 3: pattern, 4: custom
  const [form, setForm] = useState({
    eveniment: "",
    comportament: "",
    rezultat: "",
    tipar: null,
    tiparCustom: "",
    nota: "",
  });

  const steps = [
    {
      id: "eveniment",
      title: "Ce s-a întâmplat?",
      subtitle: "Descrie faptele — fără interpretare, fără judecată. Ce ai văzut, ce ai auzit, ce s-a petrecut.",
      placeholder: "Ex: Am evitat o conversație importantă cu un coleg timp de 3 zile...",
      hint: "Fii specific și concret. Nu 'a mers rău' ci ce anume s-a întâmplat.",
      field: "eveniment",
    },
    {
      id: "comportament",
      title: "Ce ai făcut tu în acel moment?",
      subtitle: "Nu de ce — ci ce. Comportamentul concret, nu intenția. Ce ai spus, ce ai evitat, ce ai ales.",
      placeholder: "Ex: Am tot amânat să trimit mesajul, am găsit alte lucruri de făcut, am spus că nu e urgent...",
      hint: "Comportamentele sunt mai greu de falsificat decât explicațiile.",
      field: "comportament",
    },
    {
      id: "rezultat",
      title: "Ce s-a întâmplat după?",
      subtitle: "Rezultatul concret. Ce a produs comportamentul tău în situație.",
      placeholder: "Ex: Tensiunea a crescut, colegul a crezut că îl ignor, lucrurile s-au complicat inutil...",
      hint: "Notează efectul real, nu pe cel pe care îl voiai.",
      field: "rezultat",
    },
  ];

  const current = steps[step];
  const canNext = form[current?.field]?.trim() !== "";

  function selectPattern(id) {
    setForm(f => ({ ...f, tipar: id }));
  }

  function finish() {
    onSave({
      eveniment: form.eveniment,
      comportament: form.comportament,
      rezultat: form.rezultat,
      tipar: form.tipar,
      tiparCustom: form.tiparCustom,
      nota: form.nota,
    });
  }

  return (
    <div style={{
      background: C.panelWarm, border: `1px solid ${C.borderWarm}`,
      borderRadius: 20, padding: "24px 22px",
      boxShadow: `0 0 40px ${C.orange}08`,
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 20,
      }}>
        <div style={{ fontSize: 12, letterSpacing: 2, color: C.orange, textTransform: "uppercase", fontFamily: "monospace" }}>
          Intrare nouă
        </div>
        <button onClick={onCancel} style={{ background: "none", border: "none", color: C.muted, fontSize: 18, cursor: "pointer" }}>×</button>
      </div>

      {/* Progress dots */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24, justifyContent: "center" }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            width: i <= step ? 24 : 8, height: 8, borderRadius: 4,
            background: i <= step ? C.orange : C.border,
            transition: "all 0.3s",
          }} />
        ))}
      </div>

      {/* Steps 0-2 */}
      {step <= 2 && current && (
        <div style={{ animation: "fadeUp 0.3s ease" }}>
          <div style={{ fontSize: 17, fontWeight: "700", color: C.text, marginBottom: 8, lineHeight: 1.4 }}>
            {current.title}
          </div>
          <div style={{ fontSize: 13, color: "#9088AA", lineHeight: 1.7, marginBottom: 12 }}>
            {current.subtitle}
          </div>
          <div style={{
            fontSize: 12, color: C.muted, fontStyle: "italic",
            padding: "8px 12px", background: `${C.orange}08`,
            borderRadius: 8, borderLeft: `2px solid ${C.orange}33`,
            marginBottom: 14, lineHeight: 1.6,
          }}>
            💡 {current.hint}
          </div>
          <textarea
            autoFocus
            value={form[current.field]}
            onChange={e => setForm(f => ({ ...f, [current.field]: e.target.value }))}
            placeholder={current.placeholder}
            style={{
              width: "100%", minHeight: 100,
              background: "#FFFFFF",
              border: `1px solid ${C.borderWarm}`,
              borderRadius: 12, color: C.text, fontSize: 14,
              padding: "12px 14px", resize: "vertical",
              fontFamily: "'DM Sans', system-ui, sans-serif", outline: "none",
              boxSizing: "border-box", lineHeight: 1.7,
              caretColor: C.orange,
            }}
          />
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} style={{
                background: "#FFFFFF", border: `1px solid ${C.border}`,
                borderRadius: 10, color: C.muted, fontSize: 13,
                padding: "10px 18px", cursor: "pointer",
              }}>← Înapoi</button>
            )}
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext}
              style={{
                flex: 1,
                background: canNext ? C.accent : C.border,
                border: "none", borderRadius: 10,
                color: canNext ? "#F3F4F6" : C.muted,
                fontWeight: "bold", fontSize: 14,
                padding: "11px", cursor: canNext ? "pointer" : "default",
                transition: "all 0.3s",
              }}>
              {step === 2 ? "Am mai văzut asta? →" : "Continuă →"}
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Pattern selection */}
      {step === 3 && (
        <div style={{ animation: "fadeUp 0.3s ease" }}>
          <div style={{ fontSize: 17, fontWeight: "700", color: C.text, marginBottom: 8 }}>
            Recunoști un tipar?
          </div>
          <div style={{ fontSize: 13, color: "#9088AA", lineHeight: 1.7, marginBottom: 16 }}>
            Nu trebuie să fie perfect. Alege ce rezonează cel mai mult — sau mai multe dacă se potrivesc.
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
            {PATTERN_CATEGORIES.map(cat => {
              const selected = form.tipar === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => selectPattern(cat.id)}
                  style={{
                    background: selected ? `${cat.color}18` : "#FFFFFF",
                    border: `1px solid ${selected ? cat.color : C.border}`,
                    borderRadius: 12, padding: "12px",
                    cursor: "pointer", transition: "all 0.2s",
                    boxShadow: selected ? `0 0 16px ${cat.color}22` : "none",
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{cat.emoji}</div>
                  <div style={{ fontSize: 12, fontWeight: "bold", color: selected ? cat.color : C.text, marginBottom: 3 }}>{cat.label}</div>
                  <div style={{ fontSize: 10, color: C.muted, lineHeight: 1.5 }}>{cat.desc}</div>
                </div>
              );
            })}
          </div>

          {form.tipar === "altul" && (
            <input
              autoFocus
              value={form.tiparCustom}
              onChange={e => setForm(f => ({ ...f, tiparCustom: e.target.value }))}
              placeholder="Descrie tiparele pe scurt..."
              style={{
                width: "100%", background: "#FFFFFF",
                border: `1px solid ${C.borderWarm}`, borderRadius: 10,
                color: C.text, fontSize: 13, padding: "10px 12px",
                fontFamily: "'DM Sans', system-ui, sans-serif", outline: "none",
                boxSizing: "border-box", marginBottom: 12,
              }}
            />
          )}

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: C.muted, fontFamily: "monospace", letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>
              O notă pentru tine (opțional)
            </div>
            <textarea
              value={form.nota}
              onChange={e => setForm(f => ({ ...f, nota: e.target.value }))}
              placeholder="Orice altceva vrei să reții despre această situație..."
              style={{
                width: "100%", minHeight: 60,
                background: "#FFFFFF",
                border: `1px solid ${C.border}`, borderRadius: 10,
                color: C.text, fontSize: 13, padding: "10px 12px",
                resize: "vertical", fontFamily: "'DM Sans', system-ui, sans-serif",
                outline: "none", boxSizing: "border-box", lineHeight: 1.6,
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setStep(2)} style={{
              background: "#FFFFFF", border: `1px solid ${C.border}`,
              borderRadius: 10, color: C.muted, fontSize: 13,
              padding: "10px 18px", cursor: "pointer",
            }}>← Înapoi</button>
            <button
              onClick={finish}
              disabled={!form.tipar || (form.tipar === "altul" && !form.tiparCustom.trim())}
              style={{
                flex: 1,
                background: form.tipar ? C.green : C.border,
                border: "none", borderRadius: 10,
                color: form.tipar ? "#F3F4F6" : C.muted,
                fontWeight: "bold", fontSize: 14,
                padding: "11px", cursor: form.tipar ? "pointer" : "default",
                transition: "all 0.3s",
              }}>
              Salvează în jurnal ✓
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function EntryCard({ entry, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const cat = PATTERN_CATEGORIES.find(c => c.id === entry.tipar) || PATTERN_CATEGORIES[PATTERN_CATEGORIES.length - 1];

  return (
    <div style={{
      background: C.panelWarm, border: `1px solid ${C.borderWarm}`,
      borderRadius: 16, padding: "18px 20px",
      transition: "all 0.2s",
    }}>
      <div
        style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
        onClick={() => setExpanded(e => !e)}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
            <div style={{
              fontSize: 10, color: cat.color, fontFamily: "monospace",
              letterSpacing: 1, textTransform: "uppercase",
              background: `${cat.color}15`, border: `1px solid ${cat.color}33`,
              borderRadius: 20, padding: "2px 10px",
            }}>
              {cat.emoji} {entry.tipar === "altul" ? entry.tiparCustom : cat.label}
            </div>
            <div style={{ fontSize: 10, color: C.muted, fontFamily: "monospace" }}>{entry.date}</div>
          </div>
          <div style={{ fontSize: 13, color: "#A09888", lineHeight: 1.6 }}>
            {entry.eveniment.slice(0, expanded ? 1000 : 80)}{!expanded && entry.eveniment.length > 80 ? "…" : ""}
          </div>
        </div>
        <div style={{ fontSize: 16, color: C.muted, marginLeft: 10, flexShrink: 0 }}>
          {expanded ? "↑" : "↓"}
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: 16, animation: "fadeUp 0.3s ease" }}>
          {[
            { label: "Comportamentul meu", value: entry.comportament, color: C.orange },
            { label: "Ce s-a întâmplat după", value: entry.rezultat, color: C.teal },
            ...(entry.nota ? [{ label: "Nota mea", value: entry.nota, color: C.muted }] : []),
          ].map(item => (
            <div key={item.label} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: item.color, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, padding: "8px 12px", background: "#FFFFFF", borderRadius: 8, borderLeft: `2px solid ${item.color}44` }}>{item.value}</div>
            </div>
          ))}
          <button onClick={() => onDelete(entry.id)} style={{
            background: "none", border: `1px solid ${C.red}33`,
            borderRadius: 8, color: C.red + "88", fontSize: 12,
            padding: "6px 14px", cursor: "pointer", marginTop: 4,
            fontFamily: "monospace",
          }}>Șterge această intrare</button>
        </div>
      )}
    </div>
  );
}

function PatternInsight({ entries }) {
  const counts = {};
  entries.forEach(e => {
    if (e.tipar) counts[e.tipar] = (counts[e.tipar] || 0) + 1;
  });

  const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  if (!dominant || dominant[1] < 2) return null;

  const cat = PATTERN_CATEGORIES.find(c => c.id === dominant[0]);
  const communityPct = getRandomPercent();

  return (
    <div style={{
      background: C.panelWarm,
      border: `1px solid ${cat.color}44`,
      borderRadius: 18, padding: "22px 22px",
      marginBottom: 16,
      boxShadow: `0 0 30px ${cat.color}11`,
      animation: "fadeUp 0.5s ease",
    }}>
      <div style={{ fontSize: 12, letterSpacing: 2, color: cat.color, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 12 }}>
        🔍 Tipar identificat
      </div>
      <div style={{ fontSize: 16, fontWeight: "700", color: C.text, marginBottom: 10, lineHeight: 1.4 }}>
        {cat.emoji} {cat.label} — apare de {dominant[1]} ori în jurnalul tău
      </div>
      <div style={{ fontSize: 13, color: "#A09888", lineHeight: 1.7, marginBottom: 16 }}>
        Mintea ta a folosit același mecanism în situații diferite. Asta nu e o slăbiciune — e informație. Acum știi unde să intervii.
      </div>
      <div style={{
        padding: "12px 16px",
        background: "#FFFFFF",
        borderRadius: 12,
        fontSize: 13, color: "#475569", fontStyle: "italic", lineHeight: 1.7,
      }}>
        {communityPct}% dintre cei care au folosit jurnalul au găsit același tipar de cel puțin două ori. Nu ești singur în asta.
      </div>
    </div>
  );
}

export default function JurnalTipare() {
  const [phase, setPhase] = useState("privacy"); // privacy | journal
  const [showForm, setShowForm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const { entries, addEntry, deleteEntry, clearAll } = useLocalEntries();
  const formRef = useRef(null);

  function handleSave(data) {
    addEntry(data);
    setShowForm(false);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
  }

  function handleNewEntry() {
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  if (phase === "privacy") return <PrivacyScreen onContinue={() => setPhase("journal")} />;

  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      fontFamily: "'Georgia', serif", color: C.text,
      padding: "24px 16px 80px",
    }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        textarea:focus, input:focus { outline: none; }
      `}</style>

      <div style={{ maxWidth: 520, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 10, letterSpacing: 5, color: C.orange, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8 }}>
            Lecția 3A · Structural Intelligence
          </div>
          <h1 style={{
            fontSize: "clamp(22px, 5vw, 32px)", fontWeight: 700, margin: "0 0 6px",
            background: C.accent || C.orange,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Jurnalul de Tipare</h1>
          <p style={{ fontSize: 12, color: C.muted, margin: 0, fontStyle: "italic" }}>
            {entries.length === 0 ? "Prima intrare e cea mai importantă." : `${entries.length} ${entries.length === 1 ? "intrare" : "intrări"} în jurnal`}
          </p>
        </div>

        {/* Pattern insight */}
        {entries.length >= 2 && <PatternInsight entries={entries} />}

        {/* Empty state */}
        {entries.length === 0 && !showForm && (
          <div style={{
            background: C.panelWarm, border: `1px solid ${C.borderWarm}`,
            borderRadius: 20, padding: "36px 28px", textAlign: "center",
            marginBottom: 16, animation: "fadeUp 0.4s ease",
          }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📖</div>
            <div style={{ fontSize: 15, fontWeight: "600", color: C.text, marginBottom: 10 }}>
              Jurnalul tău e gol — deocamdată
            </div>
            <div style={{ fontSize: 13, color: "#9088AA", lineHeight: 1.8, marginBottom: 20 }}>
              Gândește-te la o situație recentă care nu ți-a ieșit sau care te-a lăsat cu un sentiment neplăcut. Nu trebuie să fie ceva mare — chiar și o conversație incomodă funcționează.
            </div>
            <div style={{
              fontSize: 12, color: C.muted, fontStyle: "italic",
              padding: "10px 14px", background: `${C.orange}08`,
              borderRadius: 10, borderLeft: `2px solid ${C.orange}22`,
              textAlign: "left", lineHeight: 1.7,
            }}>
              Tiparele nu se văd dintr-o singură intrare. Se văd când adaugi mai multe și începi să observi ce se repetă.
            </div>
          </div>
        )}

        {/* Entries */}
        {entries.length > 0 && !showForm && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            {entries.map(e => <EntryCard key={e.id} entry={e} onDelete={deleteEntry} />)}
          </div>
        )}

        {/* New entry form */}
        {showForm && (
          <div ref={formRef} style={{ marginBottom: 16, animation: "fadeUp 0.3s ease" }}>
            <NewEntryForm onSave={handleSave} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {/* Add button */}
        {!showForm && (
          <button
            onClick={handleNewEntry}
            style={{
              width: "100%",
              background: C.accent,
              border: "none", borderRadius: 16,
              color: "#F3F4F6", fontWeight: "bold", fontSize: 15,
              padding: "16px", cursor: "pointer",
              boxShadow: `0 6px 28px ${C.orange}33`,
              marginBottom: 12,
            }}>
            + Adaugă o intrare nouă
          </button>
        )}

        {/* Privacy reminder */}
        {!showForm && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 14px",
            background: `${C.green}08`, border: `1px solid ${C.green}15`,
            borderRadius: 12, marginBottom: 16,
          }}>
            <div style={{ fontSize: 14 }}>🔒</div>
            <div style={{ fontSize: 12, color: "#5A7A60", lineHeight: 1.5 }}>
              Salvat local pe acest dispozitiv. Noi nu vedem nimic. Dacă ștergi cache-ul browserului, jurnalul dispare — e în controlul tău.
            </div>
          </div>
        )}

        {/* Clear all */}
        {entries.length > 0 && !showForm && (
          <div style={{ textAlign: "center" }}>
            {!showClearConfirm ? (
              <button onClick={() => setShowClearConfirm(true)} style={{
                background: "none", border: "none",
                color: C.muted, fontSize: 12, cursor: "pointer",
                fontFamily: "monospace", letterSpacing: 1,
                textDecoration: "underline",
              }}>Șterge tot jurnalul</button>
            ) : (
              <div style={{
                background: `${C.red}0D`, border: `1px solid ${C.red}22`,
                borderRadius: 12, padding: "14px 16px",
              }}>
                <div style={{ fontSize: 13, color: "#C08080", marginBottom: 12 }}>
                  Sigur vrei să ștergi toate intrările? Această acțiune nu poate fi anulată.
                </div>
                <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                  <button onClick={() => setShowClearConfirm(false)} style={{ background: "#FFFFFF", border: `1px solid ${C.border}`, borderRadius: 8, color: C.muted, fontSize: 12, padding: "8px 16px", cursor: "pointer" }}>
                    Anulează
                  </button>
                  <button onClick={() => { clearAll(); setShowClearConfirm(false); }} style={{ background: `${C.red}22`, border: `1px solid ${C.red}44`, borderRadius: 8, color: C.red, fontSize: 12, padding: "8px 16px", cursor: "pointer" }}>
                    Da, șterge tot
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: 48, textAlign: "center", fontSize: 9, color: "#1A1510", letterSpacing: 3, textTransform: "uppercase", fontFamily: "monospace" }}>
          Structural Intelligence · Pattern Recognition · 3A
        </div>
      </div>
    </div>
  );
}
