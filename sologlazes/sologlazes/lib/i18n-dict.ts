// Idiomas del sitio y textos de la interfaz. Sin "use client": lo usan tanto los componentes de
// servidor como los de cliente.
//
// URLs: español en la raíz (/catalogo), inglés en /en y ruso en /ru. Solo las páginas de la tienda
// (inicio, catálogo, colecciones y fichas de producto) existen en los tres idiomas; el resto
// (carrito, checkout, guía, cuenta…) sigue en español.

export type Lang = "es" | "en" | "ru";
export const LANGS: Lang[] = ["es", "en", "ru"];
export const BASE_URL = "https://sologlazes.com.ar";

export const LANG_NAMES: Record<Lang, string> = { es: "Español", en: "English", ru: "Русский" };
export const LANG_SHORT: Record<Lang, string> = { es: "ES", en: "EN", ru: "RU" };
export const OG_LOCALE: Record<Lang, string> = { es: "es_AR", en: "en_US", ru: "ru_RU" };

export function isLocale(v: string): v is "en" | "ru" {
  return v === "en" || v === "ru";
}

export function langFromPath(pathname?: string | null): Lang {
  if (!pathname) return "es";
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  if (pathname === "/ru" || pathname.startsWith("/ru/")) return "ru";
  return "es";
}

// Quita el prefijo de idioma: "/en/catalogo" → "/catalogo", "/en" → "/".
export function stripLang(pathname: string): string {
  const stripped = pathname.replace(/^\/(en|ru)(?=\/|$)/, "");
  return stripped === "" ? "/" : stripped;
}

// ¿Esta ruta existe traducida? (inicio, catálogo, colecciones, fichas)
export function isTranslatedPath(path: string) {
  return path === "/" || path === "/catalogo" || /^\/catalogo\/[^/]+$/.test(path) || /^\/producto\/[^/]+$/.test(path);
}

// Link con el idioma correcto. Las rutas sin traducción quedan tal cual (en español).
export function hrefFor(lang: Lang, path: string): string {
  if (lang === "es" || !isTranslatedPath(path)) return path;
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}

// Misma página en los tres idiomas (para el selector de idioma y para hreflang).
export function altPaths(pathname: string): Record<Lang, string> {
  const base = stripLang(pathname);
  if (isTranslatedPath(base)) return { es: base, en: hrefFor("en", base), ru: hrefFor("ru", base) };
  return { es: base, en: "/en", ru: "/ru" };
}

export function plural(lang: Lang, n: number, forms: { one: string; few?: string; many: string }) {
  if (lang === "ru") {
    const m10 = n % 10;
    const m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return forms.one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return forms.few ?? forms.many;
    return forms.many;
  }
  return n === 1 ? forms.one : forms.many;
}

// "1200 °C (cono 5,5)" → "1200 °C (cone 5.5)" / "1200 °C (конус 5,5)"
export function localizeTemp(value: string, lang: Lang) {
  if (lang === "en") return value.replace(/cono/gi, "cone").replace(/(\d),(\d)/g, "$1.$2");
  if (lang === "ru") return value.replace(/cono/gi, "конус");
  return value;
}

export const COLLECTION_NAMES: Record<string, Record<Lang, string>> = {
  cristalina: { es: "Cristalina", en: "Cristalina", ru: "Cristalina" },
  floating: { es: "Floating", en: "Floating", ru: "Floating" },
  grrr: { es: "GRRR", en: "GRRR", ru: "GRRR" },
  "pack-prueba": { es: "Pack Prueba", en: "Test Pack", ru: "Пробный набор" },
};

type Dict = Record<string, string>;

