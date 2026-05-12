import {create} from 'zustand';
import type { User } from '@/types/UserType';
import { persist, createJSONStorage } from 'zustand/middleware';

type UserStore = {
    user: User | null;
    register: (email: string, password: string, name: string, lastName: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
};

function parseTokenRoles(token: string): string[] {
  const payload = JSON.parse(atob(token.split(".")[1]));
  const rawRoles =
    payload.role ||
    payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
    [];
  return Array.isArray(rawRoles) ? rawRoles : [rawRoles];
}

const loginRequest = async (email: string, password: string): Promise<User> => {
    const response = await fetch('/api/account/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Email: email, Password: password }),
    }).then((res) => res.json());

    if (!response.result.succeeded){
        return Promise.reject(new Error("Oops nous n'avons pas pu vous connecter, veuillez vérifier vos identifiants et réessayer."));
    }
    const { user, token } = response;
    const userData: User = {
        id: user.id,
        created: user.created,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        role: parseTokenRoles(token),
        token: token,
    };
    return userData;
}

const registerRequest = async (email: string, password: string, name: string, lastName: string): Promise<User> => {
    const response = await fetch('/api/account/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Email: email, Password: password, Name: name, LastName: lastName }),
    }).then((res) => res.json());
    if (!response.result.succeeded){
        return Promise.reject(new Error("Oops nous n'avons pas pu vous inscrire, veuillez vérifier vos informations et réessayer."));
    }
    const { user, token } = response;
    const userData: User = {
        id: user.id,
        created: user.created,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        role: parseTokenRoles(token),
        token: token,
    };
    return userData;
}

const useStore = create<UserStore>()(
    persist(
        (set) => ({
            user: null,
            register: async (email: string, password: string, name: string, lastName: string) => {
                const user = await registerRequest(email, password, name, lastName);
                set({ user });
            },
            login: async (email: string, password: string) => {
                const user = await loginRequest(email, password);
                set({ user });
            },
            logout: () => set({ user: null }),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useStore;