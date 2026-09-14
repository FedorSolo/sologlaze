type Props = {
  orderId: string;
  customerName: string;
  total: number;
  items?: { name: string; variantLabel?: string; quantity: number; price: number }[];
  address?: { street: string; city: string; province: string; postalCode: string };
  shippingLabel?: string;
};

// Usa elementos HTML simples (compatibles con react.email/render de Resend).
// Para producción, migrar a @react-email/components para mejor soporte cross-client.
export function OrderConfirmationEmail({ orderId, customerName, total, items, address, shippingLabel }: Props) {
  return (
    <html>
      <body style={{ fontFamily: "Georgia, serif", background: "#FAF8F5", padding: "32px", color: "#231F1B" }}>
        <table width="100%" style={{ maxWidth: 480, margin: "0 auto", background: "#FFFFFF", borderRadius: 14 }} cellPadding={0} cellSpacing={0}>
          <tbody>
            <tr>
              <td style={{ padding: "32px" }}>
                <p style={{ fontSize: 12, letterSpacing: "0.04em", textTransform: "uppercase", color: "#B5502B", margin: "0 0 16px" }}>
                  SoloGlazes
                </p>
                <h1 style={{ fontSize: 22, margin: "0 0 16px" }}>¡Gracias por tu pedido, {customerName}!</h1>
                <p style={{ fontSize: 14, color: "#6B6153", lineHeight: 1.6, margin: "0 0 20px" }}>
                  Confirmamos tu pedido <strong>{orderId}</strong>. Te avisamos apenas salga de nuestro taller.
                </p>

                {items && items.length > 0 && (
                  <table width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: 20, borderTop: "1px solid #E4DED4" }}>
                    <tbody>
                      {items.map((item, i) => (
                        <tr key={i}>
                          <td style={{ padding: "10px 0", borderBottom: "1px solid #E4DED4", fontSize: 13, color: "#231F1B" }}>
                            {item.name}
                            {item.variantLabel ? ` (${item.variantLabel})` : ""} × {item.quantity}
                          </td>
                          <td style={{ padding: "10px 0", borderBottom: "1px solid #E4DED4", fontSize: 13, textAlign: "right", whiteSpace: "nowrap" }}>
                            $ {(item.price * item.quantity).toLocaleString("es-AR")}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td style={{ padding: "12px 0 0", fontSize: 14, fontWeight: "bold" }}>Total</td>
                        <td style={{ padding: "12px 0 0", fontSize: 14, fontWeight: "bold", textAlign: "right" }}>
                          $ {total.toLocaleString("es-AR")} ARS
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}

                {address && (
                  <p style={{ fontSize: 13, color: "#6B6153", lineHeight: 1.6, margin: "0 0 8px" }}>
                    <strong style={{ color: "#231F1B" }}>Dirección de envío:</strong>
                    <br />
                    {address.street}
                    <br />
                    {address.city}, {address.province} — CP {address.postalCode}
                  </p>
                )}

                {shippingLabel && (
                  <p style={{ fontSize: 13, color: "#6B6153", lineHeight: 1.6, margin: "0 0 20px" }}>
                    <strong style={{ color: "#231F1B" }}>Método de envío:</strong> {shippingLabel}
                  </p>
                )}

                <a
                  href={`https://sologlazes.com.ar/cuenta/pedidos/${orderId}`}
                  style={{
                    display: "inline-block",
                    marginTop: 8,
                    background: "#B5502B",
                    color: "#FFFFFF",
                    textDecoration: "none",
                    padding: "12px 24px",
                    borderRadius: 999,
                    fontFamily: "sans-serif",
                    fontSize: 14,
                  }}
                >
                  Ver mi pedido
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}
