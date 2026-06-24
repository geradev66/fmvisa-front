import { inject } from 'vue'
import { MovimientoInventarioServiceKey } from '../injection-keys'
import { MovimientoInventarioService } from '../services/MovimientoInventarioService'

export function useMovimientoInventarioService(): MovimientoInventarioService {
    const service = inject(MovimientoInventarioServiceKey)
    if (!service) {
        throw new Error('MovimientoInventarioService no está provisto. Asegúrate de proveerlo en main.ts.')
    }
    return service
}
