"use client";
import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface Subtask {
  id: number;
  worker: string;
  task: string;
  expectedOutput: string;
  status: "pending" | "running" | "done";
}

interface AgentPlan {
  analysis: string;
  subtasks: Subtask[];
  estimatedTime: string;
  paymentSplit: { research: number; execution: number; quality: number };
}

const SAMPLE_GIGS = [
  { id: 1, title: "Write DeFi market research report", bounty: 5, status: "OPEN" },
  { id: 2, title: "Create Web3 Twitter content calendar", bounty: 3, status: "OPEN" },
  { id: 3, title: "Audit Solidity smart contract", bounty: 10, status: "IN PROGRESS" },
];

export default function Home() {
  const [tab, setTab] = useState<"browse" | "post" | "agent">("browse");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bounty, setBounty] = useState("5");
  const [loading, setLoading] = useState(false);
  const [agentPlan, setAgentPlan] = useState<AgentPlan | null>(null);
  const [subtaskProgress, setSubtaskProgress] = useState(-1);
  const [posted, setPosted] = useState(false);

  async function handlePost() {
    if (!title || !description) return;
    setLoading(true);
    setTab("agent");
    setAgentPlan(null);
    setSubtaskProgress(-1);
    setPosted(false);
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: title, description, bounty }),
      });
      const data = await res.json();
      if (data.success) {
        setAgentPlan(data.agentPlan);
        let i = 0;
        const interval = setInterval(() => {
          setSubtaskProgress(i);
          i++;
          if (i >= data.agentPlan.subtasks.length) {
            clearInterval(interval);
            setTimeout(() => setPosted(true), 1000);
          }
        }, 1800);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const f = (style: React.CSSProperties) => style;

  return (
    <div style={f({ minHeight: "100vh", background: "#0f0f1a", color: "#e0e0e0", fontFamily: "'Press Start 2P', monospace" })}>

      {/* Header */}
      <header style={f({ borderBottom: "3px solid #333366", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px", background: "#1a1a2e", boxShadow: "0 3px 0 #000" })}>
        <div style={f({ display: "flex", alignItems: "center", gap: "12px" })}>
          <div style={f({ width: "36px", height: "36px", background: "#00ff41", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", border: "3px solid #00cc33", boxShadow: "3px 3px 0 #007a1f" })}>⚡</div>
          <span style={f({ fontSize: "14px", color: "#00ff41", textShadow: "2px 2px 0 #007a1f", letterSpacing: "2px" })}>AUTOGIG</span>
          <span style={f({ fontSize: "7px", background: "#16213e", padding: "4px 8px", border: "2px solid #333366", color: "#4da6ff" })}>ARC TESTNET</span>
        </div>
        <ConnectButton />
      </header>

      {/* Hero */}
      <div style={f({ textAlign: "center", padding: "3rem 1.5rem 2rem", borderBottom: "3px solid #333366", background: "linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)" })}>
        <div style={f({ fontSize: "8px", color: "#00ff41", letterSpacing: "4px", marginBottom: "16px" })}>▶ POWERED BY ARC + CIRCLE USDC ◀</div>
        <h1 style={f({ fontSize: "clamp(18px, 4vw, 32px)", color: "#fff", margin: "0 0 8px", textShadow: "4px 4px 0 #333366", lineHeight: "1.6" })}>
          THE AUTONOMOUS<br/>
          <span style={f({ color: "#00ff41", textShadow: "4px 4px 0 #007a1f" })}>GIG ECONOMY</span>
        </h1>
        <p style={f({ color: "#666699", fontSize: "8px", maxWidth: "440px", margin: "16px auto 24px", lineHeight: "2" })}>
          POST A TASK › LOCK USDC › AI AGENTS EXECUTE<br/>
          PAYMENT AUTO-RELEASES ON COMPLETION
        </p>
        <div style={f({ display: "flex", justifyContent: "center", gap: "12px", fontSize: "7px", flexWrap: "wrap" })}>
          {["⚡ SUB-SECOND SETTLEMENT", "💵 USDC GAS FEES", "🤖 FULLY AUTONOMOUS"].map((s) => (
            <span key={s} style={f({ color: "#4da6ff", background: "#16213e", padding: "6px 10px", border: "2px solid #333366" })}>{s}</span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={f({ display: "flex", borderBottom: "3px solid #333366", background: "#1a1a2e" })}>
        {(["browse", "post", "agent"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={f({
            padding: "14px 20px", background: tab === t ? "#0f0f1a" : "transparent",
            border: "none", borderBottom: tab === t ? "3px solid #00ff41" : "3px solid transparent",
            color: tab === t ? "#00ff41" : "#666699", cursor: "pointer",
            fontFamily: "'Press Start 2P', monospace", fontSize: "8px", letterSpacing: "1px", marginBottom: "-3px"
          })}>
            {t === "browse" ? "▸ BROWSE" : t === "post" ? "▸ POST GIG" : "▸ AGENT"}
          </button>
        ))}
      </div>

      <main style={f({ maxWidth: "860px", margin: "0 auto", padding: "2rem 1.5rem" })}>

        {/* Browse */}
        {tab === "browse" && (
          <div>
            <div style={f({ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" })}>
              <div style={f({ fontSize: "11px", color: "#fff", textShadow: "2px 2px 0 #333366", borderLeft: "4px solid #00ff41", paddingLeft: "12px" })}>OPEN GIGS</div>
              <button onClick={() => setTab("post")} style={f({ fontSize: "8px", padding: "10px 16px", background: "#00ff41", color: "#000", border: "3px solid #00cc33", boxShadow: "4px 4px 0 #007a1f", cursor: "pointer", fontFamily: "'Press Start 2P', monospace" })}>+ POST GIG</button>
            </div>
            {SAMPLE_GIGS.map((gig) => (
              <div key={gig.id} style={f({ border: `3px solid ${gig.status === "OPEN" ? "#333366" : "#ff6b35"}`, background: "#1a1a2e", padding: "16px", marginBottom: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "4px 4px 0 #000" })}>
                <div>
                  <div style={f({ fontSize: "9px", marginBottom: "8px" })}>{gig.title}</div>
                  <span style={f({ fontSize: "7px", padding: "4px 8px", background: gig.status === "OPEN" ? "#003300" : "#331a00", color: gig.status === "OPEN" ? "#00ff41" : "#ff6b35", border: `2px solid ${gig.status === "OPEN" ? "#00ff41" : "#ff6b35"}` })}>{gig.status}</span>
                </div>
                <div style={f({ textAlign: "right" })}>
                  <div style={f({ fontSize: "18px", color: "#ffd700", textShadow: "2px 2px 0 #7a6500" })}>${gig.bounty}</div>
                  <div style={f({ fontSize: "7px", color: "#666699" })}>USDC</div>
                  <button style={f({ marginTop: "8px", fontSize: "7px", padding: "6px 12px", background: "transparent", border: "2px solid #333366", color: "#e0e0e0", cursor: "pointer", fontFamily: "'Press Start 2P', monospace" })}>TAKE GIG ▸</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Post */}
        {tab === "post" && (
          <div style={f({ maxWidth: "580px" })}>
            <div style={f({ fontSize: "11px", color: "#fff", textShadow: "2px 2px 0 #333366", borderLeft: "4px solid #00ff41", paddingLeft: "12px", marginBottom: "20px" })}>POST A NEW GIG</div>
            <div style={f({ marginBottom: "20px" })}>
              <label style={f({ display: "block", fontSize: "8px", color: "#4da6ff", marginBottom: "8px", letterSpacing: "2px" })}>▸ TASK TITLE</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Write a DeFi research report" style={f({ width: "100%", padding: "12px", background: "#0f0f1a", border: "3px solid #333366", boxShadow: "inset 3px 3px 0 #000", color: "#e0e0e0", fontFamily: "'Press Start 2P', monospace", fontSize: "8px", outline: "none", lineHeight: "1.8", boxSizing: "border-box" })} />
            </div>
            <div style={f({ marginBottom: "20px" })}>
              <label style={f({ display: "block", fontSize: "8px", color: "#4da6ff", marginBottom: "8px", letterSpacing: "2px" })}>▸ DESCRIPTION</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what you need..." rows={4} style={f({ width: "100%", padding: "12px", background: "#0f0f1a", border: "3px solid #333366", boxShadow: "inset 3px 3px 0 #000", color: "#e0e0e0", fontFamily: "'Press Start 2P', monospace", fontSize: "8px", outline: "none", lineHeight: "1.8", resize: "vertical", boxSizing: "border-box" })} />
            </div>
            <div style={f({ marginBottom: "20px" })}>
              <label style={f({ display: "block", fontSize: "8px", color: "#4da6ff", marginBottom: "8px", letterSpacing: "2px" })}>▸ BOUNTY (USDC)</label>
              <div style={f({ display: "flex", gap: "8px", flexWrap: "wrap" })}>
                {["1", "3", "5", "10", "25"].map((v) => (
                  <button key={v} onClick={() => setBounty(v)} style={f({ padding: "8px 14px", background: bounty === v ? "#ffd700" : "transparent", color: bounty === v ? "#000" : "#e0e0e0", border: `3px solid ${bounty === v ? "#ffd700" : "#333366"}`, boxShadow: bounty === v ? "3px 3px 0 #7a6500" : "3px 3px 0 #000", cursor: "pointer", fontFamily: "'Press Start 2P', monospace", fontSize: "8px" })}>${v}</button>
                ))}
              </div>
            </div>
            <div style={f({ background: "#0f0f1a", border: "3px solid #333366", padding: "14px", marginBottom: "16px", boxShadow: "inset 3px 3px 0 #000" })}>
              <div style={f({ display: "flex", justifyContent: "space-between", fontSize: "8px", marginBottom: "6px" })}><span style={f({ color: "#666699" })}>BOUNTY</span><span style={f({ color: "#ffd700" })}>${bounty} USDC</span></div>
              <div style={f({ display: "flex", justifyContent: "space-between", fontSize: "8px", borderTop: "2px solid #333366", paddingTop: "8px", marginTop: "6px" })}><span>TOTAL LOCKED ON ARC</span><span style={f({ color: "#00ff41" })}>${bounty} USDC</span></div>
            </div>
            <button onClick={handlePost} disabled={!title || !description || loading} style={f({ width: "100%", padding: "14px", background: (!title || !description) ? "#1a1a2e" : "#00ff41", color: (!title || !description) ? "#666699" : "#000", border: `3px solid ${(!title || !description) ? "#333366" : "#00cc33"}`, boxShadow: (!title || !description) ? "none" : "4px 4px 0 #007a1f", cursor: (!title || !description) ? "not-allowed" : "pointer", fontFamily: "'Press Start 2P', monospace", fontSize: "8px", letterSpacing: "1px" })}>
              {loading ? "▸ AI AGENT PROCESSING..." : "POST GIG + LOCK USDC ON ARC ▸"}
            </button>
          </div>
        )}

        {/* Agent */}
        {tab === "agent" && (
          <div>
            <div style={f({ fontSize: "11px", color: "#fff", textShadow: "2px 2px 0 #333366", borderLeft: "4px solid #00ff41", paddingLeft: "12px", marginBottom: "20px" })}>AGENT ACTIVITY</div>
            {!agentPlan && !loading && (
              <div style={f({ textAlign: "center", padding: "60px 20px", color: "#666699" })}>
                <div style={f({ fontSize: "48px", marginBottom: "16px" })}>🤖</div>
                <div style={f({ fontSize: "8px", lineHeight: "2" })}>NO ACTIVE AGENT SESSION<br/>POST A GIG TO BEGIN<span className="blink">_</span></div>
              </div>
            )}
            {loading && (
              <div style={f({ textAlign: "center", padding: "60px 20px" })}>
                <div style={f({ fontSize: "32px", marginBottom: "16px" })}>⚙️</div>
                <div style={f({ fontSize: "8px", color: "#00ff41", lineHeight: "2" })}>INITIALIZING AI AGENT<span className="blink">...</span></div>
              </div>
            )}
            {agentPlan && (
              <div>
                <div style={f({ background: "#1a1a2e", border: "3px solid #4da6ff", padding: "16px", marginBottom: "20px", boxShadow: "4px 4px 0 #000" })}>
                  <div style={f({ fontSize: "7px", color: "#4da6ff", letterSpacing: "3px", marginBottom: "10px" })}>▸ AGENT ANALYSIS</div>
                  <div style={f({ fontSize: "8px", color: "#c9c7c2", lineHeight: "2" })}>{agentPlan.analysis}</div>
                  <div style={f({ display: "flex", gap: "16px", marginTop: "12px", fontSize: "7px", color: "#666699" })}>
                    <span>⏱ {agentPlan.estimatedTime}</span>
                    <span>💵 ${bounty} USDC LOCKED</span>
                  </div>
                </div>
                <div style={f({ fontSize: "7px", color: "#666699", letterSpacing: "3px", marginBottom: "12px" })}>▸ SUBTASK EXECUTION</div>
                {agentPlan.subtasks.map((subtask, i) => {
                  const isDone = subtaskProgress > i;
                  const isRunning = subtaskProgress === i;
                  return (
                    <div key={subtask.id} style={f({ border: `3px solid ${isDone ? "#00ff41" : isRunning ? "#4da6ff" : "#333366"}`, background: isDone ? "#001a00" : isRunning ? "#001633" : "#1a1a2e", padding: "14px", marginBottom: "10px", boxShadow: `4px 4px 0 ${isDone ? "#007a1f" : isRunning ? "#003366" : "#000"}`, transition: "all 0.3s" })}>
                      <div style={f({ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" })}>
                        <span>{isDone ? "✅" : isRunning ? "⚡" : "⏳"}</span>
                        <span style={f({ fontSize: "9px", fontWeight: "600" })}>{subtask.worker}</span>
                        <span style={f({ marginLeft: "auto", fontSize: "7px", padding: "3px 8px", background: isDone ? "#003300" : isRunning ? "#001633" : "#0f0f1a", color: isDone ? "#00ff41" : isRunning ? "#4da6ff" : "#666699", border: `2px solid ${isDone ? "#00ff41" : isRunning ? "#4da6ff" : "#333366"}` })}>
                          {isDone ? "COMPLETE" : isRunning ? "RUNNING" : "PENDING"}
                        </span>
                      </div>
                      <div style={f({ fontSize: "8px", color: "#c9c7c2", lineHeight: "2", marginBottom: "4px" })}>{subtask.task}</div>
                      <div style={f({ fontSize: "7px", color: "#666699", lineHeight: "2" })}>OUTPUT: {subtask.expectedOutput}</div>
                    </div>
                  );
                })}
                {posted && (
                  <div style={f({ marginTop: "20px", background: "#001a00", border: "3px solid #00ff41", padding: "20px", textAlign: "center", boxShadow: "4px 4px 0 #007a1f" })}>
                    <div style={f({ fontSize: "12px", color: "#00ff41", textShadow: "2px 2px 0 #007a1f", marginBottom: "8px" })}>★ GIG POSTED! ★</div>
                    <div style={f({ fontSize: "7px", color: "#666699", lineHeight: "2" })}>${bounty} USDC LOCKED IN ARC SMART CONTRACT<br/>PAYMENT WILL AUTO-RELEASE ON COMPLETION</div>
                    <div style={f({ marginTop: "10px", fontSize: "7px", color: "#4da6ff" })}>▸ VIEW ON ARC EXPLORER: TESTNET.ARCSCAN.APP</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
