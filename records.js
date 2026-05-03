// functions/records.js
// Cloudflare Pages Function — auto-deployed alongside your static site
// The API key never reaches the browser

const AIRTABLE_API_KEY = "pat7Kn9CxSPPIeUzD.471e2aac869456d0dba3df0c46e7e3444ad670bfdfb698b03f37f03dbc7687bc";
const AIRTABLE_BASE_ID = "appSdGbCOIMBLAPDM";
const AIRTABLE_TABLE   = "Survey Responses";
const AIRTABLE_URL     = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE)}`;

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequest(context) {
  const { request } = context;

  // CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  // GET — fetch records for results dashboard
  if (request.method === "GET") {
    const url    = new URL(request.url);
    const offset = url.searchParams.get("offset") || "";
    const atUrl  = AIRTABLE_URL + "?pageSize=100" + (offset ? `&offset=${offset}` : "");

    const res  = await fetch(atUrl, {
      headers: { "Authorization": `Bearer ${AIRTABLE_API_KEY}`, "Content-Type": "application/json" }
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { ...CORS, "Content-Type": "application/json" }
    });
  }

  // POST — submit survey answers
  if (request.method === "POST") {
    const body = await request.json();
    const res  = await fetch(AIRTABLE_URL, {
      method:  "POST",
      headers: { "Authorization": `Bearer ${AIRTABLE_API_KEY}`, "Content-Type": "application/json" },
      body:    JSON.stringify(body)
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { ...CORS, "Content-Type": "application/json" }
    });
  }

  return new Response("Not found", { status: 404, headers: CORS });
}
