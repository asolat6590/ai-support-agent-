import { clinic } from "@/lib/knowledge";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <strong>SmileCare</strong>
          <p>Частная стоматология в центре Ташкента. Ассистент помогает с записью и не заменяет врача.</p>
        </div>
        <div>
          <span>Услуги</span>
          {clinic.services.map((service) => (
            <a key={service.id} href="#services">
              {service.name}
            </a>
          ))}
        </div>
        <div>
          <span>Клиника</span>
          <a href="#advantages">Преимущества</a>
          <a href="#faq">Вопросы</a>
          <a href="#contacts">Контакты</a>
          <a href={`tel:${clinic.phoneTel}`}>{clinic.phone}</a>
          <a href={`mailto:${clinic.email}`}>{clinic.email}</a>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} SmileCare Dental Clinic</p>
        <p>{clinic.address}</p>
      </div>
    </footer>
  );
}
