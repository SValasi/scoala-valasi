"use client";

import { useState, useEffect } from "react";

const C = {
  bg: "#F3F4F6",
  bgDeep: "#EEF2F7",
  panel: "#FFFFFF",
  panelAlt: "#F8FAFC",
  border: "#E5E7EB",
  text: "#111827",
  muted: "#475569",
  obs: "#2563EB",
  judecata: "#DC2626",
  consecvent: "#7C3AED",
  contextual: "#16A34A",
  gold: "#FFB347",
  accent: "#FF6B2B",
};

const EXAMPLES = [
  {
    situatie: "Colegul tău a întârziat 20 de minute la o întâlnire importantă.",
    observatie: "A întârziat 20 de minute. Nu a trimis un mesaj înainte.",
    judecati: ["Nu îi pasă de mine.", "E iresponsabil.", "Mă desconsideră."],
    intrebari: ["A mai întârziat și la alte întâlniri, cu alți oameni?", "Ce se întâmpla în ziua respectivă în viața lui?"],
  },
  {
    situatie: "Prietena ta nu a răspuns la mesajele tale timp de o zi.",
    observatie: "Nu a răspuns la 2 mesaje în 24 de ore.",
    judecati: ["Mă evită.", "S-a supărat pe mine.", "Nu mai sunt important pentru ea."],
    intrebari: ["Răspunde în general rapid sau nu?", "Avea ceva dificil în ziua respectivă?"],
  },
  {
    situatie: "Șeful tău a fost scurt și distant în ședință.",
    observatie: "A vorbit puțin, nu a făcut contact vizual, a terminat ședința devreme.",
    judecati: ["E nemulțumit de munca mea.", "Urmează să fiu concediat.", "Nu mă place."],
    intrebari: ["Se comportă la fel cu toată echipa sau doar cu tine?", "Ai observat că e așa și în alte zile stresante?"],
  },
];

const CONTEXTS = [
  { id: "stres", label: "Sub stres", emoji: "😤", desc: "Se comportă diferit când e sub presiune?" },
  { id: "oboseala", label: "Când e obosit", emoji: "😴", desc: "Comportamentul se schimbă după un program greu?" },
  { id: "public", label: "În public vs. privat", emoji: "👥", desc: "E diferit când sunt alții față de când sunteți doar voi?" },
  { id: "toti", label: "Cu toată lumea", emoji: "🌐", desc: "Se comportă la fel cu toți sau doar cu tine?" },
  { id: "mereu", label: "De fiecare dată", emoji: "🔄", desc: "Apare indiferent de context și moment?" },
];

