"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarPlus,
  Check,
  Clock,
  HelpCircle,
  Loader2,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  Star,
  Wrench,
} from "lucide-react";
import { formatPrice, getService } from "@/lib/services";
import { STRINGS, dayText, houstonToday, longDateText, longDayText, monthDayText, windowText } from "@/lib/booking/i18n";
import {
  ApiError,
  BOOKING_API,
  BUSINESS_PHONE,
  BUSINESS_PHONE_PRETTY,
  SMS_LINK,
  api,
  captureLead,
  formatPhoneInput,
  googleCalendarLink,
  icsDataUri,
  prepareTurnstile,
  readLead,
  smsLink,
  track,
  turnstileToken,
  uuid,
} from "@/lib/booking/api";

const STEPS = ["address", "service", "day", "time", "details", "confirm"];
// Each bookable service: its entry in the site's price list (lib/services) and
// which devices it is for. Liquid metal is PS5 only; stick drift is controllers only.
const SERVICES = {
  hdmi: { priceId: "hdmi-port", devices: "console" },
  hdmi_liquid_metal: { priceId: "hdmi-liquid-metal", devices: "ps5" },
  deep_clean: { priceId: "deep-clean", devices: "console" },
  deep_clean_liquid_metal: { priceId: "deep-clean-liquid-metal", devices: "ps5" },
  stick_drift: { priceId: "stick-drift", devices: "controller" },
  fan_connector: { priceId: "fan-connector", devices: "console" },
  other: { priceId: null, devices: "console", describe: true },
};
const SERVICE_IDS = Object.keys(SERVICES);
const DEVICE_IDS = {
  console: ["ps5", "ps5_slim", "ps5_pro", "xbox_series_x", "xbox_series_s", "ps4", "xbox_one", "other"],
  ps5: ["ps5", "ps5_slim", "ps5_pro"],
  controller: ["dualsense", "dualshock4", "xbox_controller", "other_controller"],
};
const JOB_MINUTES = 60;
const IS_BETA = process.env.NEXT_PUBLIC_BOOKING_BETA === "1";

function priceEntry(id) {
  const priceId = SERVICES[id]?.priceId;
  if (!priceId) return null;
  try {
    return getService(priceId);
  } catch {
    return null;
  }
}

const servicePrice = (id) => (SERVICES[id]?.describe ? 0 : priceEntry(id)?.price ?? null);
const serviceIcon = (id) => priceEntry(id)?.icon || HelpCircle;
const deviceLabel = (t, id) => t.consoles[id] || t.controllers[id] || "";

const endOf = (startIso) => new Date(new Date(startIso).getTime() + JOB_MINUTES * 60000).toISOString();
const mmss = (ms) => {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
};

function initialLang() {
  try {
    const saved = localStorage.getItem("wfc-lang");
    if (saved === "en" || saved === "es") return saved;
  } catch {
    // ignore
  }
  return typeof navigator !== "undefined" && /^es\b/i.test(navigator.language || "") ? "es" : "en";
}

// ── small pieces ──

function PrimaryButton({ children, disabled, onClick, type = "button", busy }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || busy}
      className="w-full h-14 rounded-xl font-bold text-base text-white bg-primary hover:bg-primary-dark active:scale-[0.98] transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none disabled:active:scale-100"
    >
      {busy && <Loader2 className="w-5 h-5 animate-spin" />}
      {children}
    </button>
  );
}

function CallTextButtons({ t }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <a href={`tel:${BUSINESS_PHONE}`} className="h-14 rounded-xl font-bold text-base bg-primary text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
        <Phone className="w-5 h-5" />
        {t.call}
      </a>
      <a
        href={SMS_LINK}
        className="h-14 rounded-xl font-bold text-base bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-text-main dark:text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
      >
        <MessageSquare className="w-5 h-5 text-primary" />
        {t.text}
      </a>
    </div>
  );
}

function TextButton({ t, bookingId }) {
  return (
    <a
      href={smsLink(bookingId ? t.textBody(bookingId) : t.textBodyBook)}
      className="h-14 rounded-xl font-bold text-base bg-primary text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-primary/25"
    >
      <MessageSquare className="w-5 h-5" />
      {t.textUs(BUSINESS_PHONE_PRETTY)}
    </a>
  );
}

function Notice({ tone = "info", children }) {
  const tones = {
    info: "bg-primary/5 border-primary/20 text-text-main dark:text-slate-200",
    warn: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200",
    error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200",
  };
  return (
    <div role="status" className={`rounded-xl border px-4 py-3 text-sm leading-snug ${tones[tone]}`}>
      {children}
    </div>
  );
}

function Choice({ selected, onClick, children, disabled, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`rounded-xl border text-left transition-all active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100 ${
        selected
          ? "border-primary bg-primary/5 ring-2 ring-primary/30 dark:bg-primary/15"
          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-primary/50"
      } ${className}`}
    >
      {children}
    </button>
  );
}

function Field({ label, children, error }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-text-main dark:text-slate-200 mb-1.5">{label}</span>
      {children}
      {error && <span className="block text-sm text-red-600 dark:text-red-400 mt-1">{error}</span>}
    </label>
  );
}

const inputClass =
  "w-full h-13 min-h-[52px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-base text-text-main dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary";

// "from $99.99", or "Free diagnostic" for Other.
function priceText(t, service) {
  if (!service) return "";
  if (SERVICES[service]?.describe) return t.freeDiagnostic;
  const price = servicePrice(service);
  return price ? t.priceFrom(formatPrice(price)) : "";
}

function SummaryCard({ t, lang, area, service, consoleId, issue, start, onEdit }) {
  const what = service ? `${t.services[service].label} · ${deviceLabel(t, consoleId)}${SERVICES[service]?.describe && issue.trim() ? `\n"${issue.trim()}"` : ""}` : "";
  const price = priceText(t, service);
  const rows = [
    start && [t.when, `${longDayText(start, lang)}, ${windowText(start, endOf(start), t)}`, "time"],
    area && [t.where, area.address, "address"],
    service && [t.what, what, "service"],
    price && [t.price, price, null],
  ].filter(Boolean);
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-text-muted dark:text-slate-400 mb-2">{t.summary}</div>
      <dl className="space-y-2">
        {rows.map(([label, value, target]) => (
          <div key={label} className="flex items-start gap-3">
            <dt className="w-14 shrink-0 text-sm text-text-muted dark:text-slate-400">{label}</dt>
            <dd className="flex-1 text-sm font-semibold text-text-main dark:text-white whitespace-pre-line break-words">{value}</dd>
            {onEdit && target && (
              <button type="button" onClick={() => onEdit(target)} className="text-sm font-semibold text-primary shrink-0">
                {t.edit}
              </button>
            )}
          </div>
        ))}
      </dl>
    </div>
  );
}

// ── the flow ──

export default function BookingFlow() {
  const [lang, setLang] = useState("en");
  const t = STRINGS[lang];
  const [step, setStep] = useState("loading");
  const [notice, setNotice] = useState(null); // { tone, text }
  const [failure, setFailure] = useState(null); // { text, retry? }
  const [busy, setBusy] = useState(false);

  const [addressText, setAddressText] = useState("");
  const [suggestions, setSuggestions] = useState({ exact: null, streets: [] });
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [activeOption, setActiveOption] = useState(-1);
  const [area, setArea] = useState(null);
  const [service, setService] = useState("");
  const [consoleId, setConsoleId] = useState("");
  const [issue, setIssue] = useState("");
  const [days, setDays] = useState(null);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState(null);
  const [hold, setHold] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "", smsConsent: false });
  const [fieldErrors, setFieldErrors] = useState({});
  const [idempotencyKey, setIdempotencyKey] = useState("");
  const [result, setResult] = useState(null);
  const [now, setNow] = useState(() => Date.now());

  const turnstileBox = useRef(null);
  const topRef = useRef(null);
  const addressInput = useRef(null);
  const deviceRef = useRef(null);
  // Each keystroke starts a new suggestion round; older answers are dropped.
  const suggestRound = useRef(0);
  // The text a picked suggestion put in the box, so it is not looked up again.
  const pickedText = useRef("");
  const holdRef = useRef(null);
  holdRef.current = hold;
  const areaRef = useRef(null);
  areaRef.current = area;
  // Set when the customer taps Edit on the confirm screen: once they have
  // changed the service or the time, they go straight back to confirm.
  const returnToConfirm = useRef(false);

  // ── setup ──
  useEffect(() => {
    setLang(initialLang());
    captureLead();
    if (!BOOKING_API) {
      setStep("disabled");
      return;
    }
    // The address step shows right away. The status check (which also wakes
    // the server) runs behind it and only takes over if booking is switched
    // off; if the server can't be reached, the address check says so.
    setStep("address");
    try {
      window.history.replaceState({ bookingStep: "address" }, "");
    } catch {
      // ignore
    }
    track("booking_start");
    if (turnstileBox.current) prepareTurnstile(turnstileBox.current);
    api
      .status()
      .then((status) => {
        if (!status.enabled) setStep((current) => (current === "address" ? "disabled" : current));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("wfc-lang", lang);
    } catch {
      // ignore
    }
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang]);

  // Browser back moves one step back instead of leaving the page.
  const go = useCallback((next, { replace = false } = {}) => {
    setStep(next);
    setFailure(null);
    try {
      if (replace) window.history.replaceState({ bookingStep: next }, "");
      else window.history.pushState({ bookingStep: next }, "");
    } catch {
      // ignore
    }
    requestAnimationFrame(() => topRef.current?.scrollIntoView({ block: "start" }));
  }, []);

  useEffect(() => {
    const onPop = (event) => {
      const target = event.state?.bookingStep;
      if (target && target !== "done") setStep(target);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Hold countdown.
  useEffect(() => {
    if (!hold) return undefined;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [hold]);

  const holdLeftMs = hold ? new Date(hold.expiresAt).getTime() - now : 0;
  const holdLive = () => Boolean(holdRef.current) && new Date(holdRef.current.expiresAt).getTime() > Date.now();

  // Lets go of the held time so other customers can take it now, not in 10 minutes.
  const releaseHold = useCallback(() => {
    const current = holdRef.current;
    if (!current) return;
    setHold(null);
    const token = areaRef.current?.areaToken;
    if (token) api.release({ areaToken: token, holdId: current.holdId }).catch(() => {});
  }, []);

  // Back at the address step, a held time is no longer wanted.
  useEffect(() => {
    if (step === "address") {
      returnToConfirm.current = false;
      releaseHold();
    }
  }, [step, releaseHold]);

  // ── errors ──
  const showFailure = useCallback(
    (error, retry) => {
      const code = error instanceof ApiError ? error.code : "generic";
      if (code === "area_token_invalid") {
        // The address check is good for 30 minutes; start again from it.
        setArea(null);
        setHold(null);
        setNotice({ tone: "warn", text: t.sessionExpired });
        setStep("address");
        return;
      }
      if (code === "network") setFailure({ text: t.errors.network, retry });
      else if (["rate_limited", "maps_budget", "booking_disabled", "upstream_failed", "not_configured"].includes(code))
        setFailure({ text: code === "rate_limited" ? t.errors.rate_limited : t.errors.unavailable, callOnly: true });
      else setFailure({ text: t.errors[code] || t.errors.generic, retry });
    },
    [t]
  );

  // ── step actions ──
  const loadSlots = useCallback(
    async (forDate, { keepNotice = false } = {}) => {
      if (!keepNotice) setNotice(null);
      setSlots(null);
      try {
        setSlots(await api.slots(area.areaToken, forDate, holdRef.current?.holdId));
      } catch (error) {
        if (error instanceof ApiError && error.code === "area_token_invalid") {
          setArea(null);
          go("address");
          return;
        }
        setSlots([]);
        showFailure(error, () => loadSlots(forDate));
      }
    },
    [area, go, showFailure]
  );

  // A hold that runs out sends the customer back to the times.
  useEffect(() => {
    if (hold && holdLeftMs <= 0 && (step === "details" || step === "confirm")) {
      setHold(null);
      setNotice({ tone: "warn", text: t.holdExpired });
      go("time");
      loadSlots(date, { keepNotice: true });
    }
  }, [hold, holdLeftMs, step, t, go, loadSlots, date]);

  async function submitAddress(choice) {
    const text = (choice?.text || addressText).trim();
    if (text.length < 5) {
      setNotice({ tone: "error", text: t.addressHint });
      return;
    }
    setBusy(true);
    setNotice(null);
    setFailure(null);
    suggestRound.current += 1;
    setSuggestions({ exact: null, streets: [] });
    setSuggestOpen(false);
    try {
      const token = await turnstileToken(turnstileBox.current).catch(() => "");
      const answer = await api.checkArea({ address: text, turnstileToken: token });
      if (answer.inside) {
        setArea({ areaToken: answer.areaToken, address: answer.address });
        track("area_inside");
        go("service");
      } else {
        track("area_outside", { reason: answer.reason });
        go("outside");
      }
    } catch (error) {
      if (error instanceof ApiError && error.code === "address_required") setNotice({ tone: "error", text: t.addressNotFound });
      else showFailure(error, () => submitAddress(choice));
    } finally {
      setBusy(false);
    }
  }

  // Address suggestions as the customer types: the exact address (Census) and
  // street names (OpenStreetMap), both free, through the booking API.
  useEffect(() => {
    const query = addressText.trim();
    if (step !== "address" || query.length < 4 || query === pickedText.current) {
      if (query.length < 4) setSuggestions({ exact: null, streets: [] });
      return undefined;
    }
    const round = ++suggestRound.current;
    const handle = setTimeout(async () => {
      try {
        const found = await api.suggest(query);
        if (suggestRound.current === round) setSuggestions({ exact: found.exact || null, streets: found.streets || [] });
      } catch {
        // Suggestions are only a typing aid; the typed address still works.
      }
    }, 400);
    return () => clearTimeout(handle);
  }, [addressText, step]);

  const options = useMemo(
    () => [
      ...(suggestions.exact ? [{ kind: "exact", item: suggestions.exact }] : []),
      ...suggestions.streets.map((item) => ({ kind: "street", item })),
    ],
    [suggestions]
  );
  useEffect(() => setActiveOption(-1), [options]);

  function pickOption(option) {
    if (option.kind === "exact") pickExact(option.item);
    else pickStreet(option.item);
  }

  // Arrow keys move through the suggestions, Enter picks, Escape closes.
  function onAddressKey(event) {
    if (!suggestOpen || options.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveOption((index) => (index + 1) % options.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveOption((index) => (index <= 0 ? options.length - 1 : index - 1));
    } else if (event.key === "Enter" && activeOption >= 0) {
      event.preventDefault();
      pickOption(options[activeOption]);
    } else if (event.key === "Escape") {
      setSuggestOpen(false);
      setActiveOption(-1);
    }
  }

  function pickExact(match) {
    pickedText.current = match.address;
    setAddressText(match.address);
    submitAddress({ text: match.address });
  }

  function pickStreet(street) {
    pickedText.current = street.label;
    setAddressText(street.label);
    if (street.hasNumber) {
      submitAddress({ text: street.label });
      return;
    }
    // A street with no house number cannot be placed: ask for the number.
    suggestRound.current += 1;
    setSuggestions({ exact: null, streets: [] });
    setNotice({ tone: "warn", text: t.addNumber });
    requestAnimationFrame(() => {
      addressInput.current?.focus();
      addressInput.current?.setSelectionRange(0, 0);
    });
  }

  function chooseService(id) {
    setService(id);
    if (!DEVICE_IDS[SERVICES[id].devices].includes(consoleId)) setConsoleId("");
    requestAnimationFrame(() => deviceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  // Service picked: back to confirm when editing a booking in progress (the
  // service does not change which times fit), otherwise on to the days.
  function continueFromService() {
    if (returnToConfirm.current && holdLive()) {
      returnToConfirm.current = false;
      go("confirm");
      return;
    }
    returnToConfirm.current = false;
    openDays();
  }

  async function openDays() {
    go("day");
    setDays(null);
    try {
      setDays(await api.days(area.areaToken, holdRef.current?.holdId));
    } catch (error) {
      if (error instanceof ApiError && error.code === "area_token_invalid") {
        setArea(null);
        go("address");
        return;
      }
      setDays([]);
      showFailure(error, openDays);
    }
  }

  function pickDay(day) {
    setDate(day.date);
    track("day_selected", { date: day.date, free: day.free });
    go("time");
    loadSlots(day.date);
  }

  // The day chips on the times step: another day without going back.
  function switchDay(day) {
    if (day.date === date) return;
    setDate(day.date);
    setNotice(null);
    track("day_selected", { date: day.date, free: day.free, from: "chips" });
    loadSlots(day.date);
  }

  async function pickSlot(slot) {
    setBusy(slot.start);
    setNotice(null);
    setFailure(null);
    try {
      const held = await api.hold({ areaToken: area.areaToken, start: slot.start, replaceHoldId: hold?.holdId || "" });
      setHold(held);
      setNow(Date.now());
      setIdempotencyKey(uuid());
      track("slot_held", { start: held.start });
      const detailsDone = form.name.trim().length >= 2 && form.phone.replace(/\D/g, "").length === 10;
      if (returnToConfirm.current && detailsDone) go("confirm");
      else go("details");
      returnToConfirm.current = false;
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setNotice({ tone: "warn", text: t.slotTaken });
        setSlots(error.body.slots || []);
      } else showFailure(error, () => pickSlot(slot));
    } finally {
      setBusy(false);
    }
  }

  function reviewDetails(event) {
    event.preventDefault();
    const errors = {};
    if (form.name.trim().length < 2) errors.name = t.errors.invalid_name;
    if (form.phone.replace(/\D/g, "").length !== 10) errors.phone = t.errors.invalid_phone;
    if (form.email.trim() && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(form.email.trim())) errors.email = t.errors.invalid_email;
    setFieldErrors(errors);
    if (Object.keys(errors).length === 0) go("confirm");
  }

  async function confirmBooking() {
    setBusy(true);
    setFailure(null);
    try {
      const token = await turnstileToken(turnstileBox.current).catch(() => "");
      const booked = await api.book(
        {
          holdId: hold.holdId,
          name: form.name.trim(),
          phone: form.phone,
          email: form.email.trim(),
          service,
          console: consoleId,
          issue: SERVICES[service]?.describe ? issue.trim() : "",
          notes: form.notes.trim(),
          smsConsent: form.smsConsent,
          turnstileToken: token,
          language: lang,
          utm: readLead(),
        },
        idempotencyKey
      );
      setResult({ ...booked, smsConsent: form.smsConsent });
      setHold(null);
      track("booking_confirmed", { service, console: consoleId });
      go("done", { replace: true });
    } catch (error) {
      track("booking_failed", { reason: error instanceof ApiError ? error.code : "unknown" });
      if (error instanceof ApiError && error.status === 409 && ["slot_taken", "hold_expired", "in_progress"].includes(error.code)) {
        setHold(null);
        setNotice({ tone: "warn", text: error.code === "hold_expired" ? t.holdExpired : t.slotTaken });
        go("time");
        if (error.body.slots) setSlots(error.body.slots);
        else loadSlots(date, { keepNotice: true });
      } else if (error instanceof ApiError && ["issue_required", "invalid_console", "invalid_service"].includes(error.code)) {
        setNotice({ tone: "error", text: t.errors[error.code] || t.errors.generic });
        go("service");
      } else if (error instanceof ApiError && ["invalid_name", "invalid_phone", "invalid_email"].includes(error.code)) {
        setFieldErrors({ [error.code.replace("invalid_", "")]: t.errors[error.code] });
        go("details");
      } else showFailure(error, confirmBooking);
    } finally {
      setBusy(false);
    }
  }

  function editFromSummary(target) {
    if (target === "address") {
      // The address step lets go of the held time.
      go("address");
      return;
    }
    returnToConfirm.current = true;
    if (target === "service") go("service");
    else {
      go("time");
      loadSlots(date);
    }
  }

  function back() {
    if (returnToConfirm.current && holdLive() && (step === "service" || step === "time" || step === "day")) {
      returnToConfirm.current = false;
      go("confirm");
      return;
    }
    const index = STEPS.indexOf(step);
    if (step === "outside") go("address");
    else if (index > 0) go(STEPS[index - 1]);
  }

  const stepNumber = STEPS.indexOf(step) + 1;
  const today = useMemo(() => houstonToday(new Date(now)), [now]);
  const tomorrow = useMemo(() => {
    const d = new Date(`${today}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() + 1);
    return d.toISOString().slice(0, 10);
  }, [today]);
  const relativeDay = (dateString) => (dateString === today ? t.today : dateString === tomorrow ? t.tomorrow : "");

  const calendarDetails = result
    ? {
        start: result.start,
        end: result.end,
        title: `We-Fix-Consoles: ${result.service}`,
        address: result.address,
        details: `${result.console} - ${result.service}. ${t.questions} ${BUSINESS_PHONE_PRETTY}. ${t.bookingId} ${result.bookingId}`,
        uid: result.bookingId,
      }
    : null;

  // ── render ──
  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-40 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 px-4 h-16 w-full max-w-xl mx-auto">
          {stepNumber > 1 || step === "outside" ? (
            <button type="button" onClick={back} aria-label={t.back} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-text-main dark:text-white">
              <ArrowLeft className="w-6 h-6" />
            </button>
          ) : (
            <Link href="/" aria-label="We-Fix-Consoles" className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-text-main dark:text-white">
              <ArrowLeft className="w-6 h-6" />
            </Link>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-base font-bold text-text-main dark:text-white truncate">{t.pageTitle}</div>
            {stepNumber > 0 && <div className="text-xs text-text-muted dark:text-slate-400">{t.stepOf(stepNumber, STEPS.length)}</div>}
          </div>
          <button
            type="button"
            onClick={() => setLang(lang === "en" ? "es" : "en")}
            className="h-9 px-3 rounded-full border border-slate-200 dark:border-slate-700 text-sm font-semibold text-text-main dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {t.langToggle}
          </button>
        </div>
        {stepNumber > 0 && (
          <div className="h-1 bg-slate-200 dark:bg-slate-800">
            <div className="h-1 bg-primary transition-all duration-300" style={{ width: `${(stepNumber / STEPS.length) * 100}%` }} />
          </div>
        )}
      </header>

      <main ref={topRef} className="flex-1 w-full max-w-xl mx-auto px-4 pt-6 pb-16 scroll-mt-20">
        {IS_BETA && step !== "disabled" && step !== "loading" && (
          <div className="mb-4 text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">{t.demoBanner}</div>
        )}

        {hold && (step === "details" || step === "confirm") && (
          <div className={`mb-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${holdLeftMs < 120000 ? "bg-amber-50 text-amber-900 dark:bg-amber-900/20 dark:text-amber-200" : "bg-primary/5 text-primary dark:bg-primary/15 dark:text-blue-300"}`}>
            <Clock className="w-4 h-4 shrink-0" />
            <span aria-live="polite">{t.heldFor(mmss(holdLeftMs))}</span>
          </div>
        )}

        {notice && step !== "details" && step !== "confirm" && (
          <div className="mb-4">
            <Notice tone={notice.tone}>{notice.text}</Notice>
          </div>
        )}

        {failure && (
          <div className="mb-4 space-y-3">
            <Notice tone="error">{failure.text}</Notice>
            {failure.retry && !failure.callOnly && (
              <button type="button" onClick={() => { setFailure(null); failure.retry(); }} className="w-full h-12 rounded-xl border border-primary text-primary font-bold">
                {t.errors.retry}
              </button>
            )}
            <CallTextButtons t={t} />
          </div>
        )}

        {step === "loading" && (
          <div className="flex justify-center py-24 text-primary">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        )}

        {step === "disabled" && (
          <section className="text-center pt-6">
            <h1 className="text-3xl font-extrabold text-text-main dark:text-white mb-3">{t.disabledTitle}</h1>
            <p className="text-text-muted dark:text-slate-400 mb-8">{t.disabledSub}</p>
            <CallTextButtons t={t} />
          </section>
        )}

        {step === "address" && (
          <section>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold mb-4">
              <MapPin className="w-4 h-4" />
              Houston, TX
            </div>
            <h1 className="text-4xl font-extrabold text-text-main dark:text-white leading-tight tracking-tight">{t.introTitle}</h1>
            <p className="text-lg text-text-muted dark:text-slate-400 mt-2 mb-8">{t.introSub}</p>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                submitAddress();
              }}
              className="space-y-4"
            >
              <Field label={t.addressLabel}>
                <div className="relative">
                  <input
                    ref={addressInput}
                    className={inputClass}
                    type="text"
                    inputMode="text"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    role="combobox"
                    aria-expanded={suggestOpen && Boolean(suggestions.exact || suggestions.streets.length)}
                    aria-controls="address-suggestions"
                    aria-autocomplete="list"
                    aria-activedescendant={activeOption >= 0 ? `address-option-${activeOption}` : undefined}
                    onKeyDown={onAddressKey}
                    placeholder={t.addressPlaceholder}
                    value={addressText}
                    maxLength={200}
                    onChange={(event) => {
                      pickedText.current = "";
                      setAddressText(event.target.value);
                      setSuggestOpen(true);
                    }}
                    onFocus={() => setSuggestOpen(true)}
                    // Let a tap on a suggestion land before the list goes away.
                    onBlur={() => setTimeout(() => setSuggestOpen(false), 150)}
                    aria-describedby="address-hint"
                  />
                  {suggestOpen && !busy && options.length > 0 && (
                    <ul id="address-suggestions" role="listbox" className="absolute z-30 left-0 right-0 mt-1 max-h-80 overflow-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl p-1">
                      {options.map((option, index) => {
                        const exact = option.kind === "exact";
                        const active = index === activeOption;
                        return (
                          <li key={exact ? "exact" : option.item.label} id={`address-option-${index}`} role="option" aria-selected={active}>
                            <button
                              type="button"
                              tabIndex={-1}
                              onPointerDown={(event) => event.preventDefault()}
                              onMouseEnter={() => setActiveOption(index)}
                              onClick={() => pickOption(option)}
                              className={`w-full text-left rounded-lg px-3 py-3 flex items-start gap-2.5 ${active ? "bg-slate-100 dark:bg-slate-700" : "hover:bg-slate-50 dark:hover:bg-slate-700"}`}
                            >
                              {exact ? <BadgeCheck className="w-5 h-5 mt-0.5 text-primary shrink-0" /> : <MapPin className="w-5 h-5 mt-0.5 text-slate-400 shrink-0" />}
                              <span className="min-w-0">
                                <span className={`block truncate text-sm text-text-main dark:text-white ${exact ? "font-bold" : "font-semibold"}`}>{option.item.line1}</span>
                                <span className="block truncate text-xs text-text-muted dark:text-slate-400">{option.item.line2}</span>
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </Field>
              <p id="address-hint" className="text-sm text-text-muted dark:text-slate-400 -mt-2">
                {t.addressHint}
              </p>
              <PrimaryButton type="submit" busy={busy}>
                {busy ? t.checking : t.checkAddress}
              </PrimaryButton>
            </form>
            <div className="mt-8 grid grid-cols-3 gap-2 text-center text-xs text-text-muted dark:text-slate-400">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-5 h-5 text-primary" />
                {t.badges.warranty}
              </div>
              <div className="flex flex-col items-center gap-1">
                <Wrench className="w-5 h-5 text-primary" />
                {t.badges.noFix}
              </div>
              <div className="flex flex-col items-center gap-1">
                <MapPin className="w-5 h-5 text-primary" />
                {t.badges.door}
              </div>
            </div>
          </section>
        )}

        {step === "outside" && (
          <section className="text-center pt-4">
            <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600">
              <MapPin className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-extrabold text-text-main dark:text-white mb-2">{t.outsideTitle}</h1>
            <p className="text-text-muted dark:text-slate-400 mb-8">{t.outsideSub}</p>
            <CallTextButtons t={t} />
            <button type="button" onClick={() => go("address")} className="mt-6 text-primary font-semibold">
              {t.tryAnother}
            </button>
          </section>
        )}

        {step === "service" && (
          <section className="space-y-7">
            <div>
              {area && (
                <div className="mb-5 flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-3 py-2.5 text-sm">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span className="flex-1 min-w-0 truncate font-semibold text-text-main dark:text-white">{area.address}</span>
                  <button type="button" onClick={() => go("address")} className="font-semibold text-primary shrink-0">
                    {t.edit}
                  </button>
                </div>
              )}
              <h1 className="text-2xl font-extrabold text-text-main dark:text-white mb-4">{t.serviceTitle}</h1>
              <div className="space-y-2.5">
                {SERVICE_IDS.map((id) => {
                  const Icon = serviceIcon(id);
                  const price = servicePrice(id);
                  return (
                    <Choice key={id} selected={service === id} onClick={() => chooseService(id)} className="w-full p-4 flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-text-main dark:text-white">{t.services[id].label}</div>
                        <div className="text-sm text-text-muted dark:text-slate-400">{t.services[id].note}</div>
                      </div>
                      {price !== null && (
                        <div className="text-right shrink-0">
                          {price === 0 ? (
                            <span className="text-sm font-bold text-green-600 dark:text-green-400">{t.free}</span>
                          ) : (
                            <>
                              <div className="text-[11px] text-text-muted dark:text-slate-400 leading-none">{t.from}</div>
                              <div className="font-bold text-text-main dark:text-white">{formatPrice(price)}</div>
                            </>
                          )}
                        </div>
                      )}
                    </Choice>
                  );
                })}
              </div>
            </div>

            {service && (
              <div ref={deviceRef} className="scroll-mt-24">
                <h2 className="text-lg font-bold text-text-main dark:text-white mb-3">{t.deviceTitle[SERVICES[service].devices]}</h2>
                <div className="grid grid-cols-2 gap-2.5">
                  {DEVICE_IDS[SERVICES[service].devices].map((id) => (
                    <Choice key={id} selected={consoleId === id} onClick={() => setConsoleId(id)} className="p-3.5 font-semibold text-sm text-text-main dark:text-white">
                      {deviceLabel(t, id)}
                    </Choice>
                  ))}
                </div>
              </div>
            )}

            {service && SERVICES[service].describe && (
              <Field label={t.issueTitle}>
                <textarea
                  className={`${inputClass} h-28 py-3 resize-none`}
                  maxLength={300}
                  placeholder={t.issuePlaceholder}
                  value={issue}
                  onChange={(event) => setIssue(event.target.value)}
                />
              </Field>
            )}

            <PrimaryButton disabled={!service || !consoleId || (SERVICES[service]?.describe && issue.trim().length < 3)} onClick={continueFromService}>
              {returnToConfirm.current && hold ? t.saveChanges : t.continue}
            </PrimaryButton>
          </section>
        )}

        {step === "day" && (
          <section>
            <h1 className="text-2xl font-extrabold text-text-main dark:text-white mb-4">{t.dayTitle}</h1>
            {days === null ? (
              <div className="grid grid-cols-2 gap-2.5">
                <p className="col-span-2 flex items-center gap-2 text-sm text-text-muted dark:text-slate-400 mb-1">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  {t.checkingRoute}
                </p>
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="h-[74px] rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                ))}
              </div>
            ) : days.length === 0 && !failure ? (
              <div className="space-y-4">
                <Notice>{t.noDays}</Notice>
                <TextButton t={t} bookingId="" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                {days.map((day) => {
                  const special = relativeDay(day.date);
                  return (
                    <Choice key={day.date} selected={date === day.date} disabled={day.free === 0} onClick={() => pickDay(day)} className="p-4">
                      <div className="font-bold text-text-main dark:text-white">{special || dayText(day.date, lang)}</div>
                      <div className="text-sm">
                        {special && <span className="text-text-muted dark:text-slate-400">{monthDayText(day.date, lang)} · </span>}
                        <span className={day.free === 0 ? "text-slate-400" : "text-green-600 dark:text-green-400"}>{day.free === 0 ? t.full : t.openCount(day.free)}</span>
                      </div>
                    </Choice>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {step === "time" && (
          <section>
            <h1 className="text-2xl font-extrabold text-text-main dark:text-white">{t.timeTitle}</h1>
            <p className="text-text-muted dark:text-slate-400 mb-1">{t.timeSub}</p>
            {days && days.length > 1 && (
              <div className="-mx-4 px-4 mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
                {days.map((day) => {
                  const selected = day.date === date;
                  return (
                    <button
                      key={day.date}
                      type="button"
                      onClick={() => switchDay(day)}
                      aria-pressed={selected}
                      className={`shrink-0 h-10 px-3.5 rounded-full border text-sm font-semibold transition-colors ${
                        selected
                          ? "border-primary bg-primary text-white"
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-text-main dark:text-white hover:border-primary/50"
                      }`}
                    >
                      {relativeDay(day.date) || dayText(day.date, lang)}
                    </button>
                  );
                })}
              </div>
            )}
            {date && (
              <p className="text-sm font-semibold text-primary mt-3 mb-4">
                {relativeDay(date) ? `${relativeDay(date)} · ` : ""}
                {longDateText(date, lang)}
              </p>
            )}
            {slots === null ? (
              <div className="space-y-2.5">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="h-14 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                ))}
              </div>
            ) : slots.length === 0 ? (
              <div className="space-y-4">
                <Notice>{t.fullyBooked}</Notice>
                <button type="button" onClick={openDays} className="w-full h-12 rounded-xl border border-primary text-primary font-bold">
                  {t.pickAnotherDay}
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {slots.map((slot) => (
                  <Choice key={slot.start} selected={hold?.start === slot.start} disabled={Boolean(busy)} onClick={() => pickSlot(slot)} className="w-full px-4 py-4 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary shrink-0" />
                    <span className="flex-1 font-bold text-text-main dark:text-white">{windowText(slot.start, endOf(slot.start), t)}</span>
                    {busy === slot.start ? (
                      <span className="flex items-center gap-1 text-sm text-primary">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t.holding}
                      </span>
                    ) : (
                      slot.recommended && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-1 text-xs font-bold">
                          <Star className="w-3.5 h-3.5" />
                          {t.best}
                        </span>
                      )
                    )}
                  </Choice>
                ))}
              </div>
            )}
          </section>
        )}

        {step === "details" && (
          <section>
            <h1 className="text-2xl font-extrabold text-text-main dark:text-white mb-4">{t.detailsTitle}</h1>
            <form onSubmit={reviewDetails} className="space-y-4" noValidate>
              <Field label={t.name} error={fieldErrors.name}>
                <input className={inputClass} type="text" autoComplete="name" maxLength={60} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </Field>
              <Field label={t.phone} error={fieldErrors.phone}>
                <input className={inputClass} type="tel" inputMode="tel" autoComplete="tel-national" placeholder="(346) 555-0123" value={form.phone} onChange={(e) => setForm({ ...form, phone: formatPhoneInput(e.target.value) })} />
              </Field>
              <Field label={t.email} error={fieldErrors.email}>
                <input className={inputClass} type="email" inputMode="email" autoComplete="email" maxLength={254} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </Field>
              <Field label={t.notes}>
                <textarea className={`${inputClass} h-24 py-3 resize-none`} maxLength={500} placeholder={t.notesPlaceholder} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </Field>
              <label className="flex items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 cursor-pointer">
                <input type="checkbox" className="mt-0.5 size-5 accent-primary shrink-0" checked={form.smsConsent} onChange={(e) => setForm({ ...form, smsConsent: e.target.checked })} />
                <span className="text-sm text-text-main dark:text-slate-200">{t.smsConsent}</span>
              </label>
              <SummaryCard t={t} lang={lang} area={area} service={service} consoleId={consoleId} issue={issue} start={hold?.start} />
              <PrimaryButton type="submit">{t.review}</PrimaryButton>
            </form>
          </section>
        )}

        {step === "confirm" && (
          <section className="space-y-5">
            <div>
              <h1 className="text-2xl font-extrabold text-text-main dark:text-white">{t.confirmTitle}</h1>
              <p className="text-text-muted dark:text-slate-400 mt-1">{t.confirmSub}</p>
            </div>
            <SummaryCard t={t} lang={lang} area={area} service={service} consoleId={consoleId} issue={issue} start={hold?.start} onEdit={editFromSummary} />
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 text-sm space-y-1">
              <div className="font-semibold text-text-main dark:text-white">{form.name}</div>
              <div className="text-text-muted dark:text-slate-400">{form.phone}</div>
              {form.email && <div className="text-text-muted dark:text-slate-400">{form.email}</div>}
              {form.notes && <div className="text-text-muted dark:text-slate-400 whitespace-pre-line">{form.notes}</div>}
              <button type="button" onClick={() => go("details")} className="text-primary font-semibold pt-1">
                {t.edit}
              </button>
            </div>
            <PrimaryButton onClick={confirmBooking} busy={busy}>
              {busy ? t.booking : t.confirm}
            </PrimaryButton>
          </section>
        )}

        {step === "done" && result && (
          <section className="space-y-6">
            <div className="text-center pt-2">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                <Check className="w-9 h-9" strokeWidth={3} />
              </div>
              <h1 className="text-3xl font-extrabold text-text-main dark:text-white">{t.doneTitle}</h1>
              <p className="text-text-muted dark:text-slate-400 mt-1">{t.doneSub}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-4 space-y-2 text-sm">
              <div className="flex gap-3">
                <span className="w-14 shrink-0 text-text-muted dark:text-slate-400">{t.when}</span>
                <span className="font-semibold text-text-main dark:text-white">
                  {longDayText(result.start, lang)}, {windowText(result.start, result.end, t)}
                </span>
              </div>
              <div className="flex gap-3">
                <span className="w-14 shrink-0 text-text-muted dark:text-slate-400">{t.where}</span>
                <span className="font-semibold text-text-main dark:text-white">{result.address}</span>
              </div>
              <div className="flex gap-3">
                <span className="w-14 shrink-0 text-text-muted dark:text-slate-400">{t.what}</span>
                <span className="font-semibold text-text-main dark:text-white">
                  {t.services[service]?.label || result.service} · {deviceLabel(t, consoleId) || result.console}
                </span>
              </div>
              {priceText(t, service) && (
                <div className="flex gap-3">
                  <span className="w-14 shrink-0 text-text-muted dark:text-slate-400">{t.price}</span>
                  <span className="font-semibold text-text-main dark:text-white">{priceText(t, service)}</span>
                </div>
              )}
              <div className="flex gap-3">
                <span className="w-14 shrink-0 text-text-muted dark:text-slate-400">{t.bookingId}</span>
                <span className="font-mono font-semibold text-text-main dark:text-white">{result.bookingId}</span>
              </div>
            </div>
            {result.smsConsent && <Notice>{t.willText}</Notice>}
            <div>
              <div className="text-sm font-bold text-text-main dark:text-white mb-2 flex items-center gap-2">
                <CalendarPlus className="w-4 h-4 text-primary" />
                {t.addToCalendar}
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <a href={googleCalendarLink(calendarDetails)} target="_blank" rel="noopener noreferrer" className="h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-text-main dark:text-white flex items-center justify-center">
                  {t.googleCalendar}
                </a>
                <a href={icsDataUri(calendarDetails)} download="we-fix-consoles.ics" className="h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-text-main dark:text-white flex items-center justify-center">
                  {t.appleCalendar}
                </a>
              </div>
            </div>
            <div>
              <p className="text-center text-sm text-text-muted dark:text-slate-400 mb-2">{t.questions}</p>
              <TextButton t={t} bookingId={result.bookingId} />
            </div>
            <Link href="/" className="block text-center text-primary font-semibold">
              we-fix-consoles.com
            </Link>
          </section>
        )}

        <div ref={turnstileBox} className="mt-6 flex justify-center" />
      </main>
    </div>
  );
}
