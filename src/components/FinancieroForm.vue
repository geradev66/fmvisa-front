<template>
    <Card class="section-card financiero-card">
        <template #title>
            <div class="card-title">
                <i class="pi pi-dollar"></i>
                <span>Resumen Financiero</span>
            </div>
        </template>
        <template #content>
            <div class="financial-grid">
                <small>Cobros</small>
                <div class="financial-row">
                    <label>+ Presupuesto</label>
                    <span class="computed-value">{{ formatCurrency(calcularPresupuesto(refacciones, financiero)) }}</span>
                </div>
                <div class="financial-row">
                    <label>+ Revisión</label>
                    <InputNumber :modelValue="financiero.revision" @update:modelValue="updateField('revision', $event)" mode="currency" currency="USD" locale="en-US" />
                </div>

                <Divider />

                <div class="pagos-header">
                    <small>Pagos</small>
                    <Button
                        icon="pi pi-plus"
                        size="small"
                        text
                        rounded
                        @click="abrirDialogoPago"
                        :disabled="!ordenId"
                        v-tooltip="ordenId ? 'Registrar pago' : 'Guarde la orden primero'"
                        class="btn-add-pago"
                    />
                </div>

                <div class="pagos-list">
                    <div v-if="pagosList.length === 0" class="pagos-empty">Sin pagos registrados</div>
                    <div v-for="pago in pagosList" :key="pago._id" class="pago-row">
                        <div class="pago-info">
                            <span class="pago-forma"> {{pago.tipo == 'anticipo' ? 'Anticipo en ' : 'Pago en '}} {{ pago.formaPago }}</span>
                            <span v-if="pago.ordenServicioRefaccionInternalId" class="pago-ref-tag">
                                <i class="pi pi-box" style="font-size:0.65rem"></i>
                                {{ getRefaccionNombre(pago.ordenServicioRefaccionInternalId) }}
                            </span>
                            <span class="pago-fecha">{{ formatFecha(pago.fecha) }}</span>
                        </div>
                        <span class="pago-monto">{{ formatCurrency(pago.monto) }}</span>
                        <Button
                            icon="pi pi-times"
                            severity="danger"
                            text
                            rounded
                            size="small"
                            :loading="deletingId === pago._id"
                            :disabled="!!deletingId"
                            @click="confirmarEliminar(pago)"
                            class="btn-delete-pago"
                            v-tooltip="'Eliminar pago'"
                        />
                    </div>
                </div>

                <Divider />

                <div class="financial-row subtotal">
                    <label>Total a Pagar</label>
                    <span class="computed-value">{{ formatCurrency(calcularSubtotal(refacciones, financiero)) }}</span>
                </div>
                <div class="financial-row payments">
                    <label>Pagos</label>
                    <span class="computed-value">{{ formatCurrency(totalPagado) }}</span>
                </div>
                <div class="financial-row total">
                    <h2><strong>Saldo</strong></h2>
                    <h2 class="total-value">{{ formatCurrency(calcularSubtotal(refacciones, financiero) - totalPagado) }}</h2>
                </div>
            </div>
        </template>
    </Card>

    <!-- Diálogo: Registrar Pago -->
    <Dialog v-model:visible="dialogoPagoVisible" header="Registrar Pago" :modal="true" :style="{ width: '360px' }">
        <div class="nuevo-pago-form">
            <div class="campo">
                <label>Monto <span class="req">*</span></label>
                <InputNumber
                    v-model="nuevoPago.monto"
                    mode="currency"
                    currency="USD"
                    locale="en-US"
                    class="w-full"
                    :min="0.01"
                />
                <p v-if="erroresPago.monto" class="error-msg">{{ erroresPago.monto }}</p>
            </div>
            <div class="campo">
                <label>Forma de Pago <span class="req">*</span></label>
                <Select
                    v-model="nuevoPago.formaPago"
                    :options="formasPago"
                    class="w-full"
                    placeholder="Seleccionar..."
                />
                <p v-if="erroresPago.formaPago" class="error-msg">{{ erroresPago.formaPago }}</p>
            </div>
            <div v-if="nuevoPago.formaPago === 'Cheque' || nuevoPago.formaPago === 'Transferencia'" class="campo">
                <label>Referencia</label>
                <InputText v-model="nuevoPago.referencia" class="w-full" placeholder="Núm. cheque / referencia" />
            </div>
            <div class="campo">
                <label>Notas</label>
                <InputText v-model="nuevoPago.notas" class="w-full" />
            </div>
            <div class="campo">
                <label>Fecha</label>
                <DatePicker v-model="nuevoPago.fecha" showIcon class="w-full" />
            </div>
        </div>
        <template #footer>
            <Button label="Cancelar" severity="secondary" @click="dialogoPagoVisible = false" :disabled="guardandoPago" />
            <Button label="Registrar" icon="pi pi-check" @click="guardarPago" :loading="guardandoPago" />
        </template>
    </Dialog>

    <!-- Diálogo: Confirmar eliminación -->
    <Dialog v-model:visible="dialogoConfirmarVisible" header="Eliminar Pago" :modal="true" :closable="false" :style="{ width: '340px' }">
        <div style="display: flex; align-items: flex-start; gap: 0.75rem; line-height: 1.6;">
            <i class="pi pi-exclamation-triangle" style="font-size: 1.4rem; color: #ef4444; flex-shrink: 0; margin-top: 0.1rem;"></i>
            <p style="margin: 0; font-size: 0.88rem;">
                ¿Eliminar el pago de <strong>{{ pagoAEliminar ? formatCurrency(pagoAEliminar.monto) : '' }}</strong>
                ({{ pagoAEliminar?.formaPago }})? Esta acción no se puede deshacer.
            </p>
        </div>
        <template #footer>
            <Button label="Cancelar" severity="secondary" text @click="dialogoConfirmarVisible = false" />
            <Button label="Eliminar" icon="pi pi-trash" severity="danger" @click="eliminarPago" :loading="!!deletingId" />
        </template>
    </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from 'primevue/card'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Divider from 'primevue/divider'
