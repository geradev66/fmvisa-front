import type { Cliente } from "./cliente";
import type { Equipo } from "./equipo";

export interface Fechas {
    ingreso: Date | null;
    salida: Date | null;
    autorizacion: Date | null;
    llegadaRefaccion: Date | null;
    pedidoRefaccion?: Date | null;
    presupuesto?: Date | null;
}

export interface EstadoEquipo {
    pendiente: string;
    enviadoANombre: string;
    fechaEnvio: Date | null;
    notasEnvio: string;
    reparadoPor: string;
    fechaReparacion: Date | null;
    descripcionReparacion: string;
    noPedido: string;
}

export interface HistorialItem {
    _id?: string;
    fecha: string;
    accion: string;
    usuario: string;
}

export interface RefaccionItem {
    internalId?: string
    refaccionId?: string | null
    codigo: number
    nombre: string
    aparato: string
    cantidad: number | null
    precio: number | null
    costo: number | null
    existencia: number | null
    ubicacion: string
    compraCosto: number | null
    pago?: number | null
    fechaPresupuesto: Date | null
    formaPago?: string
    catalogId: string | null   // null = fila nueva sin guardar en catálogo; truthy = guardada
    guardandoEnCatalogo: boolean
}



export interface Financiero {
    presupuesto: number;
    revision: number;
    manoDeObra: number;
    anticipo: number;
    anticipoFormaPago?: string;
    anticipoReferencia?: string;
    anticipoNotas?: string;
    //Relacion con 'Pago' para vincular el anticipo con los pagos realizados
    anticipoPagoId?: string;
    pagos: number;
    iva: number;
}

export type EstadoOrden = 
    | 'Pendiente' 
    | 'Autoriza' 
    | 'Informa' 
    | 'Refacción' 
    | 'Entregar' 
    | 'Ninguno';

export type ReferenciaTipo = 
    | 'Garantia' 
    | 'SinReparacion' 
    | 'NoAutorizo' 
    | 'Reparado' 
    | 'Ninguno';

export type TipoCargo = 
    | 'CargoRegular' 
    | 'SinCargo' 
    | 'GarantiaVendor';

/** Fechas con fechas serializadas como ISO strings, tal como las espera/devuelve el backend */
export interface FechasPayload {
    ingreso: string | null;
    salida: string | null;
    autorizacion: string | null;
    llegadaRefaccion: string | null;
    pedidoRefaccion?: string | null;
    presupuesto?: string | null;
}

/** EstadoEquipo con fechas serializadas como ISO strings */
export interface EstadoEquipoPayload {
    pendiente: string;
    enviadoANombre: string;
    fechaEnvio: string | null;
    notasEnvio: string;
    reparadoPor: string;
    fechaReparacion: string | null;
    descripcionReparacion: string;
    noPedido: string;
}

export interface OrdenServicio {
    _id?: string;
    numeroOrden: string;
    fechaCreacion: Date;
    cliente?: Cliente;
    equipo?: Equipo;
    fechas: Fechas;
    estado: EstadoEquipo;
    estadoOrden: EstadoOrden;
    referencias: ReferenciaTipo;
    tipoCargo: TipoCargo;
    financiero: Financiero;
    historial: HistorialItem[];
    refacciones?: RefaccionItem[];
    formaPago?: string;
    formaPagoEspecifique?: string;
    formaPagoCheque?: string;
}

// DTOs para API

/** Refacción tal como la espera el backend (sin campos exclusivos del frontend) */
export interface RefaccionItemDTO {
    internalId?: string;
    refaccionId?: string | null;
    codigo?: number | string;
    nombre?: string;
    aparato?: string;
    cantidad: number;
    precio: number;
    costo?: number | null;
    pago?: number | null;
}

export interface CrearOrdenServicioDTO {
    cliente?: Cliente;
    equipo?: Equipo;
    estadoOrden?: EstadoOrden;
    referencias?: ReferenciaTipo;
    tipoCargo?: TipoCargo;
    fechas: FechasPayload;
    estado?: EstadoEquipoPayload;
    financiero?: Partial<Financiero>;
    refacciones?: RefaccionItemDTO[];
    formaPago?: string;
    formaPagoEspecifique?: string;
    formaPagoCheque?: string;
}

export interface ActualizarOrdenServicioDTO {
    cliente?: Cliente;
    equipo?: Equipo;
    estadoOrden?: EstadoOrden;
    referencias?: ReferenciaTipo;
    tipoCargo?: TipoCargo;
    fechas?: FechasPayload;
    estado?: EstadoEquipoPayload;
    financiero?: Partial<Financiero>;
    refacciones?: RefaccionItemDTO[];
    formaPago?: string;
    formaPagoEspecifique?: string;
    formaPagoCheque?: string;
    accionHistorial?: string;
    usuarioHistorial?: string;
}


export function createInternalId(): string {
    // Genera un ID interno único para las refacciones
    return 'ref_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
}