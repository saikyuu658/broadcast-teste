import { useState, useEffect } from 'react';
import { db, auth } from '../configs/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
  Query
} from 'firebase/firestore';
import type { Message } from '../@types/message';

export function useMessage(connectionUid: string | null = null, statusFilter: 'SCHEDULE' | 'SENDED' | null = null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const userUid = auth.currentUser?.uid;

  useEffect(() => {
    if (!userUid) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    let q: Query = query(
      collection(db, "messages"),
      where("userUid", "==", userUid),
      orderBy("createdAt", "desc")
    );

    if (connectionUid) {
      q = query(
        collection(db, "messages"),
        where("userUid", "==", userUid),
        where("conectionUid", "==", connectionUid),
        orderBy("createdAt", "desc")
      );
    }

    if (connectionUid && statusFilter) {
        q = query(
        collection(db, "messages"),
        where("uid", "==", userUid),
        where("conectionUid", "==", connectionUid),
        where("status", "==", statusFilter),
        orderBy("createdAt", "desc")
      );
    }

    const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
      const messagesList = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          uid: doc.id,
          message: data.message,
          status: data.status,
          scheduleTime: data.scheduleTime,
          contactUids: data.contactUids,
          conectionUid: data.conectionUid,
          createdAt: data.createdAt?.toDate()?.toISOString() || new Date().toISOString()
        } as Message;
      });
      setMessages(messagesList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching messages in real-time:", error);
      setLoading(false);
    });

    return () => unsubscribeSnapshot();
  }, [userUid, connectionUid, statusFilter]);

  const createMessage = async (messageText: string, scheduleTime: string | null, contactUids: string[]) => {
    if (!userUid) throw new Error("User must be authenticated.");
    if (!connectionUid) throw new Error("An active connection context is required to send messages.");
    if (!messageText.trim()) throw new Error("Message text cannot be empty.");
    if (!contactUids || contactUids.length === 0) throw new Error("At least one contact must be selected.");

    const status = scheduleTime ? 'SCHEDULE' : 'SENDED';


    return await addDoc(collection(db, "messages"), {
        userUid: userUid,
        message: messageText.trim(),
        status: status,
        scheduleTime: scheduleTime || new Date().toISOString(),
        contactUids: contactUids,
        conectionUid: connectionUid,
        createdAt: serverTimestamp() 
    });
  };

  const updateMessage = async (messageId: string, updatedFields: Partial<Omit<Message, 'uid' | 'UserUid' | 'createdAt'>>) => {
    if (!messageId) throw new Error("Message ID is required for updates.");

    const messageRef = doc(db, "messages", messageId);
    
    const dataToUpdate: Record<string, any> = {};
    if (updatedFields.message !== undefined) dataToUpdate.message = updatedFields.message.trim();
    if (updatedFields.status !== undefined) dataToUpdate.status = updatedFields.status;
    if (updatedFields.scheduleTime !== undefined) dataToUpdate.scheduleTime = updatedFields.scheduleTime;
    if (updatedFields.contactUids !== undefined) dataToUpdate.contactUids = updatedFields.contactUids;

    return await updateDoc(messageRef, dataToUpdate);
  };

  const deleteMessage = async (messageId: string) => {
    if (!messageId) throw new Error("Message ID is required for deletion.");

    const messageRef = doc(db, "messages", messageId);
    return await deleteDoc(messageRef);
  };

  return {
    messages,
    loading,
    createMessage,
    updateMessage,
    deleteMessage
  };
}