"use client";

import { useEffect, useState } from "react";
import { clinic } from "@/lib/knowledge";
import OpenChatButton from "./OpenChatButton";

const links = [
  { href: "#services", label: "Услуги" },
  { href: "#advantages", label: "Преимущества" },
  { href: "#faq", label: "Вопросы" },
  { href: "#contacts", label: "Контакты" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function close() {
    setOpen(false);
  }

  return (
    <header className={scrolled || open ? "header header-solid" : "header"}>
      <div className="container header-bar">
        <a className="brand" href="#top" onClick={close}>
          <span className="logo-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32">
              <rect width="32" height="32" rx="10" fill="#141414" />
              <path
                d="M9 18.5c1.7 3.6 4.2 5.4 7 5.4s5.3-1.8 7-5.4"
                fill="none"
                stroke="#fff"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <circle cx="13" cy="13" r="1.15" fill="#fff" />
              <circle cx="19" cy="13" r="1.15" fill="#fff" />
            </svg>
          </span>
          <strong>SmileCare</strong>
        </a>

        <nav id="site-nav" className={open ? "nav nav-open" : "nav"} aria-label="Разделы сайта">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={close}>
              {link.label}
            </a>
          ))}
          <a className="nav-phone" href={`tel:${clinic.phoneTel}`}>
            {clinic.phone}
          </a>
          <OpenChatButton className="button button-small nav-chat">Запись</OpenChatButton>
        </nav>

        <div className="header-tools">
          <a className="header-phone" href={`tel:${clinic.phoneTel}`}>
            {clinic.phone}
          </a>
          <OpenChatButton className="button button-small header-book">Запись →</OpenChatButton>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Закрыть меню" : "Открыть меню"}</span>
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
