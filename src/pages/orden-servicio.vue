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
            <Badge
                v-if="estadoOrden === 'Entregar'"
                :value="estadoBadgeValue"
                size="xlarge"
                :severity="estadoBadgeSeverity"
                class="Badge-entrega"
            ></Badge>
            <div class="gsflSection">
                <div class="gsfl">
                    GSFL
                </div>
                <input type="text">
            </div>
            <div class="action-buttons">
                <div class="order-date">
                    <span class="date-label">Fecha</span>
                    <span class="date-value">{{ formatDate(fechas.ingreso) }}</span>
                </div>
                <Button label="Nueva orden"  severity="primary" size="large" @click="crearNuevaOrden"></Button>
                <Button label="Guardar"  severity="secondary" outlined size="large" @click="guardarOrden" :loading="loading"></Button>
                <Button label="Ticket" icon="pi pi-print" severity="secondary" outlined size="large" @click="abrirImprimirTicket" :disabled="!ordenId"></Button>
                <Button label="Imprimir" icon="pi pi-file" severity="secondary" outlined size="large" @click="imprimirOrdenCompleta" :disabled="!ordenId"></Button>
                <Button label="Reporte" icon="pi pi-calendar" severity="secondary" outlined size="large" @click="mostrarReporte = true"></Button>
                <Button label="Salida" icon="pi pi-box" severity="warning" outlined size="large" @click="confirmarSalida" :disabled="!ordenId"></Button>
                <Button label="Búsqueda" icon="pi pi-search" severity="secondary" outlined size="large" @click="mostrarBusqueda = true"></Button>
                <Button icon="pi pi-print" severity="secondary" outlined size="large" @click="mostrarImpresoras = true"></Button>
                <Button :icon="settings.isDark ? 'pi pi-sun' : 'pi pi-moon'" severity="secondary" outlined size="large" @click="settings.toggleDark" v-tooltip="settings.isDark ? 'Modo claro' : 'Modo oscuro'" aria-label="Cambiar tema"></Button>
            </div>
        </div>

        <BusquedaOrdenesDialog v-model="mostrarBusqueda" @seleccionar="cargarOrdenDesdeDialogo" />
        <ReporteDiarioDialog v-model="mostrarReporte" />
        <PrintersDialog v-model="mostrarImpresoras" />
        <PrintTicketDialog v-model="mostrarImprimirTicket" :orden="ordenActual" />

        <!-- Diálogo: Confirmar salida -->
        <Dialog v-model:visible="dialogoSalidaVisible" header="Confirmar Salida" :modal="true" :closable="false" :style="{ width: '420px' }">
            <div style="display: flex; align-items: flex-start; gap: 0.85rem; line-height: 1.6;">
                <i class="pi pi-sign-out" style="font-size: 1.6rem; color: #f59e0b; margin-top: 0.1rem; flex-shrink: 0;"></i>
                <div>
                    <p style="margin: 0 0 0.4rem; font-weight: 600; font-size: 0.95rem;">¿Registrar salida de la orden <strong>#{{ ordenNumero }}</strong>?</p>
                    <p style="margin: 0; font-size: 0.85rem; color: #64748b;">Esta acción marcará el equipo como entregado y no podrá revertirse fácilmente.</p>
                </div>
            </div>
            <template #footer>
                <Button label="Cancelar" severity="secondary" text @click="dialogoSalidaVisible = false" :disabled="loadingSalida" />
                <Button label="Confirmar Salida" icon="pi pi-sign-out" severity="warning" @click="ejecutarSalida" :loading="loadingSalida" />
            </template>
        </Dialog>

        <!-- Diálogo: Restaurar borrador -->
        <Dialog v-model:visible="dialogoRestaurarVisible" header="Borrador no guardado" :modal="true" :closable="false" :style="{ width: '400px' }">
            <p style="margin: 0; line-height: 1.6;">
                <i class="pi pi-exclamation-triangle" style="color: #f59e0b; margin-right: 0.5rem;"></i>
                Se encontró un borrador guardado el <strong>{{ fechaBorrador }}</strong>. ¿Deseas restaurarlo?
            </p>
            <template #footer>
                <Button label="Descartar" severity="secondary" @click="descartarBorrador" />
                <Button label="Restaurar" icon="pi pi-undo" @click="restaurarDesdeCache" />
            </template>
        </Dialog>

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
                        :refacciones="refacciones"
                        :ordenId="ordenId"
                        :pagosList="pagosList"
                        :totalPagado="totalPagado"
                        @update:pendiente="estado.pendiente = $event"
                        @pagosChanged="recargarPagos"
                    />
                </div>

                <!-- Panel Refacciones: spans cols 2-3 -->
                <div class="panel-refacciones">
                    <RefaccionesCard v-model="refacciones" v-model:financiero="financiero" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, watchEffect } from 'vue'
