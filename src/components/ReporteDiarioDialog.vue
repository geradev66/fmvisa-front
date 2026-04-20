<template>
    <Dialog v-model:visible="visible" header="Reporte Diario de Entrada de Equipos" modal :style="{ width: '380px' }">
        <div class="reporte-dialog-body">
            <div class="field">
                <label for="fechaReporte">Fecha del reporte</label>
                <DatePicker
                    id="fechaReporte"
                    v-model="fechaSeleccionada"
                    dateFormat="dd/mm/yy"
                    showIcon
                    :maxDate="new Date()"
                    placeholder="Selecciona una fecha"
                    class="w-full"
                />
            </div>
        </div>
        <template #footer>
            <Button label="Cancelar" severity="secondary" text @click="visible = false" />
            <Button
                label="Ver Reporte"
                icon="pi pi-external-link"
                :disabled="!fechaSeleccionada"
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

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', val: boolean): void }>()

const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const fechaSeleccionada = ref<Date | null>(new Date())

const abrirReporte = () => {
    if (!fechaSeleccionada.value) return
    const year  = fechaSeleccionada.value.getFullYear()
    const month = String(fechaSeleccionada.value.getMonth() + 1).padStart(2, '0')
    const day   = String(fechaSeleccionada.value.getDate()).padStart(2, '0')
    const fechaStr = `${year}-${month}-${day}`
    window.open(`/reporte-diario?fecha=${fechaStr}`, '_blank')
    visible.value = false
}
</script>

<style scoped>
.reporte-dialog-body {
    padding: 0.5rem 0;
}
.field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
.field label {
    font-weight: 600;
    font-size: 0.9rem;
}
</style>
