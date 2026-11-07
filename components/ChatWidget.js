"use client";

import { useEffect, useRef, useState } from "react";
import { clinic } from "@/lib/knowledge";

const welcome = {
  role: "assistant",
  content: `Здравствуйте! Я ассистент ${clinic.shortName}. Подскажу по услугам, ценам, графику и помогу записаться: спрошу имя, услугу и удобное время. Диагнозы и лечение не назначаю — для этого нужен очный приём.`,
};

const quickReplies = ["Какие у вас цены?", "Какой график работы?", "Хочу записаться на приём"];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([welcome]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    function handleOpen() {
      setOpen(true);
    }
    window.addEventListener("smilecare:open-chat", handleOpen);
    return () => window.removeEventListener("smilecare:open-chat", handleOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
    inputRef.current?.focus();
  }, [open, messages, loading]);

  async function send(text) {
    const content = text.trim();
    if (!content || loading) return;

    const history = [...messages, { role: "user", content }];
    setMessages(history);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.filter((message) => message !== welcome),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ассистент сейчас недоступен.");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.reply, booking: data.booking },
      ]);
    } catch (requestError) {
      setMessages((current) => current.slice(0, -1));
      setInput(content);
      setError(requestError.message || "Не удалось связаться с ассистентом.");
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(event) {
    event.preventDefault();
    send(input);
  }

  const showQuickReplies = messages.length === 1 && !loading;

  return (
    <div className="chat-root">
      {open ? (
        <section className="chat-panel" aria-label="Чат с ассистентом SmileCare">
          <header className="chat-head">
            <div>
              <strong>Ассистент SmileCare</strong>
              <p>Не ставит диагноз и не назначает лечение</p>
            </div>
            <button type="button" className="icon-button" onClick={() => setOpen(false)} aria-label="Закрыть чат">
              ×
            </button>
          </header>

          <div className="chat-log" ref={listRef}>
            {messages.map((message, index) => (
              <div className={`bubble-row is-${message.role}`} key={`${message.role}-${index}`}>
                <div className="bubble">
                  <p className="bubble-text">{message.content}</p>
                  {message.booking ? (
                    <div className="booking-card">
                      <span>Запись {message.booking.code}</span>
                      <strong>{message.booking.name}</strong>
                      <p>
                        {message.booking.service}
                        <br />
                        {message.booking.datetime}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
            {loading ? <p className="chat-pending">Ассистент печатает…</p> : null}
          </div>

          {showQuickReplies ? (
            <div className="quick-replies">
              {quickReplies.map((reply) => (
                <button key={reply} type="button" onClick={() => send(reply)}>
                  {reply}
                </button>
              ))}
            </div>
          ) : null}

          {error ? <p className="chat-error">{error}</p> : null}

          <form className="chat-form" onSubmit={onSubmit}>
            <label className="sr-only" htmlFor="chat-input">
              Сообщение ассистенту
            </label>
            <input
              id="chat-input"
              ref={inputRef}
              value={input}
              maxLength={1000}
              placeholder="Спросите о ценах, графике или записи"
              onChange={(event) => setInput(event.target.value)}
            />
            <button className="button button-small" type="submit" disabled={loading || !input.trim()}>
              Отправить
            </button>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        className="chat-launcher"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true">◌</span>
        {open ? "Закрыть" : "Спросить"}
      </button>
    </div>
  );
}
