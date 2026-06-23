interface Env {
  TURNSTILE_SECRET_KEY: string;
  RESEND_API_KEY: string;
  TO_EMAIL_ADDRESS: string;
}

const log = (message: string, data?: Record<string, any>) => {
  console.log({
    body: {
      message,
      data,
    }
  });
};

interface TurnstileVerifyResponse {
  success: boolean;
  "error-codes"?: string[];
}

const corsHeaders = (origin: string) => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
});

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin") ?? "";
    const headers = corsHeaders(origin);
    log("Incoming request", { origin, method: request.method });

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ success: false, message: "Method not allowed" }),
        { status: 405, headers }
      );
    }

    let body: {
      email: string;
      name: string;
      subject: string;
      message: string;
      turnstileToken: string;
    };

    try {
      body = await request.json();
    } catch {
      log("Invalid JSON body received");
      return new Response(
        JSON.stringify({ success: false, message: "Invalid request body" }),
        { status: 400, headers }
      );
    }

    const { email, name, subject, message, turnstileToken } = body;

    if (!turnstileToken) {
      log("Missing bot check token");
      return new Response(
        JSON.stringify({ success: false, message: "Missing bot check token" }),
        { status: 400, headers }
      );
    }

    // Verify Turnstile
    const verifyResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: env.TURNSTILE_SECRET_KEY,
          response: turnstileToken,
        }),
      }
    );

    const verifyData = await verifyResponse.json<TurnstileVerifyResponse>();

    if (!verifyData.success) {
      return new Response(
        JSON.stringify({ success: false, message: "Bot check failed" }),
        { status: 403, headers }
      );
    }

    // Send email via Resend
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "contact@martinjai.me",
        to: env.TO_EMAIL_ADDRESS,
        reply_to: email,
        subject: `Personal Site Contact: ${subject}`,
        html: `
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr />
          <p>${message.replace(/\n/g, "<br />")}</p>
        `,
      }),
    });

    if (!resendResponse.ok) {
      return new Response(
        JSON.stringify({ success: false, message: "Failed to send email" }),
        { status: 500, headers }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Message sent" }),
      { status: 200, headers }
    );
  },
};
