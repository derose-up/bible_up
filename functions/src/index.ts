import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import mercadopago from "mercadopago";
import express, { Request, Response } from "express";
import cors from "cors";

// Inicializa o Firebase Admin
admin.initializeApp();

// Configurar Mercado Pago
mercadopago.configure({
  access_token: process.env.FUNCTIONS_EMULATOR
    ? 'TEST-5379214763976385-072912-fdd04b768dd367ea7443242fb7b76778-2482986158'
    : functions.config().mercadopago.token,
});

// Planos disponíveis
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
} as const;

type PlanoId = keyof typeof planos;

// Setup do Express + CORS
const app = express();
app.use(cors({ origin: true }));
app.use(express.json()); // Importante para `req.body`

// Endpoint de criação de preferência do Mercado Pago
app.post('/criar-preferencia', async (req: Request, res: Response) => {
  const { planId, userEmail, title, price, quantity = 1 } = req.body;

  if (!planId || !userEmail) {
    res.status(400).send('Dados incompletos: planId e userEmail são necessários');
    return;
  }

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

// 🔥 Esta função deve ser usada no firebase.json com "function": "api"
export const api = functions.https.onRequest(app);
