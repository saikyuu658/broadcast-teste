import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();


export const onMessageCreated = onDocumentCreated("messages/{messageId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) return;

  const messageData = snapshot.data();

  if (messageData.status === "SENDED") {
    await enviarMensagemParaProvedor(messageData);
  }
});


export const checkScheduledMessages = onSchedule("every 1 minutes", async (event) => {
  const agora = new Date().toISOString();


  const querySnapshot = await db.collection("messages")
    .where("status", "==", "SCHEDULE")
    .where("scheduleTime", "<=", agora)
    .get();

  if (querySnapshot.empty) {
    return;
  }

  const lote = db.batch();

  for (const doc of querySnapshot.docs) {
    const messageData = doc.data();

    await enviarMensagemParaProvedor(messageData);

    const msgRef = db.collection("messages").doc(doc.id);
    lote.update(msgRef, { status: "SENDED" });
  }

  await lote.commit();
  console.log(`[Cron Job] Sucesso. ${querySnapshot.size} mensagens processadas.`);
});




async function enviarMensagemParaProvedor(messageData: any) {
  const { conectionUid, contactUids, message } = messageData;

  const connectionDoc = await db.collection("connections").doc(conectionUid).get();
  if (!connectionDoc.exists) {
    return;
  }

  for (const contactUid of contactUids) {
    const contactDoc = await db.collection("contacts").doc(contactUid).get();
    
    if (contactDoc.exists) {
      const contact = contactDoc.data();
      
      console.log(`Enviando: "${message}" para o número ${contact?.telefone}`);
      
    }
  }
}