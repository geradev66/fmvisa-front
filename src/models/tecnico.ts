export interface Tecnico {
  _id?: string;
  nombre: string;
  especialidad?: string;
  telefono?: string;
  email?: string;
  activo: boolean;
}

export interface TecnicoCreate {
  nombre: string;
  especialidad?: string;
  telefono?: string;
  email?: string;
  activo?: boolean;
}

export interface TecnicoUpdate {
  _id: string;
  nombre?: string;
  especialidad?: string;
  telefono?: string;
  email?: string;
  activo?: boolean;
}