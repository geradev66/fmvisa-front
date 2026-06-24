export interface Pago {
    _id?: string;
    ordenServicioId?: string;
    ordenServicioRefaccionInternalId?: string; // Pagos relacionados con refacciones tendrán este campo para vincularlos a la refacción específica
    monto: number;
    formaPago: string;
    referencia?: string | null;
    notas?: string | null;
    fecha: string | Date;
    tipo?: 'pago' | 'anticipo'; // Indica si es un pago normal o un anticipo
    createdAt?: string;
    updatedAt?: string;
}

export interface CrearPagoDTO {
    monto: number;
    formaPago: string;
    referencia?: string;
    notas?: string;
    fecha?: string;
    ordenServicioRefaccionInternalId?: string;
}

export interface PagosResponse {
    data: Pago[];
    totalPagado: number;
}
