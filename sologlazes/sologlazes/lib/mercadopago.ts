import { MercadoPagoConfig } from "mercadopago";

// El Access Token sale de: https://www.mercadopago.com.ar/developers/panel/app
// (Credenciales de producción, no las de prueba, cuando estén listos para cobrar de verdad).
export const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN ?? "",
});
