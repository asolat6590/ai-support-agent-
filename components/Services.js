import { clinic, servicePriceLabel } from "@/lib/knowledge";

const photos = {
  exam: "/services/exam.jpg?v=2",
  hygiene: "/services/hygiene.jpg?v=2",
  caries: "/services/caries.jpg?v=2",
  extraction: "/services/extraction.jpg?v=2",
  whitening: "/services/whitening.jpg?v=2",
  "implant-consult": "/services/implant.jpg?v=2",
};

export default function Services() {
  return (
    <section className="section" id="services">
      <div className="container">
        <div className="section-head split-head">
          <div>
            <p className="kicker">
              <span />
              Услуги
            </p>
            <h2>Лечение, собранное вокруг вашей улыбки.</h2>
          </div>
          <p>
            От осмотра и гигиены до удаления и отбеливания. Если в цене стоит «от», итоговую сумму
            врач называет после осмотра. Имплантация и ортодонтия начинаются с консультации.
          </p>
        </div>
        <div className="service-grid">
          {clinic.services.map((service, index) => (
            <article className="service-card" key={service.id}>
              <div className="service-visual">
                <img src={photos[service.id]} alt={service.name} />
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="service-body">
                <h3>{service.name}</h3>
                <p>{service.summary}</p>
                <div className="service-meta">
                  <strong>{servicePriceLabel(service)}</strong>
                  <em>{service.duration}</em>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
