"use client";

import React, { useEffect, useRef, useState } from "react";
import Button from "../common/Button";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import toast from "react-hot-toast";
import { Controller, useForm } from "react-hook-form";

import { isValidEmail } from "@/helper/validateEmail";

const BRAND_DECK_FILENAME = "Point-Of-Studio-Brand-Deck.pdf";
// Hosted on Sanity CDN (too large for git). `dl` sets the download filename,
// since the `download` attribute is ignored for cross-origin links.
const BRAND_DECK_HREF = `https://cdn.sanity.io/files/aksv9uid/production/1330bea3a4add5c27b6a31e47b75cbfff907c14d.pdf?dl=${encodeURIComponent(BRAND_DECK_FILENAME)}`;

const downloadBrandDeck = () => {
  const a = document.createElement("a");
  a.href = BRAND_DECK_HREF;
  a.download = BRAND_DECK_FILENAME;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

const isValidWebsite = (value) => {
  const raw = String(value ?? "").trim();
  if (!raw) return true;
  const url = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const { hostname } = new URL(url);
    return /^(localhost|([a-z0-9-]+\.)+[a-z]{2,})$/i.test(hostname);
  } catch {
    return false;
  }
};

const HELP_OPTIONS = ["Branding", "Website", "Marketing", "Print", "Other"];
const HEAR_OPTIONS = [
  "Google / Search Engine",
  "Social Media (LinkedIn, Behance, Instagram)",
  "Friend or Family Referral",
  "Business / Professional Referral",
  "Event or Conference",
  "Other",
];

const FieldError = ({ message }) =>
  message ? <p className="mt-1.5 text-xs text-red-600">{message}</p> : null;

const FLOAT_LABEL =
  "pointer-events-none absolute left-0 leading-none text-[14px] sm:text-[16px] text-gray-600 transition-[translate,font-size] duration-300 ease-out";
const FLOAT_LABEL_ACTIVE =
  "peer-focus:translate-y-[calc(-50%-1.25rem)] peer-focus:text-[12px] sm:peer-focus:text-[12px] peer-[&:not(:placeholder-shown)]:translate-y-[calc(-50%-1.25rem)] peer-[&:not(:placeholder-shown)]:text-[12px] sm:peer-[&:not(:placeholder-shown)]:text-[12px]";

/* ─── FloatingInput ─── */
const FloatingInput = React.forwardRef(({ label, required, className = "", error, ...props }, ref) => (
  <div className="relative">
    <div className={`relative border-b ${error ? "border-red-500" : "border-gray-400"}`}>
      <input
        {...props}
        ref={ref}
        placeholder=" "
        className={`peer w-full bg-transparent outline-none pt-5 pb-2 text-sm sm:text-base text-black caret-black ${className}`}
      />
      <label className={`${FLOAT_LABEL} top-1/2 translate-y-[-50%] ${FLOAT_LABEL_ACTIVE}`}>
        {label}{required ? "*" : ""}
      </label>
    </div>
    <FieldError message={error} />
  </div>
));
FloatingInput.displayName = "FloatingInput";

/* ─── FloatingTextarea ─── */
const FloatingTextarea = React.forwardRef(({ label, required, className = "", error, ...props }, ref) => (
  <div className={`relative ${className}`}>
    <div className={`relative border-b ${error ? "border-red-500" : "border-gray-400"}`}>
      <textarea
        {...props}
        ref={ref}
        placeholder=" "
        className="peer w-full bg-transparent outline-none pt-5 pb-2 text-sm sm:text-base text-black caret-black resize-none"
      />
      <label className={`${FLOAT_LABEL} top-5 translate-y-0 peer-focus:translate-y-[-1.5rem] peer-focus:text-[12px] sm:peer-focus:text-[12px] peer-[&:not(:placeholder-shown)]:translate-y-[-1.5rem] peer-[&:not(:placeholder-shown)]:text-[12px] sm:peer-[&:not(:placeholder-shown)]:text-[12px]`}>
        {label}{required ? "*" : ""}
      </label>
    </div>
    <FieldError message={error} />
  </div>
));
FloatingTextarea.displayName = "FloatingTextarea";

