<template>
    <Dialog v-model:visible="visible" header="Configuración de Impresoras" modal :style="{ width: '680px' }"
        :breakpoints="{ '720px': '95vw' }">

        <!-- List view -->
        <div v-if="!formVisible" class="printers-container">
            <div class="toolbar">
                <div class="service-status">
                    <span v-if="checkingHealth" class="status-chip status-checking">
                        <i class="pi pi-spin pi-spinner" />
                        Verificando servicio...
                    </span>
                    <span v-else-if="serviceOnline === true" class="status-chip status-online">
                        <i class="pi pi-check-circle" />
                        Servicio en línea
                    </span>
                    <span v-else-if="serviceOnline === false" class="status-chip status-offline">
                        <i class="pi pi-times-circle" />
                        Servicio sin conexión
                    </span>
                </div>
                <Button label="Nueva Impresora" icon="pi pi-plus" size="small" @click="openNew" :loading="loading" />
            </div>

            <DataTable :value="printers" :loading="loading" stripedRows class="p-datatable-sm"
                emptyMessage="No hay impresoras configuradas.">
                <Column field="nombre" header="Nombre" />
                <Column field="tipo" header="Tipo" style="width: 100px">
                    <template #body="{ data }">
                        <Tag :value="data.tipo" severity="secondary" />
                    </template>
                </Column>
                <Column field="ancho" header="Ancho" style="width: 80px">
                    <template #body="{ data }">
                        <span>{{ data.ancho }} mm</span>
                    </template>
                </Column>
                <Column header="Conexión" style="min-width: 140px">
                    <template #body="{ data }">
                        <span v-if="data.tipo === 'serial' || data.tipo === 'usb'">{{ data.puerto }}</span>
                        <span v-else-if="data.tipo === 'network'">{{ data.ip }}{{ data.puertoRed ? ':' + data.puertoRed : '' }}</span>
                        <span v-else-if="data.tipo === 'windows'">{{ data.windowsName }}</span>
                        <span v-else>—</span>
                    </template>
                </Column>
                <Column header="Acciones" style="width: 120px; text-align: right">
                    <template #body="{ data }">
                        <Button icon="pi pi-print" text rounded size="small" severity="info" v-tooltip="'Imprimir test'" :loading="testingId === data._id" @click="testPrint(data)" />
                        <Button icon="pi pi-pencil" text rounded size="small" @click="openEdit(data)" />
                        <Button icon="pi pi-trash" text rounded size="small" severity="danger" @click="confirmDelete(data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <!-- Form view (add / edit) -->
        <div v-else class="printer-form">
            <div class="form-title">
                <i :class="editingPrinter ? 'pi pi-pencil' : 'pi pi-plus'"></i>
                <span>{{ editingPrinter ? 'Editar Impresora' : 'Nueva Impresora' }}</span>
            </div>

            <div class="form-grid">
                <!-- Nombre -->
                <div class="field">
                    <label>Nombre <span class="required">*</span></label>
                    <InputText v-model="form.nombre" placeholder="Ej: Caja Principal" :invalid="!!errors.nombre" fluid />
                    <small class="error" v-if="errors.nombre">{{ errors.nombre }}</small>
                </div>

                <!-- Tipo -->
                <div class="field">
                    <label>Tipo <span class="required">*</span></label>
                    <Select v-model="form.tipo" :options="tipoOptions" optionLabel="label" optionValue="value"
                        placeholder="Selecciona tipo" :invalid="!!errors.tipo" fluid />
                    <small class="error" v-if="errors.tipo">{{ errors.tipo }}</small>
                </div>

                <!-- Puerto — serial / usb -->
                <div class="field" v-if="form.tipo === 'serial' || form.tipo === 'usb'">
                    <label>{{ form.tipo === 'usb' ? 'Nombre Impresora USB' : 'Puerto Serial' }} <span class="required">*</span></label>
                    <InputText v-model="form.puerto" :placeholder="form.tipo === 'usb' ? 'Ej: EPSON TM-T20' : 'Ej: COM3'" :invalid="!!errors.puerto" fluid />
                    <small class="error" v-if="errors.puerto">{{ errors.puerto }}</small>
                </div>

                <!-- USB extra fields -->
                <!-- <template v-if="form.tipo === 'usb'">
                    <div class="field">
                        <label>Vendor ID</label>
                        <InputText v-model="form.vendorId" placeholder="Ej: 0x04b8" fluid />
                    </div>
                    <div class="field">
                        <label>Product ID</label>
                        <InputText v-model="form.productId" placeholder="Ej: 0x0202" fluid />
                    </div>
                </template> -->

                <!-- Network fields -->
                <template v-if="form.tipo === 'network'">
                    <div class="field">
                        <label>Dirección IP <span class="required">*</span></label>
                        <InputText v-model="form.ip" placeholder="Ej: 192.168.1.100" :invalid="!!errors.ip" fluid />
                        <small class="error" v-if="errors.ip">{{ errors.ip }}</small>
                    </div>
                    <div class="field">
                        <label>Puerto de Red</label>
                        <InputText v-model="form.puertoRed" placeholder="Ej: 9100" fluid />
                    </div>
                </template>

                <!-- Windows name -->
                <div class="field" v-if="form.tipo === 'windows'">
                    <label>Nombre en Windows <span class="required">*</span></label>
                    <InputText v-model="form.windowsName" placeholder="Ej: EPSON TM-T20" :invalid="!!errors.windowsName" fluid />
                    <small class="error" v-if="errors.windowsName">{{ errors.windowsName }}</small>
                </div>

                <!-- Ancho de papel -->
                <div class="field">
                    <label>Ancho de papel <span class="required">*</span></label>
                    <Select v-model="form.ancho" :options="anchoOptions" optionLabel="label" optionValue="value"
                        placeholder="Selecciona ancho" fluid />
                </div>
            </div>

            <div class="form-actions">
                <Button label="Cancelar" severity="secondary" outlined @click="cancelForm" :disabled="saving" />
                <Button :label="editingPrinter ? 'Guardar Cambios' : 'Agregar'"
                    :icon="editingPrinter ? 'pi pi-save' : 'pi pi-plus'"
                    @click="submitForm" :loading="saving" />
            </div>
        </div>

        <!-- Inline confirm delete -->
        <Dialog v-model:visible="confirmVisible" header="Confirmar eliminación" modal :style="{ width: '360px' }" :closable="false">
            <div style="display:flex; align-items:flex-start; gap:0.75rem;">
                <i class="pi pi-exclamation-triangle" style="font-size:1.5rem; color:#f59e0b; flex-shrink:0; margin-top:0.1rem;"></i>
                <span>¿Eliminar la impresora <strong>"{{ printerToDelete?.nombre }}"</strong>?</span>
            </div>
            <template #footer>
                <Button label="Cancelar" severity="secondary" outlined @click="confirmVisible = false" :disabled="deleting" />
                <Button label="Eliminar" icon="pi pi-trash" severity="danger" @click="executeDelete" :loading="deleting" />
            </template>
        </Dialog>

        <template #footer v-if="!formVisible">
            <Button label="Cerrar" severity="secondary" outlined @click="visible = false" />
        </template>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import { usePrinterService } from '../composables/usePrinterService'
