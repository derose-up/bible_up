import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import mercadopago from "mercadopago";
import cors from "cors";
import { Request, Response } from "express";

admin.initializeApp();

// Configurar Mercado Pago
mercadopago.configure({
  access_token: process.env.FUNCTIONS_EMULATOR
    ? 'TEST-5379214763976385-072912-fdd04b768dd367ea7443242fb7b76778-2482986158'
    : functions.config().mercadopago.token,
});

// Planos disponíveis (fallback)
const planos = {
  mensal: {
    id: functions.config().mercadopago.plan_mensal,
    title: 'Plano Premium Mensal',
    price: 19.90,
  },
  anual: {
    id: functions.config().mercadopago.plan_anual,
    title: 'Plano Premium Anual',
    price: 159.90,
  }
} as const; // <-- 🔒 isso protege os nomes das chaves

type PlanoId = keyof typeof planos; // 'mensal' | 'anual'

const corsHandler = cors({ origin: true });

export const criarPreferenciaMP = functions.https.onRequest((req: Request, res: Response) => {
  corsHandler(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(405).send('Método não permitido');
      return;
    }

    const { planId, userEmail, title, price, quantity = 1 } = req.body;

    if (!planId || !userEmail) {
      res.status(400).send('Dados incompletos: planId e userEmail são necessários');
      return;
    }

    // ⛑️ Tipar planId para evitar erro do TS
    const planoInterno = planos[planId as PlanoId];

    const itemTitle = title || planoInterno?.title || 'Plano';
    const itemPrice = price || planoInterno?.price || 0;

    if (!itemPrice || itemPrice <= 0) {
      res.status(400).send('Preço inválido');
      return;
    }

    const preference = {
      items: [
        {
          title: itemTitle,
          unit_price: itemPrice,
          quantity,
        },
      ],
      payer: {
        email: userEmail,
      },
      back_urls: {
        success: 'https://seusite.com/sucesso',
        failure: 'https://seusite.com/falha',
        pending: 'https://seusite.com/pendente',
      },
      auto_return: 'approved',
    };

    try {
      const response = await mercadopago.preferences.create(preference);
      res.status(200).json({
        id: response.body.id,
        init_point: response.body.init_point,
      });
    } catch (error) {
      console.error('Erro ao criar preferência:', error);
      res.status(500).json({ error: 'Erro ao criar preferência de pagamento' });
    }
  });
});
