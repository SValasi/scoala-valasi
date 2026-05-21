"use client";
import { useState, useRef, useEffect } from "react";

const DRAGON_ORANGE = "#FF6B2B";
const DRAGON_DARK = "#F3F4F6";
const DRAGON_DEEP = "#EEF2F7";
const DRAGON_GOLD = "#FFB347";
const DRAGON_RED = "#DC2626";
const DRAGON_GRAY = "#E5E7EB";

const initialNodes = {
  center: {
    id: "center",
    label: "Evenimentul",
    sublabel: "Ce nu a ieșit?",
    question: "Descrie pe scurt ce s-a întâmplat",
    explanation: "Fii specific. Nu 'a mers prost' ci exact ce eveniment analizezi. Cu cât ești mai precis, cu atât harta va fi mai utilă.",
    hints: ["Ex: Am picat interviul la compania X", "Ex: Prezentarea mea n-a convins echipa", "Ex: Nu am finalizat proiectul la timp"],
    placeholder: "Ex: Am picat interviul la compania X...",
    x: 50,
    y: 50,
    editable: true,
    value: "",
  },
  resurse: {
    id: "resurse",
    label: "Resurse",
    sublabel: "timp · energie · info · relații",
    question: "Ce aveam la dispoziție?",
    explanation: "Resursele sunt tot ce puteai folosi în acel moment. Nu doar bani sau timp — ci și energie mentală, informații pe care le dețineai, oameni care te puteau ajuta. Gândește-te la ce era disponibil, nu la ce ai folosit efectiv. Uneori resursele există dar nu le vedem.",
    hints: ["Aveam timp suficient?", "Eram odihnit și concentrat?", "Știam tot ce trebuia să știu?", "Aveam pe cineva care mă putea ghida?"],
    placeholder: "Ex: Aveam 3 zile de pregătire, energie bună, dar informații incomplete despre companie...",
    x: 20,
    y: 18,
    color: "#4ECDC4",
    editable: true,
    value: "",
  },
  lipsa: {
    id: "lipsa",
    label: "Ce lipsea",
    sublabel: "forța absentă",
    question: "Ce forță n-a fost acolo?",
    explanation: "Asta e adesea cel mai greu de văzut — pentru că ce lipsește e invizibil. Nu te gândi la greșeli, ci la ce element, dacă era prezent, schimba totul. Poate era o abilitate, o informație, o conexiune, un plan mai clar, sau pur și simplu curajul de a face un pas diferit.",
    hints: ["Ce abilitate îmi lipsea?", "Ce informație nu o aveam?", "Ce relație sau sprijin îmi lipsea?", "Ce claritate sau plan îmi lipsea?"],
    placeholder: "Ex: Nu știam că recrutorul caută leadership, nu competențe tehnice...",
    x: 78,
    y: 18,
    color: DRAGON_RED,
    editable: true,
    value: "",
  },
  presiuni: {
    id: "presiuni",
    label: "Presiuni externe",
    sublabel: "deadline · așteptări · context",
    question: "Ce venea din exterior?",
    explanation: "Nicio situație nu există în vid. Presiunile externe sunt forțele din jur care au influențat cum ai gândit și acționat — chiar dacă nu le-ai conștientizat atunci. Pot fi așteptări ale altora, un context nefavorabil, un deadline strâns, sau o atmosferă care te-a blocat. Identificarea lor nu înseamnă să dai vina pe exterior — înseamnă să înțelegi câmpul de forțe în care ai acționat.",
    hints: ["Eram sub presiunea timpului?", "Cineva se aștepta la ceva anume de la mine?", "Contextul (locul, atmosfera) m-a influențat?", "Existau factori externi pe care nu îi controlam?"],
    placeholder: "Ex: Interviul era programat imediat după un alt examen, eram obosit și sub presiune...",
    x: 20,
    y: 80,
    color: DRAGON_GOLD,
    editable: true,
    value: "",
  },
  pivot: {
    id: "pivot",
    label: "Momentul pivot",
    sublabel: "decizia cheie",
    question: "Care a fost momentul care a schimbat totul?",
    explanation: "În orice eveniment există un moment cheie — o decizie, o reacție, o alegere — după care traiectoria s-a schimbat definitiv. Nu neapărat cel mai dramatic moment, ci cel mai structural. Dacă ai fi ales altfel acolo, restul ar fi arătat diferit. Uneori e o decizie conștientă, alteori e o non-decizie — momentul în care nu ai acționat când trebuia.",
    hints: ["Când am simțit că ceva s-a schimbat?", "Ce decizie, dacă era diferită, schimba totul?", "A existat un moment în care am renunțat sau am ezitat?", "Când am ales calea greșită fără să îmi dau seama?"],
    placeholder: "Ex: Când am fost întrebat despre experiența de lider și am răspuns vag în loc să dau un exemplu concret...",
    x: 78,
    y: 80,
    color: DRAGON_ORANGE,
    editable: true,
    value: "",
  },
};

