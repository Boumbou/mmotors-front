type User = {
    id: number;
    name: string;
    email: string;
    role: 'ADMIN' | 'CUSTOMER' | 'STAFF';
};

export type { User };