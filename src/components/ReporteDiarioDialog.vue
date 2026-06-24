<template>
    <Dialog
        v-model:visible="visible"
        :header="dialogHeader"
        modal
        :style="{ width: '440px' }"
    >
        <div class="reporte-dialog-body">
            <!-- Selector de tipo de reporte -->
            <div class="field">
                <label>Tipo de reporte</label>
                <SelectButton
                    v-model="tipoReporte"
                    :options="tiposReporte"
                    optionLabel="label"
                    optionValue="value"
                    class="w-full tipo-selector"
                />
            </div>

            <!-- Campos para Entradas -->
            <template v-if="tipoReporte === 'entradas'">
                <div class="field">
                    <label for="fechaReporte">Fecha del reporte</label>
                    <DatePicker
                        id="fechaReporte"
                        v-model="fechaEntrada"
                        dateFormat="dd/mm/yy"
                        showIcon
                        :maxDate="new Date()"
                        placeholder="Selecciona una fecha"
                        class="w-full"
                    />
                </div>
            </template>

            <!-- Campos para Salidas -->
            <template v-else-if="tipoReporte === 'salidas'">
                <div class="field">
                    <label for="fechaInicio">Fecha inicio</label>
                    <DatePicker
                        id="fechaInicio"
                        v-model="fechaInicio"
                        dateFormat="dd/mm/yy"
                        showIcon
                        :maxDate="new Date()"
                        placeholder="Fecha de inicio"
                        class="w-full"
                    />
                </div>
                <div class="field">
                    <label for="fechaFin">Fecha fin <span class="opcional">(opcional)</span></label>
                    <DatePicker
                        id="fechaFin"
                        v-model="fechaFin"
                        dateFormat="dd/mm/yy"
                        showIcon
                        :minDate="fechaInicio ?? undefined"
                        :maxDate="new Date()"
                        placeholder="Fecha de fin (opcional)"
                        class="w-full"
                    />
                </div>
            </template>

            <!-- Campos para Pagos -->
            <template v-else>
                <div class="field">
                    <label>Fecha inicio <span class="req">*</span></label>
                    <DatePicker
                        v-model="pagosInicio"
                        dateFormat="dd/mm/yy"
                        showIcon
                        :maxDate="new Date()"
                        placeholder="Fecha de inicio"
                        class="w-full"
                    />
                </div>
                <div class="field">
                    <label>Fecha fin <span class="opcional">(opcional)</span></label>
                    <DatePicker
                        v-model="pagosFin"
                        dateFormat="dd/mm/yy"
                        showIcon
                        :minDate="pagosInicio ?? undefined"
                        :maxDate="new Date()"
                        placeholder="Fecha de fin (opcional)"
                        class="w-full"
                    />
                </div>
                <div class="field">
                    <label>Tipo <span class="opcional">(opcional)</span></label>
                    <Select
                        v-model="pagosTipo"
                        :options="tiposPago"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Todos los tipos"
                        showClear
                        class="w-full"
                    />
                </div>
                <div class="field">
                    <label>Forma de pago <span class="opcional">(opcional)</span></label>
                    <Select
                        v-model="pagosFormaPago"
                        :options="formasPago"
                        placeholder="Todas las formas"
                        showClear
                        class="w-full"
                    />
                </div>
            </template>
        </div>

        <template #footer>
            <Button label="Cancelar" severity="secondary" text @click="visible = false" />
            <Button
                label="Ver Reporte"
                icon="pi pi-external-link"
                :disabled="!puedeGenerar"
                @click="abrirReporte"
            />
        </template>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import SelectButton from 'primevue/selectbutton'
import Select from 'primevue/select'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', val: boolean): void }>()

const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const tipoReporte = ref<'entradas' | 'salidas' | 'pagos'>('entradas')
const tiposReporte = [
    { label: 'Entradas', value: 'entradas' },
    { label: 'Salidas',  value: 'salidas'  },
    { label: 'Pagos',    value: 'pagos'    }
]

const dialogHeader = computed(() => {
    if (tipoReporte.value === 'entradas') return 'Reporte Diario de Entrada de Equipos'
    if (tipoReporte.value === 'salidas')  return 'Reporte de Salidas de Equipos'
    return 'Reporte de Pagos'
})

// Entradas
const fechaEntrada = ref<Date | null>(new Date())

// Salidas
const fechaInicio  = ref<Date | null>(new Date())
const fechaFin     = ref<Date | null>(null)

// Pagos
const pagosInicio     = ref<Date | null>(new Date())
const pagosFin        = ref<Date | null>(null)
const pagosTipo       = ref<string | null>(null)
const pagosFormaPago  = ref<string | null>(null)

const tiposPago  = [
    { label: 'Pago',     value: 'pago'     },
    { label: 'Anticipo', value: 'anticipo' }
]
const formasPago = ['Efectivo', 'Tarjeta', 'Cheque', 'Transferencia', 'Otro']

const puedeGenerar = computed(() => {
    if (tipoReporte.value === 'entradas') return !!fechaEntrada.value
    if (tipoReporte.value === 'salidas')  return !!fechaInicio.value
    return !!pagosInicio.value
})

function toIsoDateStr(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const abrirReporte = () => {
    if (tipoReporte.value === 'entradas') {
        if (!fechaEntrada.value) return
        window.open(`/reporte-diario?fecha=${toIsoDateStr(fechaEntrada.value)}`, '_blank')
    } else if (tipoReporte.value === 'salidas') {
        if (!fechaInicio.value) return
        const params = new URLSearchParams({ fechaInicio: toIsoDateStr(fechaInicio.value) })
        if (fechaFin.value) params.set('fechaFin', toIsoDateStr(fechaFin.value))
        window.open(`/reporte-salidas?${params.toString()}`, '_blank')
    } else {
        if (!pagosInicio.value) return
        const params = new URLSearchParams({ fechaInicio: toIsoDateStr(pagosInicio.value) })
        if (pagosFin.value)       params.set('fechaFin',    toIsoDateStr(pagosFin.value))
        if (pagosTipo.value)      params.set('tipo',         pagosTipo.value)
        if (pagosFormaPago.value) params.set('formaPago',    pagosFormaPago.value)
        window.open(`/reporte-pagos?${params.toString()}`, '_blank')
    }
    visible.value = false
}
</script>

<style scoped>
.reporte-dialog-body {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0.5rem 0;
}
.field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}
.field label {
    font-weight: 600;
    font-size: 0.9rem;
}
.opcional {
    font-weight: 400;
    font-size: 0.8rem;
    color: var(--p-text-muted-color, #6b7280);
}
.req { color: #ef4444; }
.tipo-selector {
    display: flex;
}
:deep(.tipo-selector .p-selectbutton) {
    width: 100%;
    display: flex;
}
:deep(.tipo-selector .p-selectbutton .p-button) {
    flex: 1;
    justify-content: center;
}
</style>
