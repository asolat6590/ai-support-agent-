import { GoogleGenAI } from "@google/genai";
import { reviewBooking } from "@/lib/booking";
import { clinic } from "@/lib/knowledge";
import { buildSystemPrompt } from "@/lib/prompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGES = 8;
const MAX_LENGTH = 1000;

let geminiClient;

function getClient(apiKey) {
  if (!geminiClient) geminiClient = new GoogleGenAI({ apiKey });
  return geminiClient;
}

const systemInstruction = buildSystemPrompt();

const responseJsonSchema = {
  type: "object",
  properties: {
    reply: { type: "string" },
    booking: {
      anyOf: [
        { type: "null" },
        {
          type: "object",
          properties: {
            name: { type: "string" },
            service: { type: "string" },
            datetime: { type: "string" },
          },
          required: ["name", "service", "datetime"],
          additionalProperties: false,
        },
      ],
    },
  },
  required: ["reply", "booking"],
  additionalProperties: false,
};

function sanitizeMessages(input) {
  if (!Array.isArray(input)) return [];

  return input
    .filter(
      (message) =>
        message &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string",
    )
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, message.role === "user" ? MAX_LENGTH : 4000),
    }))
    .filter((message) => message.content)
    .slice(-MAX_MESSAGES);
}

function extractText(response) {
  if (typeof response?.text === "string" && response.text.trim()) return response.text;
  const parts = response?.candidates?.[0]?.content?.parts ?? [];
  return parts.map((part) => part.text || "").join("");
}

function parseModelJson(text) {
  const trimmed = text.trim().replace(/^```json\s*/i, "").replace(/```$/i, "");
  const parsed = JSON.parse(trimmed);
  const reply = typeof parsed?.reply === "string" ? parsed.reply.trim() : "";
  if (!reply) throw new Error("empty reply");
  return { reply, booking: parsed.booking ?? null };
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Некорректный запрос." }, { status: 400 });
  }

  const messages = sanitizeMessages(body?.messages);
  if (!messages.length || messages.at(-1).role !== "user") {
    return Response.json({ error: "Напишите сообщение, чтобы ассистент ответил." }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        error:
          "Сервис чата не настроен. Добавьте GEMINI_API_KEY в файл .env и перезапустите сервер.",
      },
      { status: 503 },
    );
  }

  try {
    const ai = getClient(apiKey);
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
      contents: messages.map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content }],
      })),
      config: {
        systemInstruction,
        temperature: 0.2,
        maxOutputTokens: 400,
        thinkingConfig: { thinkingLevel: "MINIMAL" },
        responseMimeType: "application/json",
        responseJsonSchema,
        abortSignal: AbortSignal.timeout(20000),
      },
    });

    const parsed = parseModelJson(extractText(response));
    const review = reviewBooking(parsed.booking);
    let reply = parsed.reply;
    let booking = null;

    if (review.state === "confirmed") {
      booking = review.booking;
      reply = `${reply}\n\nЗапись подтверждена. Номер ${booking.code}. Ждём вас, ${booking.name}: ${booking.service}, ${booking.datetime}. Если планы изменятся, позвоните ${clinic.phone} минимум за 3 часа.`;
    } else if (review.state === "invalid") {
      reply = `${reply}\n\n${review.message}`;
    }

    return Response.json({ reply, booking });
  } catch (error) {
    console.error("Gemini chat failed", error?.status || error?.name || "unknown");
    return Response.json(
      {
        error: `Ассистент не смог ответить. Попробуйте ещё раз или позвоните ${clinic.phone}.`,
      },
      { status: 502 },
    );
  }
}
