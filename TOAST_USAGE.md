# Guía de Uso de Toasts

Esta aplicación utiliza PrimeVue Toast para mostrar notificaciones al usuario. Se ha creado un composable personalizado `useToast` para facilitar su uso.

## Configuración

El componente Toast ya está configurado en `App.vue` y el servicio ToastService está registrado en `main.ts`.

## Uso Básico

### 1. Importar el Composable

```typescript
import { useToast } from '../composables/useToast';

const toast = useToast();
```

### 2. Mostrar Notificaciones

#### Notificación de Éxito
```typescript
toast.showSuccess('La operación se completó correctamente');
// Con título personalizado
toast.showSuccess('Datos guardados exitosamente', 'Guardado', 3000);
```

#### Notificación de Error
```typescript
toast.showError('Ocurrió un error al procesar la solicitud');
// Con título personalizado
toast.showError('No se pudo conectar al servidor', 'Error de Conexión', 5000);
```

#### Notificación de Información
```typescript
toast.showInfo('Actualización disponible');
// Con título personalizado  
toast.showInfo('Hay 3 nuevas notificaciones', 'Información', 3000);
```

#### Notificación de Advertencia
```typescript
toast.showWarning('Los cambios no se han guardado');
// Con título personalizado
toast.showWarning('Sesión a punto de expirar', 'Advertencia', 4000);
```

### 3. Notificación Personalizada

Para casos más avanzados, puedes usar `showCustom`:

```typescript
toast.showCustom({
  severity: 'info',
  summary: 'Título personalizado',
  detail: 'Mensaje detallado',
  life: 3000,
  closable: true,
  group: 'custom'
});
```

### 4. Limpiar Todas las Notificaciones

```typescript
toast.removeAll();
```

## Ejemplos en Contexto

### Ejemplo 1: Login (ya implementado)
```typescript
const handleLogin = async () => {
  if (!validateForm()) {
    toast.showWarning('Por favor completa todos los campos correctamente');
    return;
  }
  
  try {
    const response = await authService.login(username, password);
    toast.showSuccess(`¡Bienvenido ${response.user.firstName}!`, 'Inicio de sesión exitoso');
    router.push('/dashboard');
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
    toast.showError(errorMessage, 'Error');
  }
};
```

### Ejemplo 2: Crear/Actualizar Datos
```typescript
const saveCliente = async () => {
  try {
    if (isEditMode) {
      await clienteService.update(cliente.value);
      toast.showSuccess('Cliente actualizado correctamente');
    } else {
      await clienteService.create(cliente.value);
      toast.showSuccess('Cliente creado exitosamente', 'Éxito');
    }
    closeDialog();
    refreshList();
  } catch (error: any) {
    toast.showError(
      error.response?.data?.message || 'Error al guardar el cliente',
      'Error al Guardar'
    );
  }
};
```

### Ejemplo 3: Eliminar Datos
```typescript
const deleteEquipo = async (id: string) => {
  if (!confirm('¿Estás seguro de eliminar este equipo?')) {
    return;
  }
  
  try {
    await equipoService.delete(id);
    toast.showSuccess('Equipo eliminado', 'Eliminación Exitosa');
    refreshList();
  } catch (error) {
    toast.showError('No se pudo eliminar el equipo', 'Error');
  }
};
```

### Ejemplo 4: Validaciones
```typescript
const validateOrdenServicio = () => {
  if (!ordenServicio.clienteId) {
    toast.showWarning('Selecciona un cliente', 'Campo Requerido');
    return false;
  }
  
  if (!ordenServicio.equipoId) {
    toast.showWarning('Selecciona un equipo', 'Campo Requerido');
    return false;
  }
  
  if (!ordenServicio.descripcion) {
    toast.showWarning('Ingresa una descripción', 'Campo Requerido');
    return false;
  }
  
  return true;
};
```

### Ejemplo 5: Acciones Masivas
```typescript
const deleteSelected = async () => {
  if (selectedItems.value.length === 0) {
    toast.showInfo('Selecciona al menos un elemento');
    return;
  }
  
  try {
    await Promise.all(
      selectedItems.value.map(item => service.delete(item.id))
    );
    toast.showSuccess(
      `${selectedItems.value.length} elementos eliminados`,
      'Eliminación Masiva'
    );
    selectedItems.value = [];
    refreshList();
  } catch (error) {
    toast.showError('Error al eliminar algunos elementos', 'Error');
  }
};
```

## Parámetros de los Métodos

### showSuccess / showError / showInfo / showWarning

- **detail** (string, requerido): El mensaje principal a mostrar
- **summary** (string, opcional): El título de la notificación
  - Por defecto: 'Éxito', 'Error', 'Información', 'Advertencia'
- **life** (number, opcional): Duración en milisegundos
  - Por defecto: success=3000, error=5000, info=3000, warning=4000

### showCustom

Acepta todas las opciones de ToastMessageOptions de PrimeVue:
- **severity**: 'success' | 'info' | 'warn' | 'error'
- **summary**: string
- **detail**: string
- **life**: number
- **closable**: boolean
- **group**: string
- **data**: any

## Tipos de Severidad

- **success** (verde): Para operaciones exitosas
- **error** (rojo): Para errores y fallos
- **info** (azul): Para información general
- **warn** (amarillo): Para advertencias y precauciones

## Mejores Prácticas

1. **Usa mensajes claros y concisos**: Los usuarios deben entender rápidamente qué sucedió
2. **Personaliza los títulos**: Ayuda a diferenciar el tipo de acción realizada
3. **Ajusta la duración**: Errores más tiempo (5s), éxitos menos tiempo (3s)
4. **No abuses de los toasts**: Úsalos solo para acciones importantes
5. **Mensajes en español**: Mantén consistencia en el idioma
6. **Incluye contexto**: Especifica qué elemento fue afectado cuando sea relevante

## Personalización

Si necesitas cambiar la posición global de los toasts, edita el componente Toast en `App.vue`:

```vue
<Toast position="top-right" />  <!-- Esquina superior derecha -->
<Toast position="top-left" />   <!-- Esquina superior izquierda -->
<Toast position="bottom-right" /><!-- Esquina inferior derecha -->
<Toast position="bottom-left" /> <!-- Esquina inferior izquierda -->
<Toast position="top-center" />  <!-- Centro superior -->
<Toast position="bottom-center" /><!-- Centro inferior -->
<Toast position="center" />      <!-- Centro de la pantalla -->
```

## Estilo

Los toasts heredan el tema de PrimeVue configurado en el proyecto (Aura). Si necesitas personalizar los estilos, puedes hacerlo en tu archivo CSS global.
