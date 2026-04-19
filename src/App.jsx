import { useState } from "react";

const SPICES = ["🌶️", "🫚", "🧄", "🧅", "🫛", "🌿"];

const systemPrompt = `You are a warm, expert Indian nutritionist and home cook who specializes in tiffin meal planning. 

When given user preferences, generate a 5-day tiffin meal plan in this EXACT JSON format (no markdown, no backticks, just raw JSON):

{
  "greeting": "A warm 1-sentence personalized greeting",
  "days": [
    {
      "day": "Monday",
      "lunch": {
        "main": "Dish name",
        "side": "Side dish",
        "dal": "Dal name",
        "roti": "Roti/Rice type",
        "emoji": "relevant food emoji"
      },
      "tip": "One quick cooking tip for this meal"
    }
  ],
  "grocery_highlights": ["item1", "item2", "item3", "item4", "item5"],
  "nutrition_note": "One sentence about the nutritional balance of this plan"
}

Generate exactly 5 days (Monday to Friday). Be specific with Indian dishes. Consider the user's dietary preference, health goal, and cooking time.`;

const P = {
  bg:         "#0C0E14",
  surface:    "#13161F",
  card:       "#181C27",
  border:     "rgba(196,160,96,0.18)",
  gold:       "#C4A060",
  goldLight:  "#E2C484",
  goldDim:    "rgba(196,160,96,0.10)",
  ivory:      "#F5F0E8",
  ivoryDim:   "rgba(245,240,232,0.55)",
  ivoryFaint: "rgba(245,240,232,0.07)",
  muted:      "rgba(245,240,232,0.3)",
};

const dayPalettes = [
  { header: "#181200", bar: "#C4A060", tag: "rgba(196,160,96,0.1)",  tagBorder: "rgba(196,160,96,0.25)",  label: "#C4A060" },
  { header: "#0D1A12", bar: "#4CAF78", tag: "rgba(76,175,120,0.1)",  tagBorder: "rgba(76,175,120,0.25)",  label: "#4CAF78" },
  { header: "#150D1A", bar: "#9B7EC8", tag: "rgba(155,126,200,0.1)", tagBorder: "rgba(155,126,200,0.25)", label: "#9B7EC8" },
  { header: "#0D1520", bar: "#5B9BD5", tag: "rgba(91,155,213,0.1)",  tagBorder: "rgba(91,155,213,0.25)",  label: "#5B9BD5" },
  { header: "#1A0D10", bar: "#D4717A", tag: "rgba(212,113,122,0.1)", tagBorder: "rgba(212,113,122,0.25)", label: "#D4717A" },
];

