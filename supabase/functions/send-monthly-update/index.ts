import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const authHeader = req.headers.get("Authorization");
    const cronSecret = Deno.env.get("CRON_SECRET");

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!supabaseUrl || !serviceRoleKey || !resendApiKey) {
      return new Response(JSON.stringify({ error: "Missing environment variables." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: subscribers, error } = await supabase
      .from("monthly_subscribers")
      .select("id, email")
      .eq("status", "active");

    if (error) throw error;

    if (!subscribers || subscribers.length === 0) {
      return new Response(JSON.stringify({ success: true, sent: 0, failed: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    let sentCount = 0;
    const failedEmails: string[] = [];

    for (const subscriber of subscribers) {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <body style="margin:0;padding:0;background:#050505;font-family:Arial,Helvetica,sans-serif;color:#f8f3eb;">
            <div style="max-width:680px;margin:0 auto;padding:36px 20px;">
              <div style="border:1px solid rgba(239,199,109,0.28);border-radius:26px;padding:36px;background:linear-gradient(180deg,#111111,#070707);">
                <p style="margin:0 0 16px;color:#efc76d;letter-spacing:4px;text-transform:uppercase;font-size:12px;font-weight:bold;">
                  Pinnacle Realty
                </p>

                <h1 style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:36px;line-height:1.1;color:#ffffff;">
                  Your monthly Pinnacle update is here.
                </h1>

                <p style="margin:0 0 26px;font-size:16px;line-height:1.75;color:#d8d0c4;">
                  Stay connected with market updates, real estate insights, new opportunities, and the latest Pinnacle Realty news.
                </p>

                <a href="https://blogs.pinnaclerealty.ca/"
                   style="display:inline-block;background:#efc76d;color:#111111;text-decoration:none;font-weight:bold;letter-spacing:2px;text-transform:uppercase;font-size:13px;padding:15px 24px;border-radius:14px;">
                  Read Monthly Updates
                </a>

                <p style="margin:30px 0 0;font-size:13px;line-height:1.7;color:#9f978d;">
                  You are receiving this because you subscribed to monthly Pinnacle Realty updates.
                </p>
              </div>
            </div>
          </body>
        </html>
      `;

      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Pinnacle Realty <marketing@pinnaclerealty.ca>",
          to: subscriber.email,
          subject: "Your Monthly Pinnacle Realty Update",
          html: emailHtml,
        }),
      });

      if (resendResponse.ok) {
        sentCount++;

        await supabase
          .from("monthly_subscribers")
          .update({ last_email_sent_at: new Date().toISOString() })
          .eq("id", subscriber.id);
      } else {
        failedEmails.push(subscriber.email);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      sent: sentCount,
      failed: failedEmails,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: String(error?.message || error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});