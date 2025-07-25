import { setGlobalOptions } from "firebase-functions/v2/options";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";

// Inicializa o Admin SDK (importante!)
admin.initializeApp();

// Define limites globais
setGlobalOptions({ maxInstances: 10 });

// ✅ Função: Quando usuário for criado ou atualizado, define custom claims
export const setUserClaims = onDocumentWritten("usuarios/{userId}", async (event) => {
  const userId = event.params.userId;
  const afterData = event.data?.after?.data();

  if (!afterData) {
    console.log(`Usuário ${userId} foi excluído ou não há dados.`);
    return;
  }

  const status = afterData.status || "free";
  const isAdmin = afterData.isAdmin || false;

  try {
    await admin.auth().setCustomUserClaims(userId, {
      status: status,
      admin: isAdmin
    });
    console.log(`✅ Claims definidas para ${userId}: { status: ${status}, admin: ${isAdmin} }`);
  } catch (error) {
    console.error(`❌ Erro ao definir claims para ${userId}:`, error);
  }
});