import Button from 'primevue/button'
import { Badge } from 'primevue'
import type { 
    Fechas, 
    EstadoEquipo, 
    HistorialItem, 
    Financiero,
    EstadoOrden,
    ReferenciaTipo,
    TipoCargo,
    OrdenServicio,
    RefaccionItem
} from '../models/orden-servicio'
import { useOrdenServicioService } from '../composables/useOrdenServicioService'
import {useRoute } from 'vue-router'
import { useToast } from '../composables/useToast'
import { usePagoService } from '../composables/usePagoService'
import type { Pago } from '../models/pago'
import type { CrearOrdenServicioDTO, ActualizarOrdenServicioDTO, RefaccionItemDTO } from '../models/orden-servicio'
import { serializeFechas, serializeEstado, deserializeFechas, deserializeEstado } from '../utils/fechas'
import ClienteForm from '../components/ClienteForm.vue'
import EquipoForm from '../components/EquipoForm.vue'
import FinancieroForm from '../components/FinancieroForm.vue'
import RefaccionesCard from '../components/RefaccionesCard.vue'
import BusquedaOrdenesDialog from '../components/BusquedaOrdenesDialog.vue'
import ReporteDiarioDialog from '../components/ReporteDiarioDialog.vue'
import PrintersDialog from '../components/PrintersDialog.vue'
import PrintTicketDialog from '../components/PrintTicketDialog.vue'
import { useSettingsStore } from '../stores/SettingsStore'
import { type Cliente } from '../models/cliente'
import { type Equipo } from '../models/equipo'
import Dialog from 'primevue/dialog'



// Composables
const ordenService = useOrdenServicioService()
const pagoService = usePagoService()
const settings = useSettingsStore()

const route = useRoute()
const toast = useToast()

// Estado
const loading = ref<boolean>(false)
const ordenId = ref<string | null>(null)
const mostrarBusqueda = ref(false)
const mostrarReporte = ref(false)
const mostrarImpresoras = ref(false)
const mostrarImprimirTicket = ref(false)
const dialogoSalidaVisible = ref(false)
const loadingSalida = ref(false)

// Data
const ordenNumero = ref<string>('')

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
    ingreso: new Date(),
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
    descripcionReparacion: '',
    noPedido: ''
})

const historial = ref<HistorialItem[]>([])

const refacciones = ref<RefaccionItem[]>([])

const pagosList = ref<Pago[]>([])
const totalPagado = ref(0)

const estadoOrden = ref<EstadoOrden>('Refacción')
const fechaEntrega = ref<Date | null>(null)
const referencias = ref<ReferenciaTipo>('Garantia')
const tipoCargo = ref<TipoCargo>('CargoRegular')

const estadoBadgeValue = computed(() => {
    if (estadoOrden.value !== 'Entregar') return ''
    if (fechaEntrega.value) {
        return `Entregado ${formatDate(fechaEntrega.value)}`
    }
    return 'Entregado'
})

const estadoBadgeSeverity = computed(() => {
    const severityMap: Record<EstadoOrden, 'success' | 'warn' | 'info' | 'danger' | 'secondary' | 'contrast'> = {
        'Pendiente': 'warn',
        'Autoriza': 'success',
        'Informa': 'info',
        'Refacción': 'contrast',
        'Entregar': 'success',
        'Ninguno': 'secondary'
    }
    return severityMap[estadoOrden.value] || 'secondary'
})

const referenciaBadgeValue = computed(() => {
    const labelMap: Record<ReferenciaTipo, string> = {
        'Garantia': 'Gtia. reparacion',
        'SinReparacion': 'Sin reparacion',
        'NoAutorizo': 'No autorizo',
        'Reparado': 'Reparado',
        'Ninguno': 'Ninguno'
    }
    return labelMap[referencias.value] || 'Ninguno'
})

