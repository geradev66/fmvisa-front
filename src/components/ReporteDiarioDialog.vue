<template>
    <Dialog
        v-model:visible="visible"
        :header="tipoReporte === 'entradas' ? 'Reporte Diario de Entrada de Equipos' : 'Reporte de Salidas de Equipos'"
        modal
        :style="{ width: '420px' }"
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
            <template v-else>
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

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', val: boolean): void }>()

const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const tipoReporte = ref<'entradas' | 'salidas'>('entradas')
const tiposReporte = [
    { label: 'Entradas', value: 'entradas' },
    { label: 'Salidas',  value: 'salidas'  }
]

const fechaEntrada = ref<Date | null>(new Date())
const fechaInicio  = ref<Date | null>(new Date())
const fechaFin     = ref<Date | null>(null)

const puedeGenerar = computed(() =>
    tipoReporte.value === 'entradas' ? !!fechaEntrada.value : !!fechaInicio.value
)

function toIsoDateStr(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const abrirReporte = () => {
    if (tipoReporte.value === 'entradas') {
        if (!fechaEntrada.value) return
        window.open(`/reporte-diario?fecha=${toIsoDateStr(fechaEntrada.value)}`, '_blank')
    } else {
        if (!fechaInicio.value) return
        const params = new URLSearchParams({ fechaInicio: toIsoDateStr(fechaInicio.value) })
        if (fechaFin.value) params.set('fechaFin', toIsoDateStr(fechaFin.value))
        window.open(`/reporte-salidas?${params.toString()}`, '_blank')
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

