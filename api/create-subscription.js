// api/create-subscription.js
// Vercel Serverless Function — conecta registro.html con MercadoPago

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    venueName, cat, contact, phone, email,
    plan, amount, planName, web, instagram, address
  } = req.body;

  // Validaciones básicas
  if (!venueName || !email || !plan || !amount) {
    return res.status(400).json({ error: 'Faltan datos requeridos.' });
  }

  const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
  if (!ACCESS_TOKEN) {
    return res.status(500).json({ error: 'Configuración de pago no disponible.' });
  }

  const BASE_URL = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://vaygowebapp.vercel.app';

  try {
    // Crear preferencia de pago en MercadoPago
    const preference = {
      items: [
        {
          title: `VAYGO — ${planName} — ${venueName}`,
          description: `Suscripción mensual VAYGO para ${venueName} (${cat})`,
          quantity: 1,
          unit_price: amount,
          currency_id: 'MXN',
        }
      ],
      payer: {
        name: contact,
        email: email,
        phone: { number: phone }
      },
      back_urls: {
        success: `${BASE_URL}/registro.html?status=approved&venue=${encodeURIComponent(venueName)}`,
        failure: `${BASE_URL}/registro.html?status=failure`,
        pending: `${BASE_URL}/registro.html?status=pending`,
      },
      auto_return: 'approved',
      notification_url: `${BASE_URL}/api/mp-webhook`,
      external_reference: JSON.stringify({
        venueName, cat, contact, phone, email,
        plan, amount, planName, web, instagram, address,
        timestamp: new Date().toISOString()
      }),
      statement_descriptor: 'VAYGO COZUMEL',
      expires: false,
    };

    const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `vaygo-${email}-${Date.now()}`
      },
      body: JSON.stringify(preference)
    });

    const mpData = await mpRes.json();

    if (mpData.init_point) {
      return res.status(200).json({
        init_point: mpData.init_point,
        id: mpData.id
      });
    } else {
      console.error('MercadoPago error:', mpData);
      return res.status(500).json({
        error: mpData.message || 'Error al crear el pago.'
      });
    }

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Error del servidor. Intenta de nuevo.' });
  }
}
