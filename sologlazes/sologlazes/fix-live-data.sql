-- ============================================================================
-- SoloGlazes — correcciones de datos del sitio en vivo.
-- Pegar COMPLETO en Supabase → SQL Editor → Run. Se puede ejecutar más de una vez sin problema.
-- ============================================================================

-- 1) Sección "Pack Prueba" (hoy no existe en la base: por eso el link del menú daba error 404)
INSERT INTO "Collection" (id, slug, name, description, "heroImageUrl", "isPremium", "sortOrder")
SELECT substr(md5(random()::text || clock_timestamp()::text), 1, 24),
       'pack-prueba', 'Pack Prueba',
       'Probá 5 esmaltes a elección antes de comprar de a litro.',
       '/images/cristalina-miel-1.jpg', false, 4
WHERE NOT EXISTS (SELECT 1 FROM "Collection" WHERE slug = 'pack-prueba');

UPDATE "Product"
SET "collectionId" = (SELECT id FROM "Collection" WHERE slug = 'pack-prueba')
WHERE slug = 'pack-prueba-5x200g';

-- 2) Unifica la temperatura: todos los esmaltes son 1200 °C (quita el filtro "1200–1230°C, atmósfera oxidante").
--    Reasigna los productos GRRR al valor "1200 °C (cono 5,5)" y elimina el valor viejo.
DO $$
DECLARE
  old_id text;
  attr_id text;
  new_id text;
BEGIN
  SELECT av.id, av."attributeId" INTO old_id, attr_id
  FROM "AttributeValue" av
  WHERE av.value LIKE '1200%1230%'
  LIMIT 1;

  IF old_id IS NULL THEN
    RETURN; -- ya estaba corregido
  END IF;

  SELECT id INTO new_id
  FROM "AttributeValue"
  WHERE "attributeId" = attr_id AND id <> old_id AND value LIKE '1200%cono%'
  LIMIT 1;

  IF new_id IS NULL THEN
    UPDATE "AttributeValue" SET value = '1200 °C (cono 5,5)' WHERE id = old_id;
  ELSE
    INSERT INTO "ProductAttributeValue" ("productId", "attributeValueId")
    SELECT pav."productId", new_id
    FROM "ProductAttributeValue" pav
    WHERE pav."attributeValueId" = old_id
    ON CONFLICT DO NOTHING;

    DELETE FROM "ProductAttributeValue" WHERE "attributeValueId" = old_id;
    DELETE FROM "AttributeValue" WHERE id = old_id;
  END IF;
END $$;

-- 3) Descripción de la línea GRRR: "1200–1230 °C" → 1200 °C
UPDATE "Collection"
SET description = regexp_replace(description, 'Quema a 1200.{1,3}1230.{0,3}C en atm.sfera oxidante\.?', 'Cocción a 1200 °C (cono 5–6).')
WHERE slug = 'grrr';

-- 4) Cualquier foto/portada/video que todavía apunte al Shopify cerrado se reemplaza (evita imágenes rotas)
UPDATE "ProductImage"
SET url = '/images/placeholder.jpg'
WHERE url LIKE '%/cdn/shop/%' OR url LIKE '%cdn.shopify.com%';

UPDATE "Collection"
SET "heroImageUrl" = '/images/cristalina-miel-1.jpg'
WHERE "heroImageUrl" LIKE '%/cdn/shop/%' OR "heroImageUrl" LIKE '%cdn.shopify.com%';

DELETE FROM "ProductVideo"
WHERE url LIKE '%/cdn/shop/%' OR url LIKE '%cdn.shopify.com%';

-- 5) Texto viejo y falso "sin tamizar ni mezclar" en las instrucciones (son esmaltes en polvo que SÍ se mezclan)
UPDATE "Product"
SET "applicationInstructions" = 'Diluir el esmalte en polvo con agua, agregando los modificadores incluidos, según las proporciones de la Guía de aplicación. Cocción a 1200 °C (cono 5,5).'
WHERE "applicationInstructions" LIKE '%sin tamizar ni mezclar%';