const es: Dict = {
  // navegación
  inicio: "Inicio",
  catalogo: "Catálogo",
  guia: "Guía",
  nosotros: "Nosotros",
  coworking: "Coworking",
  gres: "Esmaltes para GRES",
  contacto: "Contacto",
  buscar: "Buscar",
  carrito: "Carrito",
  favoritos: "Favoritos",
  ingresar: "Ingresar",
  ingresarRegistrarme: "Ingresar o registrarme",
  miCuenta: "Mi cuenta",
  cerrarSesion: "Cerrar sesión",
  idioma: "Idioma",
  cambiarIdioma: "Cambiar idioma",
  mas: "Más",
  verTodos: "Ver todos los esmaltes",
  abrirMenu: "Abrir menú",
  cerrarMenu: "Cerrar menú",
  menu: "Menú",
  logoAria: "SoloGlazes — inicio",
  whatsappUs: "Escribinos por WhatsApp",
  // pie
  footProducto: "Producto",
  footAyuda: "Ayuda",
  footMarca: "Marca",
  footLegal: "Legal",
  envios: "Envíos y devoluciones",
  guiaAplicacion: "Guía de aplicación",
  contactoWa: "Contacto (WhatsApp)",
  terminos: "Términos",
  privacidad: "Privacidad",
  // inicio
  homeH1: "SoloGlazes — Esmaltes cerámicos para alta temperatura, gres y vajilla (cono 5–6)",
  heroAlt: "Pieza cerámica terminada con esmalte SoloGlazes, mostrando textura y brillo tras la cocción",
  badge: "Cono 5–6 · 1200°C · Proporciones exactas, sin tanteos",
  verCatalogo: "Ver catálogo",
  noSeQueElegir: "No sé qué elegir",
  nuestrasLineas: "Nuestras líneas",
  explorar: "Explorar",
  lineAlt: "Piezas de cerámica con esmaltes de la línea {name}",
  coworkingKicker: "Coworking",
  coworkingH2: "Un espacio compartido para ceramistas",
  coworkingText: "Trabajá, cocé tus piezas y compartí con otros ceramistas en nuestro taller de Federico Lacroze 1658.",
  coworkingBtn: "Conocer el coworking",
  mlKicker: "También en Mercado Libre",
  mlH2: "Encontranos en nuestra página oficial de Mercado Libre",
  mlText: "Si preferís comprar por Mercado Libre, tenemos nuestra propia página con los mismos esmaltes de siempre.",
  mlBtn: "Ver en Mercado Libre",
  ctaH2: "¿Tenés dudas antes de comprar?",
  ctaText: "Escribinos por WhatsApp — te ayudamos a elegir el esmalte según tu horno y tu pieza.",
  ctaBtn: "Escribir por WhatsApp",
  homeSeoH2: "Esmalte cerámico para alta temperatura, gres y vajilla",
  homeSeoP1: "En SoloGlazes fabricamos en Buenos Aires esmaltes cerámicos en polvo para alta temperatura (cono 5–6, 1200 °C), pensados para gres y pastas de alta temperatura. Cada esmalte para gres se prepara con agua según proporciones exactas y trae sus modificadores incluidos, así que obtenés resultados estables y repetibles en horno eléctrico o a gas.",
  homeSeoP2: "Son esmaltes para vajilla y piezas utilitarias —tazas, platos, bowls— y también para cerámica artística y decorativa. Elegí entre Cristalina (cristales abiertos), Floating (manchas flotantes y degradé) y GRRR (texturas de pelaje), o probá cinco colores a elección con el Pack Prueba antes de comprar 500 g o 1 kg. Enviamos a todo el país.",
  homeSeoLinks: "Ver también",
  homeSeoGres: "Esmaltes para gres cono 5,5–6",
  homeSeoGuia: "Cómo aplicar el esmalte",
  // catálogo
  catalogTitle: "Esmaltes cerámicos para alta temperatura y gres — Catálogo",
  catalogDesc: "Catálogo de esmaltes cerámicos en polvo para alta temperatura: esmaltes para gres y vajilla, cono 5–6 (1200 °C). Cristalina, Floating y GRRR. Envíos a toda Argentina.",
  productCountOne: "producto",
  productCountMany: "productos",
  sortBy: "Ordenar por",
  sortPopular: "Más populares",
  sortPriceAsc: "Precio: menor a mayor",
  sortPriceDesc: "Precio: mayor a menor",
  noResults: "Sin resultados con estos filtros",
  noResultsHint: "Probá con otra combinación de temperatura o línea.",
  clearFilters: "Limpiar filtros",
  filter: "Filtrar",
  clear: "Limpiar",
  close: "Cerrar",
  viewResults: "Ver {n} resultados",
  attrTemperature: "Temperatura",
  attrCollection: "Serie",
  // tarjeta / producto
  agregarAlCarrito: "Agregar al carrito",
  agregado: "✓ Agregado",
  agotado: "Agotado",
  agotadoMsg: "Agotado por el momento — escribinos por WhatsApp y te avisamos cuando vuelva",
  agotadoShort: "(agotado)",
  addAria: "Agregar {name} al carrito",
  foodSafe: "Apto para vajilla y alimentos",
  dishwasher: "Apto lavavajillas",
  quickOrder: "Pedido rápido por WhatsApp",
  waMsg: "Hola! Quiero pedir el esmalte {name}",
  mlAlso: "También disponible en nuestra página de Mercado Libre",
  description: "Descripción",
  features: "Características",
  instructions: "Instrucciones de aplicación",
  mixVideo: "Video: cómo mezclar los esmaltes",
  mixVideoTitle: "Cómo mezclar los esmaltes SoloGlazes",
  subtract: "Restar",
  add: "Sumar",
  addFavorite: "Agregar a favoritos",
  related: "También te puede interesar",
  photoSoon: "foto próximamente",
  zoom: "Ampliar foto",
  zoomed: "Foto ampliada",
  viewImage: "Ver imagen {n}",
  viewVideo: "Ver video {n}",
  // reseñas
  reviews: "Reseñas",
  noReviews: "Todavía no hay reseñas para este producto. ¿Ya lo probaste? Contanos cómo te fue.",
  reviewOne: "reseña",
  reviewMany: "reseñas",
  verifiedClient: "Cliente verificado",
  leaveReview: "Dejá tu reseña",
  reviewPlaceholder: "¿Cómo te fue con este esmalte?",
  sendReview: "Enviar reseña",
  sending: "Enviando...",
  thanksReview: "¡Gracias! Tu reseña quedó enviada y se va a publicar apenas la revisemos.",
  rateWith: "Calificar con {n} estrellas",
  // SEO
  seoProductTitle: "{name} — Esmalte para gres y alta temperatura",
  seoKeywords: "esmalte cerámico para alta temperatura,esmalte para gres,esmalte para vajilla,esmalte cerámico en polvo,esmalte cono 6,esmaltes cerámicos Argentina,esmaltes cerámicos Buenos Aires",
  seoImgAlt: "{name} — esmalte cerámico para gres, en polvo",
  seoHomeTitle: "Esmaltes cerámicos para alta temperatura, gres y vajilla — SoloGlazes",
  seoHomeDesc: "Esmaltes cerámicos en polvo para alta temperatura (cono 5–6, 1200 °C): esmaltes para gres y vajilla, con modificadores incluidos. Cristalina, Floating y GRRR. Envíos a toda Argentina.",
  breadcrumb: "Migas de pan",
};

