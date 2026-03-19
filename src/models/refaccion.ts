export interface Refaccion {
  _id?: string;
  nombre: string;
  aparato: string;
  precio?: number;
  costo?: number;
  existencias?: number;
  ubicacion?: string;
  compra?: number;
}

export interface RefaccionCreate {
  nombre: string;
  aparato: string;
  precio?: number;
  costo?: number;
  existencias?: number;
  ubicacion?: string;
  compra?: number;
}

export interface RefaccionUpdate {
  _id: string;
  nombre?: string;
  aparato?: string;
  precio?: number;
  costo?: number;
  existencias?: number;
  ubicacion?: string;
  compra?: number;
}

