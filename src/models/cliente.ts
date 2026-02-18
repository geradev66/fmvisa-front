export interface Cliente {
    id?: string;
    nombre: string;
    celular: string;
    domicilio: string;
    rfc: string;
    colonia: string;
    ciudad: string;
    estado: string;
    cp: string;
    email: string;
    telefono: string;
    contacto: string;
}

export interface CrearClienteDTO {
    nombre: string;
    celular: string;
    domicilio: string;
    rfc: string;
    colonia: string;
    ciudad: string;
    estado: string;
    cp: string;
    email: string;
    telefono: string;
    contacto: string;
}

export interface ActualizarClienteDTO {
    nombre?: string;
    celular?: string;
    domicilio?: string;
    rfc?: string;
    colonia?: string;
    ciudad?: string;
    estado?: string;
    cp?: string;
    email?: string;
    telefono?: string;
    contacto?: string;
}