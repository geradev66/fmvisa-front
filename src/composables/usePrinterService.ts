import { inject } from 'vue'
import { PrinterServiceKey } from '../injection-keys'
import type { PrinterService } from '../services/PrinterService'

export function usePrinterService(): PrinterService {
    const service = inject(PrinterServiceKey)

    if (!service) {
        throw new Error('PrinterService no está provisto. Asegúrate de proveerlo en main.ts o en un componente padre.')
    }

    return service
}
