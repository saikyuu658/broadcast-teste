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
    orderBy,
    arrayUnion,
    arrayRemove,
    deleteDoc,
    getDocs,
    writeBatch
} from 'firebase/firestore';
import type { Contact } from '../@types/contacts';

export function useContact(idConnection: string | null = null) {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const userUid = auth.currentUser?.uid;


    useEffect(() => {
        if (!userUid) return;
        setLoading(true);


        let q = query(
            collection(db, "contacts"),
            where("userUid", "==", userUid),
            orderBy("createdAt", "desc")
        );

        if (idConnection) {
            q = query(
                collection(db, "contacts"),
                where("userId", "==", userUid),
                where("conectionsUid", "array-contains", idConnection)
            );
        }

        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
            const listaContatos = snapshot.docs.map(doc => {
                const data = doc.data() as Contact;
                return {
                    uid: doc.id,
                    ...data,
                    createdAt: data.createdAt ? (data.createdAt as any).toDate() : null
                };
            });

            setContacts(listaContatos);
            setLoading(false);
        }, (error) => {
            setLoading(false);
        });

        return () => unsubscribeSnapshot();
    }, [userUid, idConnection]);

    const createContact = async (name: string, phone: string) => {
        if (!userUid) throw new Error("Usuário não autenticado.");
        if (!name.trim() || !phone.trim()) throw new Error("Nome e telefone são obrigatórios.");

        const newContact: Contact = {
            name: name.trim(),
            phone: phone.trim(),
            userUid: userUid,
            createdAt: new Date(),
        };

        return await addDoc(collection(db, "contacts"), newContact);
    };

    const updateContact = async (id: string, newinfos: Contact) => {
        if (!id) throw new Error("ID do contato é obrigatório.");

        const contatoRef = doc(db, "contacts", id);
        return await updateDoc(contatoRef, {
            name: newinfos.name?.trim(),
            phone: newinfos.phone?.trim()
        });
    };

    const linkConnection = async (idContato: string, idNovaConexao: string) => {
        if (!idContato || !idNovaConexao) throw new Error("Parâmetros inválidos.");

        const contatoRef = doc(db, "contacts", idContato);
        await updateDoc(contatoRef, {
            conectionsUids: arrayUnion(idNovaConexao)
        });

        const messagesQuery = query(
            collection(db, "messages"),
            where("conectionUid", "==", idNovaConexao),
            where("status", "==", "SCHEDULE")
        );

        const querySnapshot = await getDocs(messagesQuery);

        if (!querySnapshot.empty) {
            const batch = writeBatch(db);

            querySnapshot.docs.forEach((messageDoc) => {
                const messageRef = doc(db, "messages", messageDoc.id);
                batch.update(messageRef, {
                    contactUids: arrayUnion(idContato)
                });
            });

            await batch.commit();
        }
    };

    const unLinkConnection = async (idContato: string, idRemoveConnection: string) => {
        if (!idContato || !idRemoveConnection) throw new Error("Parâmetros inválidos.");

        const contatoRef = doc(db, "contacts", idContato);
        await updateDoc(contatoRef, {
            conectionsUids: arrayRemove(idRemoveConnection)
        });

        const messagesQuery = query(
            collection(db, "messages"),
            where("conectionUid", "==", idRemoveConnection),
            where("status", "==", "SCHEDULE")
        );

        const querySnapshot = await getDocs(messagesQuery);

        if (!querySnapshot.empty) {
            const batch = writeBatch(db);

            querySnapshot.docs.forEach((messageDoc) => {
                const messageRef = doc(db, "messages", messageDoc.id);
                batch.update(messageRef, {
                    contactUids: arrayRemove(idContato)
                });
            });

            await batch.commit();
        }
    };
    const deleteContact = async (uid: string) => {
        if (!uid) throw new Error("ID do contato é obrigatório.");

        const contatoRef = doc(db, "contacts", uid);
        return await deleteDoc(contatoRef);
    };

    return {
        contacts,
        loading: loading,
        createContact,
        updateContact,
        linkConnection,
        unLinkConnection,
        deleteContact
    };
}