import type { Context } from "netlify:edge";
export default async function handler(request: Request, context: Context) {
  if (request.method !== "POST") return new Response("405", { status: 405 });
  const fd = await request.formData();
  if (fd.get("bot-field")) return new Response("403", { status: 403 });
  const name = fd.get("name")?.toString().trim();
  const email = fd.get("email")?.toString().trim();
  const consent = fd.get("consent") === "true";
  if (!name || !email || !consent) return new Response("Missing fields", { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return new Response("Bad email", { status: 400 });
  const url = Netlify.env.get("SUPABASE_URL");
  const key = Netlify.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return new Response("Config missing", { status: 500 });
  const res = await fetch(`${url}/rest/v1/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "apikey": key, "Authorization": `Bearer ${key}`, "Prefer": "return=minimal" },
    body: JSON.stringify({ name, email, message: fd.get("message") || "", consent: true, ip_address: request.headers.get("x-forwarded-for") || "unknown" })
  });
  return res.ok ? new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } }) : new Response("DB fail", { status: 500 });
}
