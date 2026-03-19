import axios, { type AxiosInstance } from 'axios'
import type {
    Refaccion,
    RefaccionCreate,
    RefaccionUpdate
} from '../models/refaccion'
import { generalConfig } from '../config/generalConfig'
import { RefaccionesMockDb } from '../mock/mockDb'

export class RefaccionService {
    private api: AxiosInstance

    constructor() {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
        const endpoint = '/refacciones'
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

    async crearRefaccion(dto: RefaccionCreate): Promise<Refaccion> {
        if (generalConfig.isDemo) {
            const newRefaccion: Refaccion = {
                _id: (RefaccionesMockDb.length + 1).toString(),
                ...dto
            }
            RefaccionesMockDb.push(newRefaccion)
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(newRefaccion)
                }, 1000)
            })
        }
        const response = await this.api.post<Refaccion>('/', dto)
        return response.data
    }

    async obtenerRefaccion(id: string): Promise<Refaccion> {
        if (generalConfig.isDemo) {
            const refaccion = RefaccionesMockDb.find(r => r._id === id)
            if (!refaccion) {
                throw new Error('Refacción no encontrada')
            }
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(refaccion)
                }, 1000)
            })
        }
        const response = await this.api.get<Refaccion>(`/${id}`)
        return response.data
    }

    async obtenerRefacciones(params?: {
        page?: number
        limit?: number
        aparato?: string
    }): Promise<{
        data: Refaccion[],
        pagination: {
            currentPage: number,
            totalPages: number,
            totalItems: number,
            itemsPerPage: number
        }
    }> {
        if (generalConfig.isDemo) {
            const filtered = RefaccionesMockDb.filter(r => {
                if (params?.aparato && r.aparato !== params.aparato) {
                    return false
                }
                return true
            })
            const page = params?.page || 1
            const limit = params?.limit || 10
            const totalItems = filtered.length
            const totalPages = Math.ceil(totalItems / limit)
            const paginated = filtered.slice((page - 1) * limit, page * limit)
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        data: paginated,
                        pagination: {
                            currentPage: page,
                            totalPages,
                            totalItems,
                            itemsPerPage: limit
                        }
                    })
                }, 1000)
            })
        }

        const response = await this.api.get<{
            data: Refaccion[],
            pagination: {
                currentPage: number,
                totalPages: number,
                totalItems: number,
                itemsPerPage: number
            }
        }>('/', { params })
        return response.data
    }

    async actualizarRefaccion(id: string, dto: RefaccionUpdate): Promise<Refaccion> {
        if (generalConfig.isDemo) {
            const index = RefaccionesMockDb.findIndex(r => r._id === id)
            if (index === -1) {
                throw new Error('Refacción no encontrada')
            }
            const updated = RefaccionesMockDb[index]
            if (!updated) {
                throw new Error('Refacción no encontrada')
            }
            Object.assign(updated, dto)
            RefaccionesMockDb[index] = updated
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(updated)
                }, 1000)
            })
        }
        const response = await this.api.put<Refaccion>(`/${id}`, dto)
        return response.data
    }

    async patchRefaccion(id: string, dto: Partial<RefaccionUpdate>): Promise<Refaccion> {
        if (generalConfig.isDemo) {
            const index = RefaccionesMockDb.findIndex(r => r._id === id)
            if (index === -1) {
                throw new Error('Refacción no encontrada')
            }
            const updated = RefaccionesMockDb[index]
            if (!updated) {
                throw new Error('Refacción no encontrada')
            }
            Object.assign(updated, dto)
            RefaccionesMockDb[index] = updated
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(updated)
                }, 1000)
            })
        }
        const response = await this.api.patch<Refaccion>(`/${id}`, dto)
        return response.data
    }

    async eliminarRefaccion(id: string): Promise<void> {
        if (generalConfig.isDemo) {
            const index = RefaccionesMockDb.findIndex(r => r._id === id)
            if (index === -1) {
                throw new Error('Refacción no encontrada')
            }
            RefaccionesMockDb.splice(index, 1)
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve()
                }, 1000)
            })
        }
        await this.api.delete(`/${id}`)
    }

    async actualizarExistencias(id: string, cantidad: number): Promise<Refaccion> {
        if (generalConfig.isDemo) {
            const index = RefaccionesMockDb.findIndex(r => r._id === id)
            if (index === -1) {
                throw new Error('Refacción no encontrada')
            }
            const refaccion = RefaccionesMockDb[index]
            if (!refaccion) {
                throw new Error('Refacción no encontrada')
            }
            refaccion.existencias = (refaccion.existencias || 0) + cantidad
            RefaccionesMockDb[index] = refaccion
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(refaccion)
                }, 1000)
            })
        }
        const response = await this.api.post<Refaccion>(`/${id}/existencias`, { existencias: cantidad })
        return response.data
    }
}
