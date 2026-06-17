const CDN = 'https://collidesport.co.za/cdn/shop/files'

export const CATEGORIES = [
  { value: 'scrum-caps',       label: 'Scrum Caps' },
  { value: 'premium-caps',     label: 'Premium Caps' },
  { value: 'activewear',       label: 'Activewear' },
]

export const COLOURS = [
  'Black', 'White', 'Blue', 'Navy', 'Turquoise', 'Green', 'Gold', 'Grey', 'Red', 'Maroon', 'Camo',
]

export const PRODUCTS = [
  // ── Scrum Caps ──────────────────────────────────────────────────────────
  { id:  1, name: 'Rugby Scrum Cap — Turquoise/White',          category: 'scrum-caps', price: 550, stock: 12, colours: ['Turquoise','White'],  badge: null,      image: `${CDN}/ScrumCap-Turquoise_White.jpg?v=1689063382&width=533` },
  { id:  2, name: 'Rugby Scrum Cap — Navy/Gold',                category: 'scrum-caps', price: 550, stock:  8, colours: ['Navy','Gold'],         badge: null,      image: `${CDN}/ScrumCap-Navy_Gold.jpg?v=1689063348&width=533` },
  { id:  3, name: 'Rugby Scrum Cap — Black/Grey',               category: 'scrum-caps', price: 550, stock: 10, colours: ['Black','Grey'],        badge: null,      image: `${CDN}/ScrumCap-Black_Grey.jpg?v=1689232549&width=533` },
  { id:  4, name: 'Rugby Scrum Cap — Black',                    category: 'scrum-caps', price: 550, stock:  6, colours: ['Black'],               badge: null,      image: `${CDN}/ScrumCap-Black.jpg?v=1689015482&width=533` },
  { id:  5, name: 'Rugby Scrum Cap — White/Black Border',       category: 'scrum-caps', price: 550, stock: 14, colours: ['White','Black'],       badge: null,      image: `${CDN}/0fa2da60fdc932d655d4a4d0ec1af3a7_48c2aac8-0c5f-4f98-8843-00c8d9a329ed.png?v=1719768481&width=533` },
  { id:  6, name: 'Rugby Scrum Cap — Royal Blue/Black',         category: 'scrum-caps', price: 550, stock:  5, colours: ['Blue','Black'],        badge: null,      image: `${CDN}/ScrumCap-RoyalBlue_Black_1.jpg?v=1689015686&width=533` },
  { id:  7, name: 'Rugby Scrum Cap — Turquoise/Black',          category: 'scrum-caps', price: 550, stock:  9, colours: ['Turquoise','Black'],   badge: null,      image: `${CDN}/8378F7F2-7EA7-4A45-93B4-38F9E4CA96F3.png?v=1692564303&width=533` },
  { id:  8, name: 'Rugby Scrum Cap — Blue & White Camo',        category: 'scrum-caps', price: 550, stock: 11, colours: ['Blue','White','Camo'], badge: null,      image: `${CDN}/PHOTO-2023-09-22-12-03-492.jpg?v=1696703796&width=533` },
  { id:  9, name: 'Primal Camo Scrum Cap — Black Border',       category: 'scrum-caps', price: 550, stock:  7, colours: ['Camo','Black'],        badge: null,      image: `${CDN}/IMG-8654.jpg?v=1696704119&width=533` },
  { id: 10, name: 'Primal Camo Scrum Cap — Grey Border',        category: 'scrum-caps', price: 550, stock:  3, colours: ['Camo','Grey'],         badge: 'Low Stock', image: `${CDN}/4c18b2db-1206-4880-bf77-d3e515d2b27e.jpg?v=1696704167&width=533` },
  { id: 11, name: 'White Tribal Rugby Scrum Cap',               category: 'scrum-caps', price: 550, stock: 15, colours: ['White'],               badge: null,      image: `${CDN}/TribelLeft.jpg?v=1696703994&width=533` },
  { id: 12, name: 'Darker Blue Camo Rugby Scrum Cap',           category: 'scrum-caps', price: 550, stock:  4, colours: ['Blue','Grey','Camo'],  badge: 'Low Stock', image: `${CDN}/P230725122545_2_RAW_162Large.jpg?v=1696705870&width=533` },
  { id: 13, name: 'Rugby Scrum Cap — White Border',             category: 'scrum-caps', price: 550, stock: 10, colours: ['White'],               badge: null,      image: `${CDN}/Collide_white_cap_newest.jpg?v=1719768757&width=533` },
  { id: 14, name: 'Warrior Scrum Cap',                          category: 'scrum-caps', price: 550, stock: 13, colours: ['Black','Grey'],        badge: null,      image: `${CDN}/Warrior_Scrum_Cap.jpg?v=1724349324&width=533` },
  { id: 15, name: 'Tribal Scrum Cap — Black Border',            category: 'scrum-caps', price: 550, stock: 16, colours: ['White','Black'],       badge: null,      image: `${CDN}/Tribal_Scrum_Cap_with_Black_Border.jpg?v=1722097747&width=533` },
  { id: 16, name: 'Rugby Scrum Cap — Navy & White',             category: 'scrum-caps', price: 550, stock:  8, colours: ['Navy','White'],        badge: null,      image: `${CDN}/PHOTO-2024-07-24-16-31-06.jpg?v=1722103434&width=533` },
  { id: 17, name: 'Rugby Scrum Cap — Green & Black',            category: 'scrum-caps', price: 550, salePrice: 450, stock: 20, colours: ['Green','Black'],       badge: null,      image: `${CDN}/1_165a1aff-9c87-41b8-b1c2-d8304dff7ab1.jpg?v=1722102398&width=533` },
  { id: 18, name: 'Rugby Scrum Cap — Graffiti',                 category: 'scrum-caps', price: 550, salePrice: 450, stock:  0, colours: ['White','Black'],       badge: null,      image: `${CDN}/2_edc879f4-ec89-432d-abdb-fa6a49b88508.jpg?v=1722102793&width=533` },
  { id: 19, name: 'Blue & White Camo — Black Border',           category: 'scrum-caps', price: 550, stock:  6, colours: ['Blue','White','Camo','Black'], badge: 'New', image: `${CDN}/2_5983c119-b758-4faf-9162-85a5b20e170c.jpg?v=1779389799&width=533` },

  // ── Premium Caps ────────────────────────────────────────────────────────
  { id: 20, name: 'Predator Scrum Cap — Navy & Gold',           category: 'premium-caps', price: 750, stock:  5, colours: ['Navy','Gold'],       badge: 'Premium', image: `${CDN}/52E885BC-C2E8-4007-8B49-04A5AC567F56.jpg?v=1750614416&width=533` },
  { id: 21, name: 'Predator Scrum Cap — Maroon & Gold',         category: 'premium-caps', price: 750, stock:  4, colours: ['Maroon','Gold'],     badge: 'Premium', image: `${CDN}/AE502E8A-BFEE-4C4E-B07A-D1172C2A0491.png?v=1750614673&width=533` },
  { id: 22, name: 'White & Red Tribal Scrum Cap',               category: 'premium-caps', price: 650, stock:  7, colours: ['White','Red'],       badge: 'New',     image: `${CDN}/6D305D90-7B2E-4186-AC61-AFB7A8CF0DB3.png?v=1756738038&width=533` },
  { id: 23, name: 'Red Fury Scrum Cap — White Border',          category: 'premium-caps', price: 650, stock:  6, colours: ['Red','White'],       badge: 'New',     image: `${CDN}/B45B48B7-A9B9-421B-865A-2DF787C1C0E0.png?v=1756736851&width=533` },

  // ── Activewear ──────────────────────────────────────────────────────────
  { id: 24, name: 'Compression Top — Black',                    category: 'activewear', price: 299, stock: 20, colours: ['Black'],               badge: null,      image: `${CDN}/SabreCompressionTop-Black.jpg?v=1689063664&width=533` },
  { id: 25, name: 'Compression Top — White',                    category: 'activewear', price: 299, stock: 15, colours: ['White'],               badge: null,      image: `${CDN}/SabreCompressionTop-White.jpg?v=1689016014&width=533` },
  { id: 26, name: 'Running Top — Black',                        category: 'activewear', price: 399, stock: 12, colours: ['Black'],               badge: null,      image: `${CDN}/SabreRunningTop-Black_1.jpg?v=1689063515&width=533` },
  { id: 27, name: 'Undershorts — Black',                        category: 'activewear', price: 449, stock: 10, colours: ['Black'],               badge: null,      image: `${CDN}/editedblackundershorts.jpg?v=1689431134&width=533` },
]

