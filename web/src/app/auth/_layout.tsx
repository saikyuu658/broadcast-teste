import { GitFork, History, Send, Users } from "lucide-react"
import { Sidebar } from "../../components/bar"
import { Outlet, useNavigate } from "react-router-dom"
import { auth } from "../../configs/firebase"
import { useEffect } from "react"
import toast from "react-hot-toast"
import { onAuthStateChanged } from "firebase/auth"

export const _Layout = () => {

    
    const navigate = useNavigate()
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        if (!user) {
            toast.error('Faça login novamente para continuar')
            navigate('/')
        }
        });
        return () => unsubscribeAuth();
    }, []);

    const navItems = [
        { label: "Dashboard", icon: <GitFork size={18} />, id: "connections" },
        { label: "Contato", icon: <Users size={18} />, id: "contacts" },
    ]
    return (
        <section className="flex">
            <Sidebar navItems={navItems} />
            <main className=" flex-col gap-5 p-4 w-full max-h-[100vh] overflow-y-auto">
                <Outlet />
            </main>
        </section>
    )
}