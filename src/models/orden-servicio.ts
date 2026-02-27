import type { Cliente } from "./cliente";
import type { Equipo } from "./equipo";

export interface Fechas {
    ingreso: Date | null;
    salida: Date | null;
    autorizacion: Date | null;
    llegadaRefaccion: Date | null;
}

export interface EstadoEquipo {
    pendiente: string;
    enviadoANombre: string;
    fechaEnvio: Date | null;
    notasEnvio: string;
    reparadoPor: string;
    fechaReparacion: Date | null;
    descripcionReparacion: string;
}

export interface HistorialItem {
    id?: string;
    fecha: string;
    accion: string;
    usuario: string;
}

export interface Financiero {
    presupuesto: number;
    revision: number;
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
    id?: string;
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
}

// DTOs para API
export interface CrearOrdenServicioDTO {
    cliente?: Cliente;
    equipo?: Equipo;
    fechas: Fechas;
}

export interface ActualizarOrdenServicioDTO extends Partial<OrdenServicio> {
    id: string;
}