import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_KEY");
    const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL");

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_KEY || !ADMIN_EMAIL) {
      throw new Error("Required env vars missing (LOVABLE_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY, ADMIN_EMAIL)");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `
You are UIETConnectBot.

IMPORTANT RULE:
If you are not 100% sure about the answer → reply with EXACTLY:

"I am not fully sure about this. I will forward your query to the Admin now. Please wait for a response."

No guessing. No hallucination.`
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) throw new Error("AI completion request failed");

    // *** Stream the AI response back to the client ***
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          fullText += chunk;
          controller.enqueue(value);
        }

        controller.close();

        // Detect unresolved -> store & notify admin
        if (fullText.includes("I am not fully sure about this")) {
          const userMessage = messages[messages.length - 1].content;
          const userId = messages.find(m => m.role === "user")?.user_id ?? null;

          await supabase.from("unresolved_queries").insert({
            user_message: userMessage,
            user_id: userId,
          });

          await supabase.functions.invoke("send-email", {
            body: {
              to: ADMIN_EMAIL,
              subject: "New Unresolved Student Query",
              text: `A student asked:\n\n"${userMessage}"\n\nPlease review it in the admin panel.`,
            },
          });

          console.log("✅ Unresolved query logged & admin notified");
        }
      }
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (err) {
    console.error("chat error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
