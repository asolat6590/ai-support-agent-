import { clinic } from "@/lib/knowledge";
import ClinicStatus from "./ClinicStatus";
import OpenChatButton from "./OpenChatButton";

export default function Hero() {
  const names = [...clinic.services, ...clinic.services];

  return (
    <>
      <section className="hero" id="top">
        <div className="hero-media" aria-hidden="true" />
        <div className="container hero-copy">
          <p className="kicker">
            <span />
            Стоматология
          </p>
          <h1>
            Спокойный приём.
            <br />
            Понятный план лечения.
          </h1>
          <p className="lead">{clinic.description}</p>
          <div className="hero-actions">
            <OpenChatButton className="button button-light">Записаться →</OpenChatButton>
            <a className="button button-line" href={`tel:${clinic.phoneTel}`}>
              Позвонить →
            </a>
          </div>
          <ClinicStatus />
          <p className="hero-note">3 врача · дети с 6 лет · суббота до 16:00</p>
        </div>
      </section>
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {names.map((service, index) => (
            <span key={`${service.id}-${index}`}>{service.name}</span>
          ))}
        </div>
      </div>
    </>
  );
}
