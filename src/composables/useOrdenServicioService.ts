import { inject } from 'vue'
import { OrdenServicioServiceKey } from '../injection-keys'
import { OrdenServicioService } from '../services/OrdenServicioService'

/**
 * Composable para inyectar el servicio de Orden de Servicio
 * @throws Error si el servicio no está disponible
 */
export function useOrdenServicioService(): OrdenServicioService {
    const service = inject(OrdenServicioServiceKey)
    
    if (!service) {
        throw new Error('OrdenServicioService no está provisto. Asegúrate de proveerlo en main.ts o en un componente padre.')
    }
    
    return service
}
