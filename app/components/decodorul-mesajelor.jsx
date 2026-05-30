"use client";

import { useState, useEffect, useRef } from "react";

const C = {
  bg: "#F3F4F6",
  bgGlow: "#FFF7ED",
  panel: "#FFFFFF",
  border: "#E5E7EB",
  text: "#111827",
  muted: "#475569",
  faint: "#64748B",
  red: "#DC2626",
  orange: "#FF6B2B",
  yellow: "#EAB308",
  green: "#16A34A",
  blue: "#2563EB",
  purple: "#7C3AED",
  cyan: "#0891B2",
  accent: "#FF6B2B",
};

const EMOTIONS = {
  frica: { label: "Frică", color: C.red, emoji: "😨", desc: "Mesajul activează instinctul de supraviețuire. Te face să acționezi înainte să gândești." },
  furie: { label: "Furie", color: C.orange, emoji: "😡", desc: "Furia dezactivează gândirea critică și crește distribuirea. Cel mai viral combustibil." },
  speranta: { label: "Speranță", color: C.green, emoji: "✨", desc: "Promite o lume mai bună. Ușor de exploatat dacă promisiunea e vagă sau irealizabilă." },
  invidie: { label: "Invidie / FOMO", color: C.purple, emoji: "👀", desc: "Te face să simți că pierzi ceva. Produce anxietate și decizii impulsive." },
  mandrie: { label: "Mândrie / Identitate", color: C.blue, emoji: "🦁", desc: "Atacă sau validează identitatea ta. Greu de contestat fără să te simți atacat." },
  curiozitate: { label: "Curiozitate", color: C.cyan, emoji: "🔍", desc: "Cel mai curat mecanism. Poate fi folosit onest sau ca clickbait." },
};

const PATTERNS = {
  urgenta: { label: "Urgență falsă", color: C.red, desc: "Creează presiunea timpului pentru a bloca gândirea. 'Acum sau niciodată', 'Ultimele ore'." },
  omisiune: { label: "Omisiune selectivă", color: C.orange, desc: "Prezintă doar faptele care susțin o concluzie. Tehnic adevărat, dar incomplet." },
  generalizare: { label: "Generalizare", color: C.yellow, desc: "Transformă un caz particular în regulă universală. 'Toți', 'Nimeni', 'Întotdeauna'." },
  autoritate: { label: "Autoritate falsă", color: C.purple, desc: "Invocă o sursă sau expert pentru a bloca întrebările. 'Studiile arată', 'Experții spun'." },
  victima: { label: "Narative victimă/agresor", color: C.blue, desc: "Împarte lumea în buni și răi. Ești invitat să te aliniezi cu victima împotriva agresorului." },
  social: { label: "Presiune socială", color: C.cyan, desc: "'Toată lumea face/crede asta.' Exploatează nevoia de apartenență." },
  emotional: { label: "Înlocuirea faptelor cu emoții", color: C.green, desc: "Imaginile și poveștile emoționale înlocuiesc datele și argumentele." },
};

const EXAMPLES = [
  { label: "Titlu de știre", text: "ALERTĂ: Medicii nu vor să știi asta! Ingredientul secret care distruge sănătatea ta în fiecare zi" },
  { label: "Post viral", text: "Generația noastră e prima care va trăi mai prost decât părinții. Și nimănui nu îi pasă." },
  { label: "Reclamă", text: "Doar 3 locuri rămase! Cursul care a schimbat viața a 10.000 de oameni. Nu rata această oportunitate unică." },
  { label: "Mesaj politic", text: "Ei distrug tot ce am construit. Dacă nu acționăm acum, nu va mai fi nimic de salvat pentru copiii noștri." },
];

function TypewriterText({ text, speed = 18, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    idx.current = 0;
    if (!text) return;
    const interval = setInterval(() => {
      if (idx.current < text.length) {
        setDisplayed(text.slice(0, idx.current + 1));
        idx.current++;
      } else {
        clearInterval(interval);
        setDone(true);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayed}{!done && <span style={{ opacity: 0.86 }}>▌</span>}</span>;
}

function PulsingDot({ color }) {
  return (
    <span style={{
      display: "inline-block", width: 8, height: 8, borderRadius: "50%",
      background: color, marginRight: 8, flexShrink: 0,
      boxShadow: `0 0 6px ${color}`,
      animation: "pulse 1.5s ease-in-out infinite",
    }} />
  );
}

function ScoreBar({ value, color, label }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: C.muted }}>{label}</span>
        <span style={{ fontSize: 11, color, fontFamily: "monospace" }}>{value}%</span>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: C.border, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 2, width: `${value}%`,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: `0 0 8px ${color}55`,
        }} />
      </div>
    </div>
  );
}