export const PRICE_MIN = Math.min(...PRODUCTS.map(p => p.price))
export const PRICE_MAX = Math.max(...PRODUCTS.map(p => p.price))

// ── Product image galleries ───────────────────────────────────────────────────
// Restores the old site's feature: a product's page shows the real photos that
// were used on collidesport.co.za for that exact cap — including real-life shots
// of players wearing it. Only products that genuinely had these extra photos on
// the old site get a gallery; every other product keeps its single studio image.
// Galleries below mirror the old product pages exactly (served larger, width=800).

const gw = (url) => url.replace(/width=\d+/, 'width=800')

const GALLERY_BY_ID = {
  // Rugby Scrum Cap — Turquoise/White (old-site gallery: studio + real-life player shots)
  1: [
    { src: `${CDN}/ScrumCap-Turquoise_White.jpg?v=1689063382&width=800`,                     alt: 'Rugby Scrum Cap — Turquoise/White', caption: null },
    { src: `${CDN}/14_d26a6051-8be3-4c53-a8b0-2329811c7d34.jpg?v=1728305634&width=800`,       alt: 'Player wearing the Turquoise/White scrum cap (front)', caption: 'On a player' },
    { src: `${CDN}/15.jpg?v=1728305633&width=800`,                                            alt: 'Player wearing the Turquoise/White scrum cap (side)',  caption: 'On a player' },
    { src: `${CDN}/16.jpg?v=1728305634&width=800`,                                            alt: 'Player wearing the Turquoise/White scrum cap',         caption: 'On a player' },
    { src: `${CDN}/13_99aeeea7-c0ee-4e03-8006-67823fbd61c0.jpg?v=1728305634&width=800`,       alt: 'Player wearing the Turquoise/White scrum cap',         caption: 'On a player' },
    { src: `${CDN}/17_9a163d61-b6d6-4118-829b-ef2f8e47ca19.jpg?v=1728305634&width=800`,       alt: 'Player wearing the Turquoise/White scrum cap',         caption: 'On a player' },
  ],
  // Predator Scrum Cap — Navy & Gold (old-site gallery: studio + live-match shots)
  20: [
    { src: `${CDN}/52E885BC-C2E8-4007-8B49-04A5AC567F56.jpg?v=1750614416&width=800`,          alt: 'Predator Scrum Cap — Navy & Gold', caption: null },
    { src: `${CDN}/B1312125-7503-4483-A08E-2A8DE92545E8.jpg?v=1744644600&width=800`,          alt: 'Predator Scrum Cap — Navy & Gold (alternate view)', caption: null },
    { src: `${CDN}/B56A8E00-266A-4270-A497-81E78BADDB10.jpg?v=1744644600&width=800`,          alt: 'Predator Scrum Cap — Navy & Gold (alternate view)', caption: null },
    { src: `${CDN}/29544158-Large-Digital-Photo-Download-3428x2285.jpg?v=1744747280&width=800`, alt: 'Player scoring a try in the Predator Scrum Cap', caption: 'Live match' },
    { src: `${CDN}/29544063-Large-Digital-Photo-Download-2810x1873.jpg?v=1744747333&width=800`, alt: 'Player carrying the ball in the Predator Scrum Cap', caption: 'Live match' },
  ],
}

/**
 * Image gallery for a product. Products with a real old-site gallery
 * (GALLERY_BY_ID) return those exact photos; everything else returns just its
 * single studio image (so the product page shows no extra slides).
 */
export function getProductGallery(product) {
  if (GALLERY_BY_ID[product.id]) return GALLERY_BY_ID[product.id]
  return [{ src: gw(product.image), alt: product.name, caption: null }]
}
