import { intro, site } from '../content'

interface Props {
  onSkip: () => void
  showChrome: boolean
}

export function IntroNavigation({ onSkip, showChrome }: Props) {
  return (
    <div className="intro-nav">
      {showChrome && (
        <div className="intro-nav__top">
          <a href="#top" className="intro-nav__brand">
            {site.name}
            <span aria-hidden="true">©</span>
          </a>
          <button type="button" className="intro-skip" onClick={onSkip}>
            {intro.skip}
          </button>
        </div>
      )}

      <div className="intro-label" data-intro-fade>
        <p className="intro-label__title">{intro.label}</p>
        <p className="intro-label__note intro-label__note--pointer">{intro.note}</p>
        <p className="intro-label__note intro-label__note--touch">{intro.noteTouch}</p>
      </div>

      {showChrome && (
        <p className="intro-scroll" data-intro-fade aria-hidden="true">
          {intro.scroll}
        </p>
      )}
    </div>
  )
}
