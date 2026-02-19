import axios, { type AxiosInstance } from 'axios'
import type { 
    Equipo, 
    CrearEquipoDTO, 
    ActualizarEquipoDTO 
} from '../models/equipo'

export class EquipoService {
    private api: AxiosInstance

    constructor() {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
        const endpoint = '/equipos'
        this.api = axios.create({
            baseURL: `${baseURL}${endpoint}`,
            headers: {
                'Content-Type': 'application/json'
            }
        })

        // Interceptor para agregar token de autenticación
        this.api.interceptors.request.use((config) => {
            const token = localStorage.getItem('auth_token')
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        })
    }

    async crearEquipo(dto: CrearEquipoDTO): Promise<Equipo> {
        const response = await this.api.post<Equipo>('/', dto)
        return response.data
    }

    async obtenerEquipo(id: string): Promise<Equipo> {
        const response = await this.api.get<Equipo>(`/${id}`)
        return response.data
    }

    async obtenerEquipoPorFolio(folio: string): Promise<Equipo> {
        const response = await this.api.get<Equipo>(`/folio/${folio}`)
        return response.data
    }

    async obtenerEquipos(params?: {
        page?: number
        limit?: number
        estado?: string
        fechaDesde?: string
        fechaHasta?: string
    }): Promise<{
                data: Equipo[],
                pagination: {
                    currentPage: number,
                    totalPages: number,
                    totalItems: number,
                    itemsPerPage: number
                }
            }> {
        const response = await this.api.get<{
                    data: Equipo[],
                    pagination: {
                        currentPage: number,
                        totalPages: number,
                        totalItems: number,
                        itemsPerPage: number
                    }
                }>('/', { params });
        return response.data
    }

    async actualizarEquipo(id: string, dto: ActualizarEquipoDTO): Promise<Equipo> {
        const response = await this.api.put<Equipo>(`/${id}`, dto)
        return response.data
    }

    async eliminarEquipo(id: string): Promise<void> {
        await this.api.delete(`/${id}`)
    }
}