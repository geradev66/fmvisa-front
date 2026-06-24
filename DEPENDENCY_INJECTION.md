# Implementación de Inyección de Dependencias

Este proyecto utiliza el sistema nativo `provide`/`inject` de Vue 3 para implementar inyección de dependencias.

## Estructura

```
src/
├── services/                    # Servicios de negocio
│   └── OrdenServicioService.ts # Servicio de Orden de Servicio
├── composables/                 # Vue Composables
│   ├── useOrdenServicio.ts     # Lógica de negocio
│   └── useOrdenServicioService.ts # Hook para inyectar servicio
├── models/                      # Interfaces y tipos
│   └── orden-servicio.ts
├── injection-keys.ts            # Símbolos de inyección
└── main.ts                      # Configuración global
```

## Uso de Servicios

### 1. Crear un Servicio

```typescript
// src/services/MiServicio.ts
export class MiServicio {
    constructor(private apiUrl: string) {}
    
    async getData() {
        // Lógica del servicio
    }
}
```

### 2. Crear Injection Key

```typescript
// src/injection-keys.ts
import { InjectionKey } from 'vue'
import { MiServicio } from './services/MiServicio'

export const MiServicioKey: InjectionKey<MiServicio> = Symbol('MiServicio')
```

### 3. Proveer el Servicio

```typescript
// src/main.ts
import { MiServicio } from './services/MiServicio'
import { MiServicioKey } from './injection-keys'

const miServicio = new MiServicio('http://api.example.com')
app.provide(MiServicioKey, miServicio)
```

### 4. Crear un Composable (Opcional pero Recomendado)

```typescript
// src/composables/useMiServicio.ts
import { inject } from 'vue'
import { MiServicioKey } from '../injection-keys'

export function useMiServicio() {
    const service = inject(MiServicioKey)
    if (!service) {
        throw new Error('MiServicio no está disponible')
    }
    return service
}
```

### 5. Usar en Componentes

```vue
<script setup lang="ts">
import { useMiServicio } from '../composables/useMiServicio'

const miServicio = useMiServicio()

const cargarDatos = async () => {
    const datos = await miServicio.getData()
}
</script>
```

## Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Configura la URL de tu API:

```env
VITE_API_URL=http://localhost:3010/api
```

## Servicios Disponibles

### OrdenServicioService

Servicio para manejar órdenes de servicio:

- `crearOrden(dto)` - Crear nueva orden
- `obtenerOrden(id)` - Obtener orden por ID
- `obtenerOrdenes(params)` - Listar órdenes con filtros
- `actualizarOrden(id, dto)` - Actualizar orden
- `eliminarOrden(id)` - Eliminar orden
- `buscarOrdenes(query)` - Buscar órdenes
- `imprimirTicket(id)` - Generar ticket PDF
- `imprimirOrden(id)` - Generar orden PDF

## Ventajas de este Enfoque

✅ **Type Safety**: Tipado completo con TypeScript
✅ **Testing**: Fácil de mockear en tests
✅ **Reusabilidad**: Servicios reutilizables en toda la app
✅ **Separación de Concerns**: Lógica de negocio separada de UI
✅ **No Dependencies**: Sin librerías externas adicionales
✅ **Vue Native**: Integrado con el sistema de reactividad

## Ejemplo Completo

Ver `src/pages/orden-servicio.vue` para un ejemplo completo de implementación.
