export interface Article {
  slug: string
  year: string
  month: string
  title: string
  category: string
  categorySlug: string
  date: string // ISO
  author: string
  image?: string // URL fotky; bez nej sa zobrazí farebná plocha
  body: string[]
}

export const mainCategories = [
  { slug: 'ukf-life', name: 'UKF Life' },
  { slug: 'zo-skolstva', name: 'Zo školstva' },
  { slug: 'sport', name: 'Šport' },
  { slug: 'kultura-a-umenie', name: 'Kultúra a umenie' },
  { slug: 'rande-s-nitrou', name: 'Rande s Nitrou' },
  { slug: 'komentare-a-nazory', name: 'Komentáre a názory' },
]
export const moreCategories = [
  { slug: 'medzi-riadkami', name: 'Medzi riadkami' },
  { slug: 'on-predstavuje', name: 'ON predstavuje' },
  { slug: 'eko', name: 'EKO' },
  { slug: 'aby-duse-rozkvitli', name: 'Aby duše rozkvitli' },
]
const allCategories = [...mainCategories, ...moreCategories]

const months = ['januára', 'februára', 'marca', 'apríla', 'mája', 'júna', 'júla', 'augusta', 'septembra', 'októbra', 'novembra', 'decembra']
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d}. ${months[m - 1]} ${y}`
}

const body = [
  'Toto je ukážkový text článku. V ostrej verzii ho nahradí obsah z redakčného systému.',
  'Stránka článku je zámerne jednoduchá: titulok, dátum, autor, fotografia a text, bez bočných panelov.',
  'Text sa zalamuje do čitateľnej šírky, aby sa dlhšie články čítali pohodlne aj na mobile.',
]

function make(slug: string, date: string, title: string, categorySlug: string, image?: string): Article {
  const [year, month] = date.split('-')
  const category = allCategories.find((c) => c.slug === categorySlug)!.name
  return { slug, year, month, title, category, categorySlug, date, author: 'Redakcia', image, body }
}

// Skutočné články z pôvodného webu. Dátumy okrem 21. 9. sú približné, rubriky u filmových článkov tipované.
const real: Article[] = [
  make('na-filmove-platna-prichadzaju-novinky-clayface-vydesi-ovecka-shaun-pobavi-a-general-golian-pripomenie-nasu-historiu', '2026-10-05',
    'Na filmové plátna prichádzajú novinky. Clayface vydesí, Ovečka Shaun pobaví a Generál Golian pripomenie našu históriu', 'kultura-a-umenie'),
  make('od-rozhlasu-k-podcastu-od-televizie-k-streamingu-zurnalistika-meni-svoju-tvar-aj-na-magisterskom-stupni-studia', '2026-09-21',
    'Od rozhlasu k podcastu, od televízie k streamingu. Žurnalistika mení svoju tvár aj na magisterskom stupni štúdia', 'ukf-life',
    'https://www.obcasnecas.ukf.sk/wp-content/2026/09/1.1.-900x600.jpg'),
  make('kino-laka-na-pestru-filmovu-nadielku-august-plny-dobrodruzstva-napatia-humoru', '2026-08-28',
    'Kino láka na pestrú filmovú nádielku: August plný dobrodružstva, napätia, humoru', 'kultura-a-umenie'),
]

// Vymyslené články, aby bolo čo posúvať.
const fillerTitles = [
  'Prvé týždne semestra: čo nové čaká študentov na internátoch',
  'Nitra v číslach: kde sa študenti najradšej stretávajú',
  'Univerzitný šport sa vracia: výsledky jesenných turnajov',
  'Zo Zobora na prednášku: peši alebo MHD?',
  'Komentár: prečo by mala byť knižnica otvorená dlhšie',
  'Študentský spolok pripravil sériu jesenných podujatí',
  'Ako sa mení kampus: pohľad do rekonštruovaných priestorov',
  'Rozhovor s novým prodekanom o plánoch fakulty',
  'Zelená univerzita: triedime odpad aj na fakultách',
  'Divadelný súbor študentov začína skúšať novú hru',
  'Erasmus v číslach: kam študenti najčastejšie cestujú',
  'Tipy na jeseň: päť miest v Nitre, ktoré stoja za návštevu',
]
const fillerCats = ['ukf-life', 'rande-s-nitrou', 'sport', 'zo-skolstva', 'komentare-a-nazory', 'ukf-life', 'ukf-life', 'on-predstavuje', 'eko', 'kultura-a-umenie', 'zo-skolstva', 'rande-s-nitrou']
const slugify = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const filler: Article[] = Array.from({ length: 33 }, (_, i) => {
  const t = fillerTitles[i % fillerTitles.length]
  const day = 26 - (i % 26)
  const date = i < 26 ? `2026-09-${String(day).padStart(2, '0')}` : `2026-08-${String(30 - (i - 26)).padStart(2, '0')}`
  return make(`${slugify(t)}-${i + 1}`, date, t, fillerCats[i % fillerCats.length])
})

export const articles: Article[] = [...real, ...filler].sort((a, b) => b.date.localeCompare(a.date))
