-- Analítica propia de SoloGlazes.
-- Pegar y ejecutar completo en Supabase → SQL Editor → Run (una sola vez).

CREATE TABLE IF NOT EXISTS "AnalyticsEvent" (
  "id"          TEXT PRIMARY KEY,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "type"        TEXT NOT NULL,
  "name"        TEXT,
  "path"        TEXT NOT NULL,
  "label"       TEXT,
  "value"       INTEGER,
  "source"      TEXT,
  "utmMedium"   TEXT,
  "utmCampaign" TEXT,
  "device"      TEXT,
  "browser"     TEXT,
  "country"     TEXT,
  "region"      TEXT,
  "city"        TEXT,
  "visitorId"   TEXT NOT NULL,
  "sessionId"   TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS "AnalyticsEvent_createdAt_idx"        ON "AnalyticsEvent" ("createdAt");
CREATE INDEX IF NOT EXISTS "AnalyticsEvent_type_createdAt_idx"   ON "AnalyticsEvent" ("type", "createdAt");
CREATE INDEX IF NOT EXISTS "AnalyticsEvent_name_createdAt_idx"   ON "AnalyticsEvent" ("name", "createdAt");
CREATE INDEX IF NOT EXISTS "AnalyticsEvent_visitorId_idx"        ON "AnalyticsEvent" ("visitorId");
CREATE INDEX IF NOT EXISTS "AnalyticsEvent_sessionId_idx"        ON "AnalyticsEvent" ("sessionId");

-- Cierra el acceso público a la tabla (la app entra con el usuario dueño de la base y no se ve afectada).
ALTER TABLE "AnalyticsEvent" ENABLE ROW LEVEL SECURITY;
