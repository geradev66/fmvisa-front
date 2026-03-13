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
                <div class="financial-row">
                    <label>Presupuesto</label>
                    <InputNumber :modelValue="financiero.presupuesto" @update:modelValue="updateField('presupuesto', $event)" mode="currency" currency="USD" locale="en-US" />
                </div>
                <div class="financial-row">
                    <label>Revisión</label>
                    <InputNumber :modelValue="financiero.revision" @update:modelValue="updateField('revision', $event)" mode="currency" currency="USD" locale="en-US" />
                </div>
                <div class="financial-row">
                    <label>Anticipo</label>
                    <InputNumber :modelValue="financiero.anticipo" @update:modelValue="updateField('anticipo', $event)" mode="currency" currency="USD" locale="en-US" />
                </div>
                <div class="financial-row">
                    <label>Pagos</label>
                    <InputNumber :modelValue="financiero.pagos" @update:modelValue="updateField('pagos', $event)" mode="currency" currency="USD" locale="en-US" />
                </div>
                <div class="financial-row">
                    <label>IVA</label>
                    <InputNumber :modelValue="financiero.iva" @update:modelValue="updateField('iva', $event)" mode="currency" currency="USD" locale="en-US" />
                </div>
                <Divider />
                <div class="financial-row total">
                    <label><strong>Total</strong></label>
                    <span class="total-value">${{ calcularSubtotal(financiero).toFixed(2) }}</span>
                </div>
            </div>
        </template>
    </Card>
    <Pendiente/>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import InputNumber from 'primevue/inputnumber'
import Divider from 'primevue/divider'
import { useOrdenServicio } from '../composables/useOrdenServicio'
import type { Financiero } from '../models/orden-servicio'
import Pendiente from './Pendiente.vue'

interface Props {
    financiero: Financiero
    pendiente: string
}

interface Emits {
    (e: 'update:financiero', value: Financiero): void
    (e: 'update:pendiente', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { calcularSubtotal } = useOrdenServicio()

const updateField = (field: keyof Financiero, value: number | null) => {
    emit('update:financiero', { ...props.financiero, [field]: value ?? 0 })
}
</script>

<style scoped>
.financiero-card {
    flex-shrink: 0;
    flex-grow: 0;
}

.card-title {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: var(--card-title-font-size);
    font-weight: 600;
    color: #1e293b;
}

.card-title i {
    color: #3b82f6;
    font-size: var(--card-title-font-size);
}

.financial-grid {
    display: flex;
    flex-direction: column;
    gap: 0.28rem;
}

.financial-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.4rem;
}

.financial-row label {
    font-size: var(--card-title-font-size);
    color: #475569;
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

.financial-row.total {
    margin-top: 0.15rem;
}

.total-value {
    font-size: var(--card-title-font-size);
    font-weight: 700;
    color: #1e293b;
}

:deep(.p-divider) {
    margin: 0.3rem 0;
}
</style>
