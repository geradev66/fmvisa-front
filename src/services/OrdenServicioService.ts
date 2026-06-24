import axios, { type AxiosInstance } from 'axios'
import type { 
    OrdenServicio, 
    CrearOrdenServicioDTO, 
    ActualizarOrdenServicioDTO 
} from '../models/orden-servicio'

export class OrdenServicioService {
    private api: AxiosInstance

    constructor() {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
        const endpoint = '/ordenes-servicio'
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

    /**
     * Abre una nueva pestaña con la URL del PDF de la tarjeta de servicio para la orden dada
     * @param id El ID de la orden de servicio para la cual se desea mostrar la tarjeta PDF
     */
    async showPdfTarjeta(id: string) {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        const route = `${baseUrl}/ordenes-servicio/${id}/tarjeta`
        // Abrir en una nueva pestaña
        window.open(route, '_blank')
    }

    async crearOrden(dto: CrearOrdenServicioDTO): Promise<OrdenServicio> {
        const response = await this.api.post<OrdenServicio>('/', dto)
        return response.data
    }

    async obtenerOrden(id: string): Promise<OrdenServicio> {
        const response = await this.api.get<OrdenServicio>(`/${id}`)
        return response.data
    }

    async obtenerOrdenes(params?: {
        page?: number
        limit?: number
        estado?: string
        fechaDesde?: string
        fechaHasta?: string
    }): Promise<{
                data: OrdenServicio[],
                pagination: {
                    currentPage: number,
                    totalPages: number,
                    totalItems: number,
                    itemsPerPage: number
                }
            }> {
        const response = await this.api.get<{
                    data: OrdenServicio[],
                    pagination: {
                        currentPage: number,
                        totalPages: number,
                        totalItems: number,
                        itemsPerPage: number
                    }
                }>('/', { params })
        return response.data
    }

    async actualizarOrden(id: string, dto: ActualizarOrdenServicioDTO): Promise<OrdenServicio> {
        const response = await this.api.put<OrdenServicio>(`/${id}`, dto)
        return response.data
    }

    async eliminarOrden(id: string): Promise<void> {
        await this.api.delete(`/${id}`)
    }

    async buscarOrdenes(query: string): Promise<OrdenServicio[]> {
        const response = await this.api.get<OrdenServicio[]>('/buscar', {
            params: { q: query }
        })
        return response.data
    }

    async obtenerReporteDiario(fecha: string): Promise<any> {
        const response = await this.api.post(`/reporte-diario`, { fecha })
        return response.data
    }

    async obtenerReporteSalidas(fechaInicio: string, fechaFin?: string): Promise<any[]> {
        const body: { fechaInicio: string; fechaFin?: string } = { fechaInicio }
        if (fechaFin) body.fechaFin = fechaFin
        const response = await this.api.post('/reporte-salidas', body)
        return Array.isArray(response.data) ? response.data : (response.data?.data ?? [])
    }

    async imprimirTicket(id: string): Promise<Blob> {
        const response = await this.api.get(`/${id}/ticket`, {
            responseType: 'blob'
        })
        return response.data
    }

    async imprimirOrden(id: string): Promise<Blob> {
        const response = await this.api.get(`/${id}/imprimir`, {
            responseType: 'blob'
        })
        return response.data
    }

    async generarSalida(id: string): Promise<void> {
        await this.api.post(`/salida/${id}`)
    }

    

}
