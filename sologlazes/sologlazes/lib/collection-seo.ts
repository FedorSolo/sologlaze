import type { Lang } from "@/lib/i18n-dict";

// Texto SEO por línea (abajo de la grilla de cada colección), en los tres idiomas.
type Block = { heading: string; paragraphs: string[] };

export const collectionSeoText: Record<string, Record<Lang, Block>> = {
  cristalina: {
    es: {
      heading: "Esmaltes Cristalina para cerámica en Argentina",
      paragraphs: [
        "La línea Cristalina de SoloGlazes son esmaltes cerámicos en polvo para cono 5–6 (1200 °C) que desarrollan un efecto de cristales abiertos sobre la superficie de la pieza, con una terminación brillante única en cada cocción. Vienen en los colores Miel, Gris, Rosado-Marrón, Lavanda y Verde, con sus modificadores incluidos para lograr el efecto cristalino correctamente.",
        "Son esmaltes aptos para vajilla y lavavajillas, pensados para ceramistas en Argentina que buscan un acabado decorativo con carácter propio, sin depender de importaciones ni de fórmulas de mezcla complicadas: las proporciones de agua y modificador vienen detalladas para cada peso.",
      ],
    },
    en: {
      heading: "Cristalina ceramic glazes — made in Argentina",
      paragraphs: [
        "The SoloGlazes Cristalina line is a range of powder ceramic glazes for cone 5–6 (1200 °C) that grow open crystals across the surface of the piece, leaving a glossy finish that is unique with every firing. Colors: Honey, Grey, Pink-Brown, Lavender and Green, each with the modifiers included so the crystal effect develops properly.",
        "These glazes are suitable for tableware and dishwasher use, made for ceramists who want a decorative finish with real character without relying on imports or complicated mixing formulas: the water and modifier proportions are listed for each weight.",
      ],
    },
    ru: {
      heading: "Глазури Cristalina для керамики — производство в Аргентине",
      paragraphs: [
        "Линейка Cristalina от SoloGlazes — это порошковые керамические глазури для конуса 5–6 (1200 °C), на поверхности которых при обжиге вырастают раскрытые кристаллы, а блестящее покрытие каждый раз получается неповторимым. Цвета: Мёд, Серый, Розово-коричневый, Лаванда и Зелёный; модификаторы для правильного кристаллического эффекта уже в комплекте.",
        "Глазури подходят для посуды и посудомоечной машины. Они сделаны для керамистов, которым нужен выразительный декоративный результат без импорта и сложных рецептов: пропорции воды и модификаторов указаны для каждого веса.",
      ],
    },
  },
  floating: {
    es: {
      heading: "Esmaltes Floating para cerámica en Argentina",
      paragraphs: [
        "Floating es la línea de esmaltes cerámicos de SoloGlazes con efecto de manchas flotantes y degradé natural, ideal para piezas de gres y cerámica artística cocidas a cono 5–6 (1200 °C). Está disponible en Verde, Verde Grisáceo, Celeste, Azul, Gris Oscuro, Menta y Rosa Crema.",
        "Cada esmalte Floating es en polvo, se prepara con agua según proporciones exactas y trae sus modificadores incluidos. Es una opción buscada por talleres y ceramistas de Buenos Aires y de todo el país que quieren un efecto orgánico y variable, distinto en cada pieza.",
      ],
    },
    en: {
      heading: "Floating ceramic glazes — made in Argentina",
      paragraphs: [
        "Floating is the SoloGlazes line of ceramic glazes with a floating-patch effect and a natural gradient, ideal for stoneware and art ceramics fired at cone 5–6 (1200 °C). Available in Green, Grey-Green, Sky Blue, Blue, Dark Grey, Mint and Cream Pink.",
        "Every Floating glaze is a powder, mixed with water in exact proportions, and comes with its modifiers included. It is a favorite of studios and ceramists in Buenos Aires and across the country who want an organic, variable effect that is different on every piece.",
      ],
    },
    ru: {
      heading: "Глазури Floating для керамики — производство в Аргентине",
      paragraphs: [
        "Floating — линейка керамических глазурей SoloGlazes с эффектом «плывущих» пятен и естественным градиентом. Идеальна для изделий из греса и художественной керамики, обжигаемых на конусе 5–6 (1200 °C). Цвета: Зелёный, Серо-зелёный, Небесно-голубой, Синий, Тёмно-серый, Мятный и Кремово-розовый.",
        "Каждая глазурь Floating поставляется в порошке, разводится водой в точных пропорциях, модификаторы уже в комплекте. Её выбирают мастерские и керамисты Буэнос-Айреса и всей страны, которым нужен живой, меняющийся эффект — разный на каждом изделии.",
      ],
    },
  },
  grrr: {
    es: {
      heading: "Esmaltes GRRR para cerámica en Argentina",
      paragraphs: [
        "GRRR es la línea de esmaltes cerámicos más expresiva de SoloGlazes: texturas vibrantes y manchas fluidas inspiradas en el pelaje animal, para piezas de cerámica con mucho carácter, cocidas a cono 5–6 (1200 °C). Incluye los colores Fuego, Leopardo de las Nieves y Pantera Rosa.",
        "Se aplican en dos capas (base y esmalte superior) con los modificadores correspondientes a cada frasco. Es la serie elegida por ceramistas que buscan un efecto decorativo fuerte y diferenciado dentro del catálogo de esmaltes para gres en Argentina.",
      ],
    },
    en: {
      heading: "GRRR ceramic glazes — made in Argentina",
      paragraphs: [
        "GRRR is the most expressive SoloGlazes line: vibrant textures and fluid patches inspired by animal fur, for ceramic pieces with plenty of character, fired at cone 5–6 (1200 °C). Colors: Fire, Snow Leopard and Pink Panther.",
        "They are applied in two coats (a base glaze and a top glaze) with the modifiers that come with each jar. It is the series chosen by ceramists who want a strong, distinctive decorative effect within the range of stoneware glazes available in Argentina.",
      ],
    },
    ru: {
      heading: "Глазури GRRR для керамики — производство в Аргентине",
      paragraphs: [
        "GRRR — самая выразительная линейка SoloGlazes: яркие текстуры и текучие пятна, вдохновлённые звериной шерстью, для изделий с характером, обжигаемых на конусе 5–6 (1200 °C). Цвета: Огонь, Снежный леопард и Розовая пантера.",
        "Наносятся в два слоя (базовая и верхняя глазурь) с модификаторами из соответствующих баночек. Эту серию выбирают керамисты, которым нужен сильный, ни на что не похожий декоративный эффект среди глазурей для греса в Аргентине.",
      ],
    },
  },
  "pack-prueba": {
    es: {
      heading: "Pack Prueba de esmaltes cerámicos SoloGlazes",
      paragraphs: [
        "El Pack Prueba de SoloGlazes incluye cinco esmaltes cerámicos de 200g a elección, de cualquier color de las líneas Cristalina y Floating (no incluye GRRR). Es la forma más económica de probar distintos efectos y colores antes de comprar un esmalte de 500g o 1kg.",
        "Pensado para ceramistas que recién empiezan a trabajar con los esmaltes SoloGlazes en Buenos Aires y en toda Argentina, o que quieren testear una combinación nueva de colores antes de aplicarla en una pieza grande.",
      ],
    },
    en: {
      heading: "SoloGlazes ceramic glaze Test Pack",
      paragraphs: [
        "The SoloGlazes Test Pack includes five 200 g ceramic glazes of your choice, in any color from the Cristalina and Floating lines (GRRR is not included). It is the most affordable way to try different effects and colors before buying a 500 g or 1 kg glaze.",
        "Made for ceramists who are just starting to work with SoloGlazes in Buenos Aires and across Argentina, or who want to test a new color combination before applying it to a large piece.",
      ],
    },
    ru: {
      heading: "Пробный набор керамических глазурей SoloGlazes",
      paragraphs: [
        "В пробный набор SoloGlazes входят пять керамических глазурей по 200 г на ваш выбор — любых цветов из линеек Cristalina и Floating (GRRR не входит). Это самый доступный способ попробовать разные эффекты и цвета перед покупкой глазури на 500 г или 1 кг.",
        "Набор создан для керамистов, которые только начинают работать с глазурями SoloGlazes в Буэнос-Айресе и по всей Аргентине, а также для тех, кто хочет проверить новое сочетание цветов, прежде чем наносить его на большое изделие.",
      ],
    },
  },
};
