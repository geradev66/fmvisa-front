import { inject } from 'vue'
import { UsuarioServiceKey } from '../injection-keys'
import { UsuarioService } from '../services/UsuarioService'

export function useUsuarioService(): UsuarioService {
    const service = inject(UsuarioServiceKey)
    if (!service) {
        throw new Error('UsuarioService no está provisto. Asegúrate de proveerlo en main.ts.')
    }
    return service
}