const en: Dict = {
  inicio: "Home",
  catalogo: "Catalog",
  guia: "Guide",
  nosotros: "About us",
  coworking: "Coworking",
  gres: "Stoneware glazes",
  contacto: "Contact",
  buscar: "Search",
  carrito: "Cart",
  favoritos: "Favorites",
  ingresar: "Sign in",
  ingresarRegistrarme: "Sign in or register",
  miCuenta: "My account",
  cerrarSesion: "Sign out",
  idioma: "Language",
  cambiarIdioma: "Change language",
  mas: "More",
  verTodos: "View all glazes",
  abrirMenu: "Open menu",
  cerrarMenu: "Close menu",
  menu: "Menu",
  logoAria: "SoloGlazes — home",
  whatsappUs: "Message us on WhatsApp",
  footProducto: "Products",
  footAyuda: "Help",
  footMarca: "Brand",
  footLegal: "Legal",
  envios: "Shipping & returns",
  guiaAplicacion: "Application guide",
  contactoWa: "Contact (WhatsApp)",
  terminos: "Terms",
  privacidad: "Privacy",
  homeH1: "SoloGlazes — High-temperature ceramic glazes for stoneware and tableware (cone 5–6)",
  heroAlt: "Ceramic piece finished with SoloGlazes glaze, showing texture and gloss after firing",
  badge: "Cone 5–6 · 1200 °C · Exact proportions, no guesswork",
  verCatalogo: "View catalog",
  noSeQueElegir: "Help me choose",
  nuestrasLineas: "Our lines",
  explorar: "Explore",
  lineAlt: "Ceramic pieces with glazes from the {name} line",
  coworkingKicker: "Coworking",
  coworkingH2: "A shared space for ceramists",
  coworkingText: "Work, fire your pieces and share the space with other ceramists at our studio at Federico Lacroze 1658, Buenos Aires.",
  coworkingBtn: "Discover the coworking",
  mlKicker: "Also on Mercado Libre",
  mlH2: "Find us on our official Mercado Libre page",
  mlText: "If you prefer to buy through Mercado Libre, we have our own page with the same glazes you know.",
  mlBtn: "View on Mercado Libre",
  ctaH2: "Questions before you buy?",
  ctaText: "Message us on WhatsApp — we'll help you choose the right glaze for your kiln and your piece.",
  ctaBtn: "Message us on WhatsApp",
  homeSeoH2: "High-temperature ceramic glaze for stoneware and tableware",
  homeSeoP1: "At SoloGlazes we make powder ceramic glazes for high temperature (cone 5–6, 1200 °C) in Buenos Aires, designed for stoneware and high-fire clay bodies. Each stoneware glaze is mixed with water in exact proportions and comes with its modifiers included, so you get stable, repeatable results in electric or gas kilns.",
  homeSeoP2: "They are glazes for tableware and utilitarian pieces — cups, plates, bowls — as well as art and decorative ceramics. Choose Cristalina (open crystals), Floating (floating patches and gradient) or GRRR (fur-like textures), or try five colors of your choice with the Test Pack before buying 500 g or 1 kg. We ship across Argentina.",
  homeSeoLinks: "See also",
  homeSeoGres: "Stoneware glazes, cone 5.5–6",
  homeSeoGuia: "How to apply the glaze",
  catalogTitle: "High-temperature ceramic glazes for stoneware — Catalog",
  catalogDesc: "Catalog of high-temperature ceramic glaze powders: stoneware and tableware glazes, cone 5–6 (1200 °C). Cristalina, Floating and GRRR. Shipping across Argentina.",
  productCountOne: "product",
  productCountMany: "products",
  sortBy: "Sort by",
  sortPopular: "Most popular",
  sortPriceAsc: "Price: low to high",
  sortPriceDesc: "Price: high to low",
  noResults: "No results with these filters",
  noResultsHint: "Try a different combination of temperature or line.",
  clearFilters: "Clear filters",
  filter: "Filter",
  clear: "Clear",
  close: "Close",
  viewResults: "View {n} results",
  attrTemperature: "Temperature",
  attrCollection: "Line",
  agregarAlCarrito: "Add to cart",
  agregado: "✓ Added",
  agotado: "Sold out",
  agotadoMsg: "Out of stock for now — message us on WhatsApp and we'll let you know when it's back",
  agotadoShort: "(sold out)",
  addAria: "Add {name} to cart",
  foodSafe: "Food-safe tableware glaze",
  dishwasher: "Dishwasher safe",
  quickOrder: "Quick order on WhatsApp",
  waMsg: "Hi! I'd like to order the glaze {name}",
  mlAlso: "Also available on our Mercado Libre page",
  description: "Description",
  features: "Specifications",
  instructions: "Application instructions",
  mixVideo: "Video: how to mix the glazes",
  mixVideoTitle: "How to mix SoloGlazes powder glazes",
  subtract: "Decrease",
  add: "Increase",
  addFavorite: "Add to favorites",
  related: "You may also like",
  photoSoon: "photo coming soon",
  zoom: "Enlarge photo",
  zoomed: "Enlarged photo",
  viewImage: "View image {n}",
  viewVideo: "View video {n}",
  reviews: "Reviews",
  noReviews: "No reviews for this product yet. Already tried it? Tell us how it went.",
  reviewOne: "review",
  reviewMany: "reviews",
  verifiedClient: "Verified customer",
  leaveReview: "Leave a review",
  reviewPlaceholder: "How did this glaze work for you?",
  sendReview: "Submit review",
  sending: "Sending...",
  thanksReview: "Thank you! Your review has been sent and will be published as soon as we've checked it.",
  rateWith: "Rate {n} stars",
  seoProductTitle: "{name} — Stoneware glaze, high-fire",
  seoKeywords: "ceramic glaze,powder glaze,stoneware glaze,cone 5-6 glaze,pottery glaze Argentina,glaze Buenos Aires",
  seoImgAlt: "{name} — ceramic glaze powder",
  seoHomeTitle: "High-temperature ceramic glazes for stoneware and tableware — SoloGlazes",
  seoHomeDesc: "High-temperature ceramic glaze powders (cone 5–6, 1200 °C): stoneware and tableware glazes with modifiers included. Cristalina, Floating and GRRR. Shipping across Argentina.",
  breadcrumb: "Breadcrumb",
};

