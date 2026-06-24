<template>
    <div class="conceptos-fijos-section">
        <DataTable :value="conceptos" editMode="cell" @cell-edit-complete="onEditComplete"
            class="p-datatable-sm conceptos-table" stripedRows>
            <Column field="codigo" header="Cód." style="width: 55px; min-width: 55px" frozen>
                <template #body="{ data }">
                    <span class="codigo-badge">{{ data.codigo }}</span>
                </template>
            </Column>
            <Column field="nombre" header="Nombre" style="min-width: 140px" />
            <Column field="precio" header="Precio" style="width: 130px; min-width: 130px">
                <template #body="{ data }">{{ formatCurrency(data.precio) }}</template>
                <template #editor="{ data, field }">
                    <InputNumber v-model="data[field]" mode="currency" currency="USD" locale="en-US"
                        style="width: 100%" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputNumber from 'primevue/inputnumber'
import type { Financiero } from '../models/orden-servicio'

type ConceptoKey = 'revision' | 'anticipo' | 'manoDeObra'

interface ConceptoRow {
    codigo: number
    nombre: string
    aparato: string
    cantidad: number
    precio: number | null
    key: ConceptoKey
}

interface Props {
    financiero: Financiero
}

interface Emits {
    (e: 'update:financiero', value: Financiero): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const conceptos = ref<ConceptoRow[]>([
    { codigo: 1, nombre: 'REVISION', aparato: 'REVISION', cantidad: 1, precio: props.financiero.revision || null, key: 'revision' },
    { codigo: 2, nombre: 'ANTICIPO', aparato: 'ANTICIPO', cantidad: 1, precio: props.financiero.anticipo || null, key: 'anticipo' },
    { codigo: 3, nombre: 'MANO DE OBRA', aparato: 'MANO DE OBRA', cantidad: 1, precio: props.financiero.manoDeObra || null, key: 'manoDeObra' },
])

watch(() => props.financiero, (fin) => {
    conceptos!.value[0]!.precio = fin.revision || null
    conceptos!.value[1]!.precio = fin.anticipo || null
    conceptos!.value[2]!.precio = fin.manoDeObra || null
}, { deep: true })

const onEditComplete = (event: any) => {
    const { data, newValue } = event
    const fila = conceptos.value.find(c => c.codigo === data.codigo)
    if (fila) fila.precio = newValue ?? 0
    emit('update:financiero', { ...props.financiero, [data.key]: newValue ?? 0 })
}

const formatCurrency = (value: number | null): string => {
    if (value == null || value === 0) return '0.00'
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value)
}
</script>
e
<style scoped>
.conceptos-fijos-section {
    flex-shrink: 0;
}

.conceptos-table :deep(.p-datatable-tbody > tr > td) {
    padding: 0.18rem 0.32rem;
    font-size: 13px;
}

.conceptos-table :deep(.p-datatable-thead > tr > th) {
    padding: 0.28rem 0.32rem;
    font-size: 12px;
    white-space: nowrap;
}

.codigo-badge {
    display: inline-block;
    background: #e2e8f0;
    color: #475569;
    border-radius: 3px;
    padding: 1px 5px;
    font-weight: 600;
    font-size: 12px;
}
</style>
