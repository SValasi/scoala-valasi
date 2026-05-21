"use client";
import { useState, useEffect } from "react";

const C = {
  bg: "#F3F4F6",
  bgDeep: "#EEF2F7",
  panel: "#FFFFFF",
  panelBorder: "#E5E7EB",
  intrari: "#2563EB",
  proces: "#7C3AED",
  declarate: "#16A34A",
  reale: "#D97706",
  accent: "#FF6B2B",
  text: "#111827",
  muted: "#475569",
  faint: "#F8FAFC",
};

const STEPS = [
  {
    id: "sistem",
    nr: 0,
    label: "Sistemul",
    icon: "⬡",
    color: "#CBD5E1",
    question: "Ce sistem vrei să diseci?",
    explanation: "Poți analiza orice sistem din viața ta — școala, un loc de muncă, o echipă, o relație, o instituție. Un sistem e orice structură care produce același tip de rezultat, indiferent de cine e înăuntru. Începe cu ceva pe care îl cunoști bine.",
    hints: ["Școala / universitatea", "Locul meu de muncă", "O echipă din care fac parte", "O instituție cu care interacționez"],
    placeholder: "Ex: Sistemul de învățământ din România...",
  },
  {
    id: "intrari",
    nr: 1,
    label: "Intrări",
    icon: "→",
    color: C.intrari,
    question: "Ce primește sistemul?",
    explanation: "Intrările sunt toate resursele pe care sistemul le consumă pentru a funcționa. Gândește-te la oameni, timp, bani, energie, informații. Fără aceste intrări, sistemul s-ar opri. Listează tot ce 'intră' în sistemul pe care l-ai ales.",
    hints: ["Oameni (elevi, angajați, clienți)", "Timp și energie", "Bani și resurse materiale", "Informații și cunoștințe"],
    placeholder: "Ex: Elevi, profesori, ore de curs, manuale, bani publici, timp din viața tinerilor...",
  },
  {
    id: "proces",
    nr: 2,
    label: "Proces",
    icon: "⟳",
    color: C.proces,
    question: "Ce face sistemul cu ele?",
    explanation: "Procesul e motorul sistemului — ce se întâmplă efectiv cu intrările. Nu ce ar trebui să se întâmple, ci ce se întâmplă de fapt. Uită-te la rutinele, regulile și mecanismele reale, nu la cele scrise în documente oficiale.",
    hints: ["Care sunt activitățile zilnice / repetitive?", "Cum se iau deciziile în sistem?", "Ce reguli guvernează comportamentul?", "Ce se întâmplă când cineva greșește?"],
    placeholder: "Ex: Predare frontală, memorare, teste standardizate, notare, ierarhie profesor-elev...",
  },
  {
    id: "declarate",
    nr: 3,
    label: "Ieșiri declarate",
    icon: "◎",
    color: C.declarate,
    question: "Ce spune sistemul că produce?",
    explanation: "Ieșirile declarate sunt promisiunile oficiale ale sistemului — ce scrie în misiune, în discursuri, pe site-ul oficial. Sunt obiectivele nobile pe care sistemul le afișează public. Nu sunt neapărat false — dar nu sunt mereu ceea ce se întâmplă de fapt.",
    hints: ["Ce promite oficial sistemul?", "Care e misiunea declarată?", "Ce spun cei care conduc sistemul că produce?", "Ce beneficii sunt promise celor din interior?"],
    placeholder: "Ex: Gândire critică, cetățeni educați, pregătire pentru viață, dezvoltare personală...",
  },
  {
    id: "reale",
    nr: 4,
    label: "Ieșiri reale",
    icon: "◉",
    color: C.reale,
    question: "Ce produce sistemul de fapt?",
    explanation: "Ieșirile reale sunt ce observi efectiv la oamenii care trec prin sistem. Nu judecăți — doar observații. Ce abilități, comportamente, atitudini sau rezultate concrete apar în mod constant? Uneori ieșirile reale sunt bune, uneori diferă dramatic de cele declarate.",
    hints: ["Ce abilități au oamenii care ies din sistem?", "Ce comportamente repetitive produce?", "Ce se pierde sau se deteriorează în proces?", "Ce rezultate apar constant, indiferent de individ?"],
    placeholder: "Ex: Abilitate de memorare pe termen scurt, conformism, anxietate de evaluare, lipsă de curiozitate...",
  },
];