/* ─── FloatingSelect ─── */
const FloatingSelect = ({ label, required, options = [], error, value, onChange, onBlur, name }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const hasValue = Boolean(value);
  const labelUp = open || hasValue;
  const placeholder = `${label}${required ? "*" : ""}`;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const pick = (next) => {
    onChange?.(next);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={`relative ${open ? "z-30" : "z-10"}`}>
      <div className={`relative border-b ${error ? "border-red-500" : "border-gray-400"}`}>
        <button
          type="button"
          name={name}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={placeholder}
          onClick={() => setOpen((v) => !v)}
          onBlur={onBlur}
          className="flex w-full cursor-pointer items-center justify-between gap-3 bg-transparent pt-5 pb-2.5 text-left outline-none"
        >
          <span className={`min-w-0 truncate text-sm sm:text-base leading-[1.35] ${hasValue ? "text-black" : "text-transparent"}`}>
            {value || placeholder}
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden
            className={`shrink-0 text-gray-600 transition-transform duration-300 ease-out ${open ? "rotate-180" : ""}`}
          >
            <path d="M2 4.5L6 8L10 4.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <label
          className={`${FLOAT_LABEL} top-1/2 ${
            labelUp
              ? "translate-y-[calc(-50%-1.25rem)] text-[12px]"
              : "translate-y-[-50%]"
          }`}
        >
          {placeholder}
        </label>
      </div>

      {open ? (
        <ul
          role="listbox"
          data-lenis-prevent
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-52 overflow-y-auto border border-gray-400 bg-white py-1 shadow-[0_12px_32px_rgba(0,0,0,0.12)]"
        >
          {options.map((opt) => {
            const isActive = value === opt;
            return (
              <li key={opt} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => pick(opt)}
                  className={`w-full cursor-pointer px-3 py-2.5 text-left text-sm sm:text-base text-black transition-colors ${
                    isActive ? "bg-black/10" : "hover:bg-black/5"
                  }`}
                >
                  {opt}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      <FieldError message={error} />
    </div>
  );
};

const DEFAULT_PHONE_DIAL = "91";

/* ─── Main ─── */
const GetInTouch = () => {
  const [submitting, setSubmitting]               = useState(false);
  const [submitted, setSubmitted]                 = useState(false);
  const [phoneFocused, setPhoneFocused]           = useState(false);
  const [phoneHasTypedDigits, setPhoneHasTypedDigits] = useState(false);
  const [helpIsOther, setHelpIsOther]             = useState(false);
  const [hearIsOther, setHearIsOther]             = useState(false);

  const helpOtherRef     = useRef(null);
  const hearOtherRef     = useRef(null);
  const phoneFieldRef    = useRef(null);
  const phoneDialRef     = useRef(DEFAULT_PHONE_DIAL);

  const { register, handleSubmit, control, watch, reset, setValue, getValues, formState: { errors } } = useForm({
    defaultValues: {
      fullName: "", company: "", website: "", email: "",
      phone: DEFAULT_PHONE_DIAL, industry: "", help: "", hear: "", brief: "",
    },
    mode: "onSubmit",
  });

  const helpValue     = watch("help");
  const hearValue     = watch("hear");

  if (!helpIsOther) {
    register("help", { required: "Please tell us how we can help" });
  }
  if (!hearIsOther) {
    register("hear", { required: "Please tell us how you heard about us" });
  }

  useEffect(() => { if (helpIsOther)     helpOtherRef.current?.focus();     }, [helpIsOther]);
  useEffect(() => { if (hearIsOther)     hearOtherRef.current?.focus();     }, [hearIsOther]);

  useEffect(() => {
    const root = phoneFieldRef.current;
    if (!root) return;

    const tagCountryList = () => {
      root.querySelectorAll(".country-list").forEach((el) => {
        el.setAttribute("data-lenis-prevent", "");
        el.setAttribute("data-lenis-prevent-wheel", "");
        el.setAttribute("data-lenis-prevent-touch", "");
      });
    };

    tagCountryList();
    const observer = new MutationObserver(tagCountryList);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const handleReset = () => {
    const dial = phoneDialRef.current || DEFAULT_PHONE_DIAL;
    phoneDialRef.current = dial;
    reset({
      fullName: "",
      company: "",
      website: "",
      email: "",
      phone: dial,
      industry: "",
      help: "",
      hear: "",
      brief: "",
    });
    setHelpIsOther(false);
    setHearIsOther(false);
    setPhoneFocused(false);
    setPhoneHasTypedDigits(false);
  };

  const onValidSubmit = async (values) => {
    if (submitting) return;
    if (!phoneHasTypedDigits) { toast.error("Enter a valid phone number."); return; }

    const payload = {
      fullName:    values.fullName.trim(),
      company:     values.company.trim(),
      website:     values.website.trim(),
      email:       values.email.trim(),
      phone:       values.phone,
      industry:    values.industry.trim(),
      help:        values.help.trim(),
      hear:        values.hear.trim(),
      brief:       values.brief.trim(),
      submittedAt: new Date().toISOString(),
    };

    setSubmitting(true);
    setSubmitted(false);
    const t = toast.loading("Submitting...");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.error || "Something went wrong. Please try again.", { id: t });
        return;
      }

      toast.dismiss(t);
      handleReset();
      setSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please try again.", { id: t });
    } finally {
      setSubmitting(false);
    }
  };

  const onError = (formErrors) => {
    const order = ["fullName", "website", "email", "phone", "help", "hear", "brief"];
    const first = order.find((key) => formErrors?.[key]?.message);
    toast.error(first ? formErrors[first].message : "Please fill all required fields.");
  };

  /* ─── Shared select-to-other toggle factory ─── */
  const makeSelectChange = (field, setIsOther) => (v) => {
    if (v === "Other") {
      setValue(field, "", { shouldValidate: false });
      setIsOther(true);
    } else {
      setValue(field, v, { shouldValidate: true });
    }
  };

  const makeOtherBlur = (setIsOther, field, rhfOnBlur) => (e) => {
    rhfOnBlur?.(e);
    const v = getValues(field);
    if (!String(v || "").trim()) {
      setIsOther(false);
      setValue(field, "");
    }
  };

  return (
    <section
    id="get-in-touch-form"
      data-nav-invert
      className="min-h-screen  md:h-screen w-full bg-secondary text-background"
    >
      <div className="h-full flex items-center">
        <div className="w-full px-6 sm:px-10 md:pl-12 xl:pl-48 2xl:pl-[30rem] md:pr-12 xl:pr-20 py-16 sm:py-20 md:py-2">

          <h2 id="get-in-touch" className="heading-xl mb-6 md:mb-8">Get in touch</h2>

          <form
            noValidate
            onSubmit={handleSubmit(onValidSubmit, onError)}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-10 md:gap-x-16 gap-y-6 sm:gap-y-7 md:gap-y-6"
          >
            <FloatingInput
              label="Full Name"
              required
              error={errors.fullName?.message}
              {...register("fullName", { required: "Full name is required" })}
            />
            <FloatingInput label="Company" {...register("company")} />
            <FloatingInput
              label="Website Link"
              error={errors.website?.message}
              {...register("website", {
                validate: (value) =>
                  isValidWebsite(value) || "Enter a valid website (e.g. example.com)",
              })}
            />
            <FloatingInput
              label="Email"
              required
              type="email"
              error={errors.email?.message}
              {...register("email", {
                required: "Email is required",
                validate: (value) =>
                  isValidEmail(value) || "Please enter a valid email",
              })}
            />

            {/* ── Phone ── */}
            <div
              ref={phoneFieldRef}
              className={`phone-field relative z-20${phoneFocused || phoneHasTypedDigits ? " is-active" : ""}`}
              data-lenis-prevent
            >
              <div className={`relative border-b ${errors.phone ? "border-red-500" : "border-gray-400"}`}>
              <label
                className={`pointer-events-none absolute z-10 leading-none text-gray-600 transition-[translate,left,font-size] duration-300 ease-out ${
                  phoneFocused || phoneHasTypedDigits
                    ? "left-0 top-1/2 translate-y-[calc(-50%-1.25rem)] text-[12px]"
                    : "left-24 top-1/2 translate-y-[-50%] text-[14px] sm:text-[16px]"
                }`}
              >
                Phone Number*
              </label>
              <Controller
                name="phone"
                control={control}
                rules={{
                  validate: (value) => {
                    const digits = String(value || "").replace(/\D/g, "");
                    const dial = String(phoneDialRef.current || "");
                    const national = dial && digits.startsWith(dial)
                      ? digits.slice(dial.length)
                      : digits;
                    if (!national) return "Phone number is required";
                    if (national.length < 7 || digits.length > 15) {
                      return "Enter a valid phone number";
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <PhoneInput
                    country="in"
                    value={field.value}
                    onChange={(value, data) => {
                      const dial = data?.dialCode ? String(data.dialCode) : "";
                      phoneDialRef.current = dial;
                      const v    = String(value || "");

                      // Never let the value drop below the dial code
                      const safeValue  = v.length === 0 ? dial : v;
                      const finalValue = dial && !safeValue.startsWith(dial)
                        ? dial + safeValue.replace(/^\D+/, "")
                        : safeValue;

                      field.onChange(finalValue);

                      const rest = dial && finalValue.startsWith(dial)
                        ? finalValue.slice(dial.length)
                        : finalValue;
                      setPhoneHasTypedDigits(rest.replace(/\D/g, "").length > 0);
                    }}
                    inputProps={{
                      name:    field.name,
                      required: true,
                      onFocus: () => setPhoneFocused(true),
                      onBlur:  () => {
                        field.onBlur();
                        setPhoneFocused(false);
                        // If cursor left with only the dial code, treat as empty
                        const digits = String(field.value || "").replace(/\D/g, "");
                        const dialLen = String(field.value || "").match(/^\+?(\d{1,3})/)?.[1]?.length ?? 0;
                        if (digits.length <= dialLen) setPhoneHasTypedDigits(false);
                      },
                    }}
                    // Visually mark the field invalid if dial code was somehow removed
                    isValid={(inputNumber, country) => {
                      const dial = country?.dialCode ?? "";
                      return inputNumber.startsWith(dial);
                    }}
                    placeholder=" "
                    enableSearch
                    disableSearchIcon
                    searchPlaceholder="Search country or code"
                    searchNotFound="No country found"
                    searchClass="!text-black !bg-white"
                    containerClass="w-full"
                    inputClass="!w-full !h-auto !border-0 !bg-transparent !outline-none !shadow-none !text-sm sm:!text-base"
                    dropdownClass="!bg-white !text-black !z-[60]"
                    buttonClass="!border-0 !bg-transparent !z-[50]"
                  />
                )}
              />
              </div>
              <FieldError message={errors.phone?.message} />
            </div>

            <FloatingInput label="Industry" {...register("industry")} />

            {/* ── Help ── */}
            {helpIsOther ? (() => {
              const helpReg = register("help", { required: "Please tell us how we can help" });
              return (
                <FloatingInput
                  label="How can we help you"
                  required
                  error={errors.help?.message}
                  {...helpReg}
                  ref={(el) => {
                    helpReg.ref(el);
                    helpOtherRef.current = el;
                  }}
                  onBlur={makeOtherBlur(setHelpIsOther, "help", helpReg.onBlur)}
                />
              );
            })() : (
              <FloatingSelect
                label="How can we help you"
                required
                error={errors.help?.message}
                value={helpValue}
                options={HELP_OPTIONS}
                onChange={makeSelectChange("help", setHelpIsOther)}
              />
            )}

            {/* ── Hear ── */}
            {hearIsOther ? (() => {
              const hearReg = register("hear", { required: "Please tell us how you heard about us" });
              return (
                <FloatingInput
                  label="How did you hear about us?"
                  required
                  error={errors.hear?.message}
                  {...hearReg}
                  ref={(el) => {
                    hearReg.ref(el);
                    hearOtherRef.current = el;
                  }}
                  onBlur={makeOtherBlur(setHearIsOther, "hear", hearReg.onBlur)}
                />
              );
            })() : (
              <FloatingSelect
                label="How did you hear about us?"
                required
                error={errors.hear?.message}
                value={hearValue}
                options={HEAR_OPTIONS}
                onChange={makeSelectChange("hear", setHearIsOther)}
              />
            )}

            <FloatingTextarea
              className="md:col-span-2"
              label="Brief about your Goal, Budget & Timeline."
              required
              rows={3}
              error={errors.brief?.message}
              {...register("brief", { required: "Brief is required" })}
            />
          </form>

          <div className="mt-6 sm:mt-8 md:mt-10">
            <Button
              title={submitting ? "SUBMITTING..." : "SUBMIT"}
              color="black"
              onClick={handleSubmit(onValidSubmit, onError)}
            />
            {submitted ? (
              <div
                role="status"
                className="mt-5 max-w-lg opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
              >
                <p className="text-sm sm:text-base text-green-600 leading-relaxed">
                  Thank you! We have received your inquiry, will be in touch soon.
                </p>
                <Button
                  title="Download studio brand deck"
                  color="black"
                  onClick={downloadBrandDeck}
                  className="mt-5! md:mt-5!"
                />
              </div>
            ) : null}
            <p className="text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4 md:mt-6">
              By clicking connect you accept our{" "}
              <a href="/privacy" target="_blank" className="font-medium text-background" title="Privacy Policy">
                Privacy Policy
              </a>
              <br />
              Prefer email? <a href="mailto:think@wearepointof.com" title="Email Point Of" className="font-medium text-background">think@wearepointof.com</a>
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default GetInTouch;