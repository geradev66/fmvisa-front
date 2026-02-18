import { inject } from 'vue'
import { ClienteServiceKey } from '../injection-keys'
import type { ClienteService } from '../services/ClienteService'
/**
 * Composable para inyectar el servicio de Cliente
 * @throws Error si el servicio no está disponible
 */
export function useClienteService(): ClienteService {
    const service = inject(ClienteServiceKey)
    
    if (!service) {
        throw new Error('ClienteService no está provisto. Asegúrate de proveerlo en main.ts o en un componente padre.')
    }
    
    return service
}
