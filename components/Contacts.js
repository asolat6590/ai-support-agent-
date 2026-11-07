import { clinic, mapLink } from "@/lib/knowledge";
import OpenChatButton from "./OpenChatButton";

export default function Contacts() {
  return (
    <section className="section contact-section" id="contacts">
      <div className="container contact-grid">
        <div>
          <p className="kicker">
            <span />
            Контакты
          </p>
          <h2>Готовы улучшить улыбку?</h2>
          <p className="lead">
            Запись собирает ассистент: имя, услуга и удобное время. Перенос уже созданного визита —
            по телефону, минимум за 3 часа.
          </p>
          <div className="hero-actions">
            <OpenChatButton className="button">Записаться →</OpenChatButton>
            <a className="button button-ghost" href={`tel:${clinic.phoneTel}`}>
              Позвонить
            </a>
          </div>
        </div>
        <address className="contact-card">
          <div>
            <span>Адрес</span>
            <strong>{clinic.address}</strong>
          </div>
          <div>
            <span>Телефон</span>
            <a href={`tel:${clinic.phoneTel}`}>{clinic.phone}</a>
          </div>
          <div>
            <span>Почта</span>
            <a href={`mailto:${clinic.email}`}>{clinic.email}</a>
          </div>
          <div>
            <span>График</span>
            <ul>
              {clinic.hours.map((slot) => (
                <li key={slot.days}>
                  <em>{slot.days}</em>
                  {slot.closed ? slot.note : `${slot.open}–${slot.close}`}
                </li>
              ))}
            </ul>
          </div>
          <a className="text-link" href={mapLink()} target="_blank" rel="noreferrer">
            Открыть карту →
          </a>
        </address>
      </div>
    </section>
  );
}
