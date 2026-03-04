import axios, { type AxiosInstance } from 'axios'
import type {
    Cliente,
    CrearClienteDTO,
    ActualizarClienteDTO
} from '../models/cliente'
import { generalConfig } from '../config/generalConfig'
import { ClientesMockDb } from '../mock/mockDb'

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
            const token = localStorage.getItem('auth_token')
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        })
    }

    async crearCliente(dto: CrearClienteDTO): Promise<Cliente> {
        if (generalConfig.isDemo) {
            const newCliente: Cliente = {
                id: (ClientesMockDb.length + 1).toString(),
                ...dto,
                estado: 'activo',
            }
            ClientesMockDb.push(newCliente)
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(newCliente)
                }, 1000)
            })
        }
        const response = await this.api.post<Cliente>('/', dto)
        return response.data
    }

    async obtenerCliente(id: string): Promise<Cliente> {
        if (generalConfig.isDemo) {
            const cliente = ClientesMockDb.find(c => c.id === id)
            if (!cliente) {
                throw new Error('Cliente no encontrado')
            }
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(cliente)
                }, 1000)
            })
        }
        const response = await this.api.get<Cliente>(`/${id}`)
        return response.data
    }

    async obtenerClientePorFolio(folio: string): Promise<Cliente> {
        if (generalConfig.isDemo) {
            const cliente = ClientesMockDb.find(c => c.folio === folio)
            if (!cliente) {
                throw new Error('Cliente no encontrado')
            }
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(cliente)
                }, 1000)
            })
        }
        const response = await this.api.get<Cliente>(`/folio/${folio}`)
        return response.data
    }

    async obtenerClientes(params?: {
        page?: number
        limit?: number
        estado?: string
        fechaDesde?: string
        fechaHasta?: string
    }): Promise<{
        data: Cliente[],
        pagination: {
            currentPage: number,
            totalPages: number,
            totalItems: number,
            itemsPerPage: number
        }
    }> {
        if (generalConfig.isDemo) {
            const filteredClientes = ClientesMockDb.filter(c => {
                if (params?.estado && c.estado !== params.estado) {
                    return false
                }
                // if (params?.fechaDesde && new Date(c.createdAt) < new Date(params.fechaDesde)) {
                //     return false
                // }
                // if (params?.fechaHasta && new Date(c.createdAt) > new Date(params.fechaHasta)) {
                //     return false
                // }
                return true
            })
            const page = params?.page || 1
            const limit = params?.limit || 10
            const totalItems = filteredClientes.length
            const totalPages = Math.ceil(totalItems / limit)
            const paginatedClientes = filteredClientes.slice((page - 1) * limit, page * limit)
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        data: paginatedClientes,
                        pagination: {
                            currentPage: page,
                            totalPages,
                            totalItems,
                            itemsPerPage: limit
                        }
                    })
                }
                    , 1000)
            })
        }

        const response = await this.api.get<{
            data: Cliente[],
            pagination: {
                currentPage: number,
                totalPages: number,
                totalItems: number,
                itemsPerPage: number
            }
        }>('/', { params })
        return response.data
    }

    async actualizarCliente(id: string, dto: ActualizarClienteDTO): Promise<Cliente> {
        if (generalConfig.isDemo) {
            const clienteIndex = ClientesMockDb.findIndex(c => c.id === id)
            if (clienteIndex === -1) {
                throw new Error('Cliente no encontrado')
            }
            const updatedCliente = ClientesMockDb[clienteIndex];
            if (!updatedCliente) {
                throw new Error('Cliente no encontrado')
            }
            Object.assign(updatedCliente, dto)
            ClientesMockDb[clienteIndex] = updatedCliente
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(updatedCliente)
                }, 1000)
            })
        }
        const response = await this.api.put<Cliente>(`/${id}`, dto)
        return response.data
    }

    async eliminarCliente(id: string): Promise<void> {
        if (generalConfig.isDemo) {
            const clienteIndex = ClientesMockDb.findIndex(c => c.id === id)
            if (clienteIndex === -1) {
                throw new Error('Cliente no encontrado')
            }
            ClientesMockDb.splice(clienteIndex, 1)
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve()
                }, 1000)
            })
        }
        await this.api.delete(`/${id}`)
    }


}