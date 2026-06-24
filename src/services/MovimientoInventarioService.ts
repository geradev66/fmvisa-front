import axios, { type AxiosInstance } from 'axios'
import type {
    MovimientoInventario,
    CrearMovimientoDTO,
    HistorialRefaccionResponse,
    MovimientosPaginados
} from '../models/movimiento-inventario'

export class MovimientoInventarioService {
    private api: AxiosInstance

    constructor() {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
        this.api = axios.create({
            baseURL: `${baseURL}/movimientos-refaccion`,
            headers: { 'Content-Type': 'application/json' }
        })

        this.api.interceptors.request.use((config) => {
            const token = localStorage.getItem('auth_token')
            if (token) config.headers.Authorization = `Bearer ${token}`
            return config
        })
    }

    async registrarMovimiento(dto: CrearMovimientoDTO): Promise<MovimientoInventario> {
        const response = await this.api.post<MovimientoInventario>('/', dto)
        return response.data
    }

    async listarMovimientos(params?: {
        page?: number
        limit?: number
        tipo?: string
        refaccionId?: string
        ordenServicioId?: string
        fechaInicio?: string
        fechaFin?: string
    }): Promise<MovimientosPaginados> {
        const response = await this.api.get<MovimientosPaginados>('/', { params })
        return response.data
    }

    async historialRefaccion(refaccionId: string): Promise<HistorialRefaccionResponse> {
        const response = await this.api.get<HistorialRefaccionResponse>(`/refaccion/${refaccionId}`)
        return response.data
    }

    async obtenerMovimiento(id: string): Promise<MovimientoInventario> {
        const response = await this.api.get<MovimientoInventario>(`/${id}`)
        return response.data
    }

    async eliminarMovimiento(id: string): Promise<{ message: string }> {
        const response = await this.api.delete<{ message: string }>(`/${id}`)
        return response.data
    }
}
