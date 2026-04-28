const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  // This handles the browser preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    console.log("send-contact-email function started");
    console.log("RESEND_API_KEY exists:", !!RESEND_API_KEY);

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    const body = await req.json();
    console.log("Received contact form body:", body);

    const {
      name,
      email,
      phone,
      intent,
      message,
      source_site,
    } = body;

    if (!name || !email || !phone) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <h2>New Pinnacle Realty Contact Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Intent:</strong> ${intent || "Not provided"}</p>
        <p><strong>Source Site:</strong> ${source_site || "pinnaclerealty.ca"}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${message || "No message provided."}</p>
      </div>
    `;

    console.log("Sending email through Resend...");

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Pinnacle Realty <noreply@pinnaclerealty.ca>",
        to: ["marketing@pinnaclerealty.ca"],
        reply_to: email,
        subject: `New Pinnacle Realty Contact Inquiry - ${name}`,
        html: emailHtml,
      }),
    });

    const resendData = await resendResponse.json();

    console.log("Resend response status:", resendResponse.status);
    console.log("Resend response data:", resendData);

    if (!resendResponse.ok) {
      return new Response(JSON.stringify({ error: resendData }), {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify({ success: true, data: resendData }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("send-contact-email error:", error);

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});