import { inject } from 'vue'
import { TecnicoServiceKey } from '../injection-keys'
import type { TecnicoService } from '../services/TecnicoService'

export function useTecnicoService(): TecnicoService {
    const service = inject(TecnicoServiceKey)

    if (!service) {
        throw new Error('TecnicoService no está provisto. Asegúrate de proveerlo en main.ts o en un componente padre.')
    }

    return service
}
