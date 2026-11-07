"use client";

import { useEffect, useState } from "react";
import { getClinicStatus } from "@/lib/booking";

export default function ClinicStatus() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setStatus(getClinicStatus(new Date()));
  }, []);

  return (
    <p className="status-line">
      <span className={status?.open ? "status-dot is-open" : "status-dot"} aria-hidden="true" />
      {status?.label || "Пн–пт 09:00–20:00 · сб 10:00–16:00"}
    </p>
  );
}
