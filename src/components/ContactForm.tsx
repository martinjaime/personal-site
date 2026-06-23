import { useState, useRef, useEffect } from "react";
import { PUBLIC_WORKER_URL, PUBLIC_CF_SITE_KEY } from "astro:env/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel } from "@/components/ui/field";
import type { WorkerResponse } from "@/lib/types";

enum FormStatus {
  Idle = "idle",
  Loading = "loading",
  Success = "success",
  Error = "error",
}

const ContactForm: React.FC = () => {
  const [status, setStatus] = useState<FormStatus>(FormStatus.Idle);
  const [errorMessage, setErrorMessage] = useState("");
  const [token, setToken] = useState("");

  const onTurnstileSuccess = (successToken: string) => {
    setToken(successToken);
  }

  // Load Turnstile script and set up the callback function
  useEffect(() => {
    window.onTurnstileSuccess = onTurnstileSuccess;
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
      window.onTurnstileSuccess = undefined;
    };
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(FormStatus.Loading);

    try {
      const form = e.currentTarget;
      const response = await fetch(PUBLIC_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: (form.querySelector("[name=email]") as HTMLInputElement).value,
          name: (form.querySelector("[name=name]") as HTMLInputElement).value,
          subject: (form.querySelector("[name=subject]") as HTMLInputElement).value,
          message: (form.querySelector("[name=message]") as HTMLTextAreaElement).value,
          turnstileToken: token,
        }),
      });

      const data = await response.json() as WorkerResponse;

      if (response.ok && data.success) {
        setStatus(FormStatus.Success);
      } else {
        setStatus(FormStatus.Error);
        setErrorMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setStatus(FormStatus.Error);
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input type="email" name="email" required />
      </Field>

      <Field>
        <FieldLabel>Name</FieldLabel>
        <Input type="text" name="name" required />
      </Field>

      <Field>
        <FieldLabel>Subject</FieldLabel>
        <Input type="text" name="subject" required />
      </Field>

      <Field>
        <FieldLabel>Message</FieldLabel>
        <Textarea name="message" required className="min-h-32" />
      </Field>

      <div className="cf-turnstile" data-callback="onTurnstileSuccess" data-sitekey={PUBLIC_CF_SITE_KEY} />

      <Button type="submit" className="xs:max-w-35" disabled={status === "loading" || !token}>
        {status === "loading" ? "Sending..." : "Submit"}
      </Button>

      {status === "success" && (
        <p className="text-sm text-muted-foreground">
          Message sent. I'll get back to you soon.
        </p>
      )}

      {status === "error" && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}
    </form>
  );
}

export default ContactForm;
