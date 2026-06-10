type Json = Record<string, unknown>;

const rateWindowMs = 10 * 60 * 1000; // 10 minutes
const maxRequests = 20;
const rateMap = new Map<string, { count: number; windowStart: number }>();

const sanitize = (value: string) =>
  value.replace(/<[^>]*>?/gm, "").replace(/[\u0000-\u001F\u007F]/g, "").trim();

const safeNumber = (value: unknown) => {
  const numberValue = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numberValue) ? numberValue : "";
};

const isValidLead = (data: { name: string; whatsapp: string; message?: string }) => {
  const name = sanitize(data.name || "");
  const whatsapp = sanitize(data.whatsapp || "");
  const message = sanitize(data.message || "");

  if (!name || name.length > 80) return false;
  if (!/^\d{10,15}$/.test(whatsapp)) return false;
  if (message && message.length > 500) return false;
  return true;
};

const json = (res: any, status: number, body: Json) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { success: false, message: "Method not allowed." });
  }

  const ipHeader = req.headers["x-forwarded-for"];
  const ip = Array.isArray(ipHeader) ? ipHeader[0] : (ipHeader || "unknown").toString().split(",")[0].trim();
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now - entry.windowStart > rateWindowMs) {
    rateMap.set(ip, { count: 1, windowStart: now });
  } else {
    if (entry.count >= maxRequests) {
      res.setHeader("Retry-After", "600");
      return json(res, 429, { success: false, message: "Too many requests. Try again later." });
    }
    entry.count += 1;
    rateMap.set(ip, entry);
  }

  const { name, whatsapp, email, city, message, m2, floors, rooms, bathrooms, material, price } = req.body || {};
  if (!isValidLead({ name, whatsapp, message })) {
    return json(res, 400, { success: false, message: "Invalid lead data." });
  }

  const webhookUrl = process.env.WEBHOOK_URL;
  const webhookToken = process.env.WEBHOOK_TOKEN;
  if (!webhookUrl || !webhookToken) {
    return json(res, 500, { success: false, message: "Server not configured." });
  }

  const payload = {
    token: webhookToken,
    name: sanitize(name || ""),
    whatsapp: sanitize(whatsapp || ""),
    email: sanitize(email || ""),
    city: sanitize(city || ""),
    message: sanitize(message || ""),
    m2: safeNumber(m2),
    floors: safeNumber(floors),
    rooms: safeNumber(rooms),
    bathrooms: safeNumber(bathrooms),
    material: sanitize(material || ""),
    price: safeNumber(price),
  };

  try {
    console.info("Webhook payload summary", {
      name: Boolean(payload.name),
      nameLength: payload.name.length,
      whatsappLength: payload.whatsapp.length,
      email: Boolean(payload.email),
      emailLength: payload.email.length,
      city: Boolean(payload.city),
      cityLength: payload.city.length,
      message: Boolean(payload.message),
      messageLength: payload.message.length,
      m2: payload.m2 !== "",
      floors: payload.floors !== "",
      rooms: payload.rooms !== "",
      bathrooms: payload.bathrooms !== "",
      material: Boolean(payload.material),
      materialLength: payload.material.length,
      price: payload.price !== "",
    });

    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${webhookToken}`,
        "X-Webhook-Token": webhookToken,
      },
      body: JSON.stringify(payload),
    });
    const webhookText = await webhookResponse.text();
    console.info("Webhook response", {
      status: webhookResponse.status,
      ok: webhookResponse.ok,
      bodyLength: webhookText.length,
    });

    if (!webhookResponse.ok) {
      return json(res, 502, { success: false, message: "Webhook returned an error." });
    }
  } catch (err) {
    console.error("Webhook request failed", {
      errorType: err instanceof Error ? err.name : typeof err,
    });
    return json(res, 500, { success: false, message: "Webhook request failed." });
  }

  return json(res, 200, { success: true, message: "Gracias. Un asesor se contactara contigo pronto." });
}