function ExampleCard({ ex, index }) {
  const [revealed, setRevealed] = useState(false);
  const [step, setStep] = useState(0);

  return (
    <div style={{
      background: C.panel, border: `1px solid ${C.border}`,
      borderRadius: 18, padding: "22px 22px",
      marginBottom: 14,
      transition: "all 0.3s",
    }}>
      <div style={{
        fontSize: 9, letterSpacing: 3, color: C.muted,
        textTransform: "uppercase", fontFamily: "monospace", marginBottom: 10,
      }}>Exemplul {index + 1}</div>

      <div style={{
        fontSize: 14, color: C.text, lineHeight: 1.7,
        marginBottom: 16, padding: "12px 14px",
        background: "#FFFFFF",
        borderRadius: 10,
        borderLeft: `3px solid ${C.border}`,
        fontStyle: "italic",
      }}>
        "{ex.situatie}"
      </div>

      {!revealed ? (
        <button onClick={() => setRevealed(true)} style={{
          width: "100%", background: "rgba(59,130,246,0.08)",
          border: `1px solid ${C.obs}33`, borderRadius: 12,
          color: C.obs, fontSize: 13, padding: "12px",
          cursor: "pointer", fontFamily: "'DM Sans', system-ui, sans-serif",
        }}>
          Ce observă mintea? →
        </button>
      ) : (
        <div style={{ animation: "fadeUp 0.3s ease" }}>

          {/* Step 1 — Observation */}
          <div style={{ marginBottom: 14 }}>
            <div style={{
              fontSize: 9, letterSpacing: 2, color: C.obs,
              textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8,
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.obs }} />
              Ce s-a întâmplat de fapt — observația pură
            </div>
            <div style={{
              fontSize: 13, color: "#90A0CC", lineHeight: 1.7,
              padding: "10px 14px",
              background: `${C.obs}0A`,
              border: `1px solid ${C.obs}22`,
              borderRadius: 10,
            }}>
              {ex.observatie}
            </div>
          </div>

          {/* Step 2 — Judgments */}
          <div style={{ marginBottom: 14 }}>
            <div style={{
              fontSize: 9, letterSpacing: 2, color: C.judecata,
              textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8,
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.judecata }} />
              Ce adaugă mintea automat — interpretările
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {ex.judecati.map((j, i) => (
                <div key={i} style={{
                  fontSize: 13, color: "#C08080", lineHeight: 1.6,
                  padding: "8px 14px",
                  background: `${C.judecata}08`,
                  border: `1px solid ${C.judecata}22`,
                  borderRadius: 8,
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span style={{ color: C.judecata, fontSize: 10 }}>→</span>
                  {j}
                </div>
              ))}
            </div>
            <div style={{
              fontSize: 11, color: C.muted, fontStyle: "italic",
              marginTop: 8, lineHeight: 1.6,
            }}>
              Niciuna din interpretările de mai sus nu se găsește în observație. Toate sunt adăugate de minte în fracțiuni de secundă.
            </div>
          </div>

          {/* Step 3 — Questions */}
          <div style={{
            background: `${C.contextual}0A`,
            border: `1px solid ${C.contextual}22`,
            borderRadius: 12, padding: "14px 16px",
          }}>
            <div style={{
              fontSize: 9, letterSpacing: 2, color: C.contextual,
              textTransform: "uppercase", fontFamily: "monospace", marginBottom: 10,
            }}>
              Întrebările care schimbă imaginea
            </div>
            {ex.intrebari.map((q, i) => (
              <div key={i} style={{
                fontSize: 13, color: "#70AA88", lineHeight: 1.6,
                marginBottom: i < ex.intrebari.length - 1 ? 8 : 0,
                display: "flex", gap: 8,
              }}>
                <span style={{ color: C.contextual, flexShrink: 0 }}>?</span>
                {q}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MyObservation() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    persoana: "",
    situatie: "",
    observatie: "",
    interpretare: "",
    alta_interpretare: "",
    contexte: [],
    concluzie: "",
  });
  const [result, setResult] = useState(null);

  const canNext0 = form.persoana.trim() && form.situatie.trim();
  const canNext1 = form.observatie.trim() && form.interpretare.trim();
  const canNext2 = form.alta_interpretare.trim();
  const canFinish = form.contexte.length > 0 && form.concluzie.trim();

  function toggleContext(id) {
    setForm(f => ({
      ...f,
      contexte: f.contexte.includes(id)
        ? f.contexte.filter(c => c !== id)
        : [...f.contexte, id],
    }));
  }

  function finish() {
    const isConsecvent = form.contexte.includes("toti") || form.contexte.includes("mereu");
    const isContextual = form.contexte.includes("stres") || form.contexte.includes("oboseala") || form.contexte.includes("public");
    setResult({
      tip: isConsecvent && !isContextual ? "consecvent"
        : isContextual && !isConsecvent ? "contextual"
        : "mixt",
    });
  }

  if (result) return (
    <div style={{
      background: C.panel, border: `1px solid ${result.tip === "consecvent" ? C.consecvent : result.tip === "contextual" ? C.contextual : C.gold}44`,
      borderRadius: 18, padding: "24px 22px",
      boxShadow: `0 0 30px ${result.tip === "consecvent" ? C.consecvent : result.tip === "contextual" ? C.contextual : C.gold}11`,
      animation: "fadeUp 0.4s ease",
    }}>
      <div style={{ fontSize: 10, letterSpacing: 3, color: C.muted, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 16 }}>
        Analiza ta
      </div>

      <div style={{
        fontSize: 28, marginBottom: 12, textAlign: "center",
      }}>
        {result.tip === "consecvent" ? "🔄" : result.tip === "contextual" ? "🌊" : "⚖️"}
      </div>

      <div style={{
        fontSize: 16, fontWeight: "700", color: "#fff",
        textAlign: "center", marginBottom: 12,
      }}>
        {result.tip === "consecvent"
          ? "Probabil un tipar al persoanei"
          : result.tip === "contextual"
            ? "Probabil un răspuns la context"
            : "Mixt — mai greu de categorisit"}
      </div>

      <div style={{
        fontSize: 13, color: "#475569", lineHeight: 1.8,
        marginBottom: 20, textAlign: "center",
      }}>
        {result.tip === "consecvent"
          ? "Comportamentul apare indiferent de context și cu mai mulți oameni. Acesta e probabil un tipar al persoanei, nu o reacție la tine personal."
          : result.tip === "contextual"
            ? "Comportamentul apare în anumite condiții — stres, oboseală, context social. Nu ești cauza — ești martorul unui răspuns la o presiune externă."
            : "Comportamentul are elemente din ambele. Merită observat mai mult înainte de o concluzie."}
      </div>

      {/* Summary */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Observația", value: form.observatie, color: C.obs },
          { label: "Prima interpretare", value: form.interpretare, color: C.judecata },
          { label: "Interpretare alternativă", value: form.alta_interpretare, color: C.contextual },
          { label: "Concluzia ta", value: form.concluzie, color: C.gold },
        ].map(item => (
          <div key={item.label}>
            <div style={{ fontSize: 9, letterSpacing: 2, color: item.color, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontSize: 12, color: "#475569", padding: "8px 12px", background: `${item.color}08`, borderRadius: 8, borderLeft: `2px solid ${item.color}33`, lineHeight: 1.6 }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{
        padding: "14px 16px",
        background: "#FFFFFF",
        borderRadius: 12, fontSize: 12,
        color: C.muted, fontStyle: "italic", lineHeight: 1.8,
      }}>
        Gândirea interpersonală matură nu înseamnă să scuzi pe toată lumea. Înseamnă să nu confunzi o observație cu un adevăr absolut — înainte să ai mai multe date.
      </div>

      <button onClick={() => {
        setForm({ persoana: "", situatie: "", observatie: "", interpretare: "", alta_interpretare: "", contexte: [], concluzie: "" });
        setResult(null); setStep(0);
      }} style={{
        marginTop: 16, width: "100%",
        background: "#FFFFFF", border: `1px solid ${C.border}`,
        borderRadius: 10, color: C.muted, fontSize: 13,
        padding: "12px", cursor: "pointer",
      }}>← Analizează altă situație</button>
    </div>
  );

  return (
    <div style={{
      background: C.panel, border: `1px solid ${C.border}`,
      borderRadius: 18, padding: "22px 22px",
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 20,
      }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: C.accent, textTransform: "uppercase", fontFamily: "monospace" }}>
          Situația ta
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              width: i <= step ? 20 : 7, height: 7, borderRadius: 4,
              background: i <= step ? C.accent : C.border,
              transition: "all 0.3s",
            }} />
          ))}
        </div>
      </div>

      {/* Step 0 — Person & situation */}
      {step === 0 && (
        <div style={{ animation: "fadeUp 0.3s ease" }}>
          <div style={{ fontSize: 16, fontWeight: "700", color: "#fff", marginBottom: 8 }}>
            Despre cine și ce situație?
          </div>
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, marginBottom: 16 }}>
            Alege un comportament al cuiva care te-a deranjat, confuzat sau te face să te întrebi ce se întâmplă.
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: C.muted, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6 }}>Persoana</div>
            <input
              autoFocus
              value={form.persoana}
              onChange={e => setForm(f => ({ ...f, persoana: e.target.value }))}
              placeholder="Ex: Colegul X, prietena mea, șeful..."
              style={{
                width: "100%", background: "#FFFFFF",
                border: `1px solid ${C.border}`, borderRadius: 10,
                color: C.text, fontSize: 13, padding: "10px 12px",
                fontFamily: "'DM Sans', system-ui, sans-serif", outline: "none", boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: C.muted, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6 }}>Ce s-a întâmplat?</div>
            <textarea
              value={form.situatie}
              onChange={e => setForm(f => ({ ...f, situatie: e.target.value }))}
              placeholder="Descrie situația concretă — fără interpretare deocamdată..."
              style={{
                width: "100%", minHeight: 80, background: "#FFFFFF",
                border: `1px solid ${C.border}`, borderRadius: 10,
                color: C.text, fontSize: 13, padding: "10px 12px",
                resize: "vertical", fontFamily: "'DM Sans', system-ui, sans-serif",
                outline: "none", boxSizing: "border-box", lineHeight: 1.6,
              }}
            />
          </div>

          <button onClick={() => setStep(1)} disabled={!canNext0} style={{
            width: "100%",
            background: canNext0 ? `linear-gradient(135deg, ${C.obs}, #60A5FA)` : C.border,
            border: "none", borderRadius: 10,
            color: canNext0 ? "#F3F4F6" : C.muted,
            fontWeight: "bold", fontSize: 14, padding: "12px",
            cursor: canNext0 ? "pointer" : "default", transition: "all 0.3s",
          }}>Continuă →</button>
        </div>
      )}

      {/* Step 1 — Observation vs interpretation */}
      {step === 1 && (
        <div style={{ animation: "fadeUp 0.3s ease" }}>
          <div style={{ fontSize: 16, fontWeight: "700", color: "#fff", marginBottom: 8 }}>
            Separă ce ai văzut de ce ai interpretat
          </div>
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, marginBottom: 16 }}>
            Observația e ce ai perceput cu simțurile. Interpretarea e ce a adăugat mintea automat.
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{
              fontSize: 10, letterSpacing: 2, color: C.obs,
              textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6,
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.obs }} />
              Ce ai văzut / auzit / observat — fapte pure
            </div>
            <textarea
              autoFocus
              value={form.observatie}
              onChange={e => setForm(f => ({ ...f, observatie: e.target.value }))}
              placeholder="Ex: A întârziat 20 de minute. Nu a trimis un mesaj."
              style={{
                width: "100%", minHeight: 70, background: `${C.obs}08`,
                border: `1px solid ${C.obs}33`, borderRadius: 10,
                color: C.text, fontSize: 13, padding: "10px 12px",
                resize: "vertical", fontFamily: "'DM Sans', system-ui, sans-serif",
                outline: "none", boxSizing: "border-box", lineHeight: 1.6,
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{
              fontSize: 10, letterSpacing: 2, color: C.judecata,
              textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6,
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.judecata }} />
              Ce a adăugat mintea automat — interpretarea ta
            </div>
            <textarea
              value={form.interpretare}
              onChange={e => setForm(f => ({ ...f, interpretare: e.target.value }))}
              placeholder="Ex: Nu îi pasă de mine. Mă desconsideră."
              style={{
                width: "100%", minHeight: 70, background: `${C.judecata}08`,
                border: `1px solid ${C.judecata}33`, borderRadius: 10,
                color: C.text, fontSize: 13, padding: "10px 12px",
                resize: "vertical", fontFamily: "'DM Sans', system-ui, sans-serif",
                outline: "none", boxSizing: "border-box", lineHeight: 1.6,
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setStep(0)} style={{
              background: "#FFFFFF", border: `1px solid ${C.border}`,
              borderRadius: 10, color: C.muted, fontSize: 13, padding: "10px 16px", cursor: "pointer",
            }}>←</button>
            <button onClick={() => setStep(2)} disabled={!canNext1} style={{
              flex: 1,
              background: canNext1 ? `linear-gradient(135deg, ${C.obs}, #60A5FA)` : C.border,
              border: "none", borderRadius: 10,
              color: canNext1 ? "#F3F4F6" : C.muted,
              fontWeight: "bold", fontSize: 14, padding: "12px",
              cursor: canNext1 ? "pointer" : "default", transition: "all 0.3s",
            }}>Continuă →</button>
          </div>
        </div>
      )}

      {/* Step 2 — Alternative interpretation */}
      {step === 2 && (
        <div style={{ animation: "fadeUp 0.3s ease" }}>
          <div style={{ fontSize: 16, fontWeight: "700", color: "#fff", marginBottom: 8 }}>
            Ce altă explicație ar putea exista?
          </div>
          <div style={{
            fontSize: 13, color: "#475569", lineHeight: 1.7, marginBottom: 16,
            padding: "12px 14px", background: "#FFFFFF",
            borderRadius: 10, borderLeft: `2px solid ${C.contextual}44`,
          }}>
            Prima interpretare vine automat. Aceasta e o practică de a forța mintea să caute o alternativă. Nu trebuie să o crezi — doar să o poți gândi.
          </div>

          <div style={{
            marginBottom: 12, padding: "10px 14px",
            background: `${C.judecata}08`, borderRadius: 10,
            border: `1px solid ${C.judecata}22`,
          }}>
            <div style={{ fontSize: 10, color: C.judecata, fontFamily: "monospace", marginBottom: 4 }}>Prima ta interpretare</div>
            <div style={{ fontSize: 13, color: "#C08080", fontStyle: "italic" }}>{form.interpretare}</div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{
              fontSize: 10, letterSpacing: 2, color: C.contextual,
              textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6,
            }}>O altă explicație posibilă</div>
            <textarea
              autoFocus
              value={form.alta_interpretare}
              onChange={e => setForm(f => ({ ...f, alta_interpretare: e.target.value }))}
              placeholder="Ex: Poate a avut o zi dificilă și a uitat. Poate e o problemă a lui de timp, nu o atitudine față de mine."
              style={{
                width: "100%", minHeight: 80, background: `${C.contextual}08`,
                border: `1px solid ${C.contextual}33`, borderRadius: 10,
                color: C.text, fontSize: 13, padding: "10px 12px",
                resize: "vertical", fontFamily: "'DM Sans', system-ui, sans-serif",
                outline: "none", boxSizing: "border-box", lineHeight: 1.6,
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setStep(1)} style={{
              background: "#FFFFFF", border: `1px solid ${C.border}`,
              borderRadius: 10, color: C.muted, fontSize: 13, padding: "10px 16px", cursor: "pointer",
            }}>←</button>
            <button onClick={() => setStep(3)} disabled={!canNext2} style={{
              flex: 1,
              background: canNext2 ? `linear-gradient(135deg, ${C.contextual}, #34D399)` : C.border,
              border: "none", borderRadius: 10,
              color: canNext2 ? "#F3F4F6" : C.muted,
              fontWeight: "bold", fontSize: 14, padding: "12px",
              cursor: canNext2 ? "pointer" : "default", transition: "all 0.3s",
            }}>Continuă →</button>
          </div>
        </div>
      )}

      {/* Step 3 — Consistent vs contextual */}
      {step === 3 && (
        <div style={{ animation: "fadeUp 0.3s ease" }}>
          <div style={{ fontSize: 16, fontWeight: "700", color: "#fff", marginBottom: 8 }}>
            Consecvent sau contextual?
          </div>
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, marginBottom: 16 }}>
            Bifează ce se potrivește pentru comportamentul observat. Asta te ajută să înțelegi dacă e un tipar al persoanei sau un răspuns la o situație.
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {CONTEXTS.map(ctx => {
              const selected = form.contexte.includes(ctx.id);
              return (
                <div
                  key={ctx.id}
                  onClick={() => toggleContext(ctx.id)}
                  style={{
                    display: "flex", gap: 12, alignItems: "center",
                    padding: "12px 16px",
                    background: selected ? `${C.consecvent}10` : "#FFFFFF",
                    border: `1px solid ${selected ? C.consecvent : C.border}`,
                    borderRadius: 12, cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: 20, flexShrink: 0 }}>{ctx.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: "600", color: selected ? "#fff" : C.text, marginBottom: 2 }}>{ctx.label}</div>
                    <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{ctx.desc}</div>
                  </div>
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                    background: selected ? C.consecvent : "transparent",
                    border: `2px solid ${selected ? C.consecvent : C.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s",
                  }}>
                    {selected && <div style={{ fontSize: 10, color: "#fff" }}>✓</div>}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: C.gold, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6 }}>
              Concluzia ta provizorie
            </div>
            <textarea
              value={form.concluzie}
              onChange={e => setForm(f => ({ ...f, concluzie: e.target.value }))}
              placeholder="Ex: Cred că e mai degrabă o reacție la stres, nu ceva îndreptat spre mine. Voi mai observa înainte să trag o concluzie."
              style={{
                width: "100%", minHeight: 80, background: `${C.gold}08`,
                border: `1px solid ${C.gold}33`, borderRadius: 10,
                color: C.text, fontSize: 13, padding: "10px 12px",
                resize: "vertical", fontFamily: "'DM Sans', system-ui, sans-serif",
                outline: "none", boxSizing: "border-box", lineHeight: 1.6,
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setStep(2)} style={{
              background: "#FFFFFF", border: `1px solid ${C.border}`,
              borderRadius: 10, color: C.muted, fontSize: 13, padding: "10px 16px", cursor: "pointer",
            }}>←</button>
            <button onClick={finish} disabled={!canFinish} style={{
              flex: 1,
              background: canFinish ? `linear-gradient(135deg, ${C.gold}, #F97316)` : C.border,
              border: "none", borderRadius: 10,
              color: canFinish ? "#F3F4F6" : C.muted,
              fontWeight: "bold", fontSize: 14, padding: "12px",
              cursor: canFinish ? "pointer" : "default", transition: "all 0.3s",
            }}>Vezi analiza →</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GhidObservatie() {
  const [tab, setTab] = useState("intro"); // intro | exemple | practica

  return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 20% 10%, #080820 0%, ${C.bgDeep} 60%)`,
      fontFamily: "'Georgia', serif", color: C.text,
      padding: "28px 16px 80px",
    }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        textarea:focus, input:focus { outline: none; }
      `}</style>

      <div style={{ maxWidth: 520, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 10, letterSpacing: 5, color: C.accent, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8 }}>
            Lecția 3B · Structural Intelligence
          </div>
          <h1 style={{
            fontSize: "clamp(20px, 5vw, 30px)", fontWeight: 700, margin: "0 0 8px",
            background: `linear-gradient(135deg, #fff 0%, #93C5FD 100%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Ghidul de Observație</h1>
          <p style={{ fontSize: 12, color: C.muted, margin: 0, fontStyle: "italic" }}>
            Separă ce ai văzut de ce ai interpretat
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: 6, marginBottom: 24,
          background: C.panel, borderRadius: 14, padding: 6,
          border: `1px solid ${C.border}`,
        }}>
          {[
            { id: "intro", label: "Conceptul" },
            { id: "exemple", label: "Exemple" },
            { id: "practica", label: "Situația mea" },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1, padding: "10px 8px", borderRadius: 10,
                border: "none", cursor: "pointer",
                background: tab === t.id ? `linear-gradient(135deg, ${C.obs}, #60A5FA)` : "transparent",
                color: tab === t.id ? "#F3F4F6" : C.muted,
                fontWeight: tab === t.id ? "bold" : "normal",
                fontSize: 12, fontFamily: "'DM Sans', system-ui, sans-serif",
                transition: "all 0.2s",
              }}>{t.label}</button>
          ))}
        </div>

        {/* INTRO */}
        {tab === "intro" && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 18, padding: "24px", marginBottom: 14 }}>
              <p style={{ fontSize: 15, lineHeight: 1.9, color: C.text, margin: "0 0 20px" }}>
                Creierul nu separă observația de interpretare. Le face simultan, în fracțiuni de secundă, fără să te întrebe.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.9, color: "#475569", margin: 0 }}>
                Cineva întârzie → creierul înregistrează direct <em style={{ color: C.judecata }}>"nu îi pasă de mine"</em>, nu <em style={{ color: C.obs }}>"a întârziat 15 minute."</em>
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              <div style={{ background: `${C.obs}0A`, border: `1px solid ${C.obs}33`, borderRadius: 14, padding: "16px" }}>
                <div style={{ fontSize: 10, letterSpacing: 2, color: C.obs, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8 }}>Observație</div>
                <div style={{ fontSize: 13, color: "#90A0CC", lineHeight: 1.7 }}>Ce ai perceput cu simțurile. Verificabil. Nu se poate contesta.</div>
              </div>
              <div style={{ background: `${C.judecata}0A`, border: `1px solid ${C.judecata}33`, borderRadius: 14, padding: "16px" }}>
                <div style={{ fontSize: 10, letterSpacing: 2, color: C.judecata, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8 }}>Judecată</div>
                <div style={{ fontSize: 13, color: "#C09090", lineHeight: 1.7 }}>Ce a adăugat mintea. Poate fi adevărat — sau poate nu. Merită verificat.</div>
              </div>
            </div>

            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 18, padding: "22px", marginBottom: 14 }}>
              <div style={{ fontSize: 11, letterSpacing: 2, color: C.muted, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 16 }}>
                Consecvent vs. contextual
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ background: `${C.consecvent}0A`, border: `1px solid ${C.consecvent}22`, borderRadius: 12, padding: "14px" }}>
                  <div style={{ fontSize: 10, letterSpacing: 1, color: C.consecvent, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6 }}>🔄 Consecvent</div>
                  <div style={{ fontSize: 12, color: "#A090CC", lineHeight: 1.6 }}>Apare indiferent de context, cu mai mulți oameni. E un tipar al persoanei.</div>
                </div>
                <div style={{ background: `${C.contextual}0A`, border: `1px solid ${C.contextual}22`, borderRadius: 12, padding: "14px" }}>
                  <div style={{ fontSize: 10, letterSpacing: 1, color: C.contextual, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6 }}>🌊 Contextual</div>
                  <div style={{ fontSize: 12, color: "#80AA90", lineHeight: 1.6 }}>Apare în anumite situații. E un răspuns la o stare, nu un tipar fix.</div>
                </div>
              </div>
            </div>

            <div style={{
              padding: "14px 18px", background: `${C.obs}08`,
              border: `1px solid ${C.obs}22`, borderRadius: 14,
              fontSize: 13, color: "#8090AA", fontStyle: "italic", lineHeight: 1.8,
            }}>
              Asta nu înseamnă să scuzi pe toată lumea. Înseamnă să nu judeci definitiv pe baza unor date insuficiente.
            </div>

            <button onClick={() => setTab("exemple")} style={{
              width: "100%", marginTop: 16,
              background: `linear-gradient(135deg, ${C.obs}, #60A5FA)`,
              border: "none", borderRadius: 14, color: "#F3F4F6",
              fontWeight: "bold", fontSize: 15, padding: "16px",
              cursor: "pointer", boxShadow: `0 6px 24px ${C.obs}33`,
            }}>Vezi exemple →</button>
          </div>
        )}

        {/* EXAMPLES */}
        {tab === "exemple" && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>
              Apasă pe fiecare exemplu pentru a vedea cum funcționează separarea observație — interpretare.
            </div>
            {EXAMPLES.map((ex, i) => <ExampleCard key={i} ex={ex} index={i} />)}
            <button onClick={() => setTab("practica")} style={{
              width: "100%", marginTop: 8,
              background: `linear-gradient(135deg, ${C.obs}, #60A5FA)`,
              border: "none", borderRadius: 14, color: "#F3F4F6",
              fontWeight: "bold", fontSize: 15, padding: "16px",
              cursor: "pointer", boxShadow: `0 6px 24px ${C.obs}33`,
            }}>Încearcă cu situația ta →</button>
          </div>
        )}

        {/* PRACTICE */}
        {tab === "practica" && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>
              Alege o situație reală din viața ta și trece-o prin același proces.
            </div>
            <MyObservation />
          </div>
        )}

        <div style={{ marginTop: 48, textAlign: "center", fontSize: 9, color: "#10101A", letterSpacing: 3, textTransform: "uppercase", fontFamily: "monospace" }}>
          Structural Intelligence · Pattern Recognition · 3B
        </div>
      </div>
    </div>
  );
}
