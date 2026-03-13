// import axios, { type AxiosInstance } from 'axios'
// import { generalConfig } from '../config/generalConfig'

// export class AuthService {
//     private api: AxiosInstance

//     constructor() {
//         const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
//         const endpoint = '/auth'
//         this.api = axios.create({
//             baseURL: `${baseURL}${endpoint}`,
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         })
//     }

//     async login(email: string, password: string): Promise<{
//         token: string; user: {
//             id: string;
//             firstName: string;
//             lastName: string;
//             email: string;
//             role: string;
//         }
//     }> {
//         //Si el .env es demo simular una respuesta exitosa
//         if (generalConfig.isDemo) {
//             return new Promise((resolve) => {
//                 setTimeout(() => {
//                     resolve({
//                         token: 'demo-token',
//                         user: {
//                             id: 'demo-id',
//                             firstName: 'Demo',
//                             lastName: 'User',
//                             email: 'demo@example.com',
//                             role: 'admin'
//                         }
//                     })
//                 }, 1000)
//             })
//         }

//         const response = await this.api.post('/login', { email, password })
//         const { token, user } = response.data;
//         return {
//             token,
//             user
//         };
//     }

//     async logout(): Promise<void> {
//         localStorage.removeItem('authToken')
//     }

//     async register(username: string, password: string): Promise<void> {
//         //Si el .env es demo simular una respuesta exitosa
//         if (generalConfig.isDemo) {
//             return new Promise((resolve) => {
//                 setTimeout(() => {
//                     resolve()
//                 }, 1000)
//             })
//         }

//         await this.api.post('/register', { username, password })
//     }
// }



import axios, { type AxiosInstance } from 'axios'

export class AuthService {
    private api: AxiosInstance
    private useMock: boolean

    constructor() {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
        const endpoint = '/auth'

        this.useMock = import.meta.env.VITE_ENABLE_MOCK === 'true'

        this.api = axios.create({
            baseURL: `${baseURL}${endpoint}`,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    async login(email: string, password: string): Promise<{
        token: string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            role: string;
        }
    }> {

        // ✅ SI MOCK ESTÁ ACTIVADO
        if (this.useMock) {
            console.log('🔵 Using MOCK login')

            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        token: 'mock-token-123',
                        user: {
                            id: '1',
                            firstName: 'Gerardo',
                            lastName: 'Mock',
                            email: email,
                            role: 'admin'
                        }
                    })
                }, 500)
            })
        }

        // 🔴 SI MOCK ESTÁ DESACTIVADO
        const response = await this.api.post('/login', { email, password })
        const { token, user } = response.data

        return { token, user }
    }

    async logout(): Promise<void> {
        localStorage.removeItem('authToken')
    }

    async register(username: string, password: string): Promise<void> {
        if (this.useMock) {
            console.log('🔵 Using MOCK register')
            return
        }

        await this.api.post('/register', { username, password })
    }
}


