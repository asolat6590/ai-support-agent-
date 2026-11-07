import { clinic } from "./knowledge.js";

const WEEKDAYS = {
  Mon: clinic.weekdays,
  Tue: clinic.weekdays,
  Wed: clinic.weekdays,
  Thu: clinic.weekdays,
  Fri: clinic.weekdays,
  Sat: clinic.saturday,
  Sun: null,
};

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replaceAll("ё", "е")
    .replace(/[«»"'`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function toMinutes(hhmm) {
  const [hours, minutes] = hhmm.split(":").map(Number);
  return hours * 60 + minutes;
}

export function tashkentParts(date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: clinic.timezone,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}

export function getClinicStatus(now = new Date()) {
  const parts = tashkentParts(now);
  const hours = WEEKDAYS[parts.weekday];

  if (!hours) {
    return { open: false, label: "Сегодня выходной. В понедельник откроемся в 09:00." };
  }

  const nowMinutes = toMinutes(`${parts.hour}:${parts.minute}`);
  const opens = toMinutes(hours.open);
  const closes = toMinutes(hours.close);

  if (nowMinutes >= opens && nowMinutes < closes) {
    return { open: true, label: `Сейчас открыто до ${hours.close}` };
  }

  if (nowMinutes < opens) {
    return { open: false, label: `Сегодня откроемся в ${hours.open}` };
  }

  return { open: false, label: "Сегодня приём уже закончился." };
}

function findService(input) {
  const query = normalize(input);
  if (!query) return { match: null, ambiguous: false };

  const exact = clinic.services.filter(
    (service) =>
      normalize(service.name) === query ||
      service.aliases.some((alias) => normalize(alias) === query),
  );

  if (exact.length === 1) return { match: exact[0], ambiguous: false };
  if (exact.length > 1) return { match: null, ambiguous: true };

  const partial = clinic.services.filter((service) => {
    const name = normalize(service.name);
    if (query.length >= 4 && name.includes(query)) return true;
    return service.aliases.some(
      (alias) => query.length >= 4 && normalize(alias).includes(query),
    );
  });

  if (partial.length === 1) return { match: partial[0], ambiguous: false };
  if (partial.length > 1) return { match: null, ambiguous: true };
  return { match: null, ambiguous: false };
}

function parseSlot(value) {
  const trimmed = String(value || "").trim();
  const hasZone = /(?:z|[+-]\d{2}:?\d{2})$/i.test(trimmed);
  const match = trimmed.match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})(?::(\d{2}))?/);

  let date;
  if (hasZone) {
    date = new Date(trimmed);
  } else if (match) {
    date = new Date(`${match[1]}T${match[2]}:${match[3] || "00"}+05:00`);
  } else {
    date = new Date(NaN);
  }

  if (Number.isNaN(date.getTime())) {
    return {
      ok: false,
      message:
        "Запись пока не оформлена. Напишите дату и время ещё раз, например: 12 ноября в 15:00.",
    };
  }

  if (date.getTime() < Date.now() + 60 * 1000) {
    return {
      ok: false,
      message: "Запись пока не оформлена. Это время уже прошло. Выберите будущие дату и время.",
    };
  }

  const parts = tashkentParts(date);
  const hours = WEEKDAYS[parts.weekday];
  if (!hours) {
    return {
      ok: false,
      message: "Запись пока не оформлена. В воскресенье клиника закрыта. Выберите день с понедельника по субботу.",
    };
  }

  const start = toMinutes(`${parts.hour.padStart(2, "0")}:${parts.minute.padStart(2, "0")}`);
  if (start < toMinutes(hours.open) || start >= toMinutes(hours.close)) {
    return {
      ok: false,
      message: `Запись пока не оформлена. В этот день клиника работает ${hours.open}–${hours.close}. Выберите время внутри графика.`,
    };
  }

  const label = new Intl.DateTimeFormat("ru-RU", {
    timeZone: clinic.timezone,
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  return { ok: true, label };
}

function makeCode() {
  return `SM-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function reviewBooking(raw) {
  if (!raw || typeof raw !== "object") return { state: "none" };

  const name = String(raw.name || "").trim();
  const serviceText = String(raw.service || "").trim();
  const datetime = String(raw.datetime || "").trim();

  if (!name || !serviceText || !datetime) return { state: "none" };
  if (name.length > 80) {
    return { state: "invalid", message: "Запись пока не оформлена. Напишите имя короче 80 символов." };
  }

  const found = findService(serviceText);
  if (found.ambiguous) {
    return {
      state: "invalid",
      message:
        "Запись пока не оформлена. Уточните услугу: «Консультация и осмотр» или «Консультация по имплантации».",
    };
  }
  if (!found.match) {
    return {
      state: "invalid",
      message:
        "Запись пока не оформлена. Такой услуги нет в прайсе. Выберите осмотр, гигиену, лечение кариеса, удаление, отбеливание или консультацию по имплантации.",
    };
  }

  const slot = parseSlot(datetime);
  if (!slot.ok) return { state: "invalid", message: slot.message };

  return {
    state: "confirmed",
    booking: {
      code: makeCode(),
      name,
      service: found.match.name,
      datetime: slot.label,
    },
  };
}
