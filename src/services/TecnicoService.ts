import axios, { type AxiosInstance } from 'axios'
import type {
    Tecnico, TecnicoCreate, TecnicoUpdate
} from '../models/tecnico'
import { generalConfig } from '../config/generalConfig'
import { TecnicosMockDb } from '../mock/mockDb'

export class TecnicoService {
    private api: AxiosInstance

    constructor() {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
        const endpoint = '/tecnicos'
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

    async crearTecnico(dto: TecnicoCreate): Promise<Tecnico> {
        if (generalConfig.isDemo) {
            const newTecnico: Tecnico = {
                _id: (TecnicosMockDb.length + 1).toString(),
                activo: true,
                ...dto
            }
            TecnicosMockDb.push(newTecnico)
            return new Promise((resolve) => setTimeout(() => resolve(newTecnico), 500))
        }
        const response = await this.api.post<Tecnico>('/', dto)
        return response.data
    }

    async obtenerTecnico(id: string): Promise<Tecnico> {
        if (generalConfig.isDemo) {
            const tecnico = TecnicosMockDb.find(t => t._id === id)
            if (!tecnico) throw new Error('Técnico no encontrado')
            return new Promise((resolve) => setTimeout(() => resolve(tecnico), 500))
        }
        const response = await this.api.get<Tecnico>(`/${id}`)
        return response.data
    }

    async obtenerTecnicos(params?: {
        page?: number
        limit?: number
        activo?: boolean
    }): Promise<{
        data: Tecnico[],
        pagination: {
            currentPage: number,
            totalPages: number,
            totalItems: number,
            itemsPerPage: number
        }
    }> {
        if (generalConfig.isDemo) {
            const filtered = TecnicosMockDb.filter(t => {
                if (params?.activo !== undefined && t.activo !== params.activo) return false
                return true
            })
            const page = params?.page || 1
            const limit = params?.limit || 10
            const totalItems = filtered.length
            const totalPages = Math.ceil(totalItems / limit)
            const paginated = filtered.slice((page - 1) * limit, page * limit)
            return new Promise((resolve) => setTimeout(() => resolve({
                data: paginated,
                pagination: { currentPage: page, totalPages, totalItems, itemsPerPage: limit }
            }), 500))
        }
        const response = await this.api.get<{
            data: Tecnico[],
            pagination: {
                currentPage: number,
                totalPages: number,
                totalItems: number,
                itemsPerPage: number
            }
        }>('/', { params })
        return response.data
    }

    async actualizarTecnico(id: string, dto: TecnicoUpdate): Promise<Tecnico> {
        if (generalConfig.isDemo) {
            const index = TecnicosMockDb.findIndex(t => t._id === id)
            if (index === -1) throw new Error('Técnico no encontrado')
            const updated = TecnicosMockDb[index]!
            Object.assign(updated, dto)
            TecnicosMockDb[index] = updated
            return new Promise((resolve) => setTimeout(() => resolve(updated), 500))
        }
        const response = await this.api.put<Tecnico>(`/${id}`, dto)
        return response.data
    }

    async eliminarTecnico(id: string): Promise<void> {
        if (generalConfig.isDemo) {
            const index = TecnicosMockDb.findIndex(t => t._id === id)
            if (index === -1) throw new Error('Técnico no encontrado')
            TecnicosMockDb.splice(index, 1)
            return new Promise((resolve) => setTimeout(() => resolve(), 500))
        }
        await this.api.delete(`/${id}`)
    }
}