function useWindowSize() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const fn = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return size;
}

export default function HartaFortelor() {
  const [nodes, setNodes] = useState(initialNodes);
  const [active, setActive] = useState(null);
  const [intervention, setIntervention] = useState("");
  const [phase, setPhase] = useState("map"); // map | result
  const svgRef = useRef(null);
  const { w, h } = useWindowSize();

  const svgW = Math.min(w - 32, 700);
  const svgH = Math.min(h * 0.55, 420);

  const px = (pct) => (pct / 100) * svgW;
  const py = (pct) => (pct / 100) * svgH;

  const centerX = px(nodes.center.x);
  const centerY = py(nodes.center.y);

  const satelliteIds = ["resurse", "lipsa", "presiuni", "pivot"];

  const allFilled = satelliteIds.every((id) => nodes[id].value.trim() !== "") &&
    nodes.center.value.trim() !== "";

  function updateValue(id, val) {
    setNodes((prev) => ({ ...prev, [id]: { ...prev[id], value: val } }));
  }

  const activeNode = active ? nodes[active] : null;

  return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 30% 20%, #1e0a3c 0%, ${DRAGON_DEEP} 60%)`,
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#E8E0FF",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "24px 16px 40px",
    }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div style={{
          fontSize: 11,
          letterSpacing: 4,
          color: DRAGON_ORANGE,
          textTransform: "uppercase",
          marginBottom: 6,
          fontFamily: "monospace",
        }}>Young Dragons Academy</div>
        <h1 style={{
          fontSize: "clamp(22px, 5vw, 34px)",
          fontWeight: 700,
          margin: 0,
          background: `linear-gradient(135deg, #fff 0%, ${DRAGON_GOLD} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          lineHeight: 1.2,
        }}>Harta Forțelor</h1>
        <p style={{ fontSize: 13, color: "#9990CC", margin: "6px 0 0", fontStyle: "italic" }}>
          Structural Intelligence · Lecția 1
        </p>
      </div>

      {phase === "map" && (
        <>
          {/* SVG Mind Map */}
          <svg
            ref={svgRef}
            width={svgW}
            height={svgH}
            style={{ display: "block", margin: "16px auto 0", overflow: "visible" }}
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="glow-strong">
                <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              {satelliteIds.map((id) => (
                <marker key={id} id={`arrow-${id}`} markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                  <circle cx="4" cy="4" r="2.5" fill={nodes[id].color} opacity="0.7" />
                </marker>
              ))}
            </defs>

            {/* Connection lines */}
            {satelliteIds.map((id) => {
              const n = nodes[id];
              const sx = px(n.x);
              const sy = py(n.y);
              const filled = n.value.trim() !== "";
              return (
                <line
                  key={id}
                  x1={centerX} y1={centerY}
                  x2={sx} y2={sy}
                  stroke={filled ? n.color : "#3A3A6A"}
                  strokeWidth={filled ? 2 : 1}
                  strokeDasharray={filled ? "none" : "5,4"}
                  opacity={filled ? 0.7 : 0.4}
                  style={{ transition: "all 0.4s" }}
                  markerEnd={filled ? `url(#arrow-${id})` : undefined}
                />
              );
            })}

            {/* Center node */}
            <g
              style={{ cursor: "pointer" }}
              onClick={() => setActive(active === "center" ? null : "center")}
            >
              <circle cx={centerX} cy={centerY} r={svgW < 400 ? 38 : 48}
                fill={DRAGON_GRAY} stroke={DRAGON_ORANGE}
                strokeWidth={active === "center" ? 3 : 1.5}
                filter="url(#glow)"
              />
              {nodes.center.value ? (
                <>
                  <text x={centerX} y={centerY - 6} textAnchor="middle"
                    fill="#fff" fontSize={svgW < 400 ? 9 : 11} fontWeight="bold">
                    {nodes.center.value.length > 18
                      ? nodes.center.value.slice(0, 18) + "…"
                      : nodes.center.value}
                  </text>
                  <text x={centerX} y={centerY + 10} textAnchor="middle"
                    fill={DRAGON_ORANGE} fontSize={9}>✓ eveniment</text>
                </>
              ) : (
                <>
                  <text x={centerX} y={centerY - 4} textAnchor="middle"
                    fill="#C0BAFF" fontSize={svgW < 400 ? 10 : 12} fontWeight="bold">
                    {nodes.center.label}
                  </text>
                  <text x={centerX} y={centerY + 12} textAnchor="middle"
                    fill="#7070AA" fontSize={9} fontStyle="italic">
                    atinge pentru a edita
                  </text>
                </>
              )}
            </g>

            {/* Satellite nodes */}
            {satelliteIds.map((id) => {
              const n = nodes[id];
              const sx = px(n.x);
              const sy = py(n.y);
              const r = svgW < 400 ? 34 : 42;
              const filled = n.value.trim() !== "";
              const isActive = active === id;
              return (
                <g key={id} style={{ cursor: "pointer" }}
                  onClick={() => setActive(isActive ? null : id)}>
                  <circle cx={sx} cy={sy} r={r}
                    fill={DRAGON_GRAY}
                    stroke={n.color}
                    strokeWidth={isActive ? 3 : filled ? 2 : 1}
                    opacity={filled ? 1 : 0.7}
                    filter={isActive ? "url(#glow-strong)" : filled ? "url(#glow)" : "none"}
                    style={{ transition: "all 0.3s" }}
                  />
                  {filled ? (
                    <>
                      <text x={sx} y={sy - 5} textAnchor="middle"
                        fill={n.color} fontSize={svgW < 400 ? 8 : 10} fontWeight="bold">
                        {n.label}
                      </text>
                      <text x={sx} y={sy + 9} textAnchor="middle"
                        fill="#ccc" fontSize={svgW < 400 ? 7.5 : 9}>
                        {n.value.length > 14 ? n.value.slice(0, 14) + "…" : n.value}
                      </text>
                    </>
                  ) : (
                    <>
                      <text x={sx} y={sy - 4} textAnchor="middle"
                        fill={n.color} fontSize={svgW < 400 ? 9 : 11} fontWeight="600">
                        {n.label}
                      </text>
                      <text x={sx} y={sy + 10} textAnchor="middle"
                        fill="#666699" fontSize={8} fontStyle="italic">
                        atinge
                      </text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Edit panel */}
          {activeNode && (
            <div style={{
              width: "100%", maxWidth: 480,
              background: `linear-gradient(160deg, ${DRAGON_GRAY} 0%, #1E1E3E 100%)`,
              border: `1px solid ${activeNode.color || DRAGON_ORANGE}`,
              borderRadius: 20,
              padding: "22px 22px 18px",
              marginTop: 16,
              boxShadow: `0 8px 24px rgba(15,23,42,0.08)`,
              transition: "all 0.3s",
            }}>
              {/* Node title */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10, marginBottom: 14,
              }}>
                <div style={{
                  width: 10, height: 10, borderRadius: "50%",
                  background: activeNode.color || DRAGON_ORANGE,
                  boxShadow: `0 8px 24px rgba(15,23,42,0.08)`,
                  flexShrink: 0,
                }} />
                <div style={{
                  fontSize: 12, letterSpacing: 2, textTransform: "uppercase",
                  color: activeNode.color || DRAGON_ORANGE, fontFamily: "monospace", fontWeight: "bold",
                }}>
                  {activeNode.label}
                </div>
              </div>

              {/* Main question */}
              <div style={{
                fontSize: 16, color: "#fff", fontWeight: "600",
                marginBottom: 10, lineHeight: 1.4,
              }}>
                {activeNode.question}
              </div>

              {/* Explanation */}
              <div style={{
                fontSize: 13, color: "#A09ACC", lineHeight: 1.7,
                marginBottom: 14,
                padding: "12px 14px",
                background: "#F8FAFC",
                borderRadius: 10,
                borderLeft: `2px solid ${activeNode.color || DRAGON_ORANGE}55`,
              }}>
                {activeNode.explanation}
              </div>

              {/* Hints */}
              {activeNode.hints && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{
                    fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
                    color: "#666699", fontFamily: "monospace", marginBottom: 8,
                  }}>Întrebări ajutătoare</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {activeNode.hints.map((hint, i) => (
                      <div key={i} style={{
                        fontSize: 11, color: "#9990CC",
                        background: "rgba(15,23,42,0.04)",
                        border: "1px solid #3A3A6A",
                        borderRadius: 20,
                        padding: "4px 10px",
                        cursor: "default",
                      }}>
                        {hint}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Textarea */}
              <textarea
                autoFocus
                value={activeNode.value}
                onChange={(e) => updateValue(active, e.target.value)}
                placeholder={activeNode.placeholder || "Scrie răspunsul tău aici..."}
                style={{
                  width: "100%", minHeight: 90,
                  background: "rgba(0,0,0,0.35)",
                  border: `1px solid ${activeNode.color || DRAGON_ORANGE}55`,
                  borderRadius: 10,
                  color: "#E8E0FF",
                  fontSize: 14,
                  padding: "12px 14px",
                  resize: "vertical",
                  fontFamily: "Georgia, serif",
                  outline: "none",
                  boxSizing: "border-box",
                  lineHeight: 1.6,
                }}
              />

              <button
                onClick={() => setActive(null)}
                style={{
                  marginTop: 12,
                  background: `linear-gradient(135deg, ${activeNode.color || DRAGON_ORANGE}, ${DRAGON_GOLD})`,
                  border: "none", borderRadius: 10,
                  color: DRAGON_DARK, fontWeight: "bold",
                  fontSize: 13, padding: "10px 24px",
                  cursor: "pointer",
                  boxShadow: `0 4px 16px ${activeNode.color || DRAGON_ORANGE}44`,
                }}>
                Salvează ✓
              </button>
            </div>
          )}

          {/* Progress */}
          <div style={{
            display: "flex", gap: 8, marginTop: 20, alignItems: "center",
          }}>
            {["center", ...satelliteIds].map((id) => (
              <div key={id} style={{
                width: 10, height: 10, borderRadius: "50%",
                background: nodes[id].value.trim()
                  ? (nodes[id].color || DRAGON_ORANGE)
                  : "#3A3A6A",
                transition: "background 0.3s",
              }} />
            ))}
            <span style={{ fontSize: 11, color: "#666699", marginLeft: 4 }}>
              {["center", ...satelliteIds].filter((id) => nodes[id].value.trim()).length}/5 completate
            </span>
          </div>

          {/* Step 3 */}
          {allFilled && (
            <div style={{
              width: "100%", maxWidth: 480,
              background: `linear-gradient(135deg, #F3F4F6 0%, #FFF7ED 100%)`,
              border: `1px solid ${DRAGON_ORANGE}`,
              borderRadius: 16,
              padding: "18px 20px",
              marginTop: 20,
              boxShadow: `0 8px 24px rgba(15,23,42,0.08)`,
            }}>
              <div style={{
                fontSize: 11, letterSpacing: 3, textTransform: "uppercase",
                color: DRAGON_ORANGE, marginBottom: 6, fontFamily: "monospace",
              }}>Pasul 3 — Punctul de intervenție</div>
              <p style={{ fontSize: 13, color: "#9990CC", margin: "0 0 12px", fontStyle: "italic" }}>
                Privește harta. Care element, dacă era diferit, schimba tot rezultatul?
                Completează concluzia:
              </p>
              <textarea
                value={intervention}
                onChange={(e) => setIntervention(e.target.value)}
                placeholder='Data viitoare, intervin la [punct structural] prin [acțiune concretă]...'
                style={{
                  width: "100%", minHeight: 70,
                  background: "rgba(0,0,0,0.4)",
                  border: `1px solid ${DRAGON_ORANGE}55`,
                  borderRadius: 10,
                  color: "#E8E0FF",
                  fontSize: 14,
                  padding: "10px 12px",
                  resize: "vertical",
                  fontFamily: "Georgia, serif",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              {intervention.trim() && (
                <button
                  onClick={() => setPhase("result")}
                  style={{
                    marginTop: 12,
                    background: `linear-gradient(135deg, ${DRAGON_ORANGE}, ${DRAGON_GOLD})`,
                    border: "none", borderRadius: 10,
                    color: DRAGON_DARK, fontWeight: "bold",
                    fontSize: 14, padding: "10px 28px",
                    cursor: "pointer",
                    boxShadow: `0 4px 20px ${DRAGON_ORANGE}55`,
                  }}>
                  Vezi analiza →
                </button>
              )}
            </div>
          )}
        </>
      )}

      {phase === "result" && (
        <div style={{
          width: "100%", maxWidth: 480, marginTop: 20,
        }}>
          <div style={{
            background: `linear-gradient(135deg, ${DRAGON_GRAY}, #1E1E3E)`,
            borderRadius: 20,
            padding: "28px 24px",
            border: `1px solid ${DRAGON_ORANGE}`,
            boxShadow: `0 8px 24px rgba(15,23,42,0.08)`,
          }}>
            <div style={{
              fontSize: 11, letterSpacing: 4, color: DRAGON_ORANGE,
              textTransform: "uppercase", fontFamily: "monospace", marginBottom: 16,
            }}>Analiza ta structurală</div>

            <div style={{
              fontSize: 15, fontWeight: "bold", color: "#fff",
              marginBottom: 20, padding: "12px 16px",
              background: "rgba(255,107,43,0.1)",
              borderRadius: 10, borderLeft: `3px solid ${DRAGON_ORANGE}`,
            }}>
              "{nodes.center.value}"
            </div>

            {satelliteIds.map((id) => (
              <div key={id} style={{ marginBottom: 14 }}>
                <div style={{
                  fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
                  color: nodes[id].color, fontFamily: "monospace", marginBottom: 4,
                }}>{nodes[id].label}</div>
                <div style={{
                  fontSize: 13, color: "#C0BAFF",
                  padding: "8px 12px",
                  background: "#F8FAFC",
                  borderRadius: 8,
                  borderLeft: `2px solid ${nodes[id].color}`,
                }}>{nodes[id].value}</div>
              </div>
            ))}

            <div style={{
              marginTop: 24, padding: "16px 18px",
              background: `linear-gradient(135deg, rgba(255,107,43,0.15), rgba(255,179,71,0.1))`,
              borderRadius: 12,
              border: `1px solid ${DRAGON_GOLD}55`,
            }}>
              <div style={{
                fontSize: 10, letterSpacing: 3, color: DRAGON_GOLD,
                textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8,
              }}>Punctul tău de intervenție</div>
              <div style={{ fontSize: 14, color: "#fff", fontStyle: "italic", lineHeight: 1.6 }}>
                "{intervention}"
              </div>
            </div>

            <div style={{
              marginTop: 20, padding: "14px 16px",
              background: "rgba(78,205,196,0.08)",
              borderRadius: 10,
              border: "1px solid #4ECDC433",
              fontSize: 12, color: "#9990CC", fontStyle: "italic", lineHeight: 1.7,
            }}>
              Felicitări. Tocmai ai folosit Inteligența Structurală. Nu ai căutat un vinovat —
              ai găsit mecanismul. Asta e diferența.
            </div>

            <button
              onClick={() => {
                setNodes(initialNodes);
                setIntervention("");
                setPhase("map");
                setActive(null);
              }}
              style={{
                marginTop: 20, width: "100%",
                background: "rgba(15,23,42,0.05)",
                border: "1px solid #3A3A6A",
                borderRadius: 10, color: "#9990CC",
                fontSize: 13, padding: "10px",
                cursor: "pointer",
              }}>
              ← Analizează alt eveniment
            </button>
          </div>
        </div>
      )}

      <div style={{
        marginTop: 32, fontSize: 10, color: "#3A3A6A",
        letterSpacing: 2, textTransform: "uppercase", fontFamily: "monospace",
      }}>
        Structural Intelligence · Modul 1 · Lecția 1
      </div>
    </div>
  );
}
