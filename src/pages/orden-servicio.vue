<template>
    <div class="orden-servicio-page">
        <!-- Compact Top Bar -->
        <div class="top-bar">
            <div class="order-info">
                <div class="order-badge">
                    <i class="pi pi-hashtag"></i>
                </div>
                <div class="order-details">
                        <span class="order-label">Orden de Servicio</span>
                        <span class="order-number">{{ ordenNumero === '' ? 'Nueva Orden' : ordenNumero }}</span>
                </div>
            </div>
            <FloatLabel variant="on" class="ingreso-floatlabel">
                <DatePicker id="fechaIngreso" v-model="fechas.ingreso" dateFormat="dd/mm/yy" showIcon size="large" />
                <label for="fechaIngreso">Fecha Ingreso</label>
            </FloatLabel>
            <Badge value="Entregado" size="xlarge" severity="success" class="Badge-entrega"></Badge>
            <div class="action-buttons">
                <Button label="Nueva Orden" icon="pi pi-plus" severity="primary" size="large" @click="crearNuevaOrden"></Button>
                <Button label="Guardar" icon="pi pi-save" severity="secondary" outlined size="large" @click="guardarOrden" :loading="loading"></Button>
                <Button label="Ticket" icon="pi pi-print" severity="secondary" outlined size="large" @click="imprimirTicket" :disabled="!ordenId"></Button>
                <Button label="Imprimir" icon="pi pi-file" severity="secondary" outlined size="large" @click="imprimirOrdenCompleta" :disabled="!ordenId"></Button>
                <Button label="Reporte" icon="pi pi-calendar" severity="secondary" outlined size="large"></Button>
                <Button label="Salida" icon="pi pi-box" severity="secondary" outlined size="large"></Button>
                <Button label="Búsqueda" icon="pi pi-search" severity="secondary" outlined size="large" ></Button>
            </div>
            <div class="order-date">
                <span class="date-label">Fecha</span>
                <span class="date-value">{{ fechaActual }}</span>
            </div>

        </div>

        <!-- Main Content -->
        <div class="main-content">
            <!-- Top three columns -->
            <div class="top-panels">
                <!-- Panel Cliente -->
                <div class="panel-cliente">
                    <ClienteForm
                        v-model="cliente"
                        v-model:estadoOrden="estadoOrden"
                        v-model:referencias="referencias"
                        v-model:tipoCargo="tipoCargo"
                    />
                </div>

                <!-- Panel Equipo -->
                <div class="panel-equipo">
                    <EquipoForm
                        v-model:equipo="equipo"
                        v-model:fechas="fechas"
                        v-model:estado="estado"
                        v-model:historial="historial"
                    />
                </div>

                <!-- Panel Lateral: Financiero -->
                <div class="panel-lateral">
                    <FinancieroForm
                        v-model:financiero="financiero"
                        :pendiente="estado.pendiente"
                        @update:pendiente="estado.pendiente = $event"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import FloatLabel from 'primevue/floatlabel'
import type { 
    Fechas, 
    EstadoEquipo, 
    HistorialItem, 
    Financiero,
    EstadoOrden,
    ReferenciaTipo,
    TipoCargo,
    OrdenServicio
} from '../models/orden-servicio'
import { useOrdenServicioService } from '../composables/useOrdenServicioService'
import {useRoute } from 'vue-router'
import { useToast } from '../composables/useToast'
import ClienteForm from '../components/ClienteForm.vue'
import EquipoForm from '../components/EquipoForm.vue'
import FinancieroForm from '../components/FinancieroForm.vue'
import { type Cliente } from '../models/cliente'
import { type Equipo } from '../models/equipo'
import { Badge } from 'primevue'



// Composables
const ordenService = useOrdenServicioService()

const route = useRoute()
const toast = useToast()

// Estados
const loading = ref<boolean>(false)
const ordenId = ref<string | null>(null)

// Data
const ordenNumero = ref<string>('')
const fechaActual = ref<string>(new Date().toLocaleDateString('es-MX', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
}))

const cliente = ref<Cliente>({
    nombre: '',
    celular: '',
    domicilio: '',
    rfc: '',
    colonia: '',
    ciudad: '',
    estado: '',
    cp: '',
    email: '',
    telefono: '',
    contacto: ''
})

const equipo = ref<Equipo>({
    marca: '',
    modelo: '',
    noSerie: '',
    tipo: '',
    falla: '',
    accesorios: ''
})

const fechas = ref<Fechas>({
    ingreso: null,
    salida: null,
    autorizacion: null,
    llegadaRefaccion: null
})

const estado = ref<EstadoEquipo>({
    pendiente: '',
    enviadoANombre: '',
    fechaEnvio: null,
    notasEnvio: '',
    reparadoPor: '',
    fechaReparacion: null,
    descripcionReparacion: ''
})

