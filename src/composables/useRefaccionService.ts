import { inject } from 'vue'
import { RefaccionServiceKey } from '../injection-keys'
import type { RefaccionService } from '../services/RefaccionService'

export function useRefaccionService(): RefaccionService {
    const service = inject(RefaccionServiceKey)

    if (!service) {
        throw new Error('RefaccionService no está provisto. Asegúrate de proveerlo en main.ts o en un componente padre.')
    }

    return service
}