const ru: Dict = {
  inicio: "Главная",
  catalogo: "Каталог",
  guia: "Гид",
  nosotros: "О нас",
  coworking: "Коворкинг",
  gres: "Глазури для греса",
  contacto: "Контакты",
  buscar: "Поиск",
  carrito: "Корзина",
  favoritos: "Избранное",
  ingresar: "Войти",
  ingresarRegistrarme: "Войти или зарегистрироваться",
  miCuenta: "Мой аккаунт",
  cerrarSesion: "Выйти",
  idioma: "Язык",
  cambiarIdioma: "Сменить язык",
  mas: "Ещё",
  verTodos: "Все глазури",
  abrirMenu: "Открыть меню",
  cerrarMenu: "Закрыть меню",
  menu: "Меню",
  logoAria: "SoloGlazes — главная",
  whatsappUs: "Написать в WhatsApp",
  footProducto: "Товары",
  footAyuda: "Помощь",
  footMarca: "Бренд",
  footLegal: "Документы",
  envios: "Доставка и возврат",
  guiaAplicacion: "Руководство по нанесению",
  contactoWa: "Связаться (WhatsApp)",
  terminos: "Условия",
  privacidad: "Конфиденциальность",
  homeH1: "SoloGlazes — высокотемпературные керамические глазури для греса и посуды (конус 5–6)",
  heroAlt: "Керамическое изделие с глазурью SoloGlazes: текстура и блеск после обжига",
  badge: "Конус 5–6 · 1200 °C · Точные пропорции, без догадок",
  verCatalogo: "Смотреть каталог",
  noSeQueElegir: "Не знаю, что выбрать",
  nuestrasLineas: "Наши линейки",
  explorar: "Смотреть",
  lineAlt: "Керамические изделия с глазурями линейки {name}",
  coworkingKicker: "Коворкинг",
  coworkingH2: "Общее пространство для керамистов",
  coworkingText: "Работайте, обжигайте изделия и общайтесь с другими керамистами в нашей мастерской на Federico Lacroze 1658 в Буэнос-Айресе.",
  coworkingBtn: "Узнать о коворкинге",
  mlKicker: "Мы есть и на Mercado Libre",
  mlH2: "Найдите нас на официальной странице Mercado Libre",
  mlText: "Если вам удобнее покупать через Mercado Libre — у нас там своя страница с теми же глазурями.",
  mlBtn: "Открыть на Mercado Libre",
  ctaH2: "Остались вопросы перед покупкой?",
  ctaText: "Напишите нам в WhatsApp — поможем выбрать глазурь под вашу печь и изделие.",
  ctaBtn: "Написать в WhatsApp",
  homeSeoH2: "Высокотемпературная керамическая глазурь для греса и посуды",
  homeSeoP1: "В SoloGlazes мы производим в Буэнос-Айресе порошковые керамические глазури для высоких температур (конус 5–6, 1200 °C), рассчитанные на грес и высокотемпературные массы. Каждая глазурь для греса разводится водой в точных пропорциях и поставляется с модификаторами — результат стабильный и повторяемый в электрической или газовой печи.",
  homeSeoP2: "Это глазури для посуды и утилитарных изделий — чашек, тарелок, мисок — а также для художественной и декоративной керамики. Выбирайте Cristalina (раскрытые кристаллы), Floating (плывущие пятна и градиент) или GRRR (текстура шерсти), либо попробуйте пять цветов на выбор в пробном наборе перед покупкой 500 г или 1 кг. Доставляем по всей Аргентине.",
  homeSeoLinks: "См. также",
  homeSeoGres: "Глазури для греса, конус 5,5–6",
  homeSeoGuia: "Как наносить глазурь",
  catalogTitle: "Высокотемпературные глазури для греса — Каталог",
  catalogDesc: "Каталог высокотемпературных керамических глазурей в порошке: глазури для греса и посуды, конус 5–6 (1200 °C). Cristalina, Floating и GRRR. Доставка по Аргентине.",
  productCountOne: "товар",
  productCountMany: "товаров",
  sortBy: "Сортировка",
  sortPopular: "Популярные",
  sortPriceAsc: "Цена: по возрастанию",
  sortPriceDesc: "Цена: по убыванию",
  noResults: "Ничего не найдено по этим фильтрам",
  noResultsHint: "Попробуйте другую комбинацию температуры или линейки.",
  clearFilters: "Сбросить фильтры",
  filter: "Фильтры",
  clear: "Сбросить",
  close: "Закрыть",
  viewResults: "Показать результатов: {n}",
  attrTemperature: "Температура",
  attrCollection: "Линейка",
  agregarAlCarrito: "В корзину",
  agregado: "✓ Добавлено",
  agotado: "Нет в наличии",
  agotadoMsg: "Сейчас нет в наличии — напишите нам в WhatsApp, мы сообщим, когда появится",
  agotadoShort: "(нет в наличии)",
  addAria: "Добавить в корзину: {name}",
  foodSafe: "Безопасна для посуды и контакта с пищей",
  dishwasher: "Можно мыть в посудомоечной машине",
  quickOrder: "Быстрый заказ в WhatsApp",
  waMsg: "Здравствуйте! Хочу заказать глазурь {name}",
  mlAlso: "Также доступно на нашей странице Mercado Libre",
  description: "Описание",
  features: "Характеристики",
  instructions: "Инструкция по нанесению",
  mixVideo: "Видео: как смешивать глазури",
  mixVideoTitle: "Как смешивать порошковые глазури SoloGlazes",
  subtract: "Уменьшить",
  add: "Увеличить",
  addFavorite: "В избранное",
  related: "Вам также может понравиться",
  photoSoon: "фото скоро появится",
  zoom: "Увеличить фото",
  zoomed: "Увеличенное фото",
  viewImage: "Изображение {n}",
  viewVideo: "Видео {n}",
  reviews: "Отзывы",
  noReviews: "Пока нет отзывов об этом товаре. Уже пробовали? Расскажите, как всё прошло.",
  reviewOne: "отзыв",
  reviewMany: "отзывов",
  verifiedClient: "Проверенный покупатель",
  leaveReview: "Оставьте отзыв",
  reviewPlaceholder: "Как прошла работа с этой глазурью?",
  sendReview: "Отправить отзыв",
  sending: "Отправка...",
  thanksReview: "Спасибо! Отзыв отправлен и появится на сайте после проверки.",
  rateWith: "Оценка: {n}",
  seoProductTitle: "{name} — глазурь для греса, высокотемпературная",
  seoKeywords: "керамическая глазурь,порошковая глазурь,глазурь для греса,глазурь конус 5-6,глазури Аргентина,глазури Буэнос-Айрес",
  seoImgAlt: "{name} — керамическая глазурь в порошке",
  seoHomeTitle: "Высокотемпературные глазури для греса и посуды — SoloGlazes",
  seoHomeDesc: "Высокотемпературные керамические глазури в порошке (конус 5–6, 1200 °C): глазури для греса и посуды, модификаторы в комплекте. Cristalina, Floating и GRRR. Доставка по Аргентине.",
  breadcrumb: "Навигационная цепочка",
};

export const dictionaries: Record<Lang, Dict> = { es, en, ru };

export function tr(lang: Lang, key: string, vars?: Record<string, string | number>) {
  let s = dictionaries[lang][key] ?? dictionaries.es[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
  return s;
}
