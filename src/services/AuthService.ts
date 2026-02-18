import axios, { type AxiosInstance } from 'axios'

export class AuthService {
    private api: AxiosInstance

    constructor() {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
        const endpoint = '/auth'
        this.api = axios.create({
            baseURL: `${baseURL}${endpoint}`,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    async login(email: string, password: string): Promise<{
        token: string; user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            role: string;
        }
    }> {
        const response = await this.api.post('/login', { email, password })
        const { token, user } = response.data;
        return {
            token,
            user
        };
    }

    async logout(): Promise<void> {
        localStorage.removeItem('authToken')
    }

    async register(username: string, password: string): Promise<void> {
        await this.api.post('/register', { username, password })
    }
}