const historial = ref<HistorialItem[]>([])

// Removed: refacciones, refaccionSeleccionada, agregarRefaccion, eliminarRefaccion,
// onCellEditComplete, formatCurrency — all moved to EquipoForm.vue

const estadoOrden = ref<EstadoOrden>('Refacción')
const referencias = ref<ReferenciaTipo>('Garantia')
const tipoCargo = ref<TipoCargo>('CargoRegular')

const financiero = ref<Financiero>({
    presupuesto: 0.00,
    revision: 0.00,
    anticipo: 0.00,
    pagos: 0.00,
    iva: 0.00
})

// Funciones del servicio
const crearNuevaOrden = () => {
    // Limpiar formulario
    ordenId.value = null
    ordenNumero.value = ''
    cliente.value = {
        nombre: '',
        celular: '',
        domicilio: '',
        rfc: '',
        colonia: '',
        ciudad: '',
        estado: '',
        cp: '',
        email: '',
        telefono: '',
        contacto: ''
    }
    equipo.value = {
        marca: '',
        modelo: '',
        noSerie: '',
        tipo: '',
        falla: '',
        accesorios: ''
    }
    fechas.value = {
        ingreso: new Date(),
        salida: null,
        autorizacion: null,
        llegadaRefaccion: null
    }
    toast.showInfo('Formulario listo para una nueva orden', 'Nueva Orden')
    estado.value = {
        pendiente: '',
        enviadoANombre: '',
        fechaEnvio: null,
        notasEnvio: '',
        reparadoPor: '',
        fechaReparacion: null,
        descripcionReparacion: ''
    }
    estadoOrden.value = 'Pendiente'
    referencias.value = 'Ninguno'
    tipoCargo.value = 'CargoRegular'
    financiero.value = {
        presupuesto: 0.00,
        revision: 0.00,
        anticipo: 0.00,
        pagos: 0.00,
        iva: 0.00
    }
}

const guardarOrden = async () => {
    try {
        loading.value = true
        
        const ordenData: OrdenServicio = {
            id: ordenId.value || undefined,
            numeroOrden: ordenNumero.value,
            fechaCreacion: new Date(),
            cliente: cliente.value,
            equipo: equipo.value,
            fechas: fechas.value,
            estado: estado.value,
            estadoOrden: estadoOrden.value,
            referencias: referencias.value,
            tipoCargo: tipoCargo.value,
            financiero: financiero.value,
            historial: historial.value
        }

        if (ordenId.value) {
            // Actualizar orden existente
            await ordenService.actualizarOrden(ordenId.value, {
                ...ordenData,
                id: ordenId.value
            })
            toast.showSuccess(`Orden #${ordenNumero.value} actualizada correctamente`, 'Orden Actualizada')
        } else {
            // Crear nueva orden
            const nuevaOrden = await ordenService.crearOrden({
                cliente: cliente.value,
                equipo: equipo.value,
                fechas: fechas.value
            })
            ordenId.value = nuevaOrden.id || null
            ordenNumero.value = nuevaOrden.numeroOrden
            toast.showSuccess(`Orden #${nuevaOrden.numeroOrden} creada exitosamente`, 'Orden Creada')
        }

        // Agregar entrada al historial
        historial.value.push({
            fecha: new Date().toLocaleDateString('es-MX'),
            accion: ordenId.value ? 'Actualización de orden' : 'Creación de orden',
            usuario: 'Usuario Actual'
        })
    } catch (error: any) {
        console.error('Error al guardar orden:', error)
        const errorMessage = error.response?.data?.message || 'Error al guardar la orden. Por favor intenta de nuevo.'
        toast.showError(errorMessage, 'Error al Guardar')
    } finally {
        loading.value = false
    }
}

const cargarOrden = async (id: string) => {
    try {
        loading.value = true
        const orden = await ordenService.obtenerOrden(id)
        
        // Cargar datos en el formulario
        ordenId.value = orden.id || null
        ordenNumero.value = orden.numeroOrden
        if (orden.cliente) {
            cliente.value = orden.cliente   
        }
        if (orden.equipo) {
            equipo.value = orden.equipo
        }
        fechas.value = orden.fechas
        estado.value = orden.estado
        estadoOrden.value = orden.estadoOrden
        referencias.value = orden.referencias
        tipoCargo.value = orden.tipoCargo
        financiero.value = orden.financiero
        historial.value = orden.historial
    } catch (error) {
        console.error('Error al cargar orden:', error)
        alert('Error al cargar la orden.')
    } finally {
        loading.value = false
    }
}

