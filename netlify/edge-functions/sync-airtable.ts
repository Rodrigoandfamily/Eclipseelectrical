import type { Context } from "netlify:edge";
export default async function handler(request: Request, context: Context) {
  if (request.method !== "POST") return new Response("405", { status: 405 });
  const payload = await request.json();
  const r = payload.record;
  if (!r?.id) return new Response("Missing ID", { status: 400 });
  const base = Netlify.env.get("AIRTABLE_BASE_ID");
  const table = Netlify.env.get("AIRTABLE_TABLE_NAME");
  const pat = Netlify.env.get("AIRTABLE_PAT");
  const supaUrl = Netlify.env.get("SUPABASE_URL");
  const supaKey = Netlify.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!base || !table || !pat || !supaUrl || !supaKey) return new Response("Config missing", { status: 500 });
  try {
    const atRes = await fetch(`https://api.airtable.com/v0/${base}/${encodeURIComponent(table)}`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${pat}`, "Content-Type": "application/json" },
      body: JSON.stringify({ records: [{ fields: { Name: r.name, Email: r.email, Message: r.message || "", Source: r.source || "web", Consent: r.consent, "IP Address": r.ip_address || "", "Supabase ID": r.id } }] })
    });
    const data = await atRes.json();
    const status = atRes.ok ? "success" : "failed";
    await fetch(`${supaUrl}/rest/v1/crm_sync_status`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": supaKey, "Authorization": `Bearer ${supaKey}`, "Prefer": "return=minimal" },
      body: JSON.stringify({ lead_id: r.id, crm_provider: "airtable", crm_record_id: data?.records?.[0]?.id || null, status, error_message: !atRes.ok ? JSON.stringify(data) : null })
    });
    return new Response(JSON.stringify({ status }), { status: atRes.ok ? 200 : 500, headers: { "Content-Type": "application/json" } });
  } catch { return new Response("Sync failed", { status: 500 }); }
}
