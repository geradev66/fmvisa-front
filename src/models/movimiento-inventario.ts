export type TipoMovimiento = 'entrada' | 'salida' | 'ajuste'

export interface RefaccionRef {
    _id: string
    nombre: string
    aparato: string
    existencias: number
    ubicacion?: string
}

export interface OrdenRef {
    _id?: string
    numeroOrden: string
    estadoOrden: string
}

export interface MovimientoInventario {
    _id?: string
    refaccionId: string | RefaccionRef
    ordenServicioId?: string | OrdenRef | null
    tipo: TipoMovimiento
    cantidad: number
    costoUnitario: number
    costoTotal: number
    existenciasAntes: number
    existenciasDespues: number
    descripcion?: string
    createdAt?: string
    createdBy?: string
    createdByName?: string
}

export interface CrearMovimientoDTO {
    refaccionId: string
    tipo: TipoMovimiento
    cantidad: number
    costoUnitario?: number
    descripcion?: string
    ordenServicioId?: string
}

export interface HistorialRefaccionResponse {
    refaccion: {
        _id: string
        nombre: string
        aparato: string
        precio?: number
        costo?: number
        existencias: number
        ubicacion?: string
    }
    existenciasActuales: number
    totalEntradas: number
    totalSalidas: number
    movimientos: MovimientoInventario[]
}

export interface MovimientosPaginados {
    data: MovimientoInventario[]
    pagination: {
        currentPage: number
        totalPages: number
        totalItems: number
        itemsPerPage: number
    }
}
