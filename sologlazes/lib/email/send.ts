import { Resend } from "resend";
import { OrderConfirmationEmail } from "@/lib/email/templates/order-confirmation";
import { OrderShippedEmail } from "@/lib/email/templates/order-shipped";
import { OrderDeliveredEmail } from "@/lib/email/templates/order-delivered";
import { AdminNewOrderEmail } from "@/lib/email/templates/admin-new-order";
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

// Notificación al vendedor cuando entra un pedido nuevo — configurar ADMIN_NOTIFICATION_EMAIL en Vercel.
export async function sendAdminNewOrderEmail(data: {
  orderId: string;
  total: number;
  customerName: string;
  customerPhone?: string;
  isQuickOrder?: boolean;
}) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) return null; // no configurado — no se envía, no rompe el checkout
  return resend.emails.send({
    from: FROM,
    to: adminEmail,
    subject: `${data.isQuickOrder ? "⚡ Pedido rápido" : "Nuevo pedido"} ${data.orderId}`,
    react: AdminNewOrderEmail(data),
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
