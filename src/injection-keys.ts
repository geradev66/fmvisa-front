import { type InjectionKey } from 'vue'
import { OrdenServicioService } from './services/OrdenServicioService'
import type { AuthService } from './services/AuthService'
import type { ClienteService } from './services/ClienteService'
import type { EquipoService } from './services/EquipoService'

// Símbolos de inyección para servicios
export const OrdenServicioServiceKey: InjectionKey<OrdenServicioService> = 
    Symbol('OrdenServicioService')

export const AuthServiceKey: InjectionKey<AuthService> = 
    Symbol('AuthService')

export const ClienteServiceKey: InjectionKey<ClienteService> = 
    Symbol('ClienteService')

export const EquipoServiceKey: InjectionKey<EquipoService> = 
    Symbol('EquipoService')