import { useOrdenServicio } from '../composables/useOrdenServicio'
import { usePagoService } from '../composables/usePagoService'
import type { Financiero, RefaccionItem } from '../models/orden-servicio'
import type { Pago, CrearPagoDTO } from '../models/pago'

interface Props {
    refacciones: RefaccionItem[]
    financiero: Financiero
    pendiente: string
    ordenId: string | null
    pagosList: Pago[]
    totalPagado: number
}

interface Emits {
    (e: 'update:financiero', value: Financiero): void
    (e: 'update:pendiente', value: string): void
    (e: 'pagosChanged'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const pagoService = usePagoService()
const { calcularSubtotal, calcularPresupuesto } = useOrdenServicio()

const formasPago = ['Efectivo', 'Tarjeta', 'Cheque', 'Transferencia', 'Otro']

// ── Formato ──
const formatCurrency = (value: number): string =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value ?? 0)

const formatFecha = (fecha: string | Date | undefined): string => {
    if (!fecha) return ''
    const d = typeof fecha === 'string' ? new Date(fecha) : fecha
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

const updateField = (field: keyof Financiero, value: number | null) => {
    emit('update:financiero', { ...props.financiero, [field]: value ?? 0 })
}

// ── Helpers ──
function getRefaccionNombre(internalId: string): string {
    const ref = props.refacciones.find(r => r.internalId === internalId)
    return ref ? ref.nombre : 'Refacción'
}

// ── Nuevo pago ──
const dialogoPagoVisible = ref(false)
const guardandoPago = ref(false)
const erroresPago = ref<{ monto?: string; formaPago?: string }>({})

const nuevoPago = ref<{ monto: number | null; formaPago: string; referencia: string; notas: string; fecha: Date }>({
    monto: null,
    formaPago: '',
    referencia: '',
    notas: '',
    fecha: new Date()
})

const abrirDialogoPago = () => {
    nuevoPago.value = { monto: null, formaPago: '', referencia: '', notas: '', fecha: new Date() }
    erroresPago.value = {}
    dialogoPagoVisible.value = true
}

const guardarPago = async () => {
    erroresPago.value = {}
    if (!nuevoPago.value.monto || nuevoPago.value.monto <= 0) {
        erroresPago.value.monto = 'El monto debe ser mayor a 0.'
        return
    }
    if (!nuevoPago.value.formaPago) {
        erroresPago.value.formaPago = 'Seleccione una forma de pago.'
        return
    }

    guardandoPago.value = true
    try {
        const dto: CrearPagoDTO = {
            monto: nuevoPago.value.monto,
            formaPago: nuevoPago.value.formaPago,
            referencia: nuevoPago.value.referencia || undefined,
            notas: nuevoPago.value.notas || undefined,
            fecha: nuevoPago.value.fecha
                ? nuevoPago.value.fecha.toISOString().split('T')[0]
                : undefined
        }
        await pagoService.crearPago(props.ordenId!, dto)
        dialogoPagoVisible.value = false
        emit('pagosChanged')
    } catch (e) {
        console.error('Error al registrar pago', e)
        erroresPago.value.monto = 'Error al registrar el pago. Intenta de nuevo.'
    } finally {
        guardandoPago.value = false
    }
}

// ── Eliminar pago ──
const deletingId = ref<string | null>(null)
const dialogoConfirmarVisible = ref(false)
const pagoAEliminar = ref<Pago | null>(null)

const confirmarEliminar = (pago: Pago) => {
    pagoAEliminar.value = pago
    dialogoConfirmarVisible.value = true
}

const eliminarPago = async () => {
    if (!pagoAEliminar.value?._id) return
    deletingId.value = pagoAEliminar.value._id
    try {
        const pagoId = pagoAEliminar.value._id
        await pagoService.eliminarPago(pagoId)
        dialogoConfirmarVisible.value = false
        // Si era el anticipo, limpiar los campos de anticipo en financiero
        if (pagoId === props.financiero.anticipoPagoId) {
            emit('update:financiero', {
                ...props.financiero,
                anticipo: 0,
                anticipoPagoId: undefined,
                anticipoFormaPago: undefined,
                anticipoReferencia: undefined,
                anticipoNotas: undefined,
            })
        }
        emit('pagosChanged')
    } catch (e) {
        console.error('Error al eliminar pago', e)
    } finally {
        deletingId.value = null
        pagoAEliminar.value = null
    }
}
</script>

<style scoped>
.financiero-card {
    flex: 1;
    min-height: 0;
    overflow: hidden;
}

.card-title {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: var(--card-title-font-size);
    font-weight: 600;
    color: var(--text-primary);
}

.card-title i {
    color: var(--icon-accent);
    font-size: var(--card-title-font-size);
}

.financial-grid {
    display: flex;
    flex-direction: column;
    gap: 0.28rem;
    height: 100%;
}

.financial-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.4rem;
}

.financial-row label {
    font-size: var(--card-title-font-size);
    color: var(--text-secondary);
    flex-shrink: 0;
}

.financial-row :deep(.p-inputnumber) {
    width: 115px;
    max-width: 115px;
    flex-shrink: 0;
}

.financial-row :deep(.p-inputnumber-input) {
    width: 100%;
    font-size: var(--card-title-font-size);
    padding: 0.18rem 0.32rem;
    height: 28px;
    text-align: right;
}

.financial-row.subtotal {
    margin-top: auto;
}

.financial-row.payments {
    font-size: small;
}

.total-value {
    font-weight: 700;
    color: var(--text-primary);
}

.computed-value {
    font-size: var(--card-title-font-size);
    font-weight: 500;
    color: var(--text-primary);
    min-width: 115px;
    text-align: right;
}

:deep(.p-divider) {
    margin: 0.3rem 0;
}

/* ── Pagos section ── */
.pagos-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.25rem;
}

