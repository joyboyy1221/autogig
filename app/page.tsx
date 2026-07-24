"use client";
import { useState } from "react";

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
  { id: 1, title: "Write a market research report on DeFi trends", bounty: 5, status: "Open" },
  { id: 2, title: "Create a Twitter content calendar for Web3 project", bounty: 3, status: "Open" },
  { id: 3, title: "Audit a Solidity smart contract for vulnerabilities", bounty: 10, status: "In Progress" },
];

export default function Home() {
  const [tab, setTab] = useState<"browse" | "post" | "agent">("browse");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bounty, setBounty] = useState("5");
  const [loading, setLoading] = useState(false);
  const [agentPlan, setAgentPlan] = useState<AgentPlan | null>(null);
  const [subtaskProgress, setSubtaskProgress] = useState<number>(-1);
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
        simulateProgress(data.agentPlan.subtasks);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function simulateProgress(subtasks: Subtask[]) {
    let i = 0;
    const interval = setInterval(() => {
      setSubtaskProgress(i);
      i++;
      if (i >= subtasks.length) {
        clearInterval(interval);
        setTimeout(() => setPosted(true), 1000);
      }
    }, 1800);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0b0f", color: "#e8e6e1", fontFamily: "'IBM Plex Mono', monospace" }}>
      <header style={{ borderBottom: "1px solid #1e2030", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, #00d4aa, #0088ff)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "700", color: "#000" }}>A</div>
          <span style={{ fontSize: "18px", fontWeight: "700" }}>AutoGig</span>
          <span style={{ fontSize: "11px", background: "#1e2030", padding: "2px 8px", borderRadius: "4px", color: "#00d4aa", border: "1px solid #00d4aa30" }}>Arc Testnet</span>
        </div>
        <div style={{ padding: "6px 14px", background: "#00d4aa15", border: "1px solid #00d4aa40", borderRadius: "6px", fontSize: "13px", color: "#00d4aa" }}>Connect Wallet</div>
      </header>

      <div style={{ textAlign: "center", padding: "4rem 2rem 2rem", borderBottom: "1px solid #1e2030" }}>
        <div style={{ fontSize: "11px", color: "#00d4aa", letterSpacing: "3px", marginBottom: "16px" }}>POWERED BY ARC + CIRCLE USDC</div>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: "800", letterSpacing: "-2px", margin: "0 0 16px", lineHeight: "1.1" }}>
          The autonomous<br />
          <span style={{ background: "linear-gradient(90deg, #00d4aa, #0088ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>gig economy</span>
        </h1>
        <p style={{ color: "#6b7280", fontSize: "16px", maxWidth: "480px", margin: "0 auto 32px", lineHeight: "1.6" }}>
          Post a task, lock USDC, and let AI agents autonomously execute it. Payment releases on completion.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "32px", fontSize: "14px", color: "#6b7280" }}>
          <span>⚡ Sub-second settlement</span>
          <span>💵 USDC gas fees</span>
          <span>🤖 Fully autonomous</span>
        </div>
      </div>

      <div style={{ display: "flex", borderBottom: "1px solid #1e2030", padding: "0 2rem" }}>
        {(["browse", "post", "agent"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "14px 24px", background: "none", border: "none", borderBottom: tab === t ? "2px solid #00d4aa" : "2px solid transparent", color: tab === t ? "#00d4aa" : "#6b7280", cursor: "pointer", fontSize: "13px", fontFamily: "inherit", fontWeight: tab === t ? "600" : "400", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "-1px" }}>
            {t === "browse" ? "Browse Gigs" : t === "post" ? "Post a Gig" : "Agent Activity"}
          </button>
        ))}
      </div>

      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
        {tab === "browse" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ margin: 0, fontSize: "18px" }}>Open Gigs</h2>
              <button onClick={() => setTab("post")} style={{ padding: "8px 20px", background: "#00d4aa", color: "#000", border: "none", borderRadius: "6px", cursor: "pointer", fontFamily: "inherit", fontSize: "13px", fontWeight: "700" }}>+ Post Gig</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {SAMPLE_GIGS.map((gig) => (
                <div key={gig.id} style={{ border: "1px solid #1e2030", borderRadius: "10px", padding: "20px", background: "#0d0f18", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: "600", marginBottom: "6px", fontSize: "15px" }}>{gig.title}</div>
                    <span style={{ padding: "2px 8px", borderRadius: "4px", fontSize: "11px", background: gig.status === "Open" ? "#00d4aa20" : "#ff880020", color: gig.status === "Open" ? "#00d4aa" : "#ff8800", border: `1px solid ${gig.status === "Open" ? "#00d4aa40" : "#ff880040"}` }}>{gig.status}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "20px", fontWeight: "800", color: "#00d4aa" }}>${gig.bounty}</div>
                    <div style={{ fontSize: "11px", color: "#6b7280" }}>USDC</div>
                    <button style={{ marginTop: "8px", padding: "6px 16px", background: "none", border: "1px solid #1e2030", borderRadius: "6px", color: "#e8e6e1", cursor: "pointer", fontFamily: "inherit", fontSize: "12px" }}>Take Gig</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "post" && (
          <div style={{ maxWidth: "600px" }}>
            <h2 style={{ margin: "0 0 24px", fontSize: "18px" }}>Post a New Gig</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#6b7280", marginBottom: "6px", letterSpacing: "1px" }}>TASK TITLE</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Write a market research report on AI trends" style={{ width: "100%", padding: "12px 14px", background: "#0d0f18", border: "1px solid #1e2030", borderRadius: "8px", color: "#e8e6e1", fontFamily: "inherit", fontSize: "14px", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#6b7280", marginBottom: "6px", letterSpacing: "1px" }}>DESCRIPTION</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what you need..." rows={4} style={{ width: "100%", padding: "12px 14px", background: "#0d0f18", border: "1px solid #1e2030", borderRadius: "8px", color: "#e8e6e1", fontFamily: "inherit", fontSize: "14px", resize: "vertical", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#6b7280", marginBottom: "6px", letterSpacing: "1px" }}>BOUNTY (USDC)</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {["1", "3", "5", "10", "25"].map((v) => (
                    <button key={v} onClick={() => setBounty(v)} style={{ padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontFamily: "inherit", fontSize: "13px", fontWeight: "600", background: bounty === v ? "#00d4aa" : "none", color: bounty === v ? "#000" : "#e8e6e1", border: bounty === v ? "1px solid #00d4aa" : "1px solid #1e2030" }}>${v}</button>
                  ))}
                </div>
              </div>
              <button onClick={handlePost} disabled={!title || !description || loading} style={{ padding: "14px", background: (!title || !description) ? "#1e2030" : "linear-gradient(90deg, #00d4aa, #0088ff)", color: (!title || !description) ? "#6b7280" : "#000", border: "none", borderRadius: "8px", cursor: (!title || !description) ? "not-allowed" : "pointer", fontFamily: "inherit", fontSize: "14px", fontWeight: "700" }}>
                {loading ? "🤖 AI Agent Processing..." : "POST GIG + LOCK USDC ON ARC →"}
              </button>
            </div>
          </div>
        )}

        {tab === "agent" && (
          <div>
            <h2 style={{ margin: "0 0 24px", fontSize: "18px" }}>Agent Activity</h2>
            {!agentPlan && !loading && (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#6b7280" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🤖</div>
                <p>No active agent session. Post a gig to see agent activity.</p>
              </div>
            )}
            {loading && (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: "32px", marginBottom: "16px" }}>⚙️</div>
                <p style={{ color: "#00d4aa" }}>AI Agent analyzing task...</p>
              </div>
            )}
            {agentPlan && (
              <div>
                <div style={{ background: "#0d0f18", border: "1px solid #1e2030", borderRadius: "10px", padding: "20px", marginBottom: "20px" }}>
                  <div style={{ fontSize: "11px", color: "#00d4aa", letterSpacing: "2px", marginBottom: "8px" }}>AGENT ANALYSIS</div>
                  <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.6", color: "#c9c7c2" }}>{agentPlan.analysis}</p>
                  <div style={{ display: "flex", gap: "16px", marginTop: "12px", fontSize: "12px", color: "#6b7280" }}>
                    <span>⏱ {agentPlan.estimatedTime}</span>
                    <span>💵 ${bounty} USDC bounty</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {agentPlan.subtasks.map((subtask, i) => {
                    const isDone = subtaskProgress > i;
                    const isRunning = subtaskProgress === i;
                    return (
                      <div key={subtask.id} style={{ border: `1px solid ${isDone ? "#00d4aa40" : isRunning ? "#0088ff40" : "#1e2030"}`, borderRadius: "10px", padding: "16px", background: isDone ? "#00d4aa08" : isRunning ? "#0088ff08" : "#0d0f18", transition: "all 0.3s" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                          <span>{isDone ? "✅" : isRunning ? "⚡" : "⏳"}</span>
                          <span style={{ fontWeight: "600", fontSize: "14px" }}>{subtask.worker}</span>
                          <span style={{ marginLeft: "auto", fontSize: "11px", padding: "2px 8px", borderRadius: "4px", background: isDone ? "#00d4aa20" : isRunning ? "#0088ff20" : "#1e2030", color: isDone ? "#00d4aa" : isRunning ? "#4da6ff" : "#6b7280" }}>
                            {isDone ? "COMPLETE" : isRunning ? "RUNNING" : "PENDING"}
                          </span>
                        </div>
                        <p style={{ margin: "0 0 6px", fontSize: "13px", color: "#c9c7c2" }}>{subtask.task}</p>
                        <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>Output: {subtask.expectedOutput}</p>
                      </div>
                    );
                  })}
                </div>
                {posted && (
                  <div style={{ marginTop: "20px", background: "#00d4aa10", border: "1px solid #00d4aa40", borderRadius: "10px", padding: "20px", textAlign: "center" }}>
                    <div style={{ fontSize: "24px", marginBottom: "8px" }}>🎉</div>
                    <div style={{ fontWeight: "700", fontSize: "16px", color: "#00d4aa", marginBottom: "4px" }}>Gig Posted Successfully!</div>
                    <div style={{ fontSize: "13px", color: "#6b7280" }}>${bounty} USDC locked on Arc smart contract.</div>
                    <div style={{ marginTop: "12px", fontSize: "12px", color: "#4da6ff" }}>View on Arc Explorer → testnet.arcscan.app</div>
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
