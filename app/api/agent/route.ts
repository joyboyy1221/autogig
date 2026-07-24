import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { task, description, bounty } = await req.json();

  if (!task || !description) {
    return NextResponse.json({ error: "Task and description required" }, { status: 400 });
  }

  const mockPlan = {
    analysis: `Breaking down "${task}" into 3 autonomous subtasks for execution on Arc. USDC bounty of $${bounty} locked in smart contract.`,
    subtasks: [
      { id: 1, worker: "Research Agent", task: `Research and gather all relevant data for: ${task}`, expectedOutput: "Comprehensive research report", status: "pending" },
      { id: 2, worker: "Execution Agent", task: `Execute core deliverable: ${description}`, expectedOutput: "Completed work product", status: "pending" },
      { id: 3, worker: "Quality Agent", task: "Verify output quality and approve USDC release", expectedOutput: "Quality approval + payment trigger", status: "pending" }
    ],
    estimatedTime: "3-5 minutes",
    paymentSplit: { research: 30, execution: 50, quality: 20 }
  };

  return NextResponse.json({ success: true, agentPlan: mockPlan });
}