const referenciaBadgeSeverity = computed(() => {
    const severityMap: Record<ReferenciaTipo, 'success' | 'warn' | 'info' | 'danger' | 'secondary' | 'contrast'> = {
        'Garantia': 'info',
        'SinReparacion': 'warn',
        'NoAutorizo': 'danger',
        'Reparado': 'success',
        'Ninguno': 'secondary'
    }
    return severityMap[referencias.value] || 'secondary'
})

const financiero = ref<Financiero>({
    presupuesto: 0.00,
    revision: 0.00,
    manoDeObra: 0.00,
    anticipo: 0.00,
    pagos: 0.00,
    iva: 0.00
})

// ── Auto-guardado en caché local ──
const CACHE_KEY = 'fm_orden_draft'
const dialogoRestaurarVisible = ref(false)
const fechaBorrador = ref('')

const guardarEnCache = () => {
    try {
        const draft = {
            ordenId: ordenId.value,
            ordenNumero: ordenNumero.value,
            cliente: cliente.value,
            equipo: equipo.value,
            fechas: fechas.value,
            estado: estado.value,
            estadoOrden: estadoOrden.value,
            referencias: referencias.value,
            tipoCargo: tipoCargo.value,
            financiero: financiero.value,
            historial: historial.value,
            refacciones: refacciones.value,
            _guardadoEn: new Date().toISOString()
        }
        localStorage.setItem(CACHE_KEY, JSON.stringify(draft))
    } catch { /* cuota excedida, ignorar */ }
}

const parseFechas = deserializeFechas

const restaurarDesdeCache = () => {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return
    try {
        const d = JSON.parse(raw)
        ordenId.value = d.ordenId ?? null
        ordenNumero.value = d.ordenNumero ?? ''
        if (d.cliente) cliente.value = d.cliente
        if (d.equipo) equipo.value = d.equipo
        if (d.fechas) fechas.value = parseFechas(d.fechas)
        if (d.estado) estado.value = deserializeEstado(d.estado)
        if (d.estadoOrden) estadoOrden.value = d.estadoOrden
        if (d.referencias) referencias.value = d.referencias
        if (d.tipoCargo) tipoCargo.value = d.tipoCargo
        if (d.financiero) financiero.value = d.financiero
        if (d.historial) historial.value = d.historial
        if (Array.isArray(d.refacciones)) {
            refacciones.value = d.refacciones.map((r: any) => ({
                ...r,
                fechaPresupuesto: r.fechaPresupuesto ? new Date(r.fechaPresupuesto) : null
            }))
        }
        dialogoRestaurarVisible.value = false
        toast.showSuccess('Borrador restaurado correctamente', 'Borrador')
    } catch {
        localStorage.removeItem(CACHE_KEY)
    }
}

const descartarBorrador = () => {
    localStorage.removeItem(CACHE_KEY)
    dialogoRestaurarVisible.value = false
}

const limpiarCache = () => localStorage.removeItem(CACHE_KEY)

// Guardar en caché cada vez que cambia cualquier dato del formulario
watch(
    [ordenId, ordenNumero, cliente, equipo, fechas, estado, estadoOrden, referencias, tipoCargo, financiero, historial, refacciones],
    guardarEnCache,
    { deep: true }
)

// Actualizar campos financieros calculables cuando cambien las refacciones
watchEffect(() => {
    const partidas = refacciones.value
    const presupuesto = partidas.reduce((acc, r) => acc + ((r.precio ?? 0) * (r.cantidad ?? 1)), 0)
    const iva = (presupuesto + financiero.value.revision) * 0.16
    financiero.value.presupuesto = presupuesto
    financiero.value.iva = iva
})


watch(estadoOrden, (nuevo) => {
    if (nuevo === 'Entregar' && !fechaEntrega.value) {
        fechaEntrega.value = new Date()
    } else if (nuevo !== 'Entregar') {
        fechaEntrega.value = null
    }
})

const formatDate = (date: Date | null): string => {
    if (!date) return '—'
    return date.toLocaleDateString('es-MX', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    })
}

