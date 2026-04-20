<template>
    <Dialog v-model:visible="visible" header="Imprimir Ticket" modal :style="{ width: '480px' }" :breakpoints="{ '520px': '95vw' }" @show="fetchPrinters">

        <div v-if="loadingPrinters" class="loading-row">
            <i class="pi pi-spin pi-spinner"></i>
            <span>Cargando impresoras...</span>
        </div>

        <div v-else-if="printers.length === 0" class="empty-row">
            <i class="pi pi-print"></i>
            <span>No hay impresoras configuradas. Agrégalas en <strong>Impresoras</strong>.</span>
        </div>

        <div v-else class="printer-list">
            <div
                v-for="p in printers"
                :key="p._id"
                class="printer-item"
                :class="{ selected: selected?._id === p._id }"
                @click="selected = p"
            >
                <div class="printer-icon">
                    <i class="pi pi-print"></i>
                </div>
                <div class="printer-info">
                    <span class="printer-name">{{ p.nombre }}</span>
                    <span class="printer-meta">{{ tipoLabel(p) }}</span>
                </div>
                <i v-if="selected?._id === p._id" class="pi pi-check-circle check-icon"></i>
            </div>
        </div>

        <template #footer>
            <Button label="Cancelar" severity="secondary" outlined @click="visible = false" :disabled="printing" />
            <Button label="Imprimir" icon="pi pi-print" :disabled="!selected || loadingPrinters" :loading="printing" @click="imprimir" />
        </template>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import { usePrinterService } from '../composables/usePrinterService'
import { useToast } from '../composables/useToast'
import { POSPrinterService } from '../services/POSPrinterService'
import type { Printer } from '../models/printer'
import type { OrdenServicio } from '../models/orden-servicio'
import type { PrintPaymentRequest } from '../services/POSPrinterService'

const props = defineProps<{
    modelValue: boolean
    orden: OrdenServicio | null
}>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

const visible = ref(props.modelValue)
watch(() => props.modelValue, v => { visible.value = v })
watch(visible, v => emit('update:modelValue', v))

const printerService = usePrinterService()
const posService = new POSPrinterService()
const toast = useToast()

const printers = ref<Printer[]>([])
const selected = ref<Printer | null>(null)
const loadingPrinters = ref(false)
const printing = ref(false)

const fetchPrinters = async () => {
    try {
        loadingPrinters.value = true
        selected.value = null
        const result = await printerService.obtenerPrinters()
        printers.value = result.data
        if (printers.value.length === 1) selected.value = printers.value[0] as any
    } catch {
        toast.showError('No se pudieron cargar las impresoras', 'Error')
    } finally {
        loadingPrinters.value = false
    }
}

const tipoLabel = (p: Printer): string => {
    if (p.tipo === 'serial' || p.tipo === 'usb') return `${p.tipo.toUpperCase()} · ${p.puerto ?? ''}`
    if (p.tipo === 'network') return `Red · ${p.ip ?? ''}${p.puertoRed ? ':' + p.puertoRed : ''}`
    if (p.tipo === 'windows') return `Windows · ${p.windowsName ?? ''}`
    return p.tipo
}

const buildPort = (p: Printer): string => {
    if (p.tipo === 'serial' || p.tipo === 'usb') return p.puerto ?? ''
    if (p.tipo === 'network') return p.ip ?? ''
    if (p.tipo === 'windows') return p.windowsName ?? ''
    return ''
}

const imprimir = async () => {
    if (!selected.value || !props.orden) return
    const orden = props.orden
    const port = buildPort(selected.value)

    if (!port) {
        toast.showWarning('La impresora seleccionada no tiene un puerto configurado', 'Sin puerto')
        return
    }

    try {
        printing.value = true

        const productos = (orden.refacciones ?? []).map(r => ({
            quantity: r.cantidad ?? 1,
            description: r.nombre,
            sku: r.codigo?.toString() ?? '',
            price: r.precio ?? 0,
            total: (r.precio ?? 0) * (r.cantidad ?? 1),
        }))

        const totalPresupuesto = orden.financiero.presupuesto + orden.financiero.revision
        const totalConIva = totalPresupuesto + orden.financiero.iva
        const pagado = orden.financiero.anticipo + orden.financiero.pagos

        const domain = import.meta.env.VITE_MY_DOMAIN || window.location.origin

        const qrData = `${domain}/orden/${orden._id}`

        const request: PrintPaymentRequest = {
            port,
            name: 'SERVICIO TÉCNICO FM VISA',
            address: 'Calle 5 de Febrero #123, Col. Centro, Ciudad',
            taxInfo: 'RFC: FMV123456789',
            phoneNumber: 'Tel: 555-123-4567',
            email: 'fmvisa@gmail.com',
            id: orden.numeroOrden,
            identifier: orden._id ?? '',
            date: new Date().toISOString(),
            subtotal: totalPresupuesto,
            taxes: orden.financiero.iva,
            total: totalConIva,
            change: 0,
            paperWidth: selected.value.ancho,
            openCashDrawer: false,
            customerInfo: orden.cliente ? {
                name: orden.cliente.nombre,
                phoneNumber: orden.cliente.celular || orden.cliente.telefono,
                address: [orden.cliente.domicilio, orden.cliente.colonia, orden.cliente.ciudad]
                    .filter(Boolean).join(', '),
            } : undefined,
            qrCodeData: qrData,
            products: productos,
            payments: pagado > 0 ? [{ name: 'Pagado', amount: pagado }] : [],
            footer: `Estado: ${orden.estadoOrden} · Equipo: ${[orden.equipo?.marca, orden.equipo?.modelo].filter(Boolean).join(' ')}`,
        }

        await posService.printPayment(request)
        toast.showSuccess('Ticket impreso correctamente', 'Impresión Exitosa')
        visible.value = false
    } catch (err: any) {
        const msg = err?.response?.data?.message ?? 'No se pudo imprimir el ticket'
        toast.showError(msg, 'Error de Impresión')
    } finally {
        printing.value = false
    }
}
</script>

<style scoped>
.loading-row,
.empty-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 1.25rem 0;
    color: var(--text-muted);
    font-size: 0.9rem;
}

.printer-list {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.printer-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.65rem 0.85rem;
    border: 1px solid var(--border-subtle);
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.12s ease, border-color 0.12s ease;
}

.printer-item:hover {
    background: var(--surface-hover);
}

.printer-item.selected {
    border-color: var(--icon-accent);
    background: var(--surface-selected);
}

.printer-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: var(--surface-section);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 1.1rem;
    color: var(--icon-accent);
}

.printer-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
}

.printer-name {
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--text-primary);
}

.printer-meta {
    font-size: 0.78rem;
    color: var(--text-muted);
}

.check-icon {
    color: var(--icon-accent);
    font-size: 1.1rem;
    flex-shrink: 0;
}
</style>
