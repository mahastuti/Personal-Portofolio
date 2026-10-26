import { about, contact, projects } from '../content'

export function Sections() {
  const links = contact.links.filter((l) => l.href)

  return (
    <>
      <section id="background" className="block" aria-labelledby="background-title">
        <h2 id="background-title" className="block__title">
          Background
        </h2>
        <div className="about">
          {about.paragraphs.map((t) => (
            <p key={t}>{t}</p>
          ))}
          <p className="about__tools">
            <span>Tools I use</span> {about.tools.join(', ')}
          </p>
        </div>
      </section>

      <section id="work" className="block" aria-labelledby="work-title">
        <h2 id="work-title" className="block__title">
          Selected work
        </h2>
        <ul className="work">
          {projects.map((p) => (
            <li key={p.title} className="work__item">
              <p className="work__kind">{p.kind}</p>
              <h3 className="work__title">
                {p.href ? (
                  <a href={p.href} target="_blank" rel="noreferrer">
                    {p.title}
                  </a>
                ) : (
                  p.title
                )}
              </h3>
              <p className="work__summary">{p.summary}</p>
              <p className="work__tools">{p.tools}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="contact" className="block block--contact" aria-labelledby="contact-title">
        <h2 id="contact-title" className="block__title">
          {contact.heading}
        </h2>
        <ul className="contact">
          {links.map((l) => (
            <li key={l.label}>
              <a href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <footer className="footer">© {new Date().getFullYear()} Nalini Mahastuti Panunjul</footer>
    </>
  )
}