export default function DeodorulMesajelor() {
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState("idle"); // idle | loading | result
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(0);
  const [sectionsReady, setSectionsReady] = useState([]);
  const resultRef = useRef(null);

  async function decode() {
    if (!input.trim()) return;
    setPhase("loading");
    setResult(null);
    setError(null);
    setActiveSection(0);
    setSectionsReady([]);

    const systemPrompt = `Ești un analist de comunicare pentru tineri din România. Analizezi mesaje media, reclame, postări și știri pentru a le ajuta pe oameni să înțeleagă mecanismele de influență.

Răspunde DOAR cu un obiect JSON valid, fără text înainte sau după, fără markdown. Structura exactă:

{
  "titlu": "un titlu scurt și direct care rezumă esența mesajului (max 8 cuvinte)",
  "emotie_principala": "unul din: frica, furie, speranta, invidie, mandrie, curiozitate",
  "intensitate_emotie": număr între 0 și 100,
  "tipare": ["lista de tipare identificate, din: urgenta, omisiune, generalizare, autoritate, victima, social, emotional"],
  "ce_vrea_sa_produca": "o propoziție simplă despre intenția reală a mesajului",
  "cum_functioneaza": "2-3 propoziții care explică mecanismul psihologic folosit, în limbaj simplu pentru un tânăr de 20 de ani",
  "intrebare_de_verificat": "o singură întrebare precisă pe care să o pui înainte să crezi sau distribui mesajul",
  "onestitate_scor": număr între 0 și 100 (100 = complet onest, 0 = complet manipulativ),
  "ce_lipseste": "ce informație sau perspectivă e omisă din mesaj",
  "recomandat_pentru": "în ce context ar fi acest tip de mesaj legitim vs manipulativ"
}

Fii direct, nu moralizator. Scopul nu e să judeci sursa, ci să explici mecanismul.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: "user", content: `Analizează acest mesaj:\n\n"${input}"` }],
        }),
      });

      const data = await response.json();
      const raw = data.content?.find(b => b.type === "text")?.text || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
      setPhase("result");

      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (e) {
      setError("Nu am putut analiza mesajul. Încearcă din nou.");
      setPhase("idle");
    }
  }

  function markSectionReady(i) {
    setSectionsReady(prev => [...new Set([...prev, i])]);
    if (i < 4) setTimeout(() => setActiveSection(i + 1), 300);
  }

  const emotionData = result ? EMOTIONS[result.emotie_principala] : null;
  const honestyColor = result
    ? result.onestitate_scor > 65 ? C.green
      : result.onestitate_scor > 35 ? C.yellow
      : C.red
    : C.muted;

  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: C.text,
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "28px 16px 80px",
    }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.85)} }
        @keyframes fadeSlideIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        textarea:focus { outline: none; }
        input[type=range] { -webkit-appearance: none; height: 3px; border-radius: 2px; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: ${C.accent}; cursor: pointer; }
      `}</style>

      {/* Scanline effect */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: "none", zIndex: 0, overflow: "hidden",
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, #FFFFFF 2px, #FFFFFF 4px)",
      }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 520 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            fontSize: 9, letterSpacing: 6, color: C.accent,
            textTransform: "uppercase", fontFamily: "monospace", marginBottom: 10,
            opacity: 0.8,
          }}>Școala Valasi · Lecția 3C</div>

          <div style={{ position: "relative", display: "inline-block" }}>
            <h1 style={{
              fontSize: "clamp(26px, 6vw, 42px)",
              fontWeight: 700, margin: 0,
              letterSpacing: "-0.02em",
              color: "#fff",
              textShadow: "none",
            }}>Decodorul</h1>
            <h1 style={{
              fontSize: "clamp(26px, 6vw, 42px)",
              fontWeight: 700, margin: 0,
              letterSpacing: "-0.02em",
              background: `linear-gradient(135deg, ${C.orange} 0%, ${C.red} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>de Mesaje</h1>
          </div>

          <p style={{
            fontSize: 13, color: C.muted, margin: "12px auto 0",
            maxWidth: 360, lineHeight: 1.7,
          }}>
            Orice mesaj vrea ceva de la tine. Află ce — înainte să îl dai.
          </p>
        </div>

        {/* Input area */}
        <div style={{
          background: C.panel,
          border: `1px solid ${input.trim() ? C.accent + "55" : C.border}`,
          borderRadius: 20, padding: "20px 20px 16px",
          marginBottom: 14,
          transition: "border-color 0.3s",
          boxShadow: input.trim() ? `0 0 30px ${C.accent}11` : "none",
        }}>
          <div style={{
            fontSize: 9, letterSpacing: 3, color: C.muted,
            textTransform: "uppercase", fontFamily: "monospace", marginBottom: 10,
          }}>Introdu mesajul</div>

          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Lipește orice mesaj — titlu de știre, post, reclamă, frază politică..."
            rows={4}
            style={{
              width: "100%", background: "transparent",
              border: "none", color: C.text,
              fontSize: 14, lineHeight: 1.7,
              resize: "vertical", fontFamily: "'DM Sans', system-ui, sans-serif",
              boxSizing: "border-box",
              caretColor: C.accent,
            }}
          />

          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "center", marginTop: 12, paddingTop: 12,
            borderTop: `1px solid ${C.border}`,
          }}>
            <span style={{ fontSize: 11, color: C.muted, fontFamily: "monospace" }}>
              {input.length} caractere
            </span>
            <button
              onClick={decode}
              disabled={!input.trim() || phase === "loading"}
              style={{
                background: input.trim() && phase !== "loading"
                  ? `linear-gradient(135deg, ${C.orange}, ${C.red})`
                  : C.border,
                border: "none", borderRadius: 12,
                color: input.trim() && phase !== "loading" ? "#fff" : C.muted,
                fontWeight: "bold", fontSize: 13,
                padding: "10px 24px", cursor: input.trim() && phase !== "loading" ? "pointer" : "default",
                transition: "all 0.3s",
                boxShadow: input.trim() && phase !== "loading" ? `0 4px 20px ${C.orange}44` : "none",
                fontFamily: "monospace", letterSpacing: 1,
              }}>
              {phase === "loading" ? "Analizez..." : "DECODEAZĂ →"}
            </button>
          </div>
        </div>

        {/* Examples */}
        {phase === "idle" && (
          <div style={{ marginBottom: 28 }}>
            <div style={{
              fontSize: 9, letterSpacing: 3, color: C.muted,
              textTransform: "uppercase", fontFamily: "monospace", marginBottom: 10,
              textAlign: "center",
            }}>sau încearcă un exemplu</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {EXAMPLES.map((ex, i) => (
                <div
                  key={i}
                  onClick={() => setInput(ex.text)}
                  style={{
                    background: C.panel, border: `1px solid ${C.border}`,
                    borderRadius: 12, padding: "12px 16px", cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex", alignItems: "flex-start", gap: 12,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent + "55"; e.currentTarget.style.background = C.bgGlow; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.panel; }}
                >
                  <div style={{
                    fontSize: 9, letterSpacing: 1, color: C.accent,
                    textTransform: "uppercase", fontFamily: "monospace",
                    flexShrink: 0, marginTop: 2, whiteSpace: "nowrap",
                  }}>{ex.label}</div>
                  <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{ex.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading state */}
        {phase === "loading" && (
          <div style={{
            textAlign: "center", padding: "40px 20px",
            animation: "fadeSlideIn 0.3s ease",
          }}>
            <div style={{
              display: "inline-flex", gap: 6, marginBottom: 16,
            }}>
              {[C.red, C.orange, C.yellow].map((c, i) => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: "50%", background: c,
                  animation: `pulse 1s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
            <div style={{ fontSize: 13, color: C.muted, fontFamily: "monospace", letterSpacing: 1 }}>
              Citesc mecanismele...
            </div>
          </div>
        )}

        {/* Result */}
        {phase === "result" && result && (
          <div ref={resultRef} style={{ animation: "fadeSlideIn 0.4s ease" }}>

            {/* Title bar */}
            <div style={{
              background: `linear-gradient(135deg, ${C.panel}, ${C.faint})`,
              border: `1px solid ${C.accent}44`,
              borderRadius: 18, padding: "20px 22px",
              marginBottom: 12,
              boxShadow: `0 0 40px ${C.accent}11`,
            }}>
              <div style={{
                fontSize: 9, letterSpacing: 3, color: C.accent,
                textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8,
              }}>Mesajul tău în esență</div>
              <div style={{ fontSize: 17, fontWeight: "700", color: "#fff", lineHeight: 1.4 }}>
                {activeSection >= 0 ? (
                  <TypewriterText text={result.titlu} onDone={() => markSectionReady(0)} />
                ) : null}
              </div>
            </div>

            {/* Emotion + Honesty */}
            {sectionsReady.includes(0) && (
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10,
                marginBottom: 12,
                animation: "fadeSlideIn 0.4s ease",
              }}>
                {/* Emotion */}
                <div style={{
                  background: C.panel, border: `1px solid ${emotionData?.color}44`,
                  borderRadius: 16, padding: "16px 16px",
                  boxShadow: `0 0 20px ${emotionData?.color}11`,
                }}>
                  <div style={{ fontSize: 9, letterSpacing: 2, color: C.muted, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 10 }}>Emoția activată</div>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{emotionData?.emoji}</div>
                  <div style={{ fontSize: 14, fontWeight: "bold", color: emotionData?.color, marginBottom: 8 }}>
                    {emotionData?.label}
                  </div>
                  <ScoreBar value={result.intensitate_emotie} color={emotionData?.color} label="Intensitate" />
                  <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6, marginTop: 8 }}>
                    {emotionData?.desc}
                  </div>
                </div>

                {/* Honesty */}
                <div style={{
                  background: C.panel, border: `1px solid ${honestyColor}44`,
                  borderRadius: 16, padding: "16px 16px",
                  boxShadow: `0 0 20px ${honestyColor}11`,
                }}>
                  <div style={{ fontSize: 9, letterSpacing: 2, color: C.muted, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 10 }}>Scor de onestitate</div>
                  <div style={{
                    fontSize: 42, fontWeight: "900", color: honestyColor,
                    fontFamily: "monospace", lineHeight: 1,
                    textShadow: "none",
                    marginBottom: 6,
                  }}>{result.onestitate_scor}</div>
                  <div style={{ fontSize: 11, color: honestyColor, fontFamily: "monospace", marginBottom: 10 }}>
                    {result.onestitate_scor > 65 ? "Predominant onest" : result.onestitate_scor > 35 ? "Parțial manipulativ" : "Puternic manipulativ"}
                  </div>
                  <ScoreBar value={result.onestitate_scor} color={honestyColor} label="Transparență" />
                </div>
              </div>
            )}

            {/* Patterns */}
            {sectionsReady.includes(0) && result.tipare?.length > 0 && (
              <div style={{
                background: C.panel, border: `1px solid ${C.border}`,
                borderRadius: 16, padding: "18px 20px", marginBottom: 12,
                animation: "fadeSlideIn 0.4s ease",
              }}>
                <div style={{ fontSize: 9, letterSpacing: 3, color: C.muted, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 14 }}>
                  Tipare identificate ({result.tipare.length})
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {result.tipare.map((p, i) => {
                    const pd = PATTERNS[p];
                    if (!pd) return null;
                    return (
                      <div key={i} style={{
                        display: "flex", gap: 12, alignItems: "flex-start",
                        padding: "10px 12px",
                        background: `${pd.color}08`,
                        border: `1px solid ${pd.color}22`,
                        borderRadius: 10,
                      }}>
                        <PulsingDot color={pd.color} />
                        <div>
                          <div style={{ fontSize: 12, fontWeight: "bold", color: pd.color, marginBottom: 3 }}>{pd.label}</div>
                          <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6 }}>{pd.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* How it works */}
            {sectionsReady.includes(0) && (
              <div style={{
                background: C.panel, border: `1px solid ${C.blue}33`,
                borderRadius: 16, padding: "18px 20px", marginBottom: 12,
                animation: "fadeSlideIn 0.5s ease",
              }}>
                <div style={{ fontSize: 9, letterSpacing: 3, color: C.blue, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 10 }}>
                  Cum funcționează
                </div>
                <div style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.8 }}>
                  <TypewriterText text={result.cum_functioneaza} speed={12} onDone={() => markSectionReady(1)} />
                </div>
              </div>
            )}

            {/* What it wants */}
            {sectionsReady.includes(1) && (
              <div style={{
                background: C.panel, border: `1px solid ${C.purple}33`,
                borderRadius: 16, padding: "18px 20px", marginBottom: 12,
                animation: "fadeSlideIn 0.4s ease",
              }}>
                <div style={{ fontSize: 9, letterSpacing: 3, color: C.purple, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 10 }}>
                  Ce vrea să producă în tine
                </div>
                <div style={{ fontSize: 14, color: "#fff", lineHeight: 1.7, fontWeight: "500" }}>
                  <TypewriterText text={result.ce_vrea_sa_produca} speed={15} onDone={() => markSectionReady(2)} />
                </div>
              </div>
            )}

            {/* What's missing */}
            {sectionsReady.includes(2) && (
              <div style={{
                background: C.panel, border: `1px solid ${C.yellow}33`,
                borderRadius: 16, padding: "18px 20px", marginBottom: 12,
                animation: "fadeSlideIn 0.4s ease",
              }}>
                <div style={{ fontSize: 9, letterSpacing: 3, color: C.yellow, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 10 }}>
                  Ce lipsește din mesaj
                </div>
                <div style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.7 }}>
                  <TypewriterText text={result.ce_lipseste} speed={14} onDone={() => markSectionReady(3)} />
                </div>
              </div>
            )}

            {/* The question */}
            {sectionsReady.includes(3) && (
              <div style={{
                background: `linear-gradient(135deg, ${C.orange}15, ${C.red}08)`,
                border: `1px solid ${C.accent}55`,
                borderRadius: 18, padding: "22px 22px",
                marginBottom: 12,
                boxShadow: `0 0 30px ${C.accent}15`,
                animation: "fadeSlideIn 0.4s ease",
              }}>
                <div style={{ fontSize: 9, letterSpacing: 3, color: C.accent, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 12 }}>
                  Întrebarea pe care să o pui
                </div>
                <div style={{
                  fontSize: 16, color: "#fff", lineHeight: 1.6,
                  fontStyle: "italic", fontWeight: "600",
                }}>
                  "<TypewriterText text={result.intrebare_de_verificat} speed={16} onDone={() => markSectionReady(4)} />"
                </div>
              </div>
            )}

            {/* Context */}
            {sectionsReady.includes(4) && (
              <div style={{
                background: C.panel, border: `1px solid ${C.green}22`,
                borderRadius: 16, padding: "16px 20px", marginBottom: 20,
                animation: "fadeSlideIn 0.4s ease",
              }}>
                <div style={{ fontSize: 9, letterSpacing: 3, color: C.green, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 10 }}>
                  Context legitim vs. manipulativ
                </div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.7 }}>
                  {result.recomandat_pentru}
                </div>
              </div>
            )}

            {/* Reset */}
            {sectionsReady.includes(4) && (
              <div style={{ display: "flex", gap: 10, animation: "fadeSlideIn 0.4s ease" }}>
                <button
                  onClick={() => { setPhase("idle"); setInput(""); setResult(null); setSectionsReady([]); setActiveSection(0); }}
                  style={{
                    flex: 1, background: "#FFFFFF",
                    border: "1px solid #E5E7EB", borderRadius: 12,
                    color: C.muted, fontSize: 13, padding: "12px",
                    cursor: "pointer", fontFamily: "monospace",
                  }}>← Analizează alt mesaj</button>
                <button
                  onClick={() => { setInput(""); setPhase("idle"); setResult(null); setSectionsReady([]); }}
                  style={{
                    flex: 1,
                    background: `linear-gradient(135deg, ${C.orange}, ${C.red})`,
                    border: "none", borderRadius: 12,
                    color: "#fff", fontWeight: "bold", fontSize: 13,
                    padding: "12px", cursor: "pointer",
                    boxShadow: `0 4px 20px ${C.orange}33`,
                    fontFamily: "monospace",
                  }}>Încearcă alt mesaj →</button>
              </div>
            )}
          </div>
        )}

        {error && (
          <div style={{
            background: `${C.red}15`, border: `1px solid ${C.red}44`,
            borderRadius: 12, padding: "14px 18px",
            fontSize: 13, color: C.red, marginTop: 12,
          }}>{error}</div>
        )}

        <div style={{
          marginTop: 48, textAlign: "center",
          fontSize: 9, color: "#E5E7EB",
          letterSpacing: 3, textTransform: "uppercase", fontFamily: "monospace",
        }}>
          Structural Intelligence · Pattern Recognition · 3C
        </div>
      </div>
    </div>
  );
}
