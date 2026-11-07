import { clinic } from "@/lib/knowledge";

export default function Advantages() {
  return (
    <section className="section section-tight" id="advantages">
      <div className="container">
        <div className="section-head split-head">
          <div>
            <p className="kicker">
              <span />
              Почему мы
            </p>
            <h2>Современный приём и понятная забота.</h2>
          </div>
          <p>
            SmileCare не обещает лечение в переписке. Сначала вы видите план, цену и время визита.
            Решение принимает стоматолог на приёме.
          </p>
        </div>
        <ol className="steps">
          {clinic.advantages.map((item, index) => (
            <li key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="team">
          <div className="section-head">
            <p className="kicker">
              <span />
              Врачи
            </p>
            <h2>Люди, которые вас примут.</h2>
          </div>
          <div className="doctor-grid">
            {clinic.doctors.map((doctor) => (
              <article className="doctor-card" key={doctor.name}>
                <span className="avatar" aria-hidden="true">
                  {doctor.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <h3>{doctor.name}</h3>
                <p className="doctor-role">{doctor.role}</p>
                <p className="doctor-years">{doctor.experience}</p>
                <p>{doctor.focus}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
