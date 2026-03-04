export interface Equipo {
    id?: string;
    marca: string;
    modelo: string;
    noSerie: string;
    tipo: string;
    falla: string;
    accesorios: string;
    diagnostico?: string;
    observaciones?: string;
}

export interface CrearEquipoDTO {
    marca: string;
    modelo: string;
    noSerie: string;
    tipo: string;
    falla: string;
    accesorios: string;
}

export interface ActualizarEquipoDTO {
    marca?: string;
    modelo?: string;
    noSerie?: string;
    tipo?: string;
    falla?: string;
    accesorios?: string;
}