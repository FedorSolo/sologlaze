import { Resend } from "resend";
import { OrderConfirmationEmail } from "@/lib/email/templates/order-confirmation";
import { OrderShippedEmail } from "@/lib/email/templates/order-shipped";
import { OrderDeliveredEmail } from "@/lib/email/templates/order-delivered";
import { WelcomeEmail } from "@/lib/email/templates/welcome";
import { PasswordResetEmail } from "@/lib/email/templates/password-reset";

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder_configure_in_vercel");
const FROM = "SoloGlazes <pedidos@sologlazes.com.ar>";

type OrderEmailData = {
  orderId: string;
  customerName: string;
  total: number;
  trackingNumber?: string;
  trackingCarrier?: string;
};

export async function sendOrderConfirmationEmail(to: string, data: OrderEmailData) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `Confirmamos tu pedido ${data.orderId}`,
    react: OrderConfirmationEmail(data),
  });
}

export async function sendOrderShippedEmail(to: string, data: OrderEmailData) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `Tu pedido ${data.orderId} está en camino`,
    react: OrderShippedEmail(data),
  });
}

export async function sendOrderDeliveredEmail(to: string, data: OrderEmailData) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `¡Tu pedido ${data.orderId} llegó!`,
    react: OrderDeliveredEmail(data),
  });
}

export async function sendWelcomeEmail(to: string, data: { customerName: string }) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: "¡Bienvenida a SoloGlazes!",
    react: WelcomeEmail(data),
  });
}

export async function sendPasswordResetEmail(to: string, data: { resetUrl: string }) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: "Restablecer tu contraseña — SoloGlazes",
    react: PasswordResetEmail(data),
  });
}

// EmailLog debe registrarse en cada envío exitoso/fallido (orderId, type, recipient, status)
// — ver ejemplo de uso en lib/actions/checkout.ts y lib/actions/admin-orders.ts.
