import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Todos los textos, precios e imágenes de este archivo se tomaron directamente de
// sologlazes.com.ar (Shopify) el 31/07/2026 — no son datos de ejemplo inventados.
// Las URLs de imagen apuntan al CDN actual del sitio (ver next.config.ts); migrar a
// Cloudinary/UploadThing es un paso pendiente del PRD (sección 7), no de este seed.

const CDN = "https://www.sologlazes.com.ar/cdn/shop/files";

async function main() {
  const bcrypt = await import("bcryptjs");

  const cristalina = await prisma.collection.upsert({
    where: { slug: "cristalina" },
    update: {},
    create: {
      slug: "cristalina",
      name: "Cristalina",
      description:
        "Esmaltes de base transparente con cristales que emergen durante la cocción, creando efectos únicos de profundidad y movimiento en cada pieza. Cocción a 1200 °C (cono 5–6).",
      heroImageUrl: "https://www.sologlazes.com.ar/cdn/shop/collections/IMG_5769.jpg",
      isPremium: false,
      sortOrder: 1,
    },
  });

  const floating = await prisma.collection.upsert({
    where: { slug: "floating" },
    update: {},
    create: {
      slug: "floating",
      name: "Floating",
      description:
        "Esmaltes con pigmentos que \"flotan\" en la superficie durante el gateo, generando texturas orgánicas e irrepetibles en hornos de gres.",
      heroImageUrl: "https://www.sologlazes.com.ar/cdn/shop/collections/IMG_5924.jpg",
      isPremium: false,
      sortOrder: 2,
    },
  });

  const grrr = await prisma.collection.upsert({
    where: { slug: "grrr" },
    update: {},
    create: {
      slug: "grrr",
      name: "GRRR",
      description:
        "Nuestra línea premium con efectos volcánicos y de alta textura, para ceramistas que buscan acabados espectaculares. Quema a 1200–1230 °C en atmósfera oxidante.",
      heroImageUrl: "https://www.sologlazes.com.ar/cdn/shop/collections/IMG_8904_1.jpg",
      isPremium: true,
      sortOrder: 3,
    },
  });

  const tempAttribute = await prisma.attribute.upsert({
    where: { key: "temperature" },
    update: {},
    create: { key: "temperature", label: "Temperatura" },
  });
  const tempStandard = await prisma.attributeValue.upsert({
    where: { attributeId_value: { attributeId: tempAttribute.id, value: "1200 °C (cono 5,5)" } },
    update: {},
    create: { attributeId: tempAttribute.id, value: "1200 °C (cono 5,5)" },
  });
  const tempGrrr = await prisma.attributeValue.upsert({
    where: { attributeId_value: { attributeId: tempAttribute.id, value: "1200–1230°C, atmósfera oxidante" } },
    update: {},
    create: { attributeId: tempAttribute.id, value: "1200–1230°C, atmósfera oxidante" },
  });

  const modifiersNote = "Con cada esmalte vienen dos frascos con modificadores incluidos en el paquete.";
  const applicationDefault =
    "Aplicar directamente sobre bizcocho poroso, sin tamizar ni mezclar. Cocción a 1200 °C (cono 5,5). Gres utilizado en las pruebas: Muta Camel / Crecer Lisa.";
  const applicationGrrr = `Instrucciones de aplicación — Serie GRRR:
1) Preparación: diluir los esmaltes Base y superior con agua, agregando los modificadores según las proporciones indicadas. Preparar cada uno por separado, sin mezclarlos entre sí, hasta consistencia homogénea.
2) Base: aplicar dos capas cubritivas del esmalte base, dejando secar bien entre manos.
3) Esmalte superior: una vez seca la base, aplicar dos o tres capas del esmalte superior, dejando secar cada capa para evitar disolver las anteriores.`;

  type SeedProduct = {
    slug: string;
    name: string;
    collectionId: string;
    shortDescription: string;
    description: string;
    applicationInstructions: string;
    tempValueId: string;
    images: { url: string; alt: string }[];
    variants: { label: string; price: number }[];
  };

  const products: SeedProduct[] = [
    {
      slug: "cristalina-lavanda",
      name: "Cristalina \"Lavanda\"",
      collectionId: cristalina.id,
      shortDescription: "Suave, etérea y con un toque mágico.",
      description: `Suave, etérea y con un toque mágico. Los cristales florecen sobre la superficie como pequeñas constelaciones. ${modifiersNote}`,
      applicationInstructions: applicationDefault,
      tempValueId: tempStandard.id,
      images: [
        { url: `${CDN}/IMG_5894.jpg`, alt: "Pieza de cerámica con esmalte Cristalina Lavanda" },
        { url: `${CDN}/IMG_5896.jpg`, alt: "Detalle de los cristales del esmalte Cristalina Lavanda" },
        { url: `${CDN}/IMG_2422.jpg`, alt: "Otra pieza terminada con esmalte Cristalina Lavanda" },
      ],
      variants: [
        { label: "0.5 kg", price: 17000 },
        { label: "1 kg", price: 27000 },
      ],
    },
    {
      slug: "cristalina-gris",
      name: "Cristalina \"Gris\"",
      collectionId: cristalina.id,
      shortDescription: "Elegante y misteriosa.",
      description: `Elegante y misteriosa. Sobre la base gris aparecen cristales marrones que le dan profundidad y movimiento a la superficie. ${modifiersNote}`,
      applicationInstructions: applicationDefault,
      tempValueId: tempStandard.id,
      images: [
        { url: `${CDN}/IMG_5889.jpg`, alt: "Pieza de cerámica con esmalte Cristalina Gris" },
        { url: `${CDN}/IMG_5891.jpg`, alt: "Detalle del esmalte Cristalina Gris" },
        { url: `${CDN}/IMG_2425.jpg`, alt: "Otra pieza terminada con esmalte Cristalina Gris" },
      ],
      variants: [
        { label: "0.5 kg", price: 17000 },
        { label: "1 kg", price: 27000 },
      ],
    },
    {
      slug: "cristalina-rosado-marron",
      name: "Cristalina \"Rosado-Marrón\"",
      collectionId: cristalina.id,
      shortDescription: "Cálida, terrosa y con mucha personalidad.",
      description: `Cálida, terrosa y con mucha personalidad. Los cristales se expanden sobre una base suave y compleja, creando texturas profundas y orgánicas. ${modifiersNote}`,
      applicationInstructions: applicationDefault,
      tempValueId: tempStandard.id,
      images: [
        { url: `${CDN}/IMG_5874.jpg`, alt: "Pieza de cerámica con esmalte Cristalina Rosado-Marrón" },
        { url: `${CDN}/IMG_5875.jpg`, alt: "Detalle del esmalte Cristalina Rosado-Marrón" },
      ],
      variants: [
        { label: "0.5 kg", price: 16000 },
        { label: "1 kg", price: 26000 },
      ],
    },
    {
      slug: "cristalina-verde",
      name: "Cristalina \"Verde\"",
      collectionId: cristalina.id,
      shortDescription: "Fresca, vibrante y llena de vida.",
      description: `Fresca, vibrante y llena de vida. Se revelan cristales turquesa sobre una base verde suave, creando un efecto orgánico y acuático. ${modifiersNote}`,
      applicationInstructions: applicationDefault,
      tempValueId: tempStandard.id,
      images: [
        { url: `${CDN}/IMG_5901.jpg`, alt: "Pieza de cerámica con esmalte Cristalina Verde" },
        { url: `${CDN}/IMG_5902.jpg`, alt: "Detalle del esmalte Cristalina Verde" },
        { url: `${CDN}/IMG_2424.jpg`, alt: "Otra pieza terminada con esmalte Cristalina Verde" },
      ],
      variants: [
        { label: "0.5 kg", price: 16500 },
        { label: "1 kg", price: 26500 },
      ],
    },
    {
      slug: "cristalina-miel",
      name: "Cristalina \"Miel\"",
      collectionId: cristalina.id,
      shortDescription: "Los cristales se abren como un pequeño universo.",
      description: `Los cristales se abren como un pequeño universo en la superficie. ${modifiersNote}`,
      applicationInstructions: applicationDefault,
      tempValueId: tempStandard.id,
      images: [
        { url: `${CDN}/Miel_85698f43-a229-4bba-a755-2ddd7c3238d5.jpg`, alt: "Pieza de cerámica con esmalte Cristalina Miel" },
        { url: `${CDN}/Miel1.jpg`, alt: "Detalle del esmalte Cristalina Miel" },
        { url: `${CDN}/IMG_2423.jpg`, alt: "Otra pieza terminada con esmalte Cristalina Miel" },
      ],
      variants: [
        { label: "0.5 kg", price: 16000 },
        { label: "1 kg", price: 26000 },
      ],
    },
    {
      slug: "floating-verde",
      name: "Floating \"Verde\"",
      collectionId: floating.id,
      shortDescription: "Profundo, envolvente y con una fluidez que enamora.",
      description: `Profundo, envolvente y con una fluidez que enamora. Esta esmalte parece tener vida propia: cae suave sobre la pieza, dejando transiciones delicadas y bordes acuarelados. Cada horneada trae su propia sorpresa. ${modifiersNote}`,
      applicationInstructions: applicationDefault,
      tempValueId: tempStandard.id,
      images: [
        { url: `${CDN}/IMG_5943.jpg`, alt: "Pieza de cerámica con esmalte Floating Verde" },
        { url: `${CDN}/IMG_5945.jpg`, alt: "Detalle del esmalte Floating Verde" },
        { url: `${CDN}/IMG_6361.jpg`, alt: "Otra pieza terminada con esmalte Floating Verde" },
      ],
      variants: [
        { label: "0.5 kg", price: 17000 },
        { label: "1 kg", price: 27000 },
      ],
    },
    {
      slug: "floating-celeste",
      name: "Floating \"Celeste\"",
      collectionId: floating.id,
      shortDescription: "Suave, etéreo y con la frescura del cielo abierto.",
      description: `Suave, etéreo y con la frescura del cielo abierto. Esta esmalte se desliza como una brisa sobre la pieza, creando zonas de luz y profundidad que invitan a la contemplación. Tiene un carácter sereno pero con mucha presencia. ${modifiersNote}`,
      applicationInstructions: applicationDefault,
      tempValueId: tempStandard.id,
      images: [
        { url: `${CDN}/IMG_5909.jpg`, alt: "Pieza de cerámica con esmalte Floating Celeste" },
        { url: `${CDN}/IMG_5910.jpg`, alt: "Detalle del esmalte Floating Celeste" },
        { url: `${CDN}/IMG_5918.jpg`, alt: "Otra pieza con esmalte Floating Celeste" },
        { url: `${CDN}/IMG_2429.jpg`, alt: "Set de piezas con esmalte Floating Celeste" },
      ],
      variants: [
        { label: "0.5 kg", price: 16500 },
        { label: "1 kg", price: 26500 },
      ],
    },
    {
      slug: "floating-rosa-crema",
      name: "Floating \"Rosa Crema\"",
      collectionId: floating.id,
      shortDescription: "Suave, cálida y luminosa.",
      description:
        "Suave, cálida y luminosa. Una esmalte que envuelve la pieza con tonos rosados y cremosos, dejando ver la textura y aportando mucha calidez.",
      applicationInstructions: applicationDefault,
      tempValueId: tempStandard.id,
      images: [
        { url: `${CDN}/IMG_5948.jpg`, alt: "Pieza de cerámica con esmalte Floating Rosa Crema" },
        { url: `${CDN}/IMG_5987.jpg`, alt: "Detalle del esmalte Floating Rosa Crema" },
        { url: `${CDN}/IMG_2431.jpg`, alt: "Otra pieza con esmalte Floating Rosa Crema" },
      ],
      variants: [
        { label: "0.5 kg", price: 16000 },
        { label: "1 kg", price: 26000 },
      ],
    },
    {
      slug: "floating-menta",
      name: "Floating \"Menta\"",
      collectionId: floating.id,
      shortDescription: "Fresco, jugado y con un punto vintage encantador.",
      description: `Fresco, jugado y con un punto vintage encantador. Tiene un efecto de agua calma sobre la superficie: se expande como una neblina suave, dejando zonas más claras y otras más intensas, según la forma de la pieza. ${modifiersNote}`,
      applicationInstructions: applicationDefault,
      tempValueId: tempStandard.id,
      images: [
        { url: `${CDN}/IMG_5941_e8dac8c4-be12-4aee-aaf3-725d99eed4a5.jpg`, alt: "Pieza de cerámica con esmalte Floating Menta" },
        { url: `${CDN}/IMG_2429.jpg`, alt: "Otra pieza con esmalte Floating Menta" },
      ],
      variants: [
        { label: "0.5 kg", price: 17000 },
        { label: "1 kg", price: 27000 },
      ],
    },
    {
      slug: "floating-azul",
      name: "Floating \"Azul\"",
      collectionId: floating.id,
      shortDescription: "Intenso, profundo y lleno de matices.",
      description: `Intenso, profundo y lleno de matices. Este esmalte cae con fuerza y se acomoda con variaciones naturales: desde un azul claro hasta un azul noche. ${modifiersNote}`,
      applicationInstructions: applicationDefault,
      tempValueId: tempStandard.id,
      images: [
        { url: `${CDN}/IMG_5919.jpg`, alt: "Pieza de cerámica con esmalte Floating Azul" },
        { url: `${CDN}/IMG_5964.jpg`, alt: "Detalle del esmalte Floating Azul" },
        { url: `${CDN}/IMG_2428.jpg`, alt: "Otra pieza con esmalte Floating Azul" },
      ],
      variants: [
        { label: "0.5 kg", price: 18000 },
        { label: "1 kg", price: 28000 },
      ],
    },
    {
      slug: "floating-verde-grisaceo",
      name: "Floating \"Verde Grisáceo\"",
      collectionId: floating.id,
      shortDescription: "Natural, terroso y con un carácter muy especial.",
      description: `Natural, terroso y con un carácter muy especial. Este color vive entre lo vegetal y lo mineral, con cambios sutiles que se adaptan a la forma. Aporta un aire silvestre y una belleza tranquila. ${modifiersNote}`,
      applicationInstructions: applicationDefault,
      tempValueId: tempStandard.id,
      images: [
        { url: `${CDN}/IMG_5924.jpg`, alt: "Pieza de cerámica con esmalte Floating Verde Grisáceo" },
        { url: `${CDN}/IMG_5928.jpg`, alt: "Detalle del esmalte Floating Verde Grisáceo" },
      ],
      variants: [
        { label: "0.5 kg", price: 19000 },
        { label: "1 kg", price: 30000 },
      ],
    },
    {
      slug: "floating-gris-oscuro",
      name: "Floating \"Gris Oscuro\"",
      collectionId: floating.id,
      shortDescription: "Sobrio, elegante y lleno de texturas sutiles.",
      description: `Sobrio, elegante y lleno de texturas sutiles. El esmalte revela microtransparencias y zonas de sombra que hacen que cada pieza sea única. ${modifiersNote}`,
      applicationInstructions: applicationDefault,
      tempValueId: tempStandard.id,
      images: [
        { url: `${CDN}/IMG_5929.jpg`, alt: "Pieza de cerámica con esmalte Floating Gris Oscuro" },
        { url: `${CDN}/IMG_5970.jpg`, alt: "Detalle del esmalte Floating Gris Oscuro" },
        { url: `${CDN}/IMG_2426.jpg`, alt: "Otra pieza con esmalte Floating Gris Oscuro" },
      ],
      variants: [
        { label: "0.5 kg", price: 17000 },
        { label: "1 kg", price: 27000 },
      ],
    },
    {
      slug: "grrr-pantera-rosa",
      name: "GRRR \"Pantera Rosa\"",
      collectionId: grrr.id,
      shortDescription: "Efecto de manchas fluidas, textura vibrante y salvaje.",
      description: `Un esmalte expresivo con efecto de manchas fluidas, que recuerda al pelaje de un animal exótico. Una textura vibrante, salvaje y llena de carácter. Ideal para quienes buscan piezas con garra. ${modifiersNote}`,
      applicationInstructions: applicationGrrr,
      tempValueId: tempGrrr.id,
      images: [
        { url: `${CDN}/IMG_7011.jpg`, alt: "Pieza de cerámica con esmalte GRRR Pantera Rosa" },
        { url: `${CDN}/IMG_1253.png`, alt: "Detalle de la textura del esmalte GRRR Pantera Rosa" },
      ],
      variants: [{ label: "Frasco", price: 35000 }],
    },
    {
      slug: "grrr-leopardo-de-los-nieves",
      name: "GRRR \"Leopardo de los Nieves\"",
      collectionId: grrr.id,
      shortDescription: "Efecto de manchas fluidas, textura vibrante y salvaje.",
      description: `Un esmalte expresivo con efecto de manchas fluidas, que recuerda al pelaje de un animal exótico. Una textura vibrante, salvaje y llena de carácter. Ideal para quienes buscan piezas con garra. ${modifiersNote}`,
      applicationInstructions: applicationGrrr,
      tempValueId: tempGrrr.id,
      images: [
        { url: `${CDN}/IMG_7014.jpg`, alt: "Pieza de cerámica con esmalte GRRR Leopardo de los Nieves" },
        { url: `${CDN}/IMG_2434.jpg`, alt: "Detalle del esmalte GRRR Leopardo de los Nieves" },
      ],
      variants: [{ label: "Frasco", price: 35000 }],
    },
    {
      slug: "grrr-fuego",
      name: "GRRR \"Fuego\"",
      collectionId: grrr.id,
      shortDescription: "Intensa y vibrante, con la fuerza del fuego.",
      description: `Intensa y vibrante. Sobre la base roja se despliegan matices anaranjados y destellos oscuros que evocan la fuerza del fuego y la pasión de la cerámica. ${modifiersNote}`,
      applicationInstructions: applicationGrrr,
      tempValueId: tempGrrr.id,
      images: [
        { url: `${CDN}/IMG_7012.jpg`, alt: "Pieza de cerámica con esmalte GRRR Fuego" },
        { url: `${CDN}/IMG_1253.png`, alt: "Detalle de textura del esmalte GRRR Fuego" },
        { url: `${CDN}/IMG_2432.jpg`, alt: "Otra pieza con esmalte GRRR Fuego" },
      ],
      variants: [{ label: "Frasco", price: 40000 }],
    },
    {
      slug: "pack-prueba-5x200g",
      name: "Pack Prueba 5x200g",
      collectionId: cristalina.id,
      shortDescription: "Cinco esmaltes a elección, 200 g cada uno, para testear antes de comprar de a litro.",
      description:
        "Una caja con cinco esmaltes diferentes, cada bolsita de 200 g. Elegís cualquier 5 esmaltes (excepto la serie GRRR) y te los enviamos. El peso total del pack, junto con modificadores, es de 1,1 kg. Es la cantidad ideal para probar: ver el color en tu propia arcilla, testear en tu horno, y asegurarte de que el esmalte te funciona. Todos los esmaltes son para cono 5–5.5 (1200°C).",
      applicationInstructions: applicationDefault,
      tempValueId: tempStandard.id,
      images: [{ url: `${CDN}/IMG_1907.jpg`, alt: "Pack de prueba SoloGlazes con cinco bolsitas de esmalte de 200g" }],
      variants: [{ label: "Pack 5x200g", price: 40000 }],
    },
  ];

  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        collectionId: p.collectionId,
        name: p.name,
        shortDescription: p.shortDescription,
        description: p.description,
        applicationInstructions: p.applicationInstructions,
        basePrice: p.variants[0].price,
        isActive: true,
        images: { create: p.images.map((img, i) => ({ ...img, sortOrder: i })) },
        attributeValues: { create: [{ attributeValueId: p.tempValueId }] },
      },
    });

    for (const [i, v] of p.variants.entries()) {
      const variant = await prisma.productVariant.upsert({
        where: { sku: `${p.slug}-${i}` },
        update: {},
        create: { productId: product.id, sku: `${p.slug}-${i}`, label: v.label, price: v.price },
      });
      await prisma.inventory.upsert({
        where: { variantId: variant.id },
        update: {},
        create: { variantId: variant.id, quantity: 25, status: "IN_STOCK" },
      });
    }
  }

  const demoUser = await prisma.user.upsert({
    where: { email: "maria@example.com" },
    update: {},
    create: {
      email: "maria@example.com",
      name: "María Fernández",
      phone: "+54 9 11 5555-0123",
      role: "CUSTOMER",
      passwordHash: await bcrypt.hash("sologlazes123", 12),
    },
  });

  const demoAddress = await prisma.address.upsert({
    where: { id: "seed-address-demo" },
    update: {},
    create: {
      id: "seed-address-demo",
      userId: demoUser.id,
      label: "Casa",
      street: "Av. Corrientes 1234",
      number: "1234",
      city: "CABA",
      province: "Buenos Aires",
      postalCode: "C1043",
      isDefault: true,
    },
  });

  const floatingVariant = await prisma.productVariant.findUnique({ where: { sku: "floating-celeste-0" } });
  const cristalinaVariant = await prisma.productVariant.findUnique({ where: { sku: "cristalina-lavanda-0" } });
  const grrrVariant = await prisma.productVariant.findUnique({ where: { sku: "grrr-fuego-0" } });

  if (floatingVariant && cristalinaVariant) {
    await prisma.order.upsert({
      where: { orderNumber: "SG-482913" },
      update: {},
      create: {
        orderNumber: "SG-482913",
        userId: demoUser.id,
        status: "SHIPPED",
        subtotal: 33500,
        shippingCost: 8500,
        total: 42000,
        shippingAddressId: demoAddress.id,
        trackingNumber: "CA123456789AR",
        trackingCarrier: "Correo Argentino",
        paymentProvider: "MERCADO_PAGO",
        paymentStatus: "PAID",
        items: {
          create: [
            { variantId: floatingVariant.id, productNameSnapshot: "Floating \"Celeste\"", variantLabelSnapshot: "0.5 kg", unitPriceSnapshot: 16500, quantity: 1 },
            { variantId: cristalinaVariant.id, productNameSnapshot: "Cristalina \"Lavanda\"", variantLabelSnapshot: "0.5 kg", unitPriceSnapshot: 17000, quantity: 1 },
          ],
        },
        statusHistory: { create: [{ status: "PAID" }, { status: "PROCESSING" }, { status: "SHIPPED" }] },
      },
    });
  }

  if (grrrVariant) {
    await prisma.order.upsert({
      where: { orderNumber: "SG-471022" },
      update: {},
      create: {
        orderNumber: "SG-471022",
        userId: demoUser.id,
        status: "DELIVERED",
        subtotal: 40000,
        shippingCost: 0,
        total: 40000,
        shippingAddressId: demoAddress.id,
        paymentProvider: "MANUAL",
        paymentStatus: "PAID",
        items: {
          create: [{ variantId: grrrVariant.id, productNameSnapshot: "GRRR \"Fuego\"", variantLabelSnapshot: "Frasco", unitPriceSnapshot: 40000, quantity: 1 }],
        },
        statusHistory: { create: [{ status: "PAID" }, { status: "DELIVERED" }] },
      },
    });
  }

  console.log("Seed completo con datos reales de sologlazes.com.ar ✔");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
