import { useState, useEffect } from 'react';
import { db, auth } from '../configs/firebase'; // Altere para o caminho do seu arquivo de config
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
  Query,
  documentId
} from 'firebase/firestore';
import type { Connection } from '../@types/conections';

export function useConnections(connectionId: string | null = null) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const userUid = auth.currentUser?.uid;


  useEffect(() => {
    if (!userUid) {
      setLoading(false);
      return;
    }


    let q: Query = query(
      collection(db, "connections"),
      where("userUid", "==", userUid)
    );

    if (connectionId) {
      q = query(
        collection(db, "connections"),
        where("userUid", "==", userUid), 
        where(documentId(), "==", connectionId) 
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => {
        const data = doc.data() as Connection;
        return {
          uid: doc.id,
          ...data,
          createdAt: data.createdAt ? (data.createdAt as any).toDate() : null
        };
      });

      setConnections(list);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching connections:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userUid]);

  const createConnection = async (name: string) => {
    if (!userUid) throw new Error("Usuário não autenticado");
    if (!name.trim()) throw new Error("O nome da conexão é obrigatório");

    await addDoc(collection(db, "connections"), {
      name: name.trim(),
      userUid: userUid,
      createdAt: serverTimestamp()
    });
  };

  const updateConnection = async (uid: string, newName: string) => {
    if (!newName.trim()) throw new Error("O nome não pode ser vazio");

    const conexaoRef = doc(db, "connections", uid);
    await updateDoc(conexaoRef, {
      name: newName.trim()
    });
  };

  const deletarConexao = async (uid: string) => {
    const conexaoRef = doc(db, "connections", uid);
    await deleteDoc(conexaoRef);
  };

  return {
    connections,
    loading,
    createConnection,
    updateConnection,
    deletarConexao
  };
}