import { useToast } from '../composables/useToast'
import { POSPrinterService } from '../services/POSPrinterService'
import type { Printer, CrearPrinterDTO, ActualizarPrinterDTO } from '../models/printer'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

const visible = ref(props.modelValue)
watch(() => props.modelValue, v => { visible.value = v })
watch(visible, v => emit('update:modelValue', v))

const printerService = usePrinterService()
const posService = new POSPrinterService()
const toast = useToast()

// ── State ──
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const testingId = ref<string | null>(null)
const checkingHealth = ref(false)
const serviceOnline = ref<boolean | null>(null)
const printers = ref<Printer[]>([])
const formVisible = ref(false)
const editingPrinter = ref<Printer | null>(null)
const confirmVisible = ref(false)
const printerToDelete = ref<Printer | null>(null)

type PrinterTipo = Printer['tipo']

const emptyForm = (): CrearPrinterDTO => ({
    nombre: '',
    tipo: 'serial',
    ancho: 80,
    puerto: '',
    ip: '',
    puertoRed: '',
    windowsName: '',
    vendorId: '',
    productId: '',
})

const anchoOptions: { label: string; value: 58 | 80 | 112 }[] = [
    { label: '58 mm',  value: 58  },
    { label: '80 mm',  value: 80  },
    { label: '112 mm', value: 112 },
]

const form = ref<CrearPrinterDTO>(emptyForm())
const errors = ref<Partial<Record<keyof CrearPrinterDTO, string>>>({})

const tipoOptions: { label: string; value: PrinterTipo }[] = [
    { label: 'Serial (COM)',    value: 'serial'  },
    { label: 'USB',            value: 'usb'     },
    { label: 'Red (Network)',  value: 'network' },
    { label: 'Windows',       value: 'windows' },
]

// ── Load printers when dialog opens ──
watch(visible, async (open) => {
    if (open) {
        await Promise.all([fetchPrinters(), checkServiceHealth()])
    }
})

onMounted(async () => {
    if (visible.value) {
        await Promise.all([fetchPrinters(), checkServiceHealth()])
    }
})

const fetchPrinters = async () => {
    try {
        loading.value = true
        const result = await printerService.obtenerPrinters()
        printers.value = result.data
    } catch {
        toast.showError('No se pudieron cargar las impresoras', 'Error')
    } finally {
        loading.value = false
    }
}

const checkServiceHealth = async () => {
    try {
        checkingHealth.value = true
        await posService.checkHealth()
        serviceOnline.value = true
        toast.showSuccess('El servicio de impresión está en línea', 'Servicio conectado')
    } catch {
        serviceOnline.value = false
        toast.showError('No se pudo conectar con el servicio de impresión', 'Servicio sin conexión')
    } finally {
        checkingHealth.value = false
    }
}

// ── Actions ──
const openNew = () => {
    editingPrinter.value = null
    form.value = emptyForm()
    errors.value = {}
    formVisible.value = true
}

const openEdit = (printer: Printer) => {
    editingPrinter.value = printer
    form.value = {
        nombre: printer.nombre,
        tipo: printer.tipo,
        ancho: printer.ancho ?? 80,
        puerto: printer.puerto ?? '',
        ip: printer.ip ?? '',
        puertoRed: printer.puertoRed ?? '',
        windowsName: printer.windowsName ?? '',
        vendorId: printer.vendorId ?? '',
        productId: printer.productId ?? '',
    }
    errors.value = {}
    formVisible.value = true
}

const cancelForm = () => {
    formVisible.value = false
    editingPrinter.value = null
}

const validate = (): boolean => {
    errors.value = {}
    if (!form.value.nombre.trim()) errors.value.nombre = 'El nombre es requerido'
    if (!form.value.tipo)          errors.value.tipo   = 'El tipo es requerido'
    if ((form.value.tipo === 'serial' || form.value.tipo === 'usb') && !form.value.puerto?.trim())
        errors.value.puerto = 'El puerto es requerido'
    if (form.value.tipo === 'network' && !form.value.ip?.trim())
        errors.value.ip = 'La IP es requerida'
    if (form.value.tipo === 'windows' && !form.value.windowsName?.trim())
        errors.value.windowsName = 'El nombre de Windows es requerido'
    return Object.keys(errors.value).length === 0
}

const submitForm = async () => {
    if (!validate()) return
    try {
        saving.value = true
        if (editingPrinter.value?._id) {
            const dto: ActualizarPrinterDTO = { ...form.value }
            await printerService.actualizarPrinter(editingPrinter.value._id, dto)
            toast.showSuccess('Impresora actualizada correctamente', 'Actualizada')
        } else {
            await printerService.crearPrinter(form.value)
            toast.showSuccess('Impresora agregada correctamente', 'Creada')
        }
        formVisible.value = false
        editingPrinter.value = null
        await fetchPrinters()
    } catch {
        toast.showError('No se pudo guardar la impresora', 'Error')
    } finally {
        saving.value = false
    }
}

const confirmDelete = (printer: Printer) => {
    printerToDelete.value = printer
    confirmVisible.value = true
}

const buildPort = (p: Printer): string => {
    if (p.tipo === 'serial' || p.tipo === 'usb') return p.puerto ?? ''
    if (p.tipo === 'network') return p.ip ?? ''
    if (p.tipo === 'windows') return p.windowsName ?? ''
    return ''
}

const testPrint = async (printer: Printer) => {
    const port = buildPort(printer)
    if (!port) {
        toast.showWarning('La impresora no tiene un puerto configurado', 'Sin puerto')
        return
    }
    try {
        testingId.value = printer._id ?? null
        await posService.testPrint({
            port,
            ...(printer.tipo === 'usb' && { connectionType: 'Usb', usbPrinterName: printer.nombre })
        })
        toast.showSuccess(`Test enviado a "${printer.nombre}" correctamente`, 'Test exitoso')
    } catch (err: any) {
        const msg = err?.response?.data?.message ?? 'No se pudo conectar con la impresora'
        toast.showError(msg, 'Error de Impresión')
    } finally {
        testingId.value = null
    }
}

const executeDelete = async () => {
    if (!printerToDelete.value?._id) return
    try {
        deleting.value = true
        await printerService.eliminarPrinter(printerToDelete.value._id)
        toast.showSuccess('Impresora eliminada', 'Eliminada')
        confirmVisible.value = false
        printerToDelete.value = null
        await fetchPrinters()
    } catch {
        toast.showError('No se pudo eliminar la impresora', 'Error')
    } finally {
        deleting.value = false
    }
}
</script>

<style scoped>
.printers-container {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
}

.service-status {
    display: flex;
    align-items: center;
}

.status-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.8rem;
    font-weight: 500;
    padding: 0.25rem 0.65rem;
    border-radius: 999px;
    border: 1px solid transparent;
}

.status-checking {
    background-color: var(--surface-section);
    border-color: var(--border-subtle);
    color: var(--text-muted);
}

.status-online {
    background-color: #dcfce7;
    border-color: #86efac;
    color: #166534;
}

.status-offline {
    background-color: #fee2e2;
    border-color: #fca5a5;
    color: #991b1b;
}

:root.dark .status-online {
    background-color: #14532d;
    border-color: #166534;
    color: #86efac;
}

:root.dark .status-offline {
    background-color: #450a0a;
    border-color: #991b1b;
    color: #fca5a5;
}

.printer-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--text-primary);
}

.form-grid {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.field label {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-secondary);
}

.required {
    color: #ef4444;
}

.error {
    color: #ef4444;
    font-size: 0.78rem;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding-top: 0.25rem;
}
</style>

