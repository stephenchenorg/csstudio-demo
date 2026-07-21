// Homepage content extracted from the Minion Shopify theme demo
// (minion-theme.myshopify.com). Kept as typed data so every string / asset
// is editable in one place.

export interface Product {
  brand: string
  title: string
  href: string
  image: string
  price: string
  compareAt?: string
  onSale?: boolean
}

export interface Feature {
  title: string
  body: string
}

export interface Benefit {
  title: string
  body: string
}

export interface Stat {
  value: string
  label: string
}

export interface Brand {
  name: string
  image: string
}

export interface Review {
  title: string
  body: string
  author: string
  rating: number
}

export interface Article {
  date: string
  title: string
  href: string
  image: string
  comments: number
}

export interface Faq {
  question: string
  answer: string
}

export const topProducts: Product[] = [
  {
    brand: 'Petio',
    title: 'Ideal weight white meat chicken recipe in sauce wet cat food',
    href: '/minion/',
    image: '/minion/images/prod-chicken.jpg',
    price: 'From $26.79',
  },
  {
    brand: 'Petio',
    title: 'Healthy chicken & salmon recipe pate wet kitten food',
    href: '/minion/',
    image: '/minion/images/prod-salmon.jpg',
    price: 'From $41.79',
  },
  {
    brand: 'Petsy',
    title: 'Cat chicken pate canned wet food',
    href: '/minion/',
    image: '/minion/images/prod-pate.jpg',
    price: 'From $42.29',
    compareAt: '$50.00',
    onSale: true,
  },
  {
    brand: 'Feelly',
    title: 'Wet cat food',
    href: '/minion/',
    image: '/minion/images/prod-wet.jpg',
    price: 'From $27.49',
  },
]

export const reelProducts: Product[] = [
  {
    brand: 'Petsy',
    title: 'Cat chicken pate canned wet food',
    href: '/minion/',
    image: '/minion/images/prod-pate.jpg',
    price: 'From $42.29',
    compareAt: '$50.00',
    onSale: true,
  },
  {
    brand: 'Petio',
    title: 'Ideal weight white meat chicken recipe in sauce wet cat food',
    href: '/minion/',
    image: '/minion/images/prod-chicken.jpg',
    price: 'From $26.79',
  },
  {
    brand: 'Freek',
    title: 'Dry cat food',
    href: '/minion/',
    image: '/minion/images/prod-dry.jpg',
    price: 'From $27.59',
  },
  {
    brand: 'Pure',
    title: 'Whole hearted dry cat food',
    href: '/minion/',
    image: '/minion/images/prod-wholehearted.jpg',
    price: 'From $24.75',
  },
]

export const mainFeatures: Feature[] = [
  {
    title: 'Useful properties',
    body: 'Minion feed consists of at least 62% of meat ingredients. No need to buy other supplements.',
  },
  {
    title: 'Easy transition',
    body: 'The usual taste for your pets, the transition to a new food will be easy and fast.',
  },
  {
    title: 'Subscription for cats',
    body: 'Choose proteins and textures that you like, or try something new. 🐈',
  },
]

export const benefits: Benefit[] = [
  {
    title: 'A less smelly litter box 😌',
    body: 'When cats eat right, they… poo better. More of the nutrients are digestible, so less junk comes out the other end.',
  },
  {
    title: 'Shiny coat, fewer hairballs.',
    body: 'Your cat’s coat will improve with a balanced diet leading to less shedding, fewer hairballs.',
  },
  {
    title: 'Balanced energy, better rest.',
    body: 'A high-protein diet and improved hydration promote strong bones and toned muscles.',
  },
]

export const resultStats: Stat[] = [
  { value: '92%', label: 'Report shinier and softer fur' },
  { value: '88%', label: 'Report a less stinky litter box' },
  { value: '90%', label: 'Report a more energetic cat' },
  { value: '94%', label: 'Report overall health improvements' },
]

export const counterStats: Stat[] = [
  { value: '12,000+', label: 'Happy pets — loved and cared for every day' },
  { value: '350+', label: 'Premium products — only trusted brands for your furry friends' },
  { value: '9', label: 'Years of love — making pets happier since day one' },
]

export const featuredBrands: Brand[] = [
  { name: 'Petio', image: '/minion/images/brand-petio.png' },
  { name: 'Petify', image: '/minion/images/brand-petify.png' },
  { name: 'Petsy', image: '/minion/images/brand-petsy.png' },
  { name: 'Pure', image: '/minion/images/brand-pure.png' },
  { name: 'Freek', image: '/minion/images/brand-freek.png' },
  { name: 'Feelly', image: '/minion/images/brand-feelly.png' },
]

export const certifications: string[] = [
  'USDA-Certified',
  'Humanely-harvested',
  'Sustainably-sourced ingredients',
  'No BPAs',
  'No preservatives',
  'Grain-free',
  'Protein rich',
]

export const reviews: Review[] = [
  {
    title: 'Shiny coat!',
    body: 'I always knew he was meant to be a star, so I loved seeing his fur get so shiny. He’s also started drinking way less water and is much more active and lively than before. Such a convenient option!',
    author: 'Kirstyn C.',
    rating: 5,
  },
  {
    title: 'She LOVES it 💛',
    body: 'She was always so-so with her usual food, but she is VERY enthusiastic about Minion. Her breath is MUCH better and she poops much less frequently and it does not smell as disgusting as it used to.',
    author: 'Buddy',
    rating: 5,
  },
  {
    title: 'He is absolutely OBSESSED!',
    body: 'I always knew he was meant to be a star, so I loved seeing his fur get so shiny. He devours every meal and looks healthier by the week.',
    author: 'Baxter',
    rating: 5,
  },
  {
    title: 'Shiny coat! 🍗',
    body: 'I always knew he was meant to be a star, so I loved seeing his fur get so shiny. He’s also started drinking way less water and is much more active.',
    author: 'Harley',
    rating: 5,
  },
]

export const articles: Article[] = [
  {
    date: 'April 13, 2022',
    title: 'Real, good food. For cats. 😺🥩',
    href: '/minion/',
    image: '/minion/images/blog-1.jpg',
    comments: 2,
  },
  {
    date: 'February 09, 2022',
    title: 'Cats & dogs 💉 vaccination',
    href: '/minion/',
    image: '/minion/images/blog-2.jpg',
    comments: 1,
  },
  {
    date: 'February 09, 2022',
    title: 'Cats care tips & tools',
    href: '/minion/',
    image: '/minion/images/blog-3.jpg',
    comments: 1,
  },
]

export const faqs: Faq[] = [
  {
    question: 'Is your cat food vet-approved?',
    answer: 'Yes, all our formulas are developed with veterinarians and meet international nutritional standards for feline health.',
  },
  {
    question: 'What ingredients do you use?',
    answer: 'We use high-quality proteins, natural ingredients, and essential vitamins. Our recipes contain no artificial colors, preservatives, or low-grade fillers.',
  },
  {
    question: 'Is your food suitable for cats with sensitivities?',
    answer: 'Yes. We offer grain-free, hypoallergenic, and single-protein options designed for cats with food sensitivities or digestive issues.',
  },
  {
    question: 'How should I transition my cat to your food?',
    answer: 'We recommend switching gradually over 7 days, mixing increasing amounts of our food with your cat’s current diet.',
  },
  {
    question: 'Do you offer food for all life stages?',
    answer: 'Absolutely. We produce formulas for kittens, adult cats, and seniors, ensuring balanced nutrition at every stage of life.',
  },
]
