export interface Pago {
    _id?: string;
    ordenServicioId?: string;
    monto: number;
    formaPago: string;
    referencia?: string | null;
    notas?: string | null;
    fecha: string | Date;
    createdAt?: string;
    updatedAt?: string;
}

export interface CrearPagoDTO {
    monto: number;
    formaPago: string;
    referencia?: string;
    notas?: string;
    fecha?: string;
}

export interface PagosResponse {
    data: Pago[];
    totalPagado: number;
}
