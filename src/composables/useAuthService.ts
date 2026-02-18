import { inject } from 'vue'
import { AuthServiceKey } from '../injection-keys'
import { AuthService } from '../services/AuthService'
/**
 * Composable para inyectar el servicio de Auth
 * @throws Error si el servicio no está disponible
 */
export function useAuthService(): AuthService {
    const service = inject(AuthServiceKey)
    
    if (!service) {
        throw new Error('AuthService no está provisto. Asegúrate de proveerlo en main.ts o en un componente padre.')
    }
    
    return service
}
