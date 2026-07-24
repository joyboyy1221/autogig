import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { task, description, bounty } = await req.json();

  if (!task || !description) {
    return NextResponse.json({ error: "Task and description required" }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: `You are AutoGig's AI Agent. Break tasks into exactly 3 subtasks. Always respond in valid JSON only, no other text.`,
        messages: [
          {
            role: "user",
            content: `Task: "${task}"\nDescription: "${description}"\nBounty: $${bounty} USDC\n\nRespond with this exact JSON:\n{"analysis":"Brief analysis","subtasks":[{"id":1,"worker":"Research Agent","task":"subtask","expectedOutput":"output","status":"pending"},{"id":2,"worker":"Execution Agent","task":"subtask","expectedOutput":"output","status":"pending"},{"id":3,"worker":"Quality Agent","task":"subtask","expectedOutput":"output","status":"pending"}],"estimatedTime":"time","paymentSplit":{"research":30,"execution":50,"quality":20}}`,
          },
        ],
      }),
    });

    const data = await response.json();
    const content = data.content[0].text;
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = JSON.parse(content.replace(/```json|```/g, "").trim());
    }
    return NextResponse.json({ success: true, agentPlan: parsed });
  } catch (error) {
    console.error("Agent error:", error);
    return NextResponse.json({ error: "Agent failed" }, { status: 500 });
  }
}
