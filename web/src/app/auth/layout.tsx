import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../../configs/firebase';
import { useNavigate, Outlet } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Sidebar } from '../../components/bar';

// 1. Cria o contexto para expor o UID do usuário globalmente
const AuthContext = createContext<{ userUid: string | null; authLoading: boolean }>({
    userUid: null,
    authLoading: true,
});

export default function Layout() {
    const [userUid, setUserUid] = useState<string | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserUid(user.uid);
            } else {
                setUserUid(null);
                toast.error('Faça login novamente para continuar');
                navigate('/');
            }
            setAuthLoading(false);
        });

        return () => unsubscribeAuth();
    }, [navigate]);

    if (authLoading) {
        return <div>Carregando aplicação...</div>; // Substitua por um <CircularProgress /> do MUI
    }

    const navItems = [
        { label: "Dashboard",  id: "connections" },
        { label: "Contato",  id: "contacts" },
    ]

    return (
        <AuthContext.Provider value={{ userUid, authLoading }}>
            <section className="flex">
                <Sidebar navItems={navItems} />
                <main className=" flex-col gap-5 p-4 w-full max-h-[100vh] overflow-y-auto">
                    <Outlet />
                </main>
            </section>
        </AuthContext.Provider>
    );
}

// Hook auxiliar para os seus outros hooks usarem
export const useAuth = () => useContext(AuthContext);