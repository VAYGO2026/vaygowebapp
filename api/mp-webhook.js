// api/mp-webhook.js
// Recibe notificaciones de MercadoPago cuando alguien paga

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ ok: true });
  }

  const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
  const { type, data } = req.body;

  // Solo procesamos pagos aprobados
  if (type === 'payment' && data?.id) {
    try {
      // Verificar el pago con MercadoPago
      const payRes = await fetch(`https://api.mercadopago.com/v1/payments/${data.id}`, {
        headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
      });
      const payment = await payRes.json();

      if (payment.status === 'approved') {
        // Extraer datos del venue desde external_reference
        let venueData = {};
        try {
          venueData = JSON.parse(payment.external_reference || '{}');
        } catch(e) {}

        console.log('✅ Pago aprobado:', {
          id: payment.id,
          amount: payment.transaction_amount,
          email: payment.payer?.email,
          venue: venueData.venueName,
          plan: venueData.plan
        });

        // Aquí se puede agregar Firebase cuando esté configurado
        // Por ahora queda registrado en logs de Vercel
      }
    } catch (err) {
      console.error('Webhook error:', err);
    }
  }

  // Siempre responder 200 a MercadoPago
  return res.status(200).json({ received: true });
}
