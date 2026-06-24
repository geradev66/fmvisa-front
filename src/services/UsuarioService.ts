import axios, { type AxiosInstance } from 'axios'
import type {
    Usuario,
    CrearUsuarioDTO,
    ActualizarUsuarioDTO,
    CambiarPasswordDTO,
    UsuariosPaginados
} from '../models/usuario'

export class UsuarioService {
    private api: AxiosInstance

    constructor() {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
        this.api = axios.create({
            baseURL: `${baseURL}/usuarios`,
            headers: { 'Content-Type': 'application/json' }
        })

        this.api.interceptors.request.use((config) => {
            const token = localStorage.getItem('auth_token')
            if (token) config.headers.Authorization = `Bearer ${token}`
            return config
        })
    }

    async listarUsuarios(params?: {
        page?: number
        limit?: number
        role?: string
    }): Promise<UsuariosPaginados> {
        const response = await this.api.get<UsuariosPaginados>('/', { params })
        return response.data
    }

    async obtenerUsuario(id: string): Promise<Usuario> {
        const response = await this.api.get<Usuario>(`/${id}`)
        return response.data
    }

    async crearUsuario(dto: CrearUsuarioDTO): Promise<Usuario> {
        const response = await this.api.post<Usuario>('/', dto)
        return response.data
    }

    async actualizarUsuario(id: string, dto: ActualizarUsuarioDTO): Promise<Usuario> {
        const response = await this.api.put<Usuario>(`/${id}`, dto)
        return response.data
    }

    async cambiarPassword(id: string, dto: CambiarPasswordDTO): Promise<{ message: string }> {
        const response = await this.api.patch<{ message: string }>(`/${id}/password`, dto)
        return response.data
    }

    async eliminarUsuario(id: string): Promise<{ message: string }> {
        const response = await this.api.delete<{ message: string }>(`/${id}`)
        return response.data
    }
}
