-- SoloGlazes — traducciones EN / RU de productos y colecciones (páginas /en y /ru).
-- Pegar COMPLETO en Supabase → SQL Editor → Run. Se puede ejecutar más de una vez:
-- no pisa las traducciones que ya hayas editado desde el panel (ON CONFLICT DO NOTHING).

CREATE TABLE IF NOT EXISTS "ProductTranslation" (
  "id"                      TEXT PRIMARY KEY,
  "productId"               TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
  "lang"                    TEXT NOT NULL,
  "name"                    TEXT NOT NULL,
  "shortDescription"        TEXT NOT NULL,
  "description"             TEXT NOT NULL,
  "applicationInstructions" TEXT NOT NULL,
  "metaTitle"               TEXT,
  "metaDescription"         TEXT,
  "updatedAt"               TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS "ProductTranslation_productId_lang_key" ON "ProductTranslation" ("productId", "lang");

CREATE TABLE IF NOT EXISTS "CollectionTranslation" (
  "id"           TEXT PRIMARY KEY,
  "collectionId" TEXT NOT NULL REFERENCES "Collection"("id") ON DELETE CASCADE,
  "lang"         TEXT NOT NULL,
  "name"         TEXT NOT NULL,
  "description"  TEXT NOT NULL,
  "updatedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS "CollectionTranslation_collectionId_lang_key" ON "CollectionTranslation" ("collectionId", "lang");

ALTER TABLE "ProductTranslation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CollectionTranslation" ENABLE ROW LEVEL SECURITY;

-- ───────── Productos ─────────
INSERT INTO "ProductTranslation" ("id", "productId", "lang", "name", "shortDescription", "description", "applicationInstructions")
SELECT substr(md5(random()::text || clock_timestamp()::text || v.slug || v.lang), 1, 24), p."id", v.lang, v.name, v.short, v.descr, v.instr
FROM "Product" p
JOIN (VALUES
  ($sg$cristalina-lavanda$sg$, $sg$en$sg$, $sg$Cristalina "Lavender"$sg$, $sg$Soft, ethereal, with a touch of magic.$sg$, $sg$Soft, ethereal and with a touch of magic. The crystals bloom across the surface like tiny constellations. Each glaze comes with two jars of modifiers included in the package.

Kiln firing schedule: 2.5 °C/min up to 1100 °C, then 1 °C/min up to 1200 °C.$sg$, $sg$Dilute the powder glaze with water, adding modifiers 1 and 2 according to the amount you are preparing:
• 500 g → water: 280–350 ml (depending on method) · Modifier 1: 60 ml · Modifier 2: 10 ml
• 1 kg → water: 560–700 ml (depending on method) · Modifier 1: 120 ml · Modifier 2: 20 ml

Mix each component until homogeneous and apply on porous bisque.$sg$),
  ($sg$cristalina-lavanda$sg$, $sg$ru$sg$, $sg$Cristalina «Лаванда»$sg$, $sg$Нежная, воздушная, с волшебным оттенком.$sg$, $sg$Нежная, воздушная, с волшебным оттенком. Кристаллы расцветают на поверхности, словно маленькие созвездия. К каждой глазури в комплекте идут две баночки с модификаторами.

Режим обжига в печи: 2,5 °C/мин до 1100 °C, затем 1 °C/мин до 1200 °C.$sg$, $sg$Разведите порошковую глазурь водой, добавляя модификаторы 1 и 2 в зависимости от приготавливаемого количества:
• 500 г → вода: 280–350 мл (в зависимости от метода) · Модификатор 1: 60 мл · Модификатор 2: 10 мл
• 1 кг → вода: 560–700 мл (в зависимости от метода) · Модификатор 1: 120 мл · Модификатор 2: 20 мл

Тщательно перемешайте каждый компонент до однородной консистенции и наносите на пористый утиль.$sg$),
  ($sg$cristalina-gris$sg$, $sg$en$sg$, $sg$Cristalina "Grey"$sg$, $sg$Elegant and mysterious.$sg$, $sg$Elegant and mysterious. Brown crystals appear over the grey base, adding depth and movement to the surface. Each glaze comes with two jars of modifiers included in the package.

Kiln firing schedule: 2.5 °C/min up to 1100 °C, then 1 °C/min up to 1200 °C.$sg$, $sg$Dilute the powder glaze with water, adding modifiers 1 and 2 according to the amount you are preparing:
• 500 g → water: 280–350 ml (depending on method) · Modifier 1: 60 ml · Modifier 2: 10 ml
• 1 kg → water: 560–700 ml (depending on method) · Modifier 1: 120 ml · Modifier 2: 20 ml

Mix each component until homogeneous and apply on porous bisque.$sg$),
  ($sg$cristalina-gris$sg$, $sg$ru$sg$, $sg$Cristalina «Серый»$sg$, $sg$Элегантная и загадочная.$sg$, $sg$Элегантная и загадочная. На сером фоне проступают коричневые кристаллы, придающие поверхности глубину и движение. К каждой глазури в комплекте идут две баночки с модификаторами.

Режим обжига в печи: 2,5 °C/мин до 1100 °C, затем 1 °C/мин до 1200 °C.$sg$, $sg$Разведите порошковую глазурь водой, добавляя модификаторы 1 и 2 в зависимости от приготавливаемого количества:
• 500 г → вода: 280–350 мл (в зависимости от метода) · Модификатор 1: 60 мл · Модификатор 2: 10 мл
• 1 кг → вода: 560–700 мл (в зависимости от метода) · Модификатор 1: 120 мл · Модификатор 2: 20 мл

Тщательно перемешайте каждый компонент до однородной консистенции и наносите на пористый утиль.$sg$),
  ($sg$cristalina-rosado-marron$sg$, $sg$en$sg$, $sg$Cristalina "Pink-Brown"$sg$, $sg$Warm, earthy and full of personality.$sg$, $sg$Warm, earthy and full of personality. The crystals spread over a soft, complex base, creating deep, organic textures. Each glaze comes with two jars of modifiers included in the package.

Kiln firing schedule: 2.5 °C/min up to 1100 °C, then 1 °C/min up to 1200 °C.$sg$, $sg$Dilute the powder glaze with water, adding modifiers 1 and 2 according to the amount you are preparing:
• 500 g → water: 280–350 ml (depending on method) · Modifier 1: 60 ml · Modifier 2: 10 ml
• 1 kg → water: 560–700 ml (depending on method) · Modifier 1: 120 ml · Modifier 2: 20 ml

Mix each component until homogeneous and apply on porous bisque.$sg$),
  ($sg$cristalina-rosado-marron$sg$, $sg$ru$sg$, $sg$Cristalina «Розово-коричневый»$sg$, $sg$Тёплая, землистая, с ярким характером.$sg$, $sg$Тёплая, землистая, с ярким характером. Кристаллы расползаются по мягкому сложному фону, создавая глубокие органичные текстуры. К каждой глазури в комплекте идут две баночки с модификаторами.

Режим обжига в печи: 2,5 °C/мин до 1100 °C, затем 1 °C/мин до 1200 °C.$sg$, $sg$Разведите порошковую глазурь водой, добавляя модификаторы 1 и 2 в зависимости от приготавливаемого количества:
• 500 г → вода: 280–350 мл (в зависимости от метода) · Модификатор 1: 60 мл · Модификатор 2: 10 мл
• 1 кг → вода: 560–700 мл (в зависимости от метода) · Модификатор 1: 120 мл · Модификатор 2: 20 мл

Тщательно перемешайте каждый компонент до однородной консистенции и наносите на пористый утиль.$sg$),
  ($sg$cristalina-verde$sg$, $sg$en$sg$, $sg$Cristalina "Green"$sg$, $sg$Fresh, vibrant and full of life.$sg$, $sg$Fresh, vibrant and full of life. Turquoise crystals emerge over a soft green base, creating an organic, watery effect. Each glaze comes with two jars of modifiers included in the package.

Kiln firing schedule: 2.5 °C/min up to 1100 °C, then 1 °C/min up to 1200 °C.$sg$, $sg$Dilute the powder glaze with water, adding modifiers 1 and 2 according to the amount you are preparing:
• 500 g → water: 280–350 ml (depending on method) · Modifier 1: 60 ml · Modifier 2: 10 ml
• 1 kg → water: 560–700 ml (depending on method) · Modifier 1: 120 ml · Modifier 2: 20 ml

Mix each component until homogeneous and apply on porous bisque.$sg$),
  ($sg$cristalina-verde$sg$, $sg$ru$sg$, $sg$Cristalina «Зелёный»$sg$, $sg$Свежая, яркая, полная жизни.$sg$, $sg$Свежая, яркая, полная жизни. Бирюзовые кристаллы проявляются на мягком зелёном фоне, создавая органичный «водный» эффект. К каждой глазури в комплекте идут две баночки с модификаторами.

Режим обжига в печи: 2,5 °C/мин до 1100 °C, затем 1 °C/мин до 1200 °C.$sg$, $sg$Разведите порошковую глазурь водой, добавляя модификаторы 1 и 2 в зависимости от приготавливаемого количества:
• 500 г → вода: 280–350 мл (в зависимости от метода) · Модификатор 1: 60 мл · Модификатор 2: 10 мл
• 1 кг → вода: 560–700 мл (в зависимости от метода) · Модификатор 1: 120 мл · Модификатор 2: 20 мл

Тщательно перемешайте каждый компонент до однородной консистенции и наносите на пористый утиль.$sg$),
  ($sg$cristalina-miel$sg$, $sg$en$sg$, $sg$Cristalina "Honey"$sg$, $sg$The crystals open up like a tiny universe.$sg$, $sg$The crystals open up like a tiny universe on the surface. Each glaze comes with two jars of modifiers included in the package.

Kiln firing schedule: 2.5 °C/min up to 1100 °C, then 1 °C/min up to 1200 °C.$sg$, $sg$Dilute the powder glaze with water, adding modifiers 1 and 2 according to the amount you are preparing:
• 500 g → water: 280–350 ml (depending on method) · Modifier 1: 60 ml · Modifier 2: 10 ml
• 1 kg → water: 560–700 ml (depending on method) · Modifier 1: 120 ml · Modifier 2: 20 ml

Mix each component until homogeneous and apply on porous bisque.$sg$),
  ($sg$cristalina-miel$sg$, $sg$ru$sg$, $sg$Cristalina «Мёд»$sg$, $sg$Кристаллы раскрываются, как маленькая вселенная.$sg$, $sg$Кристаллы раскрываются на поверхности, словно маленькая вселенная. К каждой глазури в комплекте идут две баночки с модификаторами.

Режим обжига в печи: 2,5 °C/мин до 1100 °C, затем 1 °C/мин до 1200 °C.$sg$, $sg$Разведите порошковую глазурь водой, добавляя модификаторы 1 и 2 в зависимости от приготавливаемого количества:
• 500 г → вода: 280–350 мл (в зависимости от метода) · Модификатор 1: 60 мл · Модификатор 2: 10 мл
• 1 кг → вода: 560–700 мл (в зависимости от метода) · Модификатор 1: 120 мл · Модификатор 2: 20 мл

Тщательно перемешайте каждый компонент до однородной консистенции и наносите на пористый утиль.$sg$),
  ($sg$floating-verde$sg$, $sg$en$sg$, $sg$Floating "Green"$sg$, $sg$Deep, enveloping, with a flow you'll fall in love with.$sg$, $sg$Deep, enveloping and with a fluidity you'll love. This glaze seems to have a life of its own: it falls softly over the piece, leaving delicate transitions and watercolor-like edges. Every firing brings its own surprise. Each glaze comes with two jars of modifiers included in the package.

Kiln firing schedule: 2.5 °C/min up to 1100 °C, then 1 °C/min up to 1200 °C.$sg$, $sg$Dilute the powder glaze with water, adding modifiers 1 and 2 according to the amount you are preparing:
• 500 g → water: 225–300 ml (depending on method) · Modifier 1: 60 ml · Modifier 2: 10 ml
• 1 kg → water: 450–600 ml (depending on method) · Modifier 1: 120 ml · Modifier 2: 20 ml

Mix each component until homogeneous and apply on porous bisque.$sg$),
  ($sg$floating-verde$sg$, $sg$ru$sg$, $sg$Floating «Зелёный»$sg$, $sg$Глубокая, обволакивающая, с текучестью, в которую влюбляешься.$sg$, $sg$Глубокая, обволакивающая, с текучестью, которая покоряет. У этой глазури будто своя жизнь: она мягко стекает по изделию, оставляя нежные переходы и акварельные края. Каждый обжиг приносит свой сюрприз. К каждой глазури в комплекте идут две баночки с модификаторами.

Режим обжига в печи: 2,5 °C/мин до 1100 °C, затем 1 °C/мин до 1200 °C.$sg$, $sg$Разведите порошковую глазурь водой, добавляя модификаторы 1 и 2 в зависимости от приготавливаемого количества:
• 500 г → вода: 225–300 мл (в зависимости от метода) · Модификатор 1: 60 мл · Модификатор 2: 10 мл
• 1 кг → вода: 450–600 мл (в зависимости от метода) · Модификатор 1: 120 мл · Модификатор 2: 20 мл

Тщательно перемешайте каждый компонент до однородной консистенции и наносите на пористый утиль.$sg$),
  ($sg$floating-celeste$sg$, $sg$en$sg$, $sg$Floating "Sky Blue"$sg$, $sg$Soft, ethereal, with the freshness of an open sky.$sg$, $sg$Soft, ethereal and with the freshness of an open sky. This glaze glides over the piece like a breeze, creating areas of light and depth that invite contemplation. It has a serene character with a lot of presence. Each glaze comes with two jars of modifiers included in the package.

Kiln firing schedule: 2.5 °C/min up to 1100 °C, then 1 °C/min up to 1200 °C.$sg$, $sg$Dilute the powder glaze with water, adding modifiers 1 and 2 according to the amount you are preparing:
• 500 g → water: 280–350 ml (depending on method) · Modifier 1: 60 ml · Modifier 2: 10 ml
• 1 kg → water: 560–700 ml (depending on method) · Modifier 1: 120 ml · Modifier 2: 20 ml

Mix each component until homogeneous and apply on porous bisque.$sg$),
  ($sg$floating-celeste$sg$, $sg$ru$sg$, $sg$Floating «Небесно-голубой»$sg$, $sg$Нежная, воздушная, со свежестью открытого неба.$sg$, $sg$Нежная, воздушная, со свежестью открытого неба. Эта глазурь скользит по изделию, как лёгкий ветерок, создавая участки света и глубины, располагающие к созерцанию. Характер спокойный, но с сильным присутствием. К каждой глазури в комплекте идут две баночки с модификаторами.

Режим обжига в печи: 2,5 °C/мин до 1100 °C, затем 1 °C/мин до 1200 °C.$sg$, $sg$Разведите порошковую глазурь водой, добавляя модификаторы 1 и 2 в зависимости от приготавливаемого количества:
• 500 г → вода: 280–350 мл (в зависимости от метода) · Модификатор 1: 60 мл · Модификатор 2: 10 мл
• 1 кг → вода: 560–700 мл (в зависимости от метода) · Модификатор 1: 120 мл · Модификатор 2: 20 мл

Тщательно перемешайте каждый компонент до однородной консистенции и наносите на пористый утиль.$sg$),
  ($sg$floating-rosa-crema$sg$, $sg$en$sg$, $sg$Floating "Cream Pink"$sg$, $sg$Soft, warm and luminous.$sg$, $sg$Soft, warm and luminous. A glaze that wraps the piece in pink and creamy tones, letting the texture show through and adding plenty of warmth.

Kiln firing schedule: 2.5 °C/min up to 1100 °C, then 1 °C/min up to 1200 °C.$sg$, $sg$Dilute the powder glaze with water, adding modifiers 1 and 2 according to the amount you are preparing:
• 500 g → water: 280–350 ml (depending on method) · Modifier 1: 60 ml · Modifier 2: 10 ml
• 1 kg → water: 560–700 ml (depending on method) · Modifier 1: 120 ml · Modifier 2: 20 ml

Mix each component until homogeneous and apply on porous bisque.$sg$),
  ($sg$floating-rosa-crema$sg$, $sg$ru$sg$, $sg$Floating «Кремово-розовый»$sg$, $sg$Нежная, тёплая и сияющая.$sg$, $sg$Нежная, тёплая и сияющая. Глазурь, которая окутывает изделие розовыми и кремовыми тонами, оставляя видимой текстуру и добавляя много тепла.

Режим обжига в печи: 2,5 °C/мин до 1100 °C, затем 1 °C/мин до 1200 °C.$sg$, $sg$Разведите порошковую глазурь водой, добавляя модификаторы 1 и 2 в зависимости от приготавливаемого количества:
• 500 г → вода: 280–350 мл (в зависимости от метода) · Модификатор 1: 60 мл · Модификатор 2: 10 мл
• 1 кг → вода: 560–700 мл (в зависимости от метода) · Модификатор 1: 120 мл · Модификатор 2: 20 мл

Тщательно перемешайте каждый компонент до однородной консистенции и наносите на пористый утиль.$sg$),
  ($sg$floating-menta$sg$, $sg$en$sg$, $sg$Floating "Mint"$sg$, $sg$Fresh, playful, with a charming vintage touch.$sg$, $sg$Fresh, playful and with a charming vintage touch. It has a calm-water effect on the surface: it spreads like a soft mist, leaving lighter and more intense areas depending on the shape of the piece. Each glaze comes with two jars of modifiers included in the package.

Kiln firing schedule: 2.5 °C/min up to 1100 °C, then 1 °C/min up to 1200 °C.$sg$, $sg$Dilute the powder glaze with water, adding modifiers 1 and 2 according to the amount you are preparing:
• 500 g → water: 280–350 ml (depending on method) · Modifier 1: 60 ml · Modifier 2: 10 ml
• 1 kg → water: 560–700 ml (depending on method) · Modifier 1: 120 ml · Modifier 2: 20 ml

Mix each component until homogeneous and apply on porous bisque.$sg$),
  ($sg$floating-menta$sg$, $sg$ru$sg$, $sg$Floating «Мятный»$sg$, $sg$Свежая, игривая, с очаровательной винтажной ноткой.$sg$, $sg$Свежая, игривая, с очаровательной винтажной ноткой. На поверхности создаётся эффект спокойной воды: глазурь растекается, как лёгкий туман, оставляя более светлые и более насыщенные участки в зависимости от формы изделия. К каждой глазури в комплекте идут две баночки с модификаторами.

Режим обжига в печи: 2,5 °C/мин до 1100 °C, затем 1 °C/мин до 1200 °C.$sg$, $sg$Разведите порошковую глазурь водой, добавляя модификаторы 1 и 2 в зависимости от приготавливаемого количества:
• 500 г → вода: 280–350 мл (в зависимости от метода) · Модификатор 1: 60 мл · Модификатор 2: 10 мл
• 1 кг → вода: 560–700 мл (в зависимости от метода) · Модификатор 1: 120 мл · Модификатор 2: 20 мл

Тщательно перемешайте каждый компонент до однородной консистенции и наносите на пористый утиль.$sg$),
  ($sg$floating-azul$sg$, $sg$en$sg$, $sg$Floating "Blue"$sg$, $sg$Intense, deep and full of nuances.$sg$, $sg$Intense, deep and full of nuances. This glaze flows boldly and settles with natural variations: from light blue to midnight blue. Each glaze comes with two jars of modifiers included in the package.

Kiln firing schedule: 2.5 °C/min up to 1100 °C, then 1 °C/min up to 1200 °C.$sg$, $sg$Dilute the powder glaze with water, adding modifiers 1 and 2 according to the amount you are preparing:
• 500 g → water: 280–350 ml (depending on method) · Modifier 1: 60 ml · Modifier 2: 10 ml
• 1 kg → water: 560–700 ml (depending on method) · Modifier 1: 120 ml · Modifier 2: 20 ml

Mix each component until homogeneous and apply on porous bisque.$sg$),
  ($sg$floating-azul$sg$, $sg$ru$sg$, $sg$Floating «Синий»$sg$, $sg$Насыщенная, глубокая, полная оттенков.$sg$, $sg$Насыщенная, глубокая, полная оттенков. Эта глазурь стекает уверенно и ложится с естественными вариациями: от светло-голубого до ночного синего. К каждой глазури в комплекте идут две баночки с модификаторами.

Режим обжига в печи: 2,5 °C/мин до 1100 °C, затем 1 °C/мин до 1200 °C.$sg$, $sg$Разведите порошковую глазурь водой, добавляя модификаторы 1 и 2 в зависимости от приготавливаемого количества:
• 500 г → вода: 280–350 мл (в зависимости от метода) · Модификатор 1: 60 мл · Модификатор 2: 10 мл
• 1 кг → вода: 560–700 мл (в зависимости от метода) · Модификатор 1: 120 мл · Модификатор 2: 20 мл

Тщательно перемешайте каждый компонент до однородной консистенции и наносите на пористый утиль.$sg$),
  ($sg$floating-verde-grisaceo$sg$, $sg$en$sg$, $sg$Floating "Grey-Green"$sg$, $sg$Natural, earthy, with a very special character.$sg$, $sg$Natural, earthy and with a very special character. This color lives between the botanical and the mineral, with subtle shifts that adapt to the form. It brings a wild air and a quiet beauty. Each glaze comes with two jars of modifiers included in the package.

Kiln firing schedule: 2.5 °C/min up to 1100 °C, then 1 °C/min up to 1200 °C.$sg$, $sg$Dilute the powder glaze with water, adding modifiers 1 and 2 according to the amount you are preparing:
• 500 g → water: 225–300 ml (depending on method) · Modifier 1: 60 ml · Modifier 2: 10 ml
• 1 kg → water: 450–600 ml (depending on method) · Modifier 1: 120 ml · Modifier 2: 20 ml

Mix each component until homogeneous and apply on porous bisque.$sg$),
  ($sg$floating-verde-grisaceo$sg$, $sg$ru$sg$, $sg$Floating «Серо-зелёный»$sg$, $sg$Природная, землистая, с особым характером.$sg$, $sg$Природная, землистая, с особым характером. Этот цвет живёт на стыке растительного и минерального, с тонкими переходами, подстраивающимися под форму. Он придаёт дикую естественность и спокойную красоту. К каждой глазури в комплекте идут две баночки с модификаторами.

Режим обжига в печи: 2,5 °C/мин до 1100 °C, затем 1 °C/мин до 1200 °C.$sg$, $sg$Разведите порошковую глазурь водой, добавляя модификаторы 1 и 2 в зависимости от приготавливаемого количества:
• 500 г → вода: 225–300 мл (в зависимости от метода) · Модификатор 1: 60 мл · Модификатор 2: 10 мл
• 1 кг → вода: 450–600 мл (в зависимости от метода) · Модификатор 1: 120 мл · Модификатор 2: 20 мл

Тщательно перемешайте каждый компонент до однородной консистенции и наносите на пористый утиль.$sg$),
  ($sg$floating-gris-oscuro$sg$, $sg$en$sg$, $sg$Floating "Dark Grey"$sg$, $sg$Sober, elegant, full of subtle textures.$sg$, $sg$Sober, elegant and full of subtle textures. The glaze reveals micro-transparencies and shadowed areas that make every piece unique. Each glaze comes with two jars of modifiers included in the package.

Kiln firing schedule: 2.5 °C/min up to 1100 °C, then 1 °C/min up to 1200 °C.$sg$, $sg$Dilute the powder glaze with water, adding modifiers 1 and 2 according to the amount you are preparing:
• 500 g → water: 280–350 ml (depending on method) · Modifier 1: 60 ml · Modifier 2: 10 ml
• 1 kg → water: 560–700 ml (depending on method) · Modifier 1: 120 ml · Modifier 2: 20 ml

Mix each component until homogeneous and apply on porous bisque.$sg$),
  ($sg$floating-gris-oscuro$sg$, $sg$ru$sg$, $sg$Floating «Тёмно-серый»$sg$, $sg$Сдержанная, элегантная, полная тонких текстур.$sg$, $sg$Сдержанная, элегантная, полная тонких текстур. Глазурь проявляет микропрозрачности и теневые участки, благодаря которым каждое изделие уникально. К каждой глазури в комплекте идут две баночки с модификаторами.

Режим обжига в печи: 2,5 °C/мин до 1100 °C, затем 1 °C/мин до 1200 °C.$sg$, $sg$Разведите порошковую глазурь водой, добавляя модификаторы 1 и 2 в зависимости от приготавливаемого количества:
• 500 г → вода: 280–350 мл (в зависимости от метода) · Модификатор 1: 60 мл · Модификатор 2: 10 мл
• 1 кг → вода: 560–700 мл (в зависимости от метода) · Модификатор 1: 120 мл · Модификатор 2: 20 мл

Тщательно перемешайте каждый компонент до однородной консистенции и наносите на пористый утиль.$sg$),
  ($sg$grrr-pantera-rosa$sg$, $sg$en$sg$, $sg$GRRR "Pink Panther"$sg$, $sg$Fluid spotted effect, vibrant and wild texture.$sg$, $sg$An expressive glaze with a fluid spotted effect that recalls the coat of an exotic animal. A vibrant, wild texture full of character. Ideal for those who want pieces with bite. Each glaze comes with two jars of modifiers included in the package.$sg$, $sg$Application instructions — GRRR series:
1) Preparation: dilute the Base and top glazes with water, adding the modifiers in the proportions indicated. Prepare each one separately, without mixing them together, until homogeneous.
2) Base: apply two covering coats of the base glaze, letting it dry well between coats.
3) Top glaze: once the base is dry, apply two or three coats of the top glaze, letting each coat dry to avoid dissolving the previous ones.$sg$),
  ($sg$grrr-pantera-rosa$sg$, $sg$ru$sg$, $sg$GRRR «Розовая пантера»$sg$, $sg$Эффект текучих пятен, живая и дикая текстура.$sg$, $sg$Выразительная глазурь с эффектом текучих пятен, напоминающим шерсть экзотического зверя. Живая, дикая текстура, полная характера. Для тех, кто ищет изделия с напором и характером. К каждой глазури в комплекте идут две баночки с модификаторами.$sg$, $sg$Инструкция по нанесению — серия GRRR:
1) Подготовка: разведите базовую и верхнюю глазури водой, добавляя модификаторы в указанных пропорциях. Готовьте каждую отдельно, не смешивая между собой, до однородной консистенции.
2) База: нанесите два укрывающих слоя базовой глазури, хорошо просушивая между слоями.
3) Верхняя глазурь: когда база высохла, нанесите два-три слоя верхней глазури, давая каждому слою просохнуть, чтобы не размыть предыдущие.$sg$),
  ($sg$grrr-leopardo-de-los-nieves$sg$, $sg$en$sg$, $sg$GRRR "Snow Leopard"$sg$, $sg$Fluid spotted effect, vibrant and wild texture.$sg$, $sg$An expressive glaze with a fluid spotted effect that recalls the coat of an exotic animal. A vibrant, wild texture full of character. Ideal for those who want pieces with bite. Each glaze comes with two jars of modifiers included in the package.$sg$, $sg$Application instructions — GRRR series:
1) Preparation: dilute the Base and top glazes with water, adding the modifiers in the proportions indicated. Prepare each one separately, without mixing them together, until homogeneous.
2) Base: apply two covering coats of the base glaze, letting it dry well between coats.
3) Top glaze: once the base is dry, apply two or three coats of the top glaze, letting each coat dry to avoid dissolving the previous ones.$sg$),
  ($sg$grrr-leopardo-de-los-nieves$sg$, $sg$ru$sg$, $sg$GRRR «Снежный леопард»$sg$, $sg$Эффект текучих пятен, живая и дикая текстура.$sg$, $sg$Выразительная глазурь с эффектом текучих пятен, напоминающим шерсть экзотического зверя. Живая, дикая текстура, полная характера. Для тех, кто ищет изделия с напором и характером. К каждой глазури в комплекте идут две баночки с модификаторами.$sg$, $sg$Инструкция по нанесению — серия GRRR:
1) Подготовка: разведите базовую и верхнюю глазури водой, добавляя модификаторы в указанных пропорциях. Готовьте каждую отдельно, не смешивая между собой, до однородной консистенции.
2) База: нанесите два укрывающих слоя базовой глазури, хорошо просушивая между слоями.
3) Верхняя глазурь: когда база высохла, нанесите два-три слоя верхней глазури, давая каждому слою просохнуть, чтобы не размыть предыдущие.$sg$),
  ($sg$grrr-fuego$sg$, $sg$en$sg$, $sg$GRRR "Fire"$sg$, $sg$Intense and vibrant, with the power of fire.$sg$, $sg$Intense and vibrant. Orange hues and dark flashes unfold over the red base, evoking the power of fire and the passion of ceramics. Each glaze comes with two jars of modifiers included in the package.$sg$, $sg$Application instructions — GRRR series:
1) Preparation: dilute the Base and top glazes with water, adding the modifiers in the proportions indicated. Prepare each one separately, without mixing them together, until homogeneous.
2) Base: apply two covering coats of the base glaze, letting it dry well between coats.
3) Top glaze: once the base is dry, apply two or three coats of the top glaze, letting each coat dry to avoid dissolving the previous ones.$sg$),
  ($sg$grrr-fuego$sg$, $sg$ru$sg$, $sg$GRRR «Огонь»$sg$, $sg$Интенсивная и яркая, с силой огня.$sg$, $sg$Интенсивная и яркая. На красной основе раскрываются оранжевые оттенки и тёмные вспышки, напоминающие о силе огня и страсти к керамике. К каждой глазури в комплекте идут две баночки с модификаторами.$sg$, $sg$Инструкция по нанесению — серия GRRR:
1) Подготовка: разведите базовую и верхнюю глазури водой, добавляя модификаторы в указанных пропорциях. Готовьте каждую отдельно, не смешивая между собой, до однородной консистенции.
2) База: нанесите два укрывающих слоя базовой глазури, хорошо просушивая между слоями.
3) Верхняя глазурь: когда база высохла, нанесите два-три слоя верхней глазури, давая каждому слою просохнуть, чтобы не размыть предыдущие.$sg$),
  ($sg$pack-prueba-5x200g$sg$, $sg$en$sg$, $sg$Test Pack 5x200 g$sg$, $sg$Five glazes of your choice, 200 g each, to test before buying in larger sizes.$sg$, $sg$A box with five different glazes, each in a 200 g bag. You choose any 5 glazes (except the GRRR series) and we ship them to you. The total weight of the pack, including modifiers, is 1.1 kg. It's the ideal amount for testing: see the color on your own clay, test it in your kiln, and make sure the glaze works for you. All glazes are for cone 5–5.5 (1200 °C).$sg$, $sg$Dilute the powder glaze with water, adding the included modifiers, following the proportions in the Application Guide. Firing at 1200 °C (cone 5.5).$sg$),
  ($sg$pack-prueba-5x200g$sg$, $sg$ru$sg$, $sg$Пробный набор 5×200 г$sg$, $sg$Пять глазурей на выбор по 200 г — чтобы протестировать перед покупкой большого объёма.$sg$, $sg$Коробка с пятью разными глазурями в пакетиках по 200 г. Вы выбираете любые 5 глазурей (кроме серии GRRR), и мы отправляем их вам. Общий вес набора вместе с модификаторами — 1,1 кг. Это идеальное количество для проб: увидеть цвет на вашей глине, проверить в своей печи и убедиться, что глазурь вам подходит. Все глазури предназначены для конуса 5–5,5 (1200 °C).$sg$, $sg$Разведите порошковую глазурь водой, добавляя модификаторы из комплекта, согласно пропорциям из Руководства по нанесению. Обжиг при 1200 °C (конус 5,5).$sg$)
) AS v(slug, lang, name, short, descr, instr) ON v.slug = p.slug
ON CONFLICT ("productId", "lang") DO NOTHING;

-- ───────── Colecciones ─────────
INSERT INTO "CollectionTranslation" ("id", "collectionId", "lang", "name", "description")
SELECT substr(md5(random()::text || clock_timestamp()::text || v.slug || v.lang), 1, 24), c."id", v.lang, v.name, v.descr
FROM "Collection" c
JOIN (VALUES
  ($sg$cristalina$sg$, $sg$en$sg$, $sg$Cristalina$sg$, $sg$Glazes with a transparent base and crystals that emerge during firing, creating unique effects of depth and movement on every piece. Firing at 1200 °C (cone 5–6).$sg$),
  ($sg$cristalina$sg$, $sg$ru$sg$, $sg$Cristalina$sg$, $sg$Глазури с прозрачной основой и кристаллами, которые проявляются при обжиге и создают уникальные эффекты глубины и движения на каждом изделии. Обжиг при 1200 °C (конус 5–6).$sg$),
  ($sg$floating$sg$, $sg$en$sg$, $sg$Floating$sg$, $sg$Glazes with pigments that “float” across the surface during firing, creating organic, unrepeatable textures in stoneware kilns.$sg$),
  ($sg$floating$sg$, $sg$ru$sg$, $sg$Floating$sg$, $sg$Глазури с пигментами, которые «плывут» по поверхности во время обжига, создавая органичные неповторимые текстуры в печах для греса.$sg$),
  ($sg$grrr$sg$, $sg$en$sg$, $sg$GRRR$sg$, $sg$Our premium line with volcanic effects and high texture, for ceramists seeking spectacular finishes. Firing at 1200 °C (cone 5–6).$sg$),
  ($sg$grrr$sg$, $sg$ru$sg$, $sg$GRRR$sg$, $sg$Наша премиальная линейка с вулканическими эффектами и выраженной текстурой — для керамистов, которые ищут эффектные покрытия. Обжиг при 1200 °C (конус 5–6).$sg$),
  ($sg$pack-prueba$sg$, $sg$en$sg$, $sg$Test Pack$sg$, $sg$Try 5 glazes of your choice before buying a 500 g or 1 kg size.$sg$),
  ($sg$pack-prueba$sg$, $sg$ru$sg$, $sg$Пробный набор$sg$, $sg$Попробуйте 5 глазурей на выбор, прежде чем покупать 500 г или 1 кг.$sg$)
) AS v(slug, lang, name, descr) ON v.slug = c.slug
ON CONFLICT ("collectionId", "lang") DO NOTHING;
