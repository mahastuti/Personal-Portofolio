import type { Ref } from 'react'
import { site } from '../content'

// nav tetap di atas; saat intro, opacity-nya dikendalikan timeline intro
export function SiteNav({ navRef, hidden = false }: { navRef?: Ref<HTMLElement>; hidden?: boolean }) {
  return (
    <header ref={navRef} className="site-nav" data-hidden={hidden || undefined}>
      <a href="#top" className="site-nav__brand">
        {site.name}
        <span aria-hidden="true">©</span>
      </a>
      <nav aria-label="Main">
        <ul className="site-nav__links">
          {site.nav.map((item, i) => (
            <li key={item.href}>
              {i > 0 && (
                <span className="site-nav__sep" aria-hidden="true">
                  /
                </span>
              )}
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