const imprimirTicket = async () => {
    if (!ordenId.value) {
        toast.showWarning('Debe guardar la orden primero', 'Orden no Guardada')
        return
    }
    try {
        loading.value = true
        const blob = await ordenService.imprimirTicket(ordenId.value)
        const url = window.URL.createObjectURL(blob)
        window.open(url, '_blank')
        toast.showSuccess('Ticket generado correctamente', 'Impresión Exitosa')
    } catch (error) {
        console.error('Error al imprimir ticket:', error)
        toast.showError('Error al imprimir el ticket', 'Error de Impresión')
    } finally {
        loading.value = false
    }
}

const imprimirOrdenCompleta = async () => {
    if (!ordenId.value) {
        toast.showWarning('Debe guardar la orden primero', 'Orden no Guardada')
        return
    }
    try {
        loading.value = true
        const blob = await ordenService.imprimirOrden(ordenId.value)
        const url = window.URL.createObjectURL(blob)
        window.open(url, '_blank')
        toast.showSuccess('Orden completa generada correctamente', 'Impresión Exitosa')
    } catch (error) {
        console.error('Error al imprimir orden:', error)
        toast.showError('Error al imprimir la orden', 'Error de Impresión')
    } finally {
        loading.value = false
    }
}

// Lifecycle
onMounted(() => {
    // Si hay un ID en la ruta, cargar la orden
    const id = route.params.id as string
    if (id) {
        cargarOrden(id)
    }
})
</script>

<style scoped>
/* =============================================
   PAGE LAYOUT — Full viewport, no scroll
   ============================================= */
.orden-servicio-page {
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: var(--bg-color);
    padding: 10px;
    box-sizing: border-box;
    font-size: 13px;
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
}

/* =============================================
   TOP BAR
   ============================================= */
.top-bar {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 1rem;
    background: var(--top-bar-bg-color);
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    flex-shrink: 0;
    margin-bottom: 0.4rem;
}

.order-info {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    flex-shrink: 0;
}

.order-badge {
    background: #3b82f6;
    color: white;
    width: 34px;
    height: 34px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    flex-shrink: 0;
}

.order-details {
    display: flex;
    flex-direction: column;
    line-height: 1;
}

.order-label {
    font-size: 11px;
    color: #64748b;
}

.order-number {
    font-size: 16px;
    font-weight: 700;
    color: #1e293b;
}

.order-date {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    line-height: 1;
}

.date-label {
    font-size: 11px;
    color: #64748b;
}

.date-value {
    font-size: 13px;
    font-weight: 600;
    color: #1e293b;
}

.action-buttons {
    display: flex;
    gap: 0.3rem;
    flex: 1;
    justify-content: flex-start;
    flex-wrap: nowrap;
    align-items: center;
    padding-left: 4rem;
}

.ingreso-floatlabel :deep(.p-datepicker-input) {
    height: 35px;
    font-size: 0.9rem;
}

.ingreso-floatlabel :deep(.p-floatlabel label) {
    font-size: 0.8rem;
}

.action-buttons :deep(.p-button) {
    font-size: .9rem;
    height: 35px;
}

.action-buttons :deep(.p-button-icon) {
    font-size: 12px;
}

/* =============================================
   MAIN CONTENT FLEX COLUMN
   ============================================= */
.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    overflow: hidden;
    min-height: 0;
}

/* Three-column row */
.top-panels {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1.45fr 0.72fr;
    gap: 0.4rem;
    overflow: hidden;
    min-height: 0;
}

.panel-cliente,
.panel-equipo,
.panel-lateral {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 0;
}

.panel-lateral {
    gap: 0.4rem;
}

/* Refacciones inside equipo column */
.refacciones-card {
    flex: 1;
    min-height: 0;
    overflow: hidden;
}

/* =============================================
   CARDS — Compact PrimeVue overrides
   ============================================= */
.section-card {
    overflow: hidden;
    min-height: 0;
}

/* Make cards fill their column */
.panel-cliente :deep(.p-card),
.panel-lateral .estado-card {
    height: 100%;
}

:deep(.p-card) {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07);
    border-radius: 6px;
}

:deep(.p-card .p-card-body) {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 0.45rem 0.6rem 0.5rem;
}

:deep(.p-card .p-card-title) {
    padding: 0;
    margin-bottom: 0.35rem;
}

:deep(.p-card .p-card-content) {
    flex: 1;
    overflow: auto;
    padding: 0;
}

:deep(.p-card .p-card-footer) {
    padding: 0.35rem 0 0;
}

.equipo-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 0;
}

.panel-equipo {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    min-height: 0;
    overflow: hidden;
}

.estado-card {
    flex: 1;
    min-height: 0;
    overflow: hidden;
}

.financiero-card {
    flex-shrink: 0;
}

.card-title {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 13px;
    font-weight: 600;
    color: #1e293b;
}

.card-title i {
    color: #3b82f6;
    font-size: 13px;
}

.Badge-entrega{
    margin-left: 1rem;
}

</style>
