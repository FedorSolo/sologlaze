type Props = { resetUrl: string };

export function PasswordResetEmail({ resetUrl }: Props) {
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
                <h1 style={{ fontSize: 22, margin: "0 0 16px" }}>Restablecer contraseña</h1>
                <p style={{ fontSize: 14, color: "#6B6153", lineHeight: 1.6 }}>
                  Recibimos un pedido para restablecer tu contraseña. Este enlace vence en 1 hora. Si no
                  fuiste vos, podés ignorar este email.
                </p>
                <a
                  href={resetUrl}
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
                  Elegir nueva contraseña
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}
