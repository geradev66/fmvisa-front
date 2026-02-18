import { InjectionKey } from 'vue'
import { OrdenServicioService } from './services/OrdenServicioService'

// Símbolos de inyección para servicios
export const OrdenServicioServiceKey: InjectionKey<OrdenServicioService> = 
    Symbol('OrdenServicioService')

// Agregar más servicios aquí según sea necesario
// export const ClienteServiceKey: InjectionKey<ClienteService> = Symbol('ClienteService')
// export const AuthServiceKey: InjectionKey<AuthService> = Symbol('AuthService')
