import axios, { type AxiosInstance } from 'axios'
import type { Pago, CrearPagoDTO, PagosResponse } from '../models/pago'

export class PagoService {
    private api: AxiosInstance

    constructor() {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
        this.api = axios.create({
            baseURL: `${baseURL}/pagos`,
            headers: { 'Content-Type': 'application/json' }
        })

        this.api.interceptors.request.use((config) => {
            const token = localStorage.getItem('auth_token')
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        })
    }

    async crearPago(ordenId: string, dto: CrearPagoDTO): Promise<Pago> {
        const response = await this.api.post<Pago>(`/orden/${ordenId}`, dto)
        return response.data
    }

    async obtenerPagosOrden(ordenId: string): Promise<PagosResponse> {
        const response = await this.api.get<PagosResponse>(`/orden/${ordenId}`)
        return response.data
    }

    async obtenerPago(id: string): Promise<Pago> {
        const response = await this.api.get<Pago>(`/${id}`)
        return response.data
    }

    async eliminarPago(id: string): Promise<void> {
        await this.api.delete(`/${id}`)
    }
}
