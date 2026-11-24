"use client";

import { useEffect } from "react";
import { captureLead } from "@/lib/booking/api";

// Keeps utm_* and the referrer from the landing page for the booking form.
export function LeadCapture() {
  useEffect(() => {
    captureLead();
  }, []);
  return null;
}
