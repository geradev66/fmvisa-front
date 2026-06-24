import { inject } from 'vue'
import { PagoServiceKey } from '../injection-keys'
import type { PagoService } from '../services/PagoService'

export function usePagoService(): PagoService {
    const service = inject(PagoServiceKey)

    if (!service) {
        throw new Error('PagoService no está provisto. Asegúrate de proveerlo en main.ts o en un componente padre.')
    }

    return service
}
