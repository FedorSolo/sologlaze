type Props = {
  orderId: string;
  total: number;
  customerName: string;
  customerPhone?: string;
  isQuickOrder?: boolean;
};

export function AdminNewOrderEmail({ orderId, total, customerName, customerPhone, isQuickOrder }: Props) {
  return (
    <html>
      <body style={{ fontFamily: "Georgia, serif", background: "#FAF8F5", padding: "32px", color: "#231F1B" }}>
        <table width="100%" style={{ maxWidth: 480, margin: "0 auto", background: "#FFFFFF", borderRadius: 14 }} cellPadding={0} cellSpacing={0}>
          <tbody>
            <tr>
              <td style={{ padding: "32px" }}>
                <p style={{ fontSize: 12, letterSpacing: "0.04em", textTransform: "uppercase", color: "#B5502B", margin: "0 0 16px" }}>
                  SoloGlazes — Panel
                </p>
                <h1 style={{ fontSize: 20, margin: "0 0 16px" }}>
                  {isQuickOrder ? "⚡ Nuevo pedido rápido" : "Nuevo pedido"} {orderId}
                </h1>
                <p style={{ fontSize: 14, color: "#6B6153", lineHeight: 1.6 }}>
                  Cliente: <strong>{customerName}</strong>
                  {customerPhone && <> · WhatsApp: <strong>{customerPhone}</strong></>}
                  <br />
                  Total: <strong>$ {total.toLocaleString("es-AR")} ARS</strong>
                </p>
                <a
                  href={`https://sologlazes.com.ar/admin/pedidos`}
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
                  Ver en el panel
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}
