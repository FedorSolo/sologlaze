import type { Lang } from "@/lib/i18n-dict";

// Texto SEO por línea (abajo de la grilla de cada colección), en los tres idiomas.
// `faq` alimenta tanto las preguntas visibles como el JSON-LD FAQPage.
export type SeoFaq = { q: string; a: string };
export type SeoBlock = { heading: string; paragraphs: string[]; faqHeading: string; faq: SeoFaq[] };

export const collectionSeoText: Record<string, Record<Lang, SeoBlock>> = {
  cristalina: {
    es: {
      heading: "Esmaltes Cristalina para cerámica en Argentina",
      paragraphs: [
        "La línea Cristalina de SoloGlazes son esmaltes cerámicos en polvo para cono 5–6 (1200 °C) que desarrollan un efecto de cristales abiertos sobre la superficie de la pieza, con una terminación brillante única en cada cocción. Vienen en los colores Miel, Gris, Rosado-Marrón, Lavanda y Verde, con sus modificadores incluidos para lograr el efecto cristalino correctamente.",
        "Son esmaltes aptos para vajilla y lavavajillas, pensados para ceramistas en Argentina que buscan un acabado decorativo con carácter propio, sin depender de importaciones ni de fórmulas de mezcla complicadas: las proporciones de agua y modificador vienen detalladas para cada peso.",
        "Los esmaltes Cristalina se venden en 500 g y 1 kg, y también podés probarlos primero en el Pack Prueba de 5 esmaltes de 200 g. Si es tu primera vez con esmaltes cristalinos, la Guía de aplicación explica cómo preparar la mezcla, cuántas capas aplicar y cómo cocer para que los cristales se desarrollen bien.",
      ],
      faqHeading: "Preguntas frecuentes sobre los esmaltes Cristalina",
      faq: [
        { q: "¿A qué temperatura se cuecen los esmaltes Cristalina?", a: "A cono 5–6, es decir alrededor de 1200 °C, sobre piezas de gres o pasta de alta temperatura ya bizcochadas." },
        { q: "¿Qué colores tiene la línea Cristalina?", a: "Miel, Gris, Rosado-Marrón, Lavanda y Verde. Cada color se vende en polvo, con los modificadores incluidos." },
        { q: "¿Los esmaltes Cristalina sirven para vajilla?", a: "Sí, son aptos para vajilla y lavavajillas una vez cocidos correctamente a la temperatura indicada." },
        { q: "¿Cómo preparo el esmalte en polvo?", a: "Se diluye con agua y se agregan los modificadores incluidos, siguiendo las proporciones que vienen para cada peso y que están detalladas en la Guía de aplicación." },
      ],
    },
    en: {
      heading: "Cristalina ceramic glazes — made in Argentina",
      paragraphs: [
        "The SoloGlazes Cristalina line is a range of powder ceramic glazes for cone 5–6 (1200 °C) that grow open crystals across the surface of the piece, leaving a glossy finish that is unique with every firing. Colors: Honey, Grey, Pink-Brown, Lavender and Green, each with the modifiers included so the crystal effect develops properly.",
        "These glazes are suitable for tableware and dishwasher use, made for ceramists who want a decorative finish with real character without relying on imports or complicated mixing formulas: the water and modifier proportions are listed for each weight.",
        "Cristalina glazes are sold in 500 g and 1 kg sizes, and you can also try them first in the Test Pack of five 200 g glazes. If crystalline glazes are new to you, the Application Guide explains how to mix, how many coats to apply and how to fire so the crystals grow well.",
      ],
      faqHeading: "Frequently asked questions about Cristalina glazes",
      faq: [
        { q: "What temperature are Cristalina glazes fired at?", a: "At cone 5–6, around 1200 °C, on stoneware or high-fire clay that has already been bisque fired." },
        { q: "Which colors does the Cristalina line come in?", a: "Honey, Grey, Pink-Brown, Lavender and Green. Each color is sold as a powder with the modifiers included." },
        { q: "Are Cristalina glazes suitable for tableware?", a: "Yes, they are suitable for tableware and dishwasher use once fired correctly at the recommended temperature." },
        { q: "How do I prepare the powder glaze?", a: "Dilute it with water and add the included modifiers, following the proportions given for each weight and detailed in the Application Guide." },
      ],
    },
    ru: {
      heading: "Глазури Cristalina для керамики — производство в Аргентине",
      paragraphs: [
        "Линейка Cristalina от SoloGlazes — это порошковые керамические глазури для конуса 5–6 (1200 °C), на поверхности которых при обжиге вырастают раскрытые кристаллы, а блестящее покрытие каждый раз получается неповторимым. Цвета: Мёд, Серый, Розово-коричневый, Лаванда и Зелёный; модификаторы для правильного кристаллического эффекта уже в комплекте.",
        "Глазури подходят для посуды и посудомоечной машины. Они сделаны для керамистов, которым нужен выразительный декоративный результат без импорта и сложных рецептов: пропорции воды и модификаторов указаны для каждого веса.",
        "Глазури Cristalina продаются по 500 г и 1 кг, а сначала их можно попробовать в пробном наборе из пяти глазурей по 200 г. Если вы впервые работаете с кристаллическими глазурями, Руководство по нанесению расскажет, как готовить смесь, сколько слоёв наносить и как обжигать, чтобы кристаллы выросли правильно.",
      ],
      faqHeading: "Частые вопросы о глазурях Cristalina",
      faq: [
        { q: "На какую температуру рассчитаны глазури Cristalina?", a: "На конус 5–6, то есть около 1200 °C, для изделий из греса или высокотемпературной массы после утельного обжига." },
        { q: "Какие цвета есть в линейке Cristalina?", a: "Мёд, Серый, Розово-коричневый, Лаванда и Зелёный. Каждый цвет продаётся в порошке, модификаторы входят в комплект." },
        { q: "Подходят ли глазури Cristalina для посуды?", a: "Да, после правильного обжига на рекомендованной температуре они подходят для посуды и посудомоечной машины." },
        { q: "Как приготовить порошковую глазурь?", a: "Разведите водой и добавьте модификаторы из комплекта по пропорциям, указанным для каждого веса и описанным в Руководстве по нанесению." },
      ],
    },
  },
  floating: {
    es: {
      heading: "Esmaltes Floating para cerámica en Argentina",
      paragraphs: [
        "Floating es la línea de esmaltes cerámicos de SoloGlazes con efecto de manchas flotantes y degradé natural, ideal para piezas de gres y cerámica artística cocidas a cono 5–6 (1200 °C). Está disponible en Verde, Verde Grisáceo, Celeste, Azul, Gris Oscuro, Menta y Rosa Crema.",
        "Cada esmalte Floating es en polvo, se prepara con agua según proporciones exactas y trae sus modificadores incluidos. Es una opción buscada por talleres y ceramistas de Buenos Aires y de todo el país que quieren un efecto orgánico y variable, distinto en cada pieza.",
        "Con Floating podés trabajar un solo color o combinar dos tonos para lograr degradés propios. Se venden en 500 g y 1 kg, y para decidir el color sin arriesgar una compra grande podés armar tu Pack Prueba con cinco esmaltes de 200 g a elección.",
      ],
      faqHeading: "Preguntas frecuentes sobre los esmaltes Floating",
      faq: [
        { q: "¿Qué efecto tienen los esmaltes Floating?", a: "Producen manchas flotantes y un degradé natural que cambia de una pieza a otra, por eso cada cerámica queda distinta." },
        { q: "¿A qué temperatura se cuecen?", a: "A cono 5–6 (alrededor de 1200 °C), pensados para gres y cerámica artística de alta temperatura." },
        { q: "¿Qué colores hay en la línea Floating?", a: "Verde, Verde Grisáceo, Celeste, Azul, Gris Oscuro, Menta y Rosa Crema." },
        { q: "¿Puedo probar un color antes de comprar un kilo?", a: "Sí: el Pack Prueba incluye cinco esmaltes de 200 g a elección entre las líneas Cristalina y Floating." },
      ],
    },
    en: {
      heading: "Floating ceramic glazes — made in Argentina",
      paragraphs: [
        "Floating is the SoloGlazes line of ceramic glazes with a floating-patch effect and a natural gradient, ideal for stoneware and art ceramics fired at cone 5–6 (1200 °C). Available in Green, Grey-Green, Sky Blue, Blue, Dark Grey, Mint and Cream Pink.",
        "Every Floating glaze is a powder, mixed with water in exact proportions, and comes with its modifiers included. It is a favorite of studios and ceramists in Buenos Aires and across the country who want an organic, variable effect that is different on every piece.",
        "With Floating you can work with a single color or combine two shades to create your own gradients. The glazes come in 500 g and 1 kg sizes, and to choose a color without risking a large purchase you can build your own Test Pack of five 200 g glazes.",
      ],
      faqHeading: "Frequently asked questions about Floating glazes",
      faq: [
        { q: "What effect do Floating glazes give?", a: "They produce floating patches and a natural gradient that changes from piece to piece, so every ceramic comes out different." },
        { q: "What temperature are they fired at?", a: "At cone 5–6 (around 1200 °C), made for stoneware and high-fire art ceramics." },
        { q: "Which colors are in the Floating line?", a: "Green, Grey-Green, Sky Blue, Blue, Dark Grey, Mint and Cream Pink." },
        { q: "Can I try a color before buying a kilo?", a: "Yes: the Test Pack includes five 200 g glazes of your choice from the Cristalina and Floating lines." },
      ],
    },
    ru: {
      heading: "Глазури Floating для керамики — производство в Аргентине",
      paragraphs: [
        "Floating — линейка керамических глазурей SoloGlazes с эффектом «плывущих» пятен и естественным градиентом. Идеальна для изделий из греса и художественной керамики, обжигаемых на конусе 5–6 (1200 °C). Цвета: Зелёный, Серо-зелёный, Небесно-голубой, Синий, Тёмно-серый, Мятный и Кремово-розовый.",
        "Каждая глазурь Floating поставляется в порошке, разводится водой в точных пропорциях, модификаторы уже в комплекте. Её выбирают мастерские и керамисты Буэнос-Айреса и всей страны, которым нужен живой, меняющийся эффект — разный на каждом изделии.",
        "С Floating можно работать в одном цвете или сочетать два оттенка, создавая собственные градиенты. Глазури продаются по 500 г и 1 кг, а чтобы выбрать цвет без крупной покупки, соберите пробный набор из пяти глазурей по 200 г на ваш выбор.",
      ],
      faqHeading: "Частые вопросы о глазурях Floating",
      faq: [
        { q: "Какой эффект дают глазури Floating?", a: "Они создают «плывущие» пятна и естественный градиент, который отличается от изделия к изделию, поэтому каждая вещь получается неповторимой." },
        { q: "На какую температуру они рассчитаны?", a: "На конус 5–6 (около 1200 °C) — для греса и высокотемпературной художественной керамики." },
        { q: "Какие цвета есть в линейке Floating?", a: "Зелёный, Серо-зелёный, Небесно-голубой, Синий, Тёмно-серый, Мятный и Кремово-розовый." },
        { q: "Можно ли попробовать цвет, не покупая килограмм?", a: "Да: в пробный набор входят пять глазурей по 200 г на ваш выбор из линеек Cristalina и Floating." },
      ],
    },
  },
  grrr: {
    es: {
      heading: "Esmaltes GRRR para cerámica en Argentina",
      paragraphs: [
        "GRRR es la línea de esmaltes cerámicos más expresiva de SoloGlazes: texturas vibrantes y manchas fluidas inspiradas en el pelaje animal, para piezas de cerámica con mucho carácter, cocidas a cono 5–6 (1200 °C). Incluye los colores Fuego, Leopardo de las Nieves y Pantera Rosa.",
        "Se aplican en dos capas (base y esmalte superior) con los modificadores correspondientes a cada frasco. Es la serie elegida por ceramistas que buscan un efecto decorativo fuerte y diferenciado dentro del catálogo de esmaltes para gres en Argentina.",
        "Como el resultado depende de la aplicación en dos pasos, conviene leer la Guía de aplicación antes de empezar y hacer una prueba en una pieza chica. GRRR no forma parte del Pack Prueba: se compra por separado, en su presentación completa.",
      ],
      faqHeading: "Preguntas frecuentes sobre los esmaltes GRRR",
      faq: [
        { q: "¿Qué colores tiene la línea GRRR?", a: "Fuego, Leopardo de las Nieves y Pantera Rosa, con texturas que recuerdan al pelaje animal." },
        { q: "¿Cómo se aplican los esmaltes GRRR?", a: "En dos capas: primero la base y después el esmalte superior, con los modificadores que trae cada frasco." },
        { q: "¿A qué temperatura se cuecen?", a: "A cono 5–6, alrededor de 1200 °C." },
        { q: "¿GRRR viene en el Pack Prueba?", a: "No, el Pack Prueba incluye las líneas Cristalina y Floating. GRRR se compra por separado." },
      ],
    },
    en: {
      heading: "GRRR ceramic glazes — made in Argentina",
      paragraphs: [
        "GRRR is the most expressive SoloGlazes line: vibrant textures and fluid patches inspired by animal fur, for ceramic pieces with plenty of character, fired at cone 5–6 (1200 °C). Colors: Fire, Snow Leopard and Pink Panther.",
        "They are applied in two coats (a base glaze and a top glaze) with the modifiers that come with each jar. It is the series chosen by ceramists who want a strong, distinctive decorative effect within the range of stoneware glazes available in Argentina.",
        "Because the result depends on the two-step application, it is worth reading the Application Guide before you start and testing on a small piece first. GRRR is not part of the Test Pack: it is bought separately, in its full size.",
      ],
      faqHeading: "Frequently asked questions about GRRR glazes",
      faq: [
        { q: "Which colors does the GRRR line come in?", a: "Fire, Snow Leopard and Pink Panther, with textures reminiscent of animal fur." },
        { q: "How are GRRR glazes applied?", a: "In two coats: the base glaze first and then the top glaze, with the modifiers that come in each jar." },
        { q: "What temperature are they fired at?", a: "At cone 5–6, around 1200 °C." },
        { q: "Does GRRR come in the Test Pack?", a: "No, the Test Pack covers the Cristalina and Floating lines. GRRR is bought separately." },
      ],
    },
    ru: {
      heading: "Глазури GRRR для керамики — производство в Аргентине",
      paragraphs: [
        "GRRR — самая выразительная линейка SoloGlazes: яркие текстуры и текучие пятна, вдохновлённые звериной шерстью, для изделий с характером, обжигаемых на конусе 5–6 (1200 °C). Цвета: Огонь, Снежный леопард и Розовая пантера.",
        "Наносятся в два слоя (базовая и верхняя глазурь) с модификаторами из соответствующих баночек. Эту серию выбирают керамисты, которым нужен сильный, ни на что не похожий декоративный эффект среди глазурей для греса в Аргентине.",
        "Поскольку результат зависит от двухэтапного нанесения, перед началом стоит прочитать Руководство по нанесению и сделать пробу на небольшом изделии. GRRR не входит в пробный набор: эта серия покупается отдельно, в полной упаковке.",
      ],
      faqHeading: "Частые вопросы о глазурях GRRR",
      faq: [
        { q: "Какие цвета есть в линейке GRRR?", a: "Огонь, Снежный леопард и Розовая пантера — с текстурами, напоминающими звериную шерсть." },
        { q: "Как наносить глазури GRRR?", a: "В два слоя: сначала базовая глазурь, затем верхняя, с модификаторами из каждой баночки." },
        { q: "На какую температуру они рассчитаны?", a: "На конус 5–6, около 1200 °C." },
        { q: "Входит ли GRRR в пробный набор?", a: "Нет, в пробный набор входят линейки Cristalina и Floating. GRRR покупается отдельно." },
      ],
    },
  },
  "pack-prueba": {
    es: {
      heading: "Pack Prueba de esmaltes cerámicos SoloGlazes",
      paragraphs: [
        "El Pack Prueba de SoloGlazes incluye cinco esmaltes cerámicos de 200 g a elección, de cualquier color de las líneas Cristalina y Floating (no incluye GRRR). Es la forma más económica de probar distintos efectos y colores antes de comprar un esmalte de 500 g o 1 kg.",
        "Pensado para ceramistas que recién empiezan a trabajar con los esmaltes SoloGlazes en Buenos Aires y en toda Argentina, o que quieren testear una combinación nueva de colores antes de aplicarla en una pieza grande.",
        "El peso total del pack, con los modificadores incluidos, es de 1,1 kg: una cantidad ideal para probar el color sobre tu propia arcilla, en tu horno, y comprobar que el esmalte funciona para vos. Todos los esmaltes son para cono 5–5,5 (1200 °C).",
      ],
      faqHeading: "Preguntas frecuentes sobre el Pack Prueba",
      faq: [
        { q: "¿Qué incluye el Pack Prueba?", a: "Cinco esmaltes de 200 g a elección, con sus modificadores incluidos. El peso total del pack es de 1,1 kg." },
        { q: "¿Puedo elegir cualquier color?", a: "Podés elegir entre los colores de las líneas Cristalina y Floating. La línea GRRR no está incluida en el pack." },
        { q: "¿Cómo elijo los cinco esmaltes?", a: "Los elegís en el carrito, después de agregar el pack, y nosotros te los enviamos." },
        { q: "¿A qué temperatura se cuecen los esmaltes del pack?", a: "A cono 5–5,5, alrededor de 1200 °C." },
      ],
    },
    en: {
      heading: "SoloGlazes ceramic glaze Test Pack",
      paragraphs: [
        "The SoloGlazes Test Pack includes five 200 g ceramic glazes of your choice, in any color from the Cristalina and Floating lines (GRRR is not included). It is the most affordable way to try different effects and colors before buying a 500 g or 1 kg glaze.",
        "Made for ceramists who are just starting to work with SoloGlazes in Buenos Aires and across Argentina, or who want to test a new color combination before applying it to a large piece.",
        "The total weight of the pack, including the modifiers, is 1.1 kg: an ideal amount to test the color on your own clay, in your own kiln, and make sure the glaze works for you. All glazes are for cone 5–5.5 (1200 °C).",
      ],
      faqHeading: "Frequently asked questions about the Test Pack",
      faq: [
        { q: "What is included in the Test Pack?", a: "Five 200 g glazes of your choice, with their modifiers included. The total weight of the pack is 1.1 kg." },
        { q: "Can I choose any color?", a: "You can choose from the colors of the Cristalina and Floating lines. The GRRR line is not included in the pack." },
        { q: "How do I choose the five glazes?", a: "You pick them in the cart after adding the pack, and we ship them to you." },
        { q: "What temperature are the pack's glazes fired at?", a: "At cone 5–5.5, around 1200 °C." },
      ],
    },
    ru: {
      heading: "Пробный набор керамических глазурей SoloGlazes",
      paragraphs: [
        "В пробный набор SoloGlazes входят пять керамических глазурей по 200 г на ваш выбор — любых цветов из линеек Cristalina и Floating (GRRR не входит). Это самый доступный способ попробовать разные эффекты и цвета перед покупкой глазури на 500 г или 1 кг.",
        "Набор создан для керамистов, которые только начинают работать с глазурями SoloGlazes в Буэнос-Айресе и по всей Аргентине, а также для тех, кто хочет проверить новое сочетание цветов, прежде чем наносить его на большое изделие.",
        "Общий вес набора вместе с модификаторами — 1,1 кг: идеальное количество, чтобы проверить цвет на своей глине, в своей печи и убедиться, что глазурь вам подходит. Все глазури рассчитаны на конус 5–5,5 (1200 °C).",
      ],
      faqHeading: "Частые вопросы о пробном наборе",
      faq: [
        { q: "Что входит в пробный набор?", a: "Пять глазурей по 200 г на ваш выбор, модификаторы включены. Общий вес набора — 1,1 кг." },
        { q: "Можно ли выбрать любой цвет?", a: "Можно выбирать из цветов линеек Cristalina и Floating. Линейка GRRR в набор не входит." },
        { q: "Как выбрать пять глазурей?", a: "Вы выбираете их в корзине после добавления набора, а мы отправляем их вам." },
        { q: "На какую температуру рассчитаны глазури набора?", a: "На конус 5–5,5, около 1200 °C." },
      ],
    },
  },
};
