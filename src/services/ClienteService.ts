import axios, { type AxiosInstance } from 'axios'
import type { 
    Cliente, 
    CrearClienteDTO, 
    ActualizarClienteDTO 
} from '../models/cliente'

export class ClienteService {
    private api: AxiosInstance

    constructor() {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
        const endpoint = '/clientes'
        this.api = axios.create({
            baseURL: `${baseURL}${endpoint}`,
            headers: {
                'Content-Type': 'application/json'
            }
        })

        // Interceptor para agregar token de autenticación
        this.api.interceptors.request.use((config) => {
            const token = localStorage.getItem('authToken')
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        })
    }

    async crearCliente(dto: CrearClienteDTO): Promise<Cliente> {
        const response = await this.api.post<Cliente>('/', dto)
        return response.data
    }

    async obtenerCliente(id: string): Promise<Cliente> {
        const response = await this.api.get<Cliente>(`/${id}`)
        return response.data
    }

    async obtenerClientePorFolio(folio: string): Promise<Cliente> {
        const response = await this.api.get<Cliente>(`/folio/${folio}`)
        return response.data
    }

    async obtenerClientes(params?: {
        page?: number
        limit?: number
        estado?: string
        fechaDesde?: string
        fechaHasta?: string
    }): Promise<{ clientes: Cliente[]; total: number }> {
        const response = await this.api.get<{ clientes: Cliente[]; total: number }>('/', { params })
        return response.data
    }

    async actualizarCliente(id: string, dto: ActualizarClienteDTO): Promise<Cliente> {
        const response = await this.api.put<Cliente>(`/${id}`, dto)
        return response.data
    }

    async eliminarCliente(id: string): Promise<void> {
        await this.api.delete(`/${id}`)
    }

    
}