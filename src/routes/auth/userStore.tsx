import {create} from 'zustand';
import type { User } from '@/types/UserType';
import { persist, createJSONStorage } from 'zustand/middleware';

type UserStore = {
    user: User | null;
    login: () => void;
    logout: () => void;
};

const useStore = create<UserStore>()(
    persist(
        (set) => ({
            user: null,
            login: () => set({ user: { id: 1, name: 'Bibi Mbap', email: 'bibi.mbap@example.com', role: 'USER' } }),
            logout: () => set({ user: null }),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useStore;