<template>
    <Card class="section-card refacciones-card">
        <template #title>
            <div class="card-title">
                <i class="pi pi-table"></i>
                <span>Refacciones / Partes</span>
            </div>
        </template>
        <template #content>
            <div class="tabla-refacciones">
                <div class="tabla-actions">
                    <Button icon="pi pi-plus" label="Agregar" severity="primary" size="small"
                        @click="agregarRefaccion" />
                    <Button icon="pi pi-trash" label="Eliminar" severity="danger" size="small" outlined
                        @click="eliminarRefaccion" :disabled="!refaccionSeleccionada" />
                </div>
                <DataTable :value="refacciones" v-model:selection="refaccionSeleccionada" selectionMode="single"
                    dataKey="codigo" editMode="cell" @cell-edit-complete="onCellEditComplete"
                    class="p-datatable-sm refacciones-table" stripedRows scrollable scrollHeight="flex">
                    <Column field="codigo" header="Cód." style="width: 55px; min-width: 55px" frozen>
                        <template #body="{ data }">
                            <span class="codigo-badge">{{ data.codigo }}</span>
                        </template>
                    </Column>
                    <Column field="nombre" header="Nombre" style="min-width: 140px">
                        <template #editor="{ data, field }">
                            <InputText v-model="data[field]" style="width: 100%" />
                        </template>
                    </Column>
                    <Column field="aparato" header="Aparato" style="min-width: 110px">
                        <template #editor="{ data, field }">
                            <InputText v-model="data[field]" style="width: 100%" />
                        </template>
                    </Column>
                    <Column field="cantidad" header="Cant." style="width: 75px; min-width: 75px">
                        <template #editor="{ data, field }">
                            <InputNumber v-model="data[field]" :useGrouping="false" :min="0" style="width: 100%" />
                        </template>
                    </Column>
                    <Column field="precio" header="Precio" style="width: 95px; min-width: 95px">
                        <template #body="{ data }">{{ formatCurrency(data.precio) }}</template>
                        <template #editor="{ data, field }">
                            <InputNumber v-model="data[field]" mode="currency" currency="USD" locale="en-US"
                                style="width: 100%" />
                        </template>
                    </Column>
                    <Column field="costo" header="Costo" style="width: 95px; min-width: 95px">
                        <template #body="{ data }">{{ formatCurrency(data.costo) }}</template>
                        <template #editor="{ data, field }">
                            <InputNumber v-model="data[field]" mode="currency" currency="USD" locale="en-US"
                                style="width: 100%" />
                        </template>
                    </Column>
                    <Column field="existencia" header="Exist." style="width: 75px; min-width: 75px">
                        <template #editor="{ data, field }">
                            <InputNumber v-model="data[field]" :useGrouping="false" :min="0" style="width: 100%" />
                        </template>
                    </Column>
                    <Column field="ubicacion" header="Ubicación" style="min-width: 110px">
                        <template #editor="{ data, field }">
                            <InputText v-model="data[field]" style="width: 100%" />
                        </template>
                    </Column>
                    <Column field="compraCosto" header="Compra" style="width: 100px; min-width: 100px">
                        <template #body="{ data }">{{ formatCurrency(data.compraCosto) }}</template>
                        <template #editor="{ data, field }">
                            <InputNumber v-model="data[field]" mode="currency" currency="USD" locale="en-US"
                                style="width: 100%" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'

interface Refaccion {
    codigo: number
    nombre: string
    aparato: string
    cantidad: number | null
    precio: number | null
    costo: number | null
    existencia: number | null
    ubicacion: string
    compraCosto: number | null
    fechaPresupuesto: Date | null
}

const refacciones = ref<Refaccion[]>([])
const refaccionSeleccionada = ref<Refaccion | null>(null)

const agregarRefaccion = () => {
    const nextCodigo = refacciones.value.length > 0
        ? Math.max(...refacciones.value.map(r => r.codigo)) + 1
        : 1
    refacciones.value.push({
        codigo: nextCodigo,
        nombre: '',
        aparato: '',
        cantidad: null,
        precio: null,
        costo: null,
        existencia: null,
        ubicacion: '',
        compraCosto: null,
        fechaPresupuesto: null
    })
}

const eliminarRefaccion = () => {
    if (!refaccionSeleccionada.value) return
    refacciones.value = refacciones.value.filter(r => r.codigo !== refaccionSeleccionada.value!.codigo)
    refacciones.value.forEach((r, i) => { r.codigo = i + 1 })
    refaccionSeleccionada.value = null
}

const onCellEditComplete = (event: any) => {
    const { data, newValue, field } = event
    data[field] = newValue
}

const formatCurrency = (value: number | null): string => {
    if (value == null) return '—'
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}
</script>

<style scoped>
.section-card {
    padding: var(--section-card-padding);
}

.refacciones-card {
    height: 100%;
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
}

.tabla-refacciones {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
}

.tabla-actions {
    display: flex;
    gap: 0.35rem;
}

.tabla-actions :deep(.p-button) {
    font-size: 12px;
    padding: 0.18rem 0.4rem;
    height: 27px;
}

.refacciones-table :deep(.p-datatable-tbody > tr > td) {
    padding: 0.18rem 0.32rem;
    font-size: 13px;
}

.refacciones-table :deep(.p-datatable-thead > tr > th) {
    padding: 0.28rem 0.32rem;
    font-size: 12px;
    white-space: nowrap;
}

:deep(.p-datatable) {
    font-size: 13px;
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
