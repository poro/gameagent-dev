import { NextRequest, NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const AUDIENCE_NAME = "Game Agent Newsletter";
const FROM_EMAIL = process.env.FROM_EMAIL || "dufus@game-agents.com";

async function resend(path: string, body: Record<string, unknown>) {
  return fetch(`https://api.resend.com${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

async function getOrCreateAudience(): Promise<string> {
  // List existing audiences
  const list = await fetch("https://api.resend.com/audiences", {
    headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
  });

  if (list.ok) {
    const { data } = await list.json();
    const existing = data?.find(
      (a: { name: string }) => a.name === AUDIENCE_NAME
    );
    if (existing) return existing.id;
  }

  // Create new audience
  const create = await resend("/audiences", { name: AUDIENCE_NAME });
  if (!create.ok) {
    const err = await create.text();
    throw new Error(`Failed to create audience: ${err}`);
  }
  const { id } = await create.json();
  return id;
}

export async function POST(req: NextRequest) {
  try {
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return NextResponse.json(
        { error: "Newsletter service is not configured." },
        { status: 503 }
      );
    }

    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const audienceId = await getOrCreateAudience();

    // Add contact to audience
    const contactRes = await resend(`/audiences/${audienceId}/contacts`, {
      email,
    });

    if (!contactRes.ok) {
      const err = await contactRes.text();
      console.error("Failed to add contact:", err);
      return NextResponse.json(
        { error: "Failed to subscribe. Please try again." },
        { status: 500 }
      );
    }

    // Send welcome email
    await resend("/emails", {
      from: FROM_EMAIL,
      to: email,
      subject: "Welcome to Game Agent!",
      html: `<h2>You're in!</h2>
<p>Thanks for subscribing to the Game Agent newsletter.</p>
<p>You'll get notified about new streams, project launches, and behind-the-scenes updates.</p>
<p>— Dufus 🤖</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