const cargarOrdenDesdeDialogo = (orden: OrdenServicio) => {
    cargarOrden(orden._id!)
}

// Snapshot de la orden actual para pasarla al diálogo de ticket
const ordenActual = computed<OrdenServicio | null>(() => {
    if (!ordenId.value) return null
    return {
        _id: ordenId.value,
        numeroOrden: ordenNumero.value,
        fechaCreacion: fechas.value.ingreso ?? new Date(),
        cliente: cliente.value,
        equipo: equipo.value,
        fechas: fechas.value,
        estado: estado.value,
        estadoOrden: estadoOrden.value,
        referencias: referencias.value,
        tipoCargo: tipoCargo.value,
        financiero: financiero.value,
        historial: historial.value,
        refacciones: refacciones.value,
    }
})

const abrirImprimirTicket = () => {
    if (!ordenId.value) {
        toast.showWarning('Debe guardar la orden primero', 'Orden no Guardada')
        return
    }
    mostrarImprimirTicket.value = true
}
const recargarPagos = async () => {
    if (!ordenId.value) return
    try {
        const res = await pagoService.obtenerPagosOrden(ordenId.value)
        pagosList.value = res.data
        totalPagado.value = res.totalPagado
    } catch (e) {
        console.error('Error al recargar pagos', e)
    }
}

// Funciones del servicio
const crearNuevaOrden = () => {
    limpiarCache()
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
        descripcionReparacion: '',
        noPedido: ''
    }
    estadoOrden.value = 'Pendiente'
    referencias.value = 'Ninguno'
    tipoCargo.value = 'CargoRegular'
    financiero.value = {
        presupuesto: 0.00,
        revision: 0.00,
        manoDeObra: 0.00,
        anticipo: 0.00,
        pagos: 0.00,
        iva: 0.00
    }
    refacciones.value = []
    pagosList.value = []
    totalPagado.value = 0
}

const guardarOrden = async () => {
    try {
        loading.value = true
        const esNueva = !ordenId.value

        // Strip empty _id so the backend knows whether to create or update the sub-document
        const clientePayload = { ...cliente.value }
        if (!clientePayload._id) delete clientePayload._id

        const equipoPayload = { ...equipo.value }
        if (!equipoPayload._id) delete equipoPayload._id

        // Map refacciones to the API shape (rename catalogId → refaccionId, drop frontend-only fields)
        const refaccionesDTO: RefaccionItemDTO[] = refacciones.value.map(r => ({
            refaccionId: r.catalogId || undefined,
            codigo: r.codigo,
            nombre: r.nombre,
            aparato: r.aparato,
            cantidad: r.cantidad ?? 0,
            precio: r.precio ?? 0,
            costo: r.costo ?? undefined,
            pago: r.pago ?? undefined,
        }))

        const basePayload: CrearOrdenServicioDTO = {
            cliente: clientePayload,
            equipo: equipoPayload,
            estadoOrden: estadoOrden.value,
            referencias: referencias.value,
            tipoCargo: tipoCargo.value,
            fechas: serializeFechas(fechas.value),
            estado: serializeEstado(estado.value),
            financiero: financiero.value,
            refacciones: refaccionesDTO,
        }

        if (ordenId.value) {
            const updatePayload: ActualizarOrdenServicioDTO = {
                ...basePayload,
                accionHistorial: 'Orden actualizada',
                usuarioHistorial: 'Usuario Actual',
            }
            const updated = await ordenService.actualizarOrden(ordenId.value, updatePayload)
            // Sync IDs from the response in case the backend updated sub-documents
            if (updated.cliente) cliente.value = updated.cliente
            if (updated.equipo) equipo.value = updated.equipo
            toast.showSuccess(`Orden #${ordenNumero.value} actualizada correctamente`, 'Orden Actualizada')
        } else {
            const nuevaOrden = await ordenService.crearOrden(basePayload)
            ordenId.value = nuevaOrden._id || null
            ordenNumero.value = nuevaOrden.numeroOrden
            // Sync client and equipo with the IDs assigned by the backend — critical for future updates
            if (nuevaOrden.cliente) cliente.value = nuevaOrden.cliente
            if (nuevaOrden.equipo) equipo.value = nuevaOrden.equipo
            if (nuevaOrden.historial) historial.value = nuevaOrden.historial
            toast.showSuccess(`Orden #${nuevaOrden.numeroOrden} creada exitosamente`, 'Orden Creada')
        }

        limpiarCache()

        if (!esNueva) {
            historial.value.push({
                fecha: new Date().toLocaleDateString('es-MX'),
                accion: 'Actualización de orden',
                usuario: 'Usuario Actual'
            })
        }
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
        ordenId.value = orden._id || null
        ordenNumero.value = orden.numeroOrden
        if (orden.cliente) {
            cliente.value = orden.cliente   
        }
        if (orden.equipo) {
            equipo.value = orden.equipo
        }
        fechas.value = deserializeFechas(orden.fechas)
        estado.value = deserializeEstado(orden.estado)
        estadoOrden.value = orden.estadoOrden
        referencias.value = orden.referencias
        tipoCargo.value = orden.tipoCargo
        financiero.value = { ...orden.financiero, manoDeObra: orden.financiero.manoDeObra ?? 0 }
        historial.value = orden.historial
        await recargarPagos()
        if (Array.isArray(orden.refacciones)) {
            refacciones.value = orden.refacciones.map(r => ({
                ...r,
                fechaPresupuesto: r.fechaPresupuesto ? new Date(r.fechaPresupuesto) : null
            }))
        }
    } catch (error) {
        console.error('Error al cargar orden:', error)
        alert('Error al cargar la orden.')
    } finally {
        loading.value = false
    }
}