function useWindowSize() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const fn = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return size;
}

export default function DisectiaSistemului() {
  const [values, setValues] = useState({ sistem: "", intrari: "", proces: "", declarate: "", reale: "" });
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState("steps"); // steps | gap | result
  const [gap, setGap] = useState("");
  const { w } = useWindowSize();

  const current = STEPS[step];
  const allStepsDone = STEPS.every(s => values[s.id].trim() !== "");

  function next() {
    if (step < STEPS.length - 1) setStep(step + 1);
    else setPhase("gap");
  }

  function prev() {
    if (phase === "gap") { setPhase("steps"); return; }
    if (step > 0) setStep(step - 1);
  }

  const canAdvance = values[current?.id]?.trim() !== "";

  // Flow diagram positions
  const flowItems = [
    { id: "intrari", label: "Intrări", color: C.intrari, icon: "→" },
    { id: "proces", label: "Proces", color: C.proces, icon: "⟳" },
    { id: "declarate", label: "Declarate", color: C.declarate, icon: "◎" },
    { id: "reale", label: "Reale", color: C.reale, icon: "◉" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 20% 10%, #0D1F3C 0%, ${C.bgDeep} 55%)`,
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: C.text,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "28px 16px 60px",
    }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{
          fontSize: 10, letterSpacing: 5, color: C.accent,
          textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8,
        }}>Young Dragons Academy · Modul 1 · Lecția 2</div>
        <h1 style={{
          fontSize: "clamp(20px, 5vw, 30px)",
          fontWeight: 700, margin: 0,
          background: `linear-gradient(135deg, #fff 0%, ${C.accent} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          lineHeight: 1.3,
        }}>Disecția Sistemului</h1>
        <p style={{ fontSize: 12, color: C.muted, margin: "8px 0 0", fontStyle: "italic" }}>
          Orice sistem face un compromis. Găsește-l.
        </p>
      </div>

      {/* Flow diagram — always visible */}
      <div style={{
        display: "flex", alignItems: "center", gap: 0,
        marginBottom: 28, flexWrap: "nowrap",
        maxWidth: 480, width: "100%",
      }}>
        {/* Sistem bubble */}
        <div style={{
          fontSize: 10, color: values.sistem ? "#fff" : C.muted,
          background: values.sistem ? "#F8FAFC" : "transparent",
          border: `1px solid ${values.sistem ? "#CBD5E1" : C.panelBorder}`,
          borderRadius: 20, padding: "4px 10px",
          fontFamily: "monospace", whiteSpace: "nowrap",
          transition: "all 0.3s", flexShrink: 0,
        }}>
          {values.sistem ? values.sistem.slice(0, 12) + (values.sistem.length > 12 ? "…" : "") : "Sistemul"}
        </div>

        {flowItems.map((item, i) => {
          const filled = values[item.id].trim() !== "";
          const isActive = phase === "steps" && STEPS[step].id === item.id;
          return (
            <div key={item.id} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
              {/* Arrow */}
              <div style={{
                width: w < 400 ? 12 : 18, height: 1,
                background: filled ? item.color : C.panelBorder,
                transition: "background 0.4s",
              }} />
              {/* Node */}
              <div style={{
                width: w < 400 ? 36 : 48,
                height: w < 400 ? 36 : 48,
                borderRadius: "50%",
                border: `2px solid ${filled || isActive ? item.color : C.panelBorder}`,
                background: filled ? `${item.color}22` : isActive ? `${item.color}11` : "transparent",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                transition: "all 0.3s",
                boxShadow: isActive ? `0 0 16px ${item.color}55` : filled ? `0 0 8px ${item.color}33` : "none",
                cursor: "pointer",
              }} onClick={() => { setPhase("steps"); setStep(i + 1); }}>
                <div style={{ fontSize: w < 400 ? 10 : 12, color: filled || isActive ? item.color : C.muted }}>
                  {filled ? "✓" : item.icon}
                </div>
                <div style={{
                  fontSize: 7, color: filled ? item.color : C.muted,
                  fontFamily: "monospace", textAlign: "center",
                  letterSpacing: 0.5, lineHeight: 1.2,
                }}>
                  {item.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* STEPS PHASE */}
      {phase === "steps" && (
        <div style={{ width: "100%", maxWidth: 480 }}>

          {/* Step indicator */}
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "center", marginBottom: 16,
          }}>
            <div style={{
              fontSize: 10, letterSpacing: 3, color: current.color,
              textTransform: "uppercase", fontFamily: "monospace",
            }}>
              {current.icon} {current.label}
            </div>
            <div style={{ fontSize: 10, color: C.muted, fontFamily: "monospace" }}>
              {step + 1} / {STEPS.length}
            </div>
          </div>

          {/* Card */}
          <div style={{
            background: `linear-gradient(135deg, #F3F4F6 0%, #FFF7ED 100%)`,
            border: `1px solid ${current.color}44`,
            borderRadius: 20,
            padding: "24px 22px",
            boxShadow: `0 8px 24px rgba(15,23,42,0.08)`,
          }}>
            {/* Question */}
            <div style={{
              fontSize: 18, fontWeight: "700", color: "#fff",
              marginBottom: 14, lineHeight: 1.4,
            }}>
              {current.question}
            </div>

            {/* Explanation */}
            <div style={{
              fontSize: 13, color: "#94A3B8", lineHeight: 1.8,
              marginBottom: 16,
              padding: "12px 14px",
              background: "#F8FAFC",
              borderRadius: 10,
              borderLeft: `2px solid ${current.color}55`,
            }}>
              {current.explanation}
            </div>

            {/* Hints */}
            <div style={{ marginBottom: 16 }}>
              <div style={{
                fontSize: 9, letterSpacing: 2, color: C.muted,
                textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8,
              }}>Întrebări ajutătoare</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {current.hints.map((h, i) => (
                  <div key={i} style={{
                    fontSize: 11, color: "#94A3B8",
                    background: "rgba(15,23,42,0.03)",
                    border: "1px solid #F8FAFC",
                    borderRadius: 20, padding: "4px 10px",
                  }}>{h}</div>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <textarea
              autoFocus
              value={values[current.id]}
              onChange={e => setValues(v => ({ ...v, [current.id]: e.target.value }))}
              placeholder={current.placeholder}
              style={{
                width: "100%", minHeight: 100,
                background: "rgba(0,0,0,0.4)",
                border: `1px solid ${current.color}44`,
                borderRadius: 12,
                color: C.text, fontSize: 14,
                padding: "12px 14px",
                resize: "vertical",
                fontFamily: "Georgia, serif",
                outline: "none",
                boxSizing: "border-box",
                lineHeight: 1.7,
              }}
            />

            {/* Navigation */}
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              {step > 0 && (
                <button onClick={prev} style={{
                  background: "rgba(15,23,42,0.04)",
                  border: "1px solid #F8FAFC",
                  borderRadius: 10, color: C.muted,
                  fontSize: 13, padding: "10px 18px",
                  cursor: "pointer",
                }}>← Înapoi</button>
              )}
              <button
                onClick={next}
                disabled={!canAdvance}
                style={{
                  flex: 1,
                  background: canAdvance
                    ? `linear-gradient(135deg, ${current.color}, ${C.accent})`
                    : "#F8FAFC",
                  border: "none", borderRadius: 10,
                  color: canAdvance ? "#F3F4F6" : C.muted,
                  fontWeight: "bold", fontSize: 14,
                  padding: "11px 20px", cursor: canAdvance ? "pointer" : "default",
                  transition: "all 0.3s",
                  boxShadow: canAdvance ? `0 4px 20px ${current.color}44` : "none",
                }}>
                {step < STEPS.length - 1 ? "Continuă →" : "Vezi distanța →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GAP PHASE */}
      {phase === "gap" && (
        <div style={{ width: "100%", maxWidth: 480 }}>
          <div style={{
            background: `linear-gradient(135deg, #F3F4F6 0%, #FFF7ED 100%)`,
            border: `1px solid ${C.accent}55`,
            borderRadius: 20, padding: "24px 22px",
            boxShadow: `0 8px 24px rgba(15,23,42,0.08)`,
          }}>
            <div style={{
              fontSize: 10, letterSpacing: 3, color: C.accent,
              textTransform: "uppercase", fontFamily: "monospace", marginBottom: 16,
            }}>Pasul final — Distanța</div>

            {/* Side by side comparison */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              <div style={{
                padding: "12px 14px",
                background: `${C.declarate}11`,
                border: `1px solid ${C.declarate}33`,
                borderRadius: 12,
              }}>
                <div style={{
                  fontSize: 9, letterSpacing: 2, color: C.declarate,
                  textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6,
                }}>◎ Declară</div>
                <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.6 }}>
                  {values.declarate.slice(0, 120)}{values.declarate.length > 120 ? "…" : ""}
                </div>
              </div>
              <div style={{
                padding: "12px 14px",
                background: `${C.reale}11`,
                border: `1px solid ${C.reale}33`,
                borderRadius: 12,
              }}>
                <div style={{
                  fontSize: 9, letterSpacing: 2, color: C.reale,
                  textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6,
                }}>◉ Produce</div>
                <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.6 }}>
                  {values.reale.slice(0, 120)}{values.reale.length > 120 ? "…" : ""}
                </div>
              </div>
            </div>

            {/* Gap arrow visual */}
            <div style={{
              textAlign: "center", padding: "10px 0", marginBottom: 16,
              borderTop: "1px solid #F8FAFC", borderBottom: "1px solid #F8FAFC",
            }}>
              <div style={{
                fontSize: 11, color: C.muted, fontFamily: "monospace",
                letterSpacing: 2, textTransform: "uppercase",
              }}>↕ Distanța dintre ele este compromisul sistemului</div>
            </div>

            <div style={{
              fontSize: 15, fontWeight: "600", color: "#fff",
              marginBottom: 10,
            }}>Care crezi că e compromisul principal?</div>

            <div style={{
              fontSize: 13, color: "#94A3B8", lineHeight: 1.7,
              marginBottom: 14,
              padding: "12px 14px",
              background: "#F8FAFC",
              borderRadius: 10,
              borderLeft: `2px solid ${C.accent}55`,
            }}>
              Privește distanța dintre ce declară și ce produce. Nu e o acuzație — e o constrângere de design. Orice sistem sacrifică ceva pentru a putea funcționa la scară. Care e sacrificiul acestui sistem? Și ce poți face tu diferit, știind asta?
            </div>

            <textarea
              autoFocus
              value={gap}
              onChange={e => setGap(e.target.value)}
              placeholder="Ex: Sistemul sacrifică înțelegerea profundă pentru eficiența evaluării. Știind asta, voi învăța separat să aplic, nu doar să reproduc..."
              style={{
                width: "100%", minHeight: 110,
                background: "rgba(0,0,0,0.4)",
                border: `1px solid ${C.accent}44`,
                borderRadius: 12,
                color: C.text, fontSize: 14,
                padding: "12px 14px", resize: "vertical",
                fontFamily: "Georgia, serif",
                outline: "none", boxSizing: "border-box",
                lineHeight: 1.7,
              }}
            />

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button onClick={prev} style={{
                background: "rgba(15,23,42,0.04)",
                border: "1px solid #F8FAFC",
                borderRadius: 10, color: C.muted,
                fontSize: 13, padding: "10px 18px", cursor: "pointer",
              }}>← Înapoi</button>
              <button
                onClick={() => setPhase("result")}
                disabled={!gap.trim()}
                style={{
                  flex: 1,
                  background: gap.trim()
                    ? `linear-gradient(135deg, ${C.accent}, #F97316)`
                    : "#F8FAFC",
                  border: "none", borderRadius: 10,
                  color: gap.trim() ? "#F3F4F6" : C.muted,
                  fontWeight: "bold", fontSize: 14,
                  padding: "11px 20px",
                  cursor: gap.trim() ? "pointer" : "default",
                  transition: "all 0.3s",
                  boxShadow: gap.trim() ? `0 4px 20px ${C.accent}44` : "none",
                }}>
                Vezi analiza completă →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESULT PHASE */}
      {phase === "result" && (
        <div style={{ width: "100%", maxWidth: 480 }}>
          <div style={{
            background: `linear-gradient(135deg, #F3F4F6 0%, #FFF7ED 100%)`,
            border: `1px solid ${C.accent}`,
            borderRadius: 20, padding: "28px 24px",
            boxShadow: `0 8px 24px rgba(15,23,42,0.08)`,
          }}>
            <div style={{
              fontSize: 10, letterSpacing: 4, color: C.accent,
              textTransform: "uppercase", fontFamily: "monospace", marginBottom: 20,
            }}>Disecția ta — {values.sistem}</div>

            {/* Flow summary */}
            {[
              { id: "intrari", label: "Intrări", color: C.intrari },
              { id: "proces", label: "Proces", color: C.proces },
            ].map(item => (
              <div key={item.id} style={{ marginBottom: 12 }}>
                <div style={{
                  fontSize: 9, letterSpacing: 2, color: item.color,
                  textTransform: "uppercase", fontFamily: "monospace", marginBottom: 4,
                }}>{item.label}</div>
                <div style={{
                  fontSize: 13, color: "#94A3B8", lineHeight: 1.6,
                  padding: "10px 12px",
                  background: "#F8FAFC",
                  borderRadius: 8,
                  borderLeft: `2px solid ${item.color}`,
                }}>{values[item.id]}</div>
              </div>
            ))}

            {/* The gap — center piece */}
            <div style={{
              margin: "20px 0",
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10,
            }}>
              {[
                { id: "declarate", label: "◎ Declară", color: C.declarate },
                { id: "reale", label: "◉ Produce", color: C.reale },
              ].map(item => (
                <div key={item.id} style={{
                  padding: "12px 14px",
                  background: `${item.color}11`,
                  border: `1px solid ${item.color}44`,
                  borderRadius: 12,
                }}>
                  <div style={{
                    fontSize: 9, letterSpacing: 2, color: item.color,
                    textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6,
                  }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.6 }}>
                    {values[item.id]}
                  </div>
                </div>
              ))}
            </div>

            {/* Compromise */}
            <div style={{
              padding: "18px 20px",
              background: `linear-gradient(135deg, rgba(245,158,11,0.12), rgba(249,115,22,0.08))`,
              border: `1px solid ${C.accent}55`,
              borderRadius: 14, marginBottom: 20,
            }}>
              <div style={{
                fontSize: 9, letterSpacing: 3, color: C.accent,
                textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8,
              }}>↕ Compromisul pe care l-ai găsit</div>
              <div style={{
                fontSize: 14, color: "#fff", fontStyle: "italic", lineHeight: 1.7,
              }}>"{gap}"</div>
            </div>

            {/* Closing insight */}
            <div style={{
              padding: "14px 16px",
              background: "rgba(59,130,246,0.06)",
              border: "1px solid rgba(59,130,246,0.2)",
              borderRadius: 10,
              fontSize: 13, color: "#94A3B8",
              fontStyle: "italic", lineHeight: 1.8,
            }}>
              Tocmai ai văzut un sistem cu ochii unui gânditor structural. Acum aplică același cadru pe orice altceva — un job, o relație, o organizație. Distanța dintre declarat și real este mereu acolo. Cei care o văd iau decizii mai bune.
            </div>

            <button onClick={() => {
              setValues({ sistem: "", intrari: "", proces: "", declarate: "", reale: "" });
              setGap(""); setStep(0); setPhase("steps");
            }} style={{
              marginTop: 20, width: "100%",
              background: "rgba(15,23,42,0.04)",
              border: "1px solid #F8FAFC",
              borderRadius: 10, color: C.muted,
              fontSize: 13, padding: "11px",
              cursor: "pointer",
            }}>← Disecă alt sistem</button>
          </div>
        </div>
      )}

      <div style={{
        marginTop: 40, fontSize: 9, color: "#F8FAFC",
        letterSpacing: 3, textTransform: "uppercase", fontFamily: "monospace",
      }}>
        Structural Intelligence · Modul 1 · Lecția 2
      </div>
    </div>
  );
}
