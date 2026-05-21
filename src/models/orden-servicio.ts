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
    codigo: number
    nombre: string
    aparato: string
    cantidad: number | null
    precio: number | null
    costo: number | null
    existencia: number | null
    ubicacion: string
    compraCosto: number | null
    fechaPresupuesto: Date | null
    catalogId: string | null   // null = fila nueva sin guardar en catálogo; truthy = guardada
    guardandoEnCatalogo: boolean
}



export interface Financiero {
    presupuesto: number;
    revision: number;
    manoDeObra: number;
    anticipo: number;
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
}

// DTOs para API
export interface CrearOrdenServicioDTO {
    cliente?: Cliente;
    equipo?: Equipo;
    fechas: Fechas;
    refacciones?: RefaccionItem[];
}

export interface ActualizarOrdenServicioDTO extends Partial<OrdenServicio> {
    id: string;
}