// const imprimirTicket = async () => {
//     if (!ordenId.value) {
//         toast.showWarning('Debe guardar la orden primero', 'Orden no Guardada')
//         return
//     }
//     try {
//         loading.value = true
//         const blob = await ordenService.imprimirTicket(ordenId.value)
//         const url = window.URL.createObjectURL(blob)
//         window.open(url, '_blank')
//         toast.showSuccess('Ticket generado correctamente', 'Impresión Exitosa')
//     } catch (error) {
//         console.error('Error al imprimir ticket:', error)
//         toast.showError('Error al imprimir el ticket', 'Error de Impresión')
//     } finally {
//         loading.value = false
//     }
// }

const confirmarSalida = () => {
    if (!ordenId.value) {
        toast.showWarning('Debe guardar la orden primero', 'Orden no Guardada')
        return
    }
    dialogoSalidaVisible.value = true
}

const ejecutarSalida = async () => {
    if (!ordenId.value) return
    try {
        loadingSalida.value = true
        await ordenService.generarSalida(ordenId.value)
        dialogoSalidaVisible.value = false
        estadoOrden.value = 'Entregar'
        toast.showSuccess(`Salida registrada para la orden #${ordenNumero.value}`, 'Salida Exitosa')
    } catch (error: any) {
        console.error('Error al generar salida:', error)
        const errorMessage = error.response?.data?.message || 'Error al registrar la salida.'
        toast.showError(errorMessage, 'Error de Salida')
    } finally {
        loadingSalida.value = false
    }
}

