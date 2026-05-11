import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email")?.trim().toLowerCase();

    if (!email) {
      return new Response("Missing email.", { status: 400 });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SERVICE_ROLE_KEY")!
    );

    await supabase
      .from("monthly_subscribers")
      .update({
        status: "unsubscribed",
        unsubscribed_at: new Date().toISOString(),
      })
      .eq("email", email);

    return new Response(
      `
      <html>
        <body style="background:#050505;color:#f8f3eb;font-family:Arial;padding:40px;">
          <div style="max-width:600px;margin:auto;border:1px solid #333;border-radius:20px;padding:30px;">
            <h1 style="color:#efc76d;">You have been unsubscribed.</h1>
            <p>You will no longer receive monthly Pinnacle Realty updates.</p>
          </div>
        </body>
      </html>
      `,
      {
        status: 200,
        headers: { "Content-Type": "text/html" },
      }
    );
  } catch {
    return new Response("Something went wrong.", { status: 500 });
  }
});