// semua teks website di satu file supaya gampang diedit

export const site = {
  name: 'NALIN',
  nav: [
    { label: 'WORK', href: '#work' },
    { label: 'ABOUT', href: '#about' },
    { label: 'CONTACT', href: '#contact' },
  ],
}

export const intro = {
  label: 'EVERYONE HAS A STORY.',
  prompt: 'FIND ME IN THE CROWD.',
  cursor: 'ENTER MY WORLD ↗',
  selected: "THERE'S MORE THAN MEETS THE EYE.",
  scroll: 'SCROLL TO STEP INSIDE ↓',
  skip: 'Skip intro',
  targetLabel: 'Nalin — enter my world',
}

export const hero = {
  hello: "HI, I'M NALIN.",
  headline: ['BEYOND THE', 'NUMBERS.'],
  lede: 'Every dataset has a story. I turn complexity into insights that drive better decisions.',
  cta: { label: 'EXPLORE MY WORK ↓', href: '#work' },
  figureAlt: 'Illustration of Nalin walking, seen from behind',
}

export interface Project {
  title: string
  kind: string
  summary: string
  tools: string
  href?: string
}

// todo: ganti ringkasan dengan hasil akhir tiap proyek
export const projects: Project[] = [
  {
    title: 'Forecasting cash flows across Java',
    kind: 'Undergraduate thesis',
    summary:
      'A hybrid TSR–GSTAR–NN model that forecasts currency inflow and outflow across five provinces in Java, combining spatial dependence between regions with a neural network for the non-linear part.',
    tools: 'R · Python',
    href: 'https://github.com/mahastuti/Skripsi-ITS',
  },
  {
    title: 'Container terminal operations',
    kind: 'Internship · PT Pelindo Terminal Petikemas',
    summary:
      'Analysis of vessel scheduling and terminal activity at TPK Semarang to support operational planning.',
    tools: 'Python · Excel',
  },
  {
    title: 'Survival analysis of breast cancer patients',
    kind: 'Coursework',
    summary:
      'Recurrence-free survival on the German Breast Cancer Study Group data, from Kaplan–Meier curves to Cox regression.',
    tools: 'R',
    href: 'https://github.com/mahastuti/Statistics-Projects',
  },
]

export const about = {
  paragraphs: [
    'I study statistics at Institut Teknologi Sepuluh Nopember (ITS) and work in the Economic and Financial Data Analytics lab, mostly on time series and spatio-temporal models.',
    'I have interned at PT Pelindo Terminal Petikemas and PT Angkasa Pura I, turning operational data into numbers people could plan with.',
  ],
  tools: ['R', 'Python', 'SAS', 'EViews', 'SPSS', 'LaTeX'],
}

// todo: isi email dan linkedin; link yang kosong tidak ditampilkan
export const contact = {
  heading: "Let's talk about your data.",
  links: [
    { label: 'Email', href: '' },
    { label: 'LinkedIn', href: '' },
    { label: 'GitHub', href: 'https://github.com/mahastuti' },
  ],
}