const imprimirOrdenCompleta = async () => {
    if (!ordenId.value) {
        toast.showWarning('Debe guardar la orden primero', 'Orden no Guardada')
        return
    }
    try {
        loading.value = true
        await ordenService.showPdfTarjeta(ordenId.value)
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
    const id = route.params.id as string
    if (id) {
        cargarOrden(id)
    } else {
        // Verificar si hay un borrador guardado
        const raw = localStorage.getItem(CACHE_KEY)
        if (raw) {
            try {
                const d = JSON.parse(raw)
                if (d._guardadoEn) {
                    fechaBorrador.value = new Date(d._guardadoEn).toLocaleString('es-MX')
                }
                dialogoRestaurarVisible.value = true
            } catch {
                localStorage.removeItem(CACHE_KEY)
            }
        }
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
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
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
    color: var(--text-muted);
}

.order-number {
    font-size: 14px;
    font-weight: 700;
    color: var(--text-primary);
}

.order-date {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    line-height: 1;
    justify-content: end;
    width: 90px;
}

.date-label {
    font-size: 11px;
    color: var(--text-muted);
}

.date-value {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
}

.action-buttons {
    display: flex;
    gap: 0.3rem;
    flex: 1;
    justify-content: flex-end;
    flex-wrap: nowrap;
    align-items: center;
}

.ingreso-floatlabel :deep(.p-datepicker-input) {
    height: 35px;
    font-size: 0.9rem;
}

.ingreso-floatlabel :deep(.p-floatlabel label) {
    font-size: 0.8rem;
}

.action-buttons :deep(.p-button) {
    font-size: 0.82rem;
    height: 32px;
    padding-left: 0.65rem;
    padding-right: 0.65rem;
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
    grid-template-columns: 1fr 1.75fr 0.72fr;
    grid-template-rows: 1fr .75fr;
    grid-template-areas:
        "cliente equipo lateral"
        "cliente refacciones refacciones";
    gap: 0.4rem;
    overflow: hidden;
    min-height: 0;
}

.panel-cliente {
    grid-area: cliente;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 0;
}

.panel-equipo {
    grid-area: equipo;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 0;
}

.panel-lateral {
    grid-area: lateral;
    gap: 0.4rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 0;
}

.panel-refacciones {
    grid-area: refacciones;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 0;
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
    color: var(--text-primary);
}

.card-title i {
    color: var(--icon-accent);
    font-size: 13px;
}

.Badge-entrega {
    margin-left: 0.25rem;
    font-size: 0.82rem;
    padding: 0.45rem 0.8rem !important;
    font-weight: 700;
    white-space: nowrap;
    flex-shrink: 0;
}

.gsfl {
    background: #3b82f6;
    color: white;
    padding: 0.35rem 0.6rem;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
}

.gsflSection {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    margin-left: 0.4rem;
    flex-shrink: 0;
}

.gsflSection input[type="text"] {
    height: 32px;
    font-size: 0.85rem;
    padding: 0.3rem 0.5rem;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    width: 120px;
    background: var(--top-bar-bg-color);
    color: var(--text-primary);
}

/* =============================================
   RESPONSIVE — TOP BAR
   ============================================= */

/* ── Laptop estándar 1024–1366px ── */
@media (max-width: 1366px) {
    .action-buttons :deep(.p-button .p-button-label) {
        display: none;
    }

    .action-buttons :deep(.p-button) {
        height: 30px;
        min-width: 30px;
        padding: 0 0.45rem;
        font-size: 0;
    }

    .action-buttons :deep(.p-button-icon) {
        font-size: 13px;
        margin: 0;
    }

    /* Sólo "Nueva Orden" y "Guardar" conservan su label */
    .action-buttons :deep(.p-button:nth-child(2) .p-button-label),
    .action-buttons :deep(.p-button:nth-child(3) .p-button-label) {
        display: inline;
        font-size: 0.8rem;
    }

    .action-buttons :deep(.p-button:nth-child(2)),
    .action-buttons :deep(.p-button:nth-child(3)) {
        padding: 0 0.6rem;
        font-size: 0.8rem;
    }

    .top-bar {
        gap: 0.4rem;
        padding: 0.4rem 0.6rem;
    }

    .gsflSection input[type="text"] {
        width: 90px;
    }
}

/* ── Pantalla pequeña / tablet landscape ≤1024px ── */
@media (max-width: 1024px) {
    .action-buttons :deep(.p-button .p-button-label) {
        display: none;
    }

    .action-buttons :deep(.p-button) {
        height: 28px;
        min-width: 28px;
        padding: 0 0.38rem;
    }

    .action-buttons :deep(.p-button-icon) {
        font-size: 12px;
        margin: 0;
    }

    .Badge-entrega {
        font-size: 0.75rem;
        padding: 0.35rem 0.6rem !important;
    }

    .order-badge {
        width: 28px;
        height: 28px;
        font-size: 13px;
    }

    .gsflSection input[type="text"] {
        width: 70px;
    }

    .order-date {
        width: auto;
    }
}

/* ── Móvil / tablet portrait ≤768px — dos filas ── */
@media (max-width: 768px) {
    .top-bar {
        flex-wrap: wrap;
        padding: 0.4rem 0.5rem;
        gap: 0.3rem;
    }

    .action-buttons {
        width: 100%;
        flex-wrap: wrap;
        justify-content: flex-start;
        gap: 0.2rem;
    }

    .Badge-entrega {
        margin-left: 0;
    }

    .gsflSection {
        margin-left: 0;
    }
}

</style>
