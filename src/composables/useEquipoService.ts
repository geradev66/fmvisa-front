import { inject } from 'vue'
import { EquipoServiceKey } from '../injection-keys'
import type { EquipoService } from '../services/EquipoService'
/**
 * Composable para inyectar el servicio de Equipo
 * @throws Error si el servicio no está disponible
 */
export function useEquipoService(): EquipoService {
    const service = inject(EquipoServiceKey)
    
    if (!service) {
        throw new Error('EquipoService no está provisto. Asegúrate de proveerlo en main.ts o en un componente padre.')
    }
    
    return service
}
