type Props = {
  orderId: string;
  customerName: string;
  trackingNumber?: string;
  trackingCarrier?: string;
};

export function OrderShippedEmail({ orderId, customerName, trackingNumber, trackingCarrier }: Props) {
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
                <h1 style={{ fontSize: 22, margin: "0 0 16px" }}>¡Tu pedido está en camino, {customerName}!</h1>
                <p style={{ fontSize: 14, color: "#6B6153", lineHeight: 1.6 }}>
                  El pedido <strong>{orderId}</strong> ya salió de nuestro taller
                  {trackingCarrier ? <> con <strong>{trackingCarrier}</strong></> : null}.
                </p>
                {trackingNumber && (
                  <p style={{ fontSize: 14, color: "#231F1B", background: "#F2EEE8", padding: "12px 16px", borderRadius: 8, marginTop: 16 }}>
                    Número de seguimiento: <strong>{trackingNumber}</strong>
                  </p>
                )}
                <a
                  href={`https://sologlazes.com.ar/cuenta/pedidos/${orderId}`}
                  style={{
                    display: "inline-block",
                    marginTop: 24,
                    background: "#B5502B",
                    color: "#FFFFFF",
                    textDecoration: "none",
                    padding: "12px 24px",
                    borderRadius: 999,
                    fontFamily: "sans-serif",
                    fontSize: 14,
                  }}
                >
                  Rastrear mi pedido
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}
