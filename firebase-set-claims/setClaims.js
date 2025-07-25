const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Substitua pelo UID do usuário que você quer atualizar
const uid = 'i8GAsvyiZufTrAEk1QaJEFel46n1';

async function setCustomClaims() {
  try {
    await admin.auth().setCustomUserClaims(uid, {
      status: 'premium', // ou 'free'
      admin: false       // ou true se for admin
    });
    console.log(`✅ Claims adicionadas para o usuário: ${uid}`);
  } catch (error) {
    console.error('❌ Erro ao definir claims:', error);
  }
}

setCustomClaims();
