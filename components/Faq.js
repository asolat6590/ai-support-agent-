"use client";

import { useState } from "react";
import OpenChatButton from "./OpenChatButton";

export default function Faq({ items }) {
  const [opened, setOpened] = useState(0);

  return (
    <section className="section" id="faq">
      <div className="container faq-layout">
        <div className="section-head">
          <p className="kicker">
            <span />
            Вопросы
          </p>
          <h2>Спросите до записи.</h2>
          <p>Те же ответы использует ассистент. Если факта здесь нет, он не будет его выдумывать.</p>
          <OpenChatButton className="button">Спросить ассистента →</OpenChatButton>
        </div>
        <div className="faq-list">
          {items.map((item, index) => {
            const isOpen = opened === index;
            return (
              <article className={isOpen ? "faq-item is-open" : "faq-item"} key={item.question}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpened(isOpen ? -1 : index)}
                  >
                    {item.question}
                    <span aria-hidden="true">{isOpen ? "–" : "+"}</span>
                  </button>
                </h3>
                {isOpen ? <p>{item.answer}</p> : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
