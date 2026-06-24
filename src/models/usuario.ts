export type UserRole = 'user' | 'admin' | 'employee'

export interface TecnicoRef {
    _id: string
    nombre: string
    especialidad?: string
    telefono?: string
    email?: string
    activo: boolean
}

export interface Usuario {
    _id?: string
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    role: UserRole
    isVerified: boolean
    tecnico?: TecnicoRef | null
    createdAt?: string
    updatedAt?: string
}

export interface CrearUsuarioDTO {
    firstName: string
    lastName: string
    email: string
    password: string
    phone?: string
    role?: UserRole
    tecnicoId?: string
}

export interface ActualizarUsuarioDTO {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    role?: UserRole
    tecnicoId?: string
    isVerified?: boolean
}

export interface CambiarPasswordDTO {
    password: string
}

export interface UsuariosPaginados {
    data: Usuario[]
    pagination: {
        currentPage: number
        totalPages: number
        totalItems: number
        itemsPerPage: number
    }
}
