import {auth} from '../configs/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";


export const useAuth = () => {
    const login = async (data: { email: string; password: string }) => {
        await signInWithEmailAndPassword(auth, data.email, data.password);
    };

    const logout = async () => {
        await auth.signOut();
    };

    const signup = async (data: { email: string; password: string; name: string;}) => {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        await updateProfile(userCredential.user, {
            displayName: data.name
        })
    }

    return { login, logout, signup };
};