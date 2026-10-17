"use client";

import { AlertCircle, Info, MessageCircle } from "lucide-react";
import { useId, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { useMounted } from "@/hooks/useMounted";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { cn } from "@/lib/cn";

type Values = {
  name: string;
  email: string;
  date: string;
  time: string;
  guests: string;
  requests: string;
};

type Errors = Partial<Record<keyof Values, string>>;

const empty: Values = { name: "", email: "", date: "", time: "", guests: "2", requests: "" };

const TIMES = ["18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"];
const GUESTS = ["1", "2", "3", "4", "5", "6", "7", "8"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function todayISO() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!EMAIL.test(values.email.trim())) errors.email = "Please enter a valid email address, e.g. name@example.com.";
  if (!values.date) errors.date = "Please choose a date.";
  else if (values.date < todayISO()) errors.date = "Please choose today or a future date.";
  if (!values.time) errors.time = "Please choose a preferred time.";
  if (!values.guests) errors.guests = "Please choose the number of guests.";
  if (values.requests.length > 500) errors.requests = "Please keep requests under 500 characters.";
  return errors;
}

export function Reservation() {
  const root = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const mounted = useMounted();
  const minDate = mounted ? todayISO() : undefined;
  useSectionReveal(root);

  const update = (key: keyof Values) => (event: { target: { value: string } }) => {
    const value = event.target.value;
    setValues((v) => ({ ...v, [key]: value }));
    setSubmitted(false);
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = validate(values);
    setErrors(next);
    const firstInvalid = Object.keys(next)[0];
    if (firstInvalid) {
      setSubmitted(false);
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    // Intentionally nothing is sent or stored: this form is not connected.
    setSubmitted(true);
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  const whatsappHref = useMemo(() => {
    if (!siteConfig.whatsappNumber) return null;
    const lines = [
      `Hello ${siteConfig.name}, I would like to request a table.`,
      values.name && `Name: ${values.name}`,
      values.date && `Date: ${values.date}`,
      values.time && `Time: ${values.time}`,
      values.guests && `Guests: ${values.guests}`,
      values.requests && `Requests: ${values.requests}`,
    ].filter(Boolean);
    return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [values]);

  return (
    <section ref={root} id="reserve" aria-labelledby="reserve-title" className="section-y relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -z-10 size-[min(1100px,140vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(217,163,95,0.16),rgba(201,122,43,0.06)_45%,transparent_75%)]"
      />
      <div className="frame grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <p data-reveal className="eyebrow flex items-center gap-4">
            <span aria-hidden="true" className="h-px w-10 bg-gold/60" />
            Reservations
          </p>
          <h2 id="reserve-title" data-reveal className="mt-6 text-title text-ivory">
            Reserve Your <em className="text-gilded italic">Evening.</em>
          </h2>
          <p data-reveal className="mt-6 max-w-[40ch] text-lede text-stone">
            Tell us when you would like to join us and anything we should know to make the evening yours.
          </p>
          {!siteConfig.reservationsConnected && (
            <p data-reveal className="glass mt-10 flex max-w-md items-start gap-3 rounded-2xl px-5 py-4 text-sm leading-relaxed text-stone">
              <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={1.5} />
              <span>
                <strong className="font-medium text-ivory">Demonstration interface.</strong> This form is not
                connected to a booking system. Nothing you enter is sent or stored.
              </span>
            </p>
          )}
        </div>

        <div data-reveal className="lg:col-span-7">
          <form
            ref={formRef}
            noValidate
            onSubmit={onSubmit}
            aria-describedby="reserve-note"
            className="glass rounded-[28px] p-6 sm:p-10"
          >
            <p id="reserve-note" className="mb-8 text-xs uppercase tracking-[0.24em] text-stone/70">
              Demo form · fields marked <span aria-hidden="true">*</span>
              <span className="sr-only">with an asterisk</span> are required
            </p>

            <div className="grid gap-x-6 gap-y-7 sm:grid-cols-2">
              <Field label="Name" required error={errors.name}>
                {(props) => (
                  <input {...props} name="name" type="text" autoComplete="name" value={values.name} onChange={update("name")} />
                )}
              </Field>
              <Field label="Email" required error={errors.email}>
                {(props) => (
                  <input
                    {...props}
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={update("email")}
                  />
                )}
              </Field>
              <Field label="Date" required error={errors.date}>
                {(props) => (
                  <input {...props} name="date" type="date" min={minDate} value={values.date} onChange={update("date")} />
                )}
              </Field>
              <Field label="Preferred time" required error={errors.time}>
                {(props) => (
                  <select {...props} name="time" value={values.time} onChange={update("time")}>
                    <option value="">Select a time</option>
                    {TIMES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
              <Field label="Number of guests" required error={errors.guests}>
                {(props) => (
                  <select {...props} name="guests" value={values.guests} onChange={update("guests")}>
                    {GUESTS.map((g) => (
                      <option key={g} value={g}>
                        {g} {g === "1" ? "guest" : "guests"}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
              <div className="hidden sm:block" aria-hidden="true" />
              <Field label="Special requests" error={errors.requests} className="sm:col-span-2" hint="Optional — allergies, occasions, seating preferences.">
                {(props) => (
                  <textarea
                    {...props}
                    name="requests"
                    rows={4}
                    maxLength={500}
                    value={values.requests}
                    onChange={update("requests")}
                    className={cn(props.className, "resize-none py-3")}
                  />
                )}
              </Field>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button type="submit" icon>
                Request a Table
              </Button>
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-line px-6 text-[0.74rem] uppercase tracking-[0.22em] text-ivory transition-colors hover:border-gold/60 hover:text-gold"
                >
                  <MessageCircle aria-hidden="true" className="size-4" strokeWidth={1.5} />
                  Message on WhatsApp
                  <span className="sr-only">(opens WhatsApp in a new tab)</span>
                </a>
              )}
            </div>

            <div ref={statusRef} tabIndex={-1} aria-live="polite" className="outline-none">
              {submitted && (
                <div className="mt-8 flex items-start gap-3 rounded-2xl border border-gold/40 bg-gold/[0.07] px-5 py-4 text-sm leading-relaxed text-ivory">
                  <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={1.5} />
                  <p>
                    <strong className="font-medium">Thank you — your details look complete.</strong> This is a
                    demonstration form, so no reservation has been made and nothing has been sent. Please contact
                    the restaurant directly to book a table.
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

const fieldClass =
  "block w-full min-h-12 rounded-xl border border-line bg-field px-4 text-[0.95rem] font-normal text-ivory placeholder:text-stone/50 transition-colors duration-300 hover:border-white/25 focus:border-gold/70 focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-gold/25 aria-[invalid=true]:border-[#e07a5f]";

type ControlProps = {
  id: string;
  required?: boolean;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  className: string;
};

function Field({
  label,
  required,
  error,
  hint,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: (props: ControlProps) => ReactNode;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2.5 block text-[0.7rem] font-medium uppercase tracking-[0.22em] text-stone">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-1 text-gold">
            *
          </span>
        )}
      </label>
      {children({
        id,
        required,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
        className: fieldClass,
      })}
      {hint && (
        <p id={hintId} className="mt-2 text-xs text-stone/60">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-2 flex items-center gap-1.5 text-xs text-[#f0a48f]">
          <AlertCircle aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
          {error}
        </p>
      )}
    </div>
  );
}