export default function MealPlanner() {
  const [step, setStep] = useState("form");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ diet:"", goal:"", cookTime:"", people:"", region:"" });

  const handleChange = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleGenerate = async () => {
    if (!form.diet || !form.goal || !form.cookTime || !form.people || !form.region) {
      setError("Please select all options to continue."); return;
    }
    setError(""); setStep("loading");
    const msg = `Generate a 5-day tiffin meal plan for:\n- Diet type: ${form.diet}\n- Health goal: ${form.goal}\n- Cooking time available: ${form.cookTime}\n- Number of people: ${form.people}\n- Regional preference: ${form.region}`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, system:systemPrompt, messages:[{role:"user",content:msg}] }),
      });
      const data = await res.json();
      const text = data.content?.map(b=>b.text||"").join("")||"";
      setResult(JSON.parse(text.replace(/```json|```/g,"").trim()));
      setStep("result");
    } catch { setError("Something went wrong. Please try again."); setStep("form"); }
  };

  const reset = () => { setStep("form"); setResult(null); setForm({diet:"",goal:"",cookTime:"",people:"",region:""}); };

  return (
    <div style={{ minHeight:"100vh", background:P.bg, fontFamily:"'Palatino Linotype','Book Antiqua',Palatino,serif", color:P.ivory, position:"relative", overflowX:"hidden" }}>

      {/* Ambient top glow */}
      <div style={{ position:"fixed", top:-200, left:"50%", transform:"translateX(-50%)", width:700, height:400, borderRadius:"50%", background:"radial-gradient(ellipse, rgba(196,160,96,0.07) 0%, transparent 70%)", pointerEvents:"none" }} />

      {/* Fine grid */}
      <div style={{ position:"fixed", inset:0, opacity:0.022, backgroundImage:"linear-gradient(rgba(196,160,96,1) 1px,transparent 1px),linear-gradient(90deg,rgba(196,160,96,1) 1px,transparent 1px)", backgroundSize:"48px 48px", pointerEvents:"none" }} />

      {/* ── HEADER ── */}
      <header style={{ textAlign:"center", padding:"52px 24px 36px", borderBottom:`1px solid ${P.border}`, position:"relative" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:P.goldDim, border:`1px solid ${P.border}`, borderRadius:50, padding:"5px 16px", marginBottom:20 }}>
          <span style={{ fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase", color:P.gold, fontFamily:"sans-serif" }}>AI-Powered</span>
        </div>
        <h1 style={{ margin:"0 0 10px", fontSize:"clamp(28px,6vw,48px)", fontWeight:400, letterSpacing:"0.04em", color:P.ivory, lineHeight:1.15 }}>
          Tiffin <em style={{ color:P.gold }}>Meal Planner</em>
        </h1>
        <p style={{ margin:0, fontSize:12, letterSpacing:"0.2em", textTransform:"uppercase", color:P.muted, fontFamily:"sans-serif" }}>
          Your personal Indian nutrition concierge
        </p>
        <div style={{ marginTop:20, display:"flex", justifyContent:"center", gap:18 }}>
          {SPICES.map((s,i)=><span key={i} style={{ fontSize:17, opacity:0.45 }}>{s}</span>)}
        </div>
      </header>

      <div style={{ maxWidth:660, margin:"0 auto", padding:"40px 20px 80px" }}>

        {/* ── FORM ── */}
        {step==="form" && (
          <div style={{ animation:"rise 0.5s cubic-bezier(.16,1,.3,1)" }}>
            <p style={{ textAlign:"center", color:P.ivoryDim, fontSize:15, marginBottom:40, lineHeight:1.85, fontFamily:"sans-serif" }}>
              Answer five questions and receive a curated week of tiffin menus tailored just for you.
            </p>

            {[
              { field:"diet",     label:"Diet Type",            options:["Vegetarian","Eggetarian","Non-Vegetarian","Vegan","Jain"] },
              { field:"goal",     label:"Health Goal",          options:["Weight Loss","Weight Gain","Maintain Weight","Diabetic-Friendly","High Protein"] },
              { field:"cookTime", label:"Cooking Time Per Day", options:["Under 30 mins","30–45 mins","45–60 mins","Over 1 hour"] },
              { field:"people",   label:"Number of People",     options:["1 Person","2 People","3–4 People","5+ People"] },
              { field:"region",   label:"Regional Preference",  options:["North Indian","South Indian","Gujarati","Maharashtrian","Bengali","Mixed / Any"] },
            ].map(({ field, label, options }, gi) => (
              <div key={field} style={{ marginBottom:30 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                  <div style={{ width:22, height:22, borderRadius:"50%", background:P.goldDim, border:`1px solid ${P.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <span style={{ fontSize:10, color:P.gold, fontFamily:"sans-serif", fontWeight:700 }}>{gi+1}</span>
                  </div>
                  <span style={{ fontSize:11, letterSpacing:"0.16em", textTransform:"uppercase", color:P.goldLight, fontFamily:"sans-serif", fontWeight:600 }}>{label}</span>
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {options.map(opt => {
                    const sel = form[field]===opt;
                    return (
                      <button key={opt} onClick={()=>handleChange(field,opt)} style={{
                        padding:"9px 18px", borderRadius:3,
                        border: sel ? `1px solid ${P.gold}` : `1px solid ${P.border}`,
                        background: sel ? P.goldDim : "transparent",
                        color: sel ? P.goldLight : P.ivoryDim,
                        cursor:"pointer", fontSize:13, fontFamily:"sans-serif",
                        fontWeight: sel ? 600 : 400, letterSpacing:"0.02em",
                        transition:"all 0.15s",
                        boxShadow: sel ? "0 0 14px rgba(196,160,96,0.14)" : "none",
                      }}>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {error && <p style={{ color:"#E07070", textAlign:"center", fontFamily:"sans-serif", fontSize:13, marginBottom:14 }}>{error}</p>}

            <div style={{ display:"flex", alignItems:"center", gap:16, margin:"8px 0 28px" }}>
              <div style={{ flex:1, height:1, background:P.border }} />
              <span style={{ color:P.gold, fontSize:14 }}>✦</span>
              <div style={{ flex:1, height:1, background:P.border }} />
            </div>

            <button onClick={handleGenerate} style={{
              width:"100%", padding:"17px",
              background:`linear-gradient(135deg, #7A5C10, ${P.gold}, #C8A855)`,
              color:"#0C0E14", border:"none", borderRadius:3,
              fontSize:13, fontFamily:"sans-serif", fontWeight:700,
              cursor:"pointer", letterSpacing:"0.14em", textTransform:"uppercase",
              boxShadow:"0 8px 32px rgba(196,160,96,0.2), 0 2px 8px rgba(0,0,0,0.5)",
              transition:"transform 0.15s, box-shadow 0.15s",
            }}
              onMouseOver={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 12px 40px rgba(196,160,96,0.3),0 4px 12px rgba(0,0,0,0.5)"; }}
              onMouseOut={e=>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 8px 32px rgba(196,160,96,0.2),0 2px 8px rgba(0,0,0,0.5)"; }}
            >
              Generate My Weekly Meal Plan →
            </button>
            <p style={{ textAlign:"center", color:P.muted, fontSize:10, marginTop:13, fontFamily:"sans-serif", letterSpacing:"0.12em" }}>
              FREE &nbsp;·&nbsp; NO SIGNUP &nbsp;·&nbsp; INSTANT RESULTS
            </p>
          </div>
        )}

        {/* ── LOADING ── */}
        {step==="loading" && (
          <div style={{ textAlign:"center", padding:"100px 20px", animation:"rise 0.3s ease" }}>
            <div style={{ position:"relative", display:"inline-block", marginBottom:32 }}>
              <div style={{ width:72, height:72, borderRadius:"50%", border:`1px solid ${P.border}`, borderTop:`2px solid ${P.gold}`, animation:"spin 1.2s linear infinite", margin:"0 auto" }} />
              <span style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>🍲</span>
            </div>
            <h2 style={{ color:P.goldLight, fontWeight:400, fontSize:22, margin:"0 0 10px" }}>Curating your meal plan…</h2>
            <p style={{ color:P.muted, fontFamily:"sans-serif", fontSize:14 }}>Our AI chef is crafting your personalised tiffin schedule</p>
          </div>
        )}

        {/* ── RESULT ── */}
        {step==="result" && result && (
          <div style={{ animation:"rise 0.6s cubic-bezier(.16,1,.3,1)" }}>

            {/* Greeting */}
            <div style={{ border:`1px solid ${P.border}`, borderRadius:4, padding:"24px 28px", marginBottom:36, background:P.goldDim, textAlign:"center", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${P.gold},transparent)` }} />
              <span style={{ fontSize:18, display:"block", marginBottom:10, color:P.gold }}>✦</span>
              <p style={{ color:P.goldLight, fontSize:16, margin:0, lineHeight:1.8, fontStyle:"italic" }}>"{result.greeting}"</p>
            </div>

            {/* Day cards */}
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:32 }}>
              {result.days?.map((day, i) => {
                const pal = dayPalettes[i%dayPalettes.length];
                return (
                  <div key={i} style={{ background:P.card, border:`1px solid ${P.border}`, borderRadius:4, overflow:"hidden", boxShadow:"0 4px 24px rgba(0,0,0,0.35)" }}>
                    <div style={{ background:pal.header, padding:"13px 20px", display:"flex", alignItems:"center", gap:12, borderBottom:`1px solid ${P.border}` }}>
                      <div style={{ width:3, height:34, background:pal.bar, borderRadius:2, flexShrink:0 }} />
                      <span style={{ fontSize:22 }}>{day.lunch.emoji}</span>
                      <div>
                        <div style={{ fontSize:16, color:P.ivory, letterSpacing:"0.06em" }}>{day.day}</div>
                        <div style={{ fontSize:10, color:P.muted, fontFamily:"sans-serif", letterSpacing:"0.12em", textTransform:"uppercase", marginTop:2 }}>Tiffin Menu</div>
                      </div>
                    </div>
                    <div style={{ padding:"16px 20px" }}>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
                        {[["Main",day.lunch.main],["Side",day.lunch.side],["Dal",day.lunch.dal],["Bread / Rice",day.lunch.roti]].map(([lbl,val])=>(
                          <div key={lbl} style={{ background:pal.tag, border:`1px solid ${pal.tagBorder}`, borderRadius:3, padding:"10px 12px" }}>
                            <div style={{ fontSize:9, color:pal.label, fontFamily:"sans-serif", fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:4 }}>{lbl}</div>
                            <div style={{ fontSize:13, color:P.ivory, fontFamily:"sans-serif", lineHeight:1.4 }}>{val}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display:"flex", alignItems:"flex-start", gap:8, padding:"9px 12px", background:P.ivoryFaint, borderRadius:3 }}>
                        <span style={{ color:P.gold, fontSize:12, marginTop:1, flexShrink:0 }}>💡</span>
                        <span style={{ fontSize:12, color:P.ivoryDim, fontFamily:"sans-serif", lineHeight:1.65, fontStyle:"italic" }}>{day.tip}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Divider */}
            <div style={{ display:"flex", alignItems:"center", gap:16, margin:"0 0 28px" }}>
              <div style={{ flex:1, height:1, background:P.border }} />
              <span style={{ color:P.gold, fontSize:13, letterSpacing:"0.4em" }}>✦ ✦</span>
              <div style={{ flex:1, height:1, background:P.border }} />
            </div>

            {/* Grocery */}
            <div style={{ background:P.card, border:`1px solid ${P.border}`, borderRadius:4, padding:"20px 24px", marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                <span style={{ fontSize:16 }}>🛒</span>
                <h3 style={{ margin:0, fontSize:11, letterSpacing:"0.16em", textTransform:"uppercase", color:P.goldLight, fontFamily:"sans-serif" }}>Key Groceries This Week</h3>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                {result.grocery_highlights?.map((item,i)=>(
                  <span key={i} style={{ background:P.goldDim, border:`1px solid ${P.border}`, color:P.goldLight, padding:"5px 13px", borderRadius:2, fontSize:12, fontFamily:"sans-serif", letterSpacing:"0.03em" }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Nutrition */}
            <div style={{ background:"rgba(39,174,96,0.06)", border:"1px solid rgba(39,174,96,0.18)", borderRadius:4, padding:"13px 18px", marginBottom:32 }}>
              <p style={{ color:"rgba(150,220,170,0.8)", margin:0, fontSize:13, fontFamily:"sans-serif", lineHeight:1.7 }}>
                🥦 &nbsp;{result.nutrition_note}
              </p>
            </div>

            {/* CTA */}
            <div style={{ background:P.card, border:`1px solid ${P.border}`, borderRadius:4, padding:"28px 24px", textAlign:"center", marginBottom:14, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${P.gold},transparent)` }} />
              <p style={{ color:P.goldLight, fontSize:18, margin:"0 0 6px", letterSpacing:"0.02em" }}>Enjoy your meal plan?</p>
              <p style={{ color:P.ivoryDim, fontSize:13, margin:"0 0 20px", fontFamily:"sans-serif", lineHeight:1.7 }}>
                Subscribe for <strong style={{ color:P.gold }}>₹199 / month</strong> — receive fresh weekly plans every Sunday on WhatsApp.
              </p>
              <button style={{
                background:`linear-gradient(135deg, #7A5C10, ${P.gold})`,
                color:"#0C0E14", border:"none", borderRadius:3,
                padding:"13px 32px", fontSize:12, cursor:"pointer",
                fontFamily:"sans-serif", fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase",
                boxShadow:"0 6px 24px rgba(196,160,96,0.22)",
              }}>
                📲 Subscribe on WhatsApp
              </button>
            </div>

            <button onClick={reset} style={{
              width:"100%", padding:"12px", background:"transparent", color:P.muted,
              border:`1px solid ${P.border}`, borderRadius:4,
              fontSize:12, cursor:"pointer", fontFamily:"sans-serif",
              letterSpacing:"0.1em", transition:"color 0.2s, border-color 0.2s",
            }}
              onMouseOver={e=>{ e.currentTarget.style.color=P.goldLight; e.currentTarget.style.borderColor=P.gold; }}
              onMouseOut={e=>{ e.currentTarget.style.color=P.muted; e.currentTarget.style.borderColor=P.border; }}
            >
              ← Generate Another Plan
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes rise { from { opacity:0; transform:translateY(22px) } to { opacity:1; transform:translateY(0) } }
        @keyframes spin { to { transform:rotate(360deg) } }
      `}</style>
    </div>
  );
}