.btn-add-pago {
    width: 22px !important;
    height: 22px !important;
    padding: 0 !important;
}

.btn-add-pago :deep(.p-button-icon) {
    font-size: 11px;
}

.pagos-list {
    display: flex;
    flex-direction: column;
    gap: 0.18rem;
    max-height: 130px;
    overflow-y: auto;
}

.pagos-empty {
    font-size: 11px;
    color: var(--text-muted);
    text-align: center;
    padding: 0.35rem 0;
}

.pago-row {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.18rem 0.3rem;
    border-radius: 4px;
    background: var(--surface-section, rgba(0,0,0,0.03));
    font-size: 14px;
}

.pago-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.pago-forma {
    font-weight: 600;
    font-size: 11px;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.pago-fecha {
    font-size: 10px;
    color: var(--text-muted);
}

.pago-ref-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    font-size: 9px;
    font-weight: 600;
    background: #e8edff;
    color: #3b5bdb;
    padding: 1px 5px;
    border-radius: 8px;
    white-space: nowrap;
}

.pago-monto {
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    font-size: 11px;
}

.btn-delete-pago {
    width: 18px !important;
    height: 18px !important;
    padding: 0 !important;
    flex-shrink: 0;
}

.btn-delete-pago :deep(.p-button-icon) {
    font-size: 9px;
}

/* ── Dialog nuevo pago ── */
.nuevo-pago-form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.campo {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
}

.campo label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
}

.w-full {
    width: 100%;
}

.req {
    color: #ef4444;
}

.error-msg {
    color: #ef4444;
    font-size: 12px;
    margin: 0;
}
</style>
