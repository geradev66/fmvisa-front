import axios, { type AxiosInstance } from 'axios'
import type {
    Printer, ActualizarPrinterDTO, CrearPrinterDTO
} from '../models/printer'

export class PrinterService {
    private api: AxiosInstance

    constructor() {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
        const endpoint = '/printers'
        this.api = axios.create({
            baseURL: `${baseURL}${endpoint}`,
            headers: {
                'Content-Type': 'application/json'
            }
        })

        this.api.interceptors.request.use((config) => {
            const token = localStorage.getItem('auth_token')
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        })
    }

    async crearPrinter(dto: CrearPrinterDTO): Promise<Printer> {
        const response = await this.api.post<Printer>('/', dto)
        return response.data
    }

    async obtenerPrinter(id: string): Promise<Printer> {
        const response = await this.api.get<Printer>(`/${id}`)
        return response.data
    }

    async obtenerPrinters(params?: {
        page?: number
        limit?: number
        activo?: boolean
    }): Promise<{
        data: Printer[],
        pagination: {
            currentPage: number,
            totalPages: number,
            totalItems: number,
            itemsPerPage: number
        }
    }> {
        const response = await this.api.get<{
            data: Printer[],
            pagination: {
                currentPage: number,
                totalPages: number,
                totalItems: number,
                itemsPerPage: number
            }
        }>('/', { params })
        return response.data
    }

    async actualizarPrinter(id: string, dto: ActualizarPrinterDTO): Promise<Printer> {
        const response = await this.api.put<Printer>(`/${id}`, dto)
        return response.data
    }

    async eliminarPrinter(id: string): Promise<void> {
        await this.api.delete(`/${id}`)
    }
}
