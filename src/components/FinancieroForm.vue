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
                <!-- <div class="financial-row">
                    <label>+ Mano de Obra</label>
                    <InputNumber :modelValue="financiero.manoDeObra" @update:modelValue="updateField('manoDeObra', $event)" mode="currency" currency="USD" locale="en-US" />
                </div> -->
                <!-- <div class="financial-row">
                    <label>+ IVA (16%)</label>
                    <span class="computed-value">{{ formatCurrency(financiero.iva) }}</span>
                </div> -->
                <Divider />
                <small>Pagos</small>
                <div class="financial-row">
                    <label>- Anticipo</label>
                    <InputNumber :modelValue="financiero.anticipo" @update:modelValue="updateField('anticipo', $event)" mode="currency" currency="USD" locale="en-US" />
                </div>
                <div class="financial-row">
                    <label>- Pagos</label>
                    <InputNumber :modelValue="financiero.pagos" @update:modelValue="updateField('pagos', $event)" mode="currency" currency="USD" locale="en-US" />
                </div>
                <!-- <Divider />
                <small>Detalles de pago y restante</small>
                <div class="financial-row">
                    <label class="payment-label">Pago con tarjeta (💳)</label>
                    <span class="computed-value">{{ formatCurrency(financiero.iva) }}</span>
                </div>
                 <div class="financial-row">
                    <label class="payment-label">Pago actual (💲)</label>
                    <span class="computed-value">{{ formatCurrency(financiero.iva) }}</span>
                </div>
                <div class="financial-row">
                    <label>Resto</label>
                    <span class="computed-value">{{ formatCurrency(financiero.iva) }}</span>
                </div> -->
                <Divider />
                <div class="financial-row subtotal">
                    <label>Total a Pagar</label>
                    <span class="computed-value">{{ formatCurrency(calcularSubtotal(financiero)) }}</span>
                </div>
                <div class="financial-row payments">
                    <label>Pagos</label>
                    <span class="computed-value">{{ formatCurrency(calcularPagos(financiero)) }}</span>
                </div>
                <div class="financial-row total">
                    <h2><strong>Saldo</strong></h2>
                    <h2 class="total-value">{{ formatCurrency(calcularSaldo(financiero)) }}</h2>
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import InputNumber from 'primevue/inputnumber'
import Divider from 'primevue/divider'
import { useOrdenServicio } from '../composables/useOrdenServicio'
import type { Financiero, RefaccionItem } from '../models/orden-servicio'

interface Props {
    refacciones: RefaccionItem[]
    financiero: Financiero
    pendiente: string
}

interface Emits {
    (e: 'update:financiero', value: Financiero): void
    (e: 'update:pendiente', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { calcularSubtotal, calcularPagos, calcularSaldo, calcularPresupuesto } = useOrdenServicio()

const formatCurrency = (value: number): string =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

const updateField = (field: keyof Financiero, value: number | null) => {
    emit('update:financiero', { ...props.financiero, [field]: value ?? 0 })
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

.payment-label {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    color: var(--text-payment);
}
</style>
