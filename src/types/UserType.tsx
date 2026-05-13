type User = {
    id: number;
    created: string;
    name: string;
    lastName: string;
    email: string;
    roles: string[];
    token: string;

};


type LoginRequest = {
    Email: string;
    Password: string;
};

type LoginResponse = {
    result: 'success' | 'error';
    user: User;
    token: string;
};

export type { User, LoginRequest, LoginResponse };