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
            <Column field="precio" header="Importe" style="width: 300px; min-width: 160px">
                <template #body="{ data }">
                    <div class="importe-cell">
                        <span>{{ formatCurrency(data.precio) }}</span>
                        <Button v-if="data.key === 'anticipo'" icon="pi pi-credit-card" size="small"
                            text rounded severity="warn"
                            v-tooltip.top="'Detalle del anticipo'"
                            @click.stop="abrirDialogoAnticipo" />
                        <span  v-if="data.key === 'anticipo' && props.financiero.anticipoFormaPago" class="text-xs text-gray-500">
                            {{ props.financiero.anticipoFormaPago ?? 'SIN FORMA DE PAGO' }} {{ props.financiero.anticipoReferencia ? `- ${props.financiero.anticipoReferencia}` : '' }}
                        </span>
                    </div>
                </template>
                <template #editor="{ data, field }">
                    <InputNumber v-model="data[field]" mode="currency" currency="USD" locale="en-US"
                        style="width: 100%" />
                </template>
            </Column>
        </DataTable>
    </div>

    <!-- Diálogo: Detalle del Anticipo -->
    <Dialog v-model:visible="dialogoAnticipoVisible" header="Detalle del Anticipo" modal
        style="width: 380px" @hide="resetAnticipo">
        <div class="anticipo-form">
            <div class="anticipo-field">
                <label>Forma de pago</label>
                <Select v-model="localFormaPago" :options="formasPago"
                    placeholder="Seleccionar..." class="w-full" @change="emitAnticipo" />
            </div>
            <div class="anticipo-field" v-if="localFormaPago === 'Cheque' || localFormaPago === 'Transferencia'">
                <label>Referencia</label>
                <InputText v-model="localReferencia" class="w-full"
                    placeholder="Núm. cheque / referencia" />
            </div>
            <div class="anticipo-field">
                <label>Notas</label>
                <InputText v-model="localNotas" class="w-full"
                    placeholder="Notas opcionales" />
            </div>
        </div>
        <template #footer>
            <Button label="Cancelar" severity="secondary" text @click="dialogoAnticipoVisible = false" />
            <Button label="Guardar" icon="pi pi-check" @click="guardarAnticipo" />
        </template>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
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
    localFormaPago.value = fin.anticipoFormaPago ?? ''
    localReferencia.value = fin.anticipoReferencia ?? ''
    localNotas.value = fin.anticipoNotas ?? ''
}, { deep: true })

const onEditComplete = (event: any) => {
    const { data, newValue } = event
    const fila = conceptos.value.find(c => c.codigo === data.codigo)
    if (fila) fila.precio = newValue ?? 0
    emit('update:financiero', { ...props.financiero, [data.key]: newValue ?? 0 })
}

// ── Anticipo: detalle de pago ──
const formasPago = ['Efectivo', 'Tarjeta', 'Cheque', 'Transferencia', 'Otro']
const localFormaPago = ref(props.financiero.anticipoFormaPago ?? '')
const localReferencia = ref(props.financiero.anticipoReferencia ?? '')
const localNotas = ref(props.financiero.anticipoNotas ?? '')
const dialogoAnticipoVisible = ref(false)

function abrirDialogoAnticipo() {
    localFormaPago.value = props.financiero.anticipoFormaPago ?? ''
    localReferencia.value = props.financiero.anticipoReferencia ?? ''
    localNotas.value = props.financiero.anticipoNotas ?? ''
    dialogoAnticipoVisible.value = true
}

function resetAnticipo() {
    // no-op, keep values until explicitly saved
}

function emitAnticipo() { /* kept for @change compatibility */ }

function guardarAnticipo() {
    emit('update:financiero', {
        ...props.financiero,
        anticipoFormaPago: localFormaPago.value || undefined,
        anticipoReferencia: localReferencia.value || undefined,
        anticipoNotas: localNotas.value || undefined,
    })
    dialogoAnticipoVisible.value = false
}

const formatCurrency = (value: number | null): string => {
    if (value == null || value === 0) return '0.00'
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value)
}
</script>

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

.importe-cell {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.2rem;
}

/* ── Diálogo anticipo ── */
.anticipo-form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 0.25rem 0;
}

.anticipo-field {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
}

.anticipo-field label {
    font-size: 0.82rem;
    font-weight: 600;
    color: #374151;
}
</style>
