import axios, { type AxiosInstance } from 'axios'
import type { 
    OrdenServicio, 
    CrearOrdenServicioDTO, 
    ActualizarOrdenServicioDTO 
} from '../models/orden-servicio'

export class OrdenServicioService {
    private api: AxiosInstance

    constructor(baseURL: string = 'http://localhost:3000/api') {
        this.api = axios.create({
            baseURL,
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

    async crearOrden(dto: CrearOrdenServicioDTO): Promise<OrdenServicio> {
        const response = await this.api.post<OrdenServicio>('/ordenes', dto)
        return response.data
    }

    async obtenerOrden(id: string): Promise<OrdenServicio> {
        const response = await this.api.get<OrdenServicio>(`/ordenes/${id}`)
        return response.data
    }

    async obtenerOrdenes(params?: {
        page?: number
        limit?: number
        estado?: string
        fechaDesde?: string
        fechaHasta?: string
    }): Promise<{ ordenes: OrdenServicio[]; total: number }> {
        const response = await this.api.get<{ ordenes: OrdenServicio[]; total: number }>('/ordenes', { params })
        return response.data
    }

    async actualizarOrden(id: string, dto: ActualizarOrdenServicioDTO): Promise<OrdenServicio> {
        const response = await this.api.put<OrdenServicio>(`/ordenes/${id}`, dto)
        return response.data
    }

    async eliminarOrden(id: string): Promise<void> {
        await this.api.delete(`/ordenes/${id}`)
    }

    async buscarOrdenes(query: string): Promise<OrdenServicio[]> {
        const response = await this.api.get<OrdenServicio[]>('/ordenes/buscar', {
            params: { q: query }
        })
        return response.data
    }

    async obtenerReporteDiario(fecha: string): Promise<any> {
        const response = await this.api.get(`/ordenes/reporte-diario`, {
            params: { fecha }
        })
        return response.data
    }

    async imprimirTicket(id: string): Promise<Blob> {
        const response = await this.api.get(`/ordenes/${id}/ticket`, {
            responseType: 'blob'
        })
        return response.data
    }

    async imprimirOrden(id: string): Promise<Blob> {
        const response = await this.api.get(`/ordenes/${id}/imprimir`, {
            responseType: 'blob'
        })
        return response.data
    }
}
