import { useState, useRef, useEffect } from "react";

const C = {
  bg: "#09090F",
  bgMid: "#0D0D18",
  panel: "#111320",
  border: "#1C1F35",
  text: "#E2E0F0",
  muted: "#5A5880",
  faint: "#0A0A14",
  orange: "#FF6B2B",
  gold: "#FFB347",
  red: "#C0392B",
  teal: "#4ECDC4",
  yellow: "#EAB308",
  accent: "#FF6B2B",
};

// ── HARTA FORTELOR (embedded) ─────────────────────────────────────────────────

const initialNodes = {
  center: { id: "center", label: "Evenimentul", question: "Descrie pe scurt ce s-a întâmplat", explanation: "Fii specific. Nu 'a mers prost' ci exact ce eveniment analizezi.", hints: ["Ex: Am picat interviul", "Ex: Prezentarea n-a convins", "Ex: N-am finalizat la timp"], placeholder: "Ex: Am picat interviul la compania X...", x: 50, y: 50, value: "" },
  resurse: { id: "resurse", label: "Resurse", question: "Ce aveam la dispoziție?", explanation: "Tot ce puteai folosi — timp, energie, informații, oameni. Nu doar ce ai folosit, ci ce era disponibil.", hints: ["Aveam timp suficient?", "Eram odihnit?", "Știam tot ce trebuia?", "Aveam pe cineva să mă ghideze?"], placeholder: "Ex: 3 zile de pregătire, energie bună, dar info incomplete...", x: 20, y: 18, color: C.teal, value: "" },
  lipsa: { id: "lipsa", label: "Ce lipsea", question: "Ce forță n-a fost acolo?", explanation: "Ce element, dacă era prezent, schimba totul. O abilitate, o informație, o conexiune, un plan mai clar.", hints: ["Ce abilitate îmi lipsea?", "Ce informație nu o aveam?", "Ce relație îmi lipsea?", "Ce claritate îmi lipsea?"], placeholder: "Ex: Nu știam că recrutorul cauta leadership, nu competențe tehnice...", x: 78, y: 18, color: C.red, value: "" },
  presiuni: { id: "presiuni", label: "Presiuni externe", question: "Ce venea din exterior?", explanation: "Forțele din jur care au influențat cum ai gândit și acționat — așteptări, deadline, context, atmosferă.", hints: ["Eram sub presiunea timpului?", "Cineva se aștepta la ceva?", "Contextul m-a influențat?", "Factori pe care nu îi controlam?"], placeholder: "Ex: Interviul era imediat după un examen, eram obosit...", x: 20, y: 80, color: C.gold, value: "" },
  pivot: { id: "pivot", label: "Momentul pivot", question: "Care a fost momentul care a schimbat totul?", explanation: "O decizie, o reacție, o alegere după care traiectoria s-a schimbat definitiv. Uneori e o non-decizie — când nu ai acționat când trebuia.", hints: ["Când am simțit că ceva s-a schimbat?", "Ce decizie schimba totul?", "Când am ezitat?", "Când am ales greșit fără să știu?"], placeholder: "Ex: Când am fost întrebat despre leadership și am răspuns vag...", x: 78, y: 80, color: C.orange, value: "" },
};

function HartaFortelor() {
  const [nodes, setNodes] = useState(initialNodes);
  const [active, setActive] = useState(null);
  const [intervention, setIntervention] = useState("");
  const [phase, setPhase] = useState("map");
  const svgRef = useRef(null);
  const [svgSize, setSvgSize] = useState({ w: 340, h: 240 });

  useEffect(() => {
    function update() {
      const w = Math.min(window.innerWidth - 48, 560);
      setSvgSize({ w, h: Math.min(w * 0.65, 320) });
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { w: svgW, h: svgH } = svgSize;
  const px = p => (p / 100) * svgW;
  const py = p => (p / 100) * svgH;
  const cx = px(50), cy = py(50);
  const satIds = ["resurse", "lipsa", "presiuni", "pivot"];
  const allFilled = satIds.every(id => nodes[id].value.trim()) && nodes.center.value.trim();
  const activeNode = active ? nodes[active] : null;

  function update(id, val) {
    setNodes(p => ({ ...p, [id]: { ...p[id], value: val } }));
  }

  return (
    <div>
      {phase === "map" && (
        <>
          <svg ref={svgRef} width={svgW} height={svgH} style={{ display: "block", margin: "0 auto", overflow: "visible" }}>
            <defs>
              <filter id="hf-glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              <filter id="hf-glow2"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            {satIds.map(id => {
              const n = nodes[id];
              const filled = n.value.trim() !== "";
              return <line key={id} x1={cx} y1={cy} x2={px(n.x)} y2={py(n.y)} stroke={filled ? n.color : "#2A2A4A"} strokeWidth={filled ? 2 : 1} strokeDasharray={filled ? "none" : "4,3"} opacity={filled ? 0.7 : 0.35} style={{ transition: "all 0.4s" }} />;
            })}
            <g style={{ cursor: "pointer" }} onClick={() => setActive(active === "center" ? null : "center")}>
              <circle cx={cx} cy={cy} r={svgW < 380 ? 34 : 44} fill={C.panel} stroke={C.orange} strokeWidth={active === "center" ? 3 : 1.5} filter="url(#hf-glow)" />
              {nodes.center.value ? (
                <>
                  <text x={cx} y={cy - 5} textAnchor="middle" fill="#fff" fontSize={10} fontWeight="bold">{nodes.center.value.slice(0, 16)}{nodes.center.value.length > 16 ? "…" : ""}</text>
                  <text x={cx} y={cy + 10} textAnchor="middle" fill={C.orange} fontSize={8}>✓</text>
                </>
              ) : (
                <>
                  <text x={cx} y={cy - 4} textAnchor="middle" fill="#C0BAFF" fontSize={svgW < 380 ? 9 : 11} fontWeight="bold">Evenimentul</text>
                  <text x={cx} y={cy + 10} textAnchor="middle" fill="#5A5880" fontSize={8} fontStyle="italic">atinge</text>
                </>
              )}
            </g>
            {satIds.map(id => {
              const n = nodes[id];
              const sx = px(n.x), sy = py(n.y);
              const r = svgW < 380 ? 30 : 38;
              const filled = n.value.trim() !== "";
              const isAct = active === id;
              return (
                <g key={id} style={{ cursor: "pointer" }} onClick={() => setActive(isAct ? null : id)}>
                  <circle cx={sx} cy={sy} r={r} fill={C.panel} stroke={n.color} strokeWidth={isAct ? 3 : filled ? 2 : 1} opacity={filled ? 1 : 0.7} filter={isAct ? "url(#hf-glow2)" : filled ? "url(#hf-glow)" : "none"} style={{ transition: "all 0.3s" }} />
                  {filled ? (
                    <>
                      <text x={sx} y={sy - 4} textAnchor="middle" fill={n.color} fontSize={svgW < 380 ? 7 : 9} fontWeight="bold">{n.label}</text>
                      <text x={sx} y={sy + 8} textAnchor="middle" fill="#ccc" fontSize={svgW < 380 ? 7 : 8}>{n.value.slice(0, 12)}{n.value.length > 12 ? "…" : ""}</text>
                    </>
                  ) : (
                    <>
                      <text x={sx} y={sy - 3} textAnchor="middle" fill={n.color} fontSize={svgW < 380 ? 8 : 10} fontWeight="600">{n.label}</text>
                      <text x={sx} y={sy + 9} textAnchor="middle" fill="#5A5880" fontSize={7} fontStyle="italic">atinge</text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>

          {activeNode && (
            <div style={{ background: `linear-gradient(160deg, ${C.panel}, #12102A)`, border: `1px solid ${activeNode.color || C.orange}`, borderRadius: 16, padding: "20px", marginTop: 16, boxShadow: `0 0 24px ${activeNode.color || C.orange}22` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: activeNode.color || C.orange, boxShadow: `0 0 6px ${activeNode.color || C.orange}`, flexShrink: 0 }} />
                <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: activeNode.color || C.orange, fontFamily: "monospace" }}>{activeNode.label}</div>
              </div>
              <div style={{ fontSize: 15, color: "#fff", fontWeight: "600", marginBottom: 8 }}>{activeNode.question}</div>
              <div style={{ fontSize: 12, color: "#9088CC", lineHeight: 1.7, marginBottom: 12, padding: "10px 12px", background: "rgba(0,0,0,0.2)", borderRadius: 8, borderLeft: `2px solid ${activeNode.color || C.orange}44` }}>{activeNode.explanation}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                {activeNode.hints?.map((h, i) => <div key={i} style={{ fontSize: 10, color: "#8080AA", background: "rgba(255,255,255,0.03)", border: "1px solid #2A2A4A", borderRadius: 20, padding: "3px 10px" }}>{h}</div>)}
              </div>
              <textarea autoFocus value={activeNode.value} onChange={e => update(active, e.target.value)} placeholder={activeNode.placeholder} style={{ width: "100%", minHeight: 80, background: "rgba(0,0,0,0.3)", border: `1px solid ${activeNode.color || C.orange}44`, borderRadius: 10, color: C.text, fontSize: 13, padding: "10px 12px", resize: "vertical", fontFamily: "Georgia, serif", outline: "none", boxSizing: "border-box", lineHeight: 1.6 }} />
              <button onClick={() => setActive(null)} style={{ marginTop: 10, background: `linear-gradient(135deg, ${activeNode.color || C.orange}, ${C.gold})`, border: "none", borderRadius: 8, color: "#0A0A14", fontWeight: "bold", fontSize: 12, padding: "8px 20px", cursor: "pointer" }}>Salvează ✓</button>
            </div>
          )}

          <div style={{ display: "flex", gap: 6, marginTop: 16, alignItems: "center", justifyContent: "center" }}>
            {["center", ...satIds].map(id => <div key={id} style={{ width: 8, height: 8, borderRadius: "50%", background: nodes[id].value.trim() ? (nodes[id].color || C.orange) : "#2A2A4A", transition: "background 0.3s" }} />)}
            <span style={{ fontSize: 10, color: "#5A5880", marginLeft: 4, fontFamily: "monospace" }}>{["center", ...satIds].filter(id => nodes[id].value.trim()).length}/5</span>
          </div>

          {allFilled && (
            <div style={{ background: "linear-gradient(135deg, #0F1A0F, #080E08)", border: `1px solid ${C.orange}`, borderRadius: 14, padding: "18px", marginTop: 16, boxShadow: `0 0 24px ${C.orange}22` }}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: C.orange, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8 }}>Pasul 3 — Punctul de intervenție</div>
              <p style={{ fontSize: 12, color: "#9088CC", margin: "0 0 10px", fontStyle: "italic" }}>Care element, dacă era diferit, schimba tot rezultatul? Formulează concluzia:</p>
              <textarea value={intervention} onChange={e => setIntervention(e.target.value)} placeholder="Data viitoare, intervin la [punct structural] prin [acțiune concretă]..." style={{ width: "100%", minHeight: 65, background: "rgba(0,0,0,0.3)", border: `1px solid ${C.orange}44`, borderRadius: 8, color: C.text, fontSize: 13, padding: "10px 12px", resize: "vertical", fontFamily: "Georgia, serif", outline: "none", boxSizing: "border-box", lineHeight: 1.6 }} />
              {intervention.trim() && <button onClick={() => setPhase("result")} style={{ marginTop: 10, background: `linear-gradient(135deg, ${C.orange}, ${C.gold})`, border: "none", borderRadius: 8, color: "#0A0A14", fontWeight: "bold", fontSize: 13, padding: "10px 24px", cursor: "pointer", boxShadow: `0 4px 16px ${C.orange}44` }}>Vezi analiza →</button>}
            </div>
          )}
        </>
      )}

      {phase === "result" && (
        <div style={{ background: `linear-gradient(160deg, ${C.panel}, #12102A)`, borderRadius: 16, padding: "24px", border: `1px solid ${C.orange}`, boxShadow: `0 0 32px ${C.orange}22` }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: C.orange, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 16 }}>Analiza ta structurală</div>
          <div style={{ fontSize: 14, fontWeight: "bold", color: "#fff", marginBottom: 16, padding: "10px 14px", background: "rgba(255,107,43,0.1)", borderRadius: 8, borderLeft: `3px solid ${C.orange}` }}>"{nodes.center.value}"</div>
          {satIds.map(id => (
            <div key={id} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: nodes[id].color, fontFamily: "monospace", marginBottom: 3 }}>{nodes[id].label}</div>
              <div style={{ fontSize: 12, color: "#A0A0CC", padding: "8px 10px", background: "rgba(0,0,0,0.2)", borderRadius: 6, borderLeft: `2px solid ${nodes[id].color}` }}>{nodes[id].value}</div>
            </div>
          ))}
          <div style={{ marginTop: 16, padding: "14px 16px", background: "rgba(255,107,43,0.08)", borderRadius: 10, border: `1px solid ${C.gold}33` }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: C.gold, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6 }}>Punctul tău de intervenție</div>
            <div style={{ fontSize: 13, color: "#fff", fontStyle: "italic", lineHeight: 1.6 }}>"{intervention}"</div>
          </div>
          <div style={{ marginTop: 14, padding: "12px 14px", background: `${C.teal}08`, borderRadius: 8, border: `1px solid ${C.teal}22`, fontSize: 12, color: "#8080AA", fontStyle: "italic", lineHeight: 1.7 }}>
            Tocmai ai folosit Inteligența Structurală. Nu ai căutat un vinovat — ai găsit mecanismul.
          </div>
          <button onClick={() => { setNodes(initialNodes); setIntervention(""); setPhase("map"); setActive(null); }} style={{ marginTop: 14, width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid #2A2A4A", borderRadius: 8, color: "#5A5880", fontSize: 12, padding: "10px", cursor: "pointer" }}>← Analizează alt eveniment</button>
        </div>
      )}
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

const SECTIONS = ["intro", "concept", "exemplu", "exercitiu", "concluzie"];

export default function Lectia1() {
  const [activeSection, setActiveSection] = useState(0);
  const [readSections, setReadSections] = useState(new Set([0]));
  const [showTool, setShowTool] = useState(false);
  const toolRef = useRef(null);

  function markRead(i) {
    setReadSections(prev => new Set([...prev, i]));
    if (i < SECTIONS.length - 1) setActiveSection(i + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToTool() {
    setShowTool(true);
    setTimeout(() => toolRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
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
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        * { box-sizing: border-box; }
      `}</style>

      {/* Top nav */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: `${C.bg}EE`, backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.border}`,
        padding: "12px 20px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: C.muted, textTransform: "uppercase", fontFamily: "monospace", flexShrink: 0 }}>
          Școala Valasi
        </div>
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
            <div style={{ fontSize: 9, letterSpacing: 3, color: C.muted, textTransform: "uppercase", fontFamily: "monospace", padding: "3px 10px", border: `1px solid ${C.border}`, borderRadius: 20 }}>Lecția 1 din 5</div>
          </div>

          <h1 style={{
            fontSize: "clamp(24px, 5vw, 40px)",
            fontWeight: 700, margin: "0 0 16px",
            lineHeight: 1.2, letterSpacing: "-0.02em",
            background: `linear-gradient(135deg, #fff 0%, ${C.gold} 100%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            De ce oamenii deștepți pierd în fața oamenilor care văd altfel
          </h1>

          <p style={{ fontSize: 15, color: "#8888BB", lineHeight: 1.8, margin: 0 }}>
            Nu e vorba de noroc. Nu e vorba de pile. E vorba de un unghi diferit din care privești lumea.
          </p>
        </div>

        {/* Section navigator */}
        <div style={{ display: "flex", gap: 6, marginBottom: 32, flexWrap: "wrap" }}>
          {[
            { id: "intro", label: "Introducere" },
            { id: "concept", label: "Conceptul" },
            { id: "exemplu", label: "Exemplul real" },
            { id: "exercitiu", label: "Exercițiul" },
            { id: "concluzie", label: "Concluzia" },
          ].map((s, i) => {
            const isRead = readSections.has(i);
            const isActive = activeSection === i;
            return (
              <button key={s.id} onClick={() => setActiveSection(i)} style={{
                fontSize: 10, padding: "5px 12px", borderRadius: 20, cursor: "pointer",
                fontFamily: "monospace", letterSpacing: 1, textTransform: "uppercase",
                border: isActive ? `1px solid ${C.orange}` : `1px solid ${C.border}`,
                background: isActive ? `${C.orange}15` : "transparent",
                color: isActive ? C.orange : isRead ? C.muted : "#3A3A5A",
                transition: "all 0.2s",
              }}>
                {isRead && !isActive ? "✓ " : ""}{s.label}
              </button>
            );
          })}
        </div>

        {/* SECTION: INTRO */}
        {activeSection === 0 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{
              background: `linear-gradient(135deg, ${C.panel}, #0E0E20)`,
              border: `1px solid ${C.border}`,
              borderRadius: 20, padding: "28px 28px",
              marginBottom: 20,
            }}>
              <div style={{ fontSize: 24, marginBottom: 16 }}>🔥</div>
              <p style={{ fontSize: 15, lineHeight: 1.9, color: C.text, margin: "0 0 16px" }}>
                Ai cunoscut vreodată un om care nu e cel mai inteligent din cameră, nu muncește cel mai mult, nu are cele mai bune note — dar mereu pare că lucrurile îi ies?
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.9, color: "#9090BB", margin: 0 }}>
                Nu e noroc. Nu e pile. <strong style={{ color: C.text }}>Vede ceva ce tu nu vezi încă.</strong>
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 24 }}>
              {[
                { icon: "👁", label: "5 minute", desc: "să citești lecția" },
                { icon: "⚡", label: "10 minute", desc: "să faci exercițiul" },
                { icon: "🐉", label: "1 instrument", desc: "de folosit oricând" },
              ].map((item, i) => (
                <div key={i} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: "bold", color: "#fff", marginBottom: 3 }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{item.desc}</div>
                </div>
              ))}
            </div>

            <button onClick={() => markRead(0)} style={{
              width: "100%", background: `linear-gradient(135deg, ${C.orange}, ${C.gold})`,
              border: "none", borderRadius: 14, color: "#09090F",
              fontWeight: "bold", fontSize: 15, padding: "16px",
              cursor: "pointer", boxShadow: `0 6px 24px ${C.orange}44`,
              fontFamily: "Georgia, serif",
            }}>Începe lecția →</button>
          </div>
        )}

        {/* SECTION: CONCEPT */}
        {activeSection === 1 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, letterSpacing: 3, color: C.orange, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 12 }}>Conceptul</div>

              <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 18, padding: "24px", marginBottom: 16 }}>
                <p style={{ fontSize: 15, lineHeight: 1.9, color: C.text, margin: "0 0 20px" }}>
                  Majoritatea oamenilor văd <strong style={{ color: C.orange }}>evenimente.</strong> A picat examenul. A pierdut jobul. Nu a primit finanțarea.
                </p>
                <p style={{ fontSize: 15, lineHeight: 1.9, color: C.text, margin: 0 }}>
                  Mintea structurală vede <strong style={{ color: C.teal }}>mecanisme.</strong> De ce s-a întâmplat. Ce forțe au produs rezultatul. Ce s-ar fi putut schimba și unde.
                </p>
              </div>

              <div style={{ background: `linear-gradient(135deg, ${C.orange}10, ${C.gold}08)`, border: `1px solid ${C.orange}33`, borderRadius: 16, padding: "20px 22px", marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: C.muted, fontFamily: "monospace", letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>Diferența nu e IQ. E unghiul.</div>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: "#B0B0CC", margin: 0 }}>
                  Un pod nu cade pentru că e slab. Cade pentru că forțele n-au fost distribuite corect. La fel și un plan, o relație, o carieră.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ background: C.panel, border: `1px solid ${C.red}33`, borderRadius: 14, padding: "16px" }}>
                  <div style={{ fontSize: 10, letterSpacing: 2, color: C.red, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8 }}>Gândire obișnuită</div>
                  <div style={{ fontSize: 13, color: "#9090AA", lineHeight: 1.7 }}>Vede ce s-a întâmplat și caută cine e de vină.</div>
                </div>
                <div style={{ background: C.panel, border: `1px solid ${C.teal}33`, borderRadius: 14, padding: "16px" }}>
                  <div style={{ fontSize: 10, letterSpacing: 2, color: C.teal, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8 }}>Gândire structurală</div>
                  <div style={{ fontSize: 13, color: "#9090AA", lineHeight: 1.7 }}>Vede cum s-a întâmplat și caută ce poate schimba.</div>
                </div>
              </div>
            </div>

            <button onClick={() => markRead(1)} style={{ width: "100%", background: `linear-gradient(135deg, ${C.orange}, ${C.gold})`, border: "none", borderRadius: 14, color: "#09090F", fontWeight: "bold", fontSize: 15, padding: "16px", cursor: "pointer", boxShadow: `0 6px 24px ${C.orange}44` }}>
              Am înțeles — arată-mi exemplul →
            </button>
          </div>
        )}

        {/* SECTION: EXEMPLU */}
        {activeSection === 2 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: C.orange, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 16 }}>Exemplul real</div>

            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 18, padding: "24px", marginBottom: 16 }}>
              <p style={{ fontSize: 14, color: C.muted, fontStyle: "italic", margin: "0 0 20px", lineHeight: 1.7 }}>
                Doi studenți aplică la același internship. Amândoi sunt respinși.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ background: `${C.red}0A`, border: `1px solid ${C.red}22`, borderRadius: 14, padding: "18px" }}>
                  <div style={{ fontSize: 10, letterSpacing: 2, color: C.red, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8 }}>Studentul A — gândire obișnuită</div>
                  <p style={{ fontSize: 13, color: "#9090AA", lineHeight: 1.7, margin: 0 }}>
                    <em>"N-am fost suficient de bun."</em> Se simte prost două săptămâni și aplică din nou la fel.
                  </p>
                </div>

                <div style={{ background: `${C.teal}0A`, border: `1px solid ${C.teal}22`, borderRadius: 14, padding: "18px" }}>
                  <div style={{ fontSize: 10, letterSpacing: 2, color: C.teal, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8 }}>Studentul B — gândire structurală</div>
                  <p style={{ fontSize: 13, color: "#9090AA", lineHeight: 1.7, margin: 0 }}>
                    Întreabă: <em>"Care a fost criteriul real de selecție? Ce a văzut recruterul în primele 10 secunde? Ce tip de om căutau de fapt?"</em> Modifică abordarea și intră la următorul internship.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ background: `${C.orange}0D`, border: `1px solid ${C.orange}33`, borderRadius: 14, padding: "18px", marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: "bold", color: "#fff", marginBottom: 6 }}>Același eveniment. Două moduri de a procesa realitatea.</div>
              <div style={{ fontSize: 13, color: "#9090AA", lineHeight: 1.7 }}>Studentul B nu e mai deștept. Are un instrument diferit în cap.</div>
            </div>

            <button onClick={() => markRead(2)} style={{ width: "100%", background: `linear-gradient(135deg, ${C.orange}, ${C.gold})`, border: "none", borderRadius: 14, color: "#09090F", fontWeight: "bold", fontSize: 15, padding: "16px", cursor: "pointer", boxShadow: `0 6px 24px ${C.orange}44` }}>
              Înțeleg — acum vreau să exersez →
            </button>
          </div>
        )}

        {/* SECTION: EXERCITIU */}
        {activeSection === 3 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: C.orange, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 16 }}>Exercițiul — Harta Forțelor</div>

            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 18, padding: "22px", marginBottom: 20 }}>
              <p style={{ fontSize: 14, color: "#9090AA", lineHeight: 1.8, margin: "0 0 16px" }}>
                Ia un lucru care nu ți-a ieșit recent. Orice. Un examen, o conversație, un proiect. Folosește instrumentul de mai jos pentru a vedea <strong style={{ color: C.text }}>structura din spatele lui</strong>, nu vinovatul.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                {[
                  { nr: "1", text: "Descrie evenimentul — centrul hărții", color: C.orange },
                  { nr: "2", text: "Completează cei 4 sateliți — resurse, ce lipsea, presiuni, momentul pivot", color: C.teal },
                  { nr: "3", text: "Identifică punctul de intervenție — ce schimbi data viitoare", color: C.gold },
                ].map(step => (
                  <div key={step.nr} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: `${step.color}22`, border: `1px solid ${step.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: step.color, fontFamily: "monospace", flexShrink: 0 }}>{step.nr}</div>
                    <div style={{ fontSize: 13, color: "#9090AA", lineHeight: 1.6, paddingTop: 3 }}>{step.text}</div>
                  </div>
                ))}
              </div>

              {!showTool ? (
                <button onClick={goToTool} style={{ width: "100%", background: `linear-gradient(135deg, ${C.orange}, ${C.gold})`, border: "none", borderRadius: 14, color: "#09090F", fontWeight: "bold", fontSize: 15, padding: "16px", cursor: "pointer", boxShadow: `0 6px 24px ${C.orange}44` }}>
                  Deschide Harta Forțelor →
                </button>
              ) : (
                <button onClick={() => markRead(3)} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 14, color: C.muted, fontSize: 13, padding: "14px", cursor: "pointer" }}>
                  Am completat harta — mergi la concluzie →
                </button>
              )}
            </div>

            {showTool && (
              <div ref={toolRef} style={{ background: C.panel, border: `1px solid ${C.orange}44`, borderRadius: 20, padding: "24px", animation: "fadeUp 0.4s ease", boxShadow: `0 0 40px ${C.orange}11` }}>
                <div style={{ fontSize: 10, letterSpacing: 3, color: C.orange, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 20 }}>🐉 Harta Forțelor</div>
                <HartaFortelor />
              </div>
            )}
          </div>
        )}

        {/* SECTION: CONCLUZIE */}
        {activeSection === 4 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: C.orange, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 16 }}>Concluzia</div>

            <div style={{ background: `linear-gradient(135deg, ${C.panel}, #0E0820)`, border: `1px solid ${C.orange}55`, borderRadius: 20, padding: "28px", marginBottom: 20, boxShadow: `0 0 40px ${C.orange}11` }}>
              <p style={{ fontSize: 18, lineHeight: 1.8, color: "#fff", fontStyle: "italic", margin: "0 0 20px", textAlign: "center" }}>
                "Oamenii care reușesc constant nu sunt mai norocoși. Văd structura din spatele evenimentelor — și o modifică înainte ca ea să îi modifice pe ei."
              </p>
              <div style={{ width: 40, height: 2, background: `linear-gradient(90deg, ${C.orange}, ${C.gold})`, margin: "0 auto" }} />
            </div>

            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px", marginBottom: 20 }}>
              <div style={{ fontSize: 11, letterSpacing: 2, color: C.muted, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 14 }}>Ce ai învățat în această lecție</div>
              {[
                "Diferența dintre a vedea evenimente și a vedea mecanisme",
                "Cum să folosești Harta Forțelor pentru orice situație care nu ți-a ieșit",
                "Că schimbarea nu vine din vina altcuiva, ci din înțelegerea structurii",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                  <div style={{ color: C.orange, fontSize: 14, flexShrink: 0, marginTop: 1 }}>✓</div>
                  <div style={{ fontSize: 13, color: "#9090AA", lineHeight: 1.6 }}>{item}</div>
                </div>
              ))}
            </div>

            {/* Next lesson teaser */}
            <div style={{ background: `linear-gradient(135deg, #0F1A2A, #0A1020)`, border: `1px solid ${C.teal}33`, borderRadius: 18, padding: "22px", marginBottom: 20 }}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: C.teal, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 10 }}>Lecția 2 — ce urmează</div>
              <div style={{ fontSize: 15, fontWeight: "bold", color: "#fff", marginBottom: 8 }}>
                "De ce școala te-a învățat să reproduci, nu să înțelegi"
              </div>
              <div style={{ fontSize: 13, color: "#7090AA", lineHeight: 1.7 }}>
                Orice sistem face un compromis. Îl găsim pe cel din spatele școlii — și înveți să aplici același instrument pe orice altceva.
              </div>
            </div>

            <button onClick={() => markRead(4)} style={{ width: "100%", background: `linear-gradient(135deg, ${C.teal}, #2DD4BF)`, border: "none", borderRadius: 14, color: "#09090F", fontWeight: "bold", fontSize: 15, padding: "16px", cursor: "pointer", boxShadow: `0 6px 24px ${C.teal}44` }}>
              Mergi la Lecția 2 →
            </button>
          </div>
        )}

        {/* Completion state */}
        {progress === 100 && (
          <div style={{ marginTop: 32, background: `linear-gradient(135deg, ${C.orange}15, ${C.gold}08)`, border: `1px solid ${C.gold}44`, borderRadius: 18, padding: "24px", textAlign: "center", animation: "fadeUp 0.4s ease" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🐉</div>
            <div style={{ fontSize: 16, fontWeight: "bold", color: "#fff", marginBottom: 8 }}>Lecția 1 completată</div>
            <div style={{ fontSize: 13, color: "#9090AA", lineHeight: 1.7 }}>Ai parcurs primul pas în Inteligența Structurală. Dragonul tău a învățat să vadă mecanismele.</div>
          </div>
        )}
      </div>
    </div>
  );
}
