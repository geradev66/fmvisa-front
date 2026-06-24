import { type InjectionKey } from 'vue'
import { OrdenServicioService } from './services/OrdenServicioService'
import type { AuthService } from './services/AuthService'
import type { ClienteService } from './services/ClienteService'
import type { EquipoService } from './services/EquipoService'
import type { RefaccionService } from './services/RefaccionService'
import type { TecnicoService } from './services/TecnicoService'
import type { PrinterService } from './services/PrinterService'
import type { PagoService } from './services/PagoService'
import type { UsuarioService } from './services/UsuarioService'
import type { MovimientoInventarioService } from './services/MovimientoInventarioService'

// Símbolos de inyección para servicios
export const OrdenServicioServiceKey: InjectionKey<OrdenServicioService> = 
    Symbol('OrdenServicioService')

export const AuthServiceKey: InjectionKey<AuthService> = 
    Symbol('AuthService')

export const ClienteServiceKey: InjectionKey<ClienteService> = 
    Symbol('ClienteService')

export const EquipoServiceKey: InjectionKey<EquipoService> = 
    Symbol('EquipoService')

export const RefaccionServiceKey: InjectionKey<RefaccionService> = 
    Symbol('RefaccionService')

export const TecnicoServiceKey: InjectionKey<TecnicoService> = 
    Symbol('TecnicoService')

export const PrinterServiceKey: InjectionKey<PrinterService> =
    Symbol('PrinterService')

export const PagoServiceKey: InjectionKey<PagoService> =
    Symbol('PagoService')

export const UsuarioServiceKey: InjectionKey<UsuarioService> =
    Symbol('UsuarioService')

export const MovimientoInventarioServiceKey: InjectionKey<MovimientoInventarioService> =
    Symbol('MovimientoInventarioService')

