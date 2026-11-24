// Booking API client, Turnstile, Google Places suggestions, lead source and
// analytics for the /book page. All config comes from NEXT_PUBLIC_* build vars.

export const BOOKING_API = process.env.NEXT_PUBLIC_BOOKING_API || "";
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
export const PLACES_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY || "";
export const BUSINESS_PHONE = "+13466674364";
export const BUSINESS_PHONE_PRETTY = "(346) 667-4364";
export const SMS_LINK = "sms:+13466674364?body=Hi!%20I%20would%20like%20to%20book%20an%20appointment%20for%20a%20console%20repair.";

export class ApiError extends Error {
  constructor(status, code, body = {}) {
    super(code);
    this.status = status;
    this.code = code;
    this.body = body;
  }
}

async function request(path, { method = "GET", body, headers = {} } = {}) {
  let response;
  try {
    response = await fetch(`${BOOKING_API}${path}`, {
      method,
      headers: { ...(body ? { "Content-Type": "application/json" } : {}), ...headers },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "network");
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(response.status, data.error || "generic", data);
  return data;
}

export const api = {
  status: () => request("/status"),
  checkArea: (payload) => request("/check-area", { method: "POST", body: payload }),
  days: (areaToken) => request(`/days?areaToken=${encodeURIComponent(areaToken)}`),
  slots: (areaToken, date, holdId) => request(`/slots?areaToken=${encodeURIComponent(areaToken)}&date=${date}${holdId ? `&holdId=${encodeURIComponent(holdId)}` : ""}`),
  hold: (payload) => request("/hold", { method: "POST", body: payload }),
  book: (payload, idempotencyKey) => request("/book", { method: "POST", body: payload, headers: { "Idempotency-Key": idempotencyKey } }),
};

export function uuid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

// ── analytics (GA4 is already on the site) ──

export function track(name, params = {}) {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") window.gtag("event", name, params);
  } catch {
    // Analytics must never break booking.
  }
}

// ── lead source: utm_* and referrer captured on landing, kept for the session ──

const LEAD_KEY = "wfc-lead";

export function captureLead() {
  try {
    if (sessionStorage.getItem(LEAD_KEY)) return;
    const params = new URLSearchParams(window.location.search);
    const referrer = document.referrer && !document.referrer.startsWith(window.location.origin) ? document.referrer : "";
    sessionStorage.setItem(
      LEAD_KEY,
      JSON.stringify({ source: params.get("utm_source") || "", medium: params.get("utm_medium") || "", campaign: params.get("utm_campaign") || "", referrer: referrer.slice(0, 200) })
    );
  } catch {
    // Private mode: no lead source, booking still works.
  }
}

export function readLead() {
  try {
    return JSON.parse(sessionStorage.getItem(LEAD_KEY) || "{}");
  } catch {
    return {};
  }
}

// ── Turnstile (invisible, run on demand) ──

let turnstileReady = null;
let widgetId = null;
let pending = null;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded) resolve();
      else existing.addEventListener("load", () => resolve(), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = "1";
      resolve();
    };
    script.onerror = () => reject(new Error(`failed to load ${src}`));
    document.head.appendChild(script);
  });
}

export function prepareTurnstile(container) {
  if (!TURNSTILE_SITE_KEY || typeof window === "undefined") return Promise.resolve(false);
  if (!turnstileReady) {
    turnstileReady = loadScript("https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit")
      .then(() => {
        widgetId = window.turnstile.render(container, {
          sitekey: TURNSTILE_SITE_KEY,
          execution: "execute",
          appearance: "interaction-only",
          callback: (token) => pending?.resolve(token),
          "error-callback": () => pending?.reject(new Error("turnstile")),
          "expired-callback": () => window.turnstile.reset(widgetId),
        });
        return true;
      })
      .catch(() => {
        turnstileReady = null;
        return false;
      });
  }
  return turnstileReady;
}

// A fresh single-use token. Empty string when Turnstile is not configured.
export async function turnstileToken(container) {
  if (!TURNSTILE_SITE_KEY) return "";
  const ready = await prepareTurnstile(container);
  if (!ready) return "";
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("turnstile timeout")), 20000);
    pending = {
      resolve: (token) => {
        clearTimeout(timer);
        pending = null;
        resolve(token);
      },
      reject: (error) => {
        clearTimeout(timer);
        pending = null;
        reject(error);
      },
    };
    try {
      window.turnstile.reset(widgetId);
      window.turnstile.execute(widgetId);
    } catch (error) {
      pending.reject(error);
    }
  });
}

// ── Google Places (New) suggestions, only when a browser key is set ──

let placesLib = null;
let sessionToken = null;

async function loadPlaces() {
  if (!PLACES_KEY) return null;
  if (!placesLib) {
    placesLib = (async () => {
      await loadScript(`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(PLACES_KEY)}&v=weekly&loading=async&libraries=places&callback=Function.prototype`);
      for (let i = 0; i < 50 && !window.google?.maps?.importLibrary; i++) await new Promise((r) => setTimeout(r, 100));
      return window.google.maps.importLibrary("places");
    })().catch(() => {
      placesLib = null;
      return null;
    });
  }
  return placesLib;
}

export const placesEnabled = () => Boolean(PLACES_KEY);

// [{ placeId, text }] for what the customer has typed, US only, biased to Houston.
export async function suggestAddresses(input) {
  const lib = await loadPlaces();
  if (!lib || input.trim().length < 3) return [];
  try {
    if (!sessionToken) sessionToken = new lib.AutocompleteSessionToken();
    const { suggestions } = await lib.AutocompleteSuggestion.fetchAutocompleteSuggestions({
      input,
      sessionToken,
      includedRegionCodes: ["us"],
      locationBias: { center: { lat: 29.7604, lng: -95.3698 }, radius: 50000 },
    });
    return (suggestions || []).filter((s) => s.placePrediction).slice(0, 5).map((s) => ({ placeId: s.placePrediction.placeId, text: s.placePrediction.text.toString() }));
  } catch {
    return [];
  }
}

export function endPlacesSession() {
  sessionToken = null;
}

// ── calendar links for the confirmed screen ──

const compact = (iso) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export function googleCalendarLink({ start, end, title, address, details }) {
  const params = new URLSearchParams({ action: "TEMPLATE", text: title, dates: `${compact(start)}/${compact(end)}`, location: address, details });
  return `https://calendar.google.com/calendar/render?${params}`;
}

export function icsDataUri({ start, end, title, address, details, uid }) {
  const esc = (text) => String(text).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//We-Fix-Consoles//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${uid}@we-fix-consoles.com`,
    `DTSTAMP:${compact(new Date().toISOString())}`,
    `DTSTART:${compact(start)}`,
    `DTEND:${compact(end)}`,
    `SUMMARY:${esc(title)}`,
    `LOCATION:${esc(address)}`,
    `DESCRIPTION:${esc(details)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

// "3465550123" -> "(346) 555-0123" as the customer types.
export function formatPhoneInput(value) {
  const digits = value.replace(/\D/g, "").replace(/^1(?=\d{10})/, "").slice(0, 10);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}
