<template>
    <Dialog v-model:visible="visible" header="Búsqueda de Órdenes" modal :style="{ width: '140vh' }"
        :breakpoints="{ '960px': '95vw' }" @show="buscar">
        <div class="busqueda-container">
            <!-- Filtros -->
            <div class="filtros-row">
                <IconField class="search-field">
                    <InputIcon class="pi pi-search" />
                    <InputText v-model="query" placeholder="Buscar por #orden, nombre, teléfono..." @keyup.enter="() => buscar()" />
                </IconField>
                <Select v-model="filtroEstado" :options="estadoOpciones" optionLabel="label" optionValue="value"
                    placeholder="Estado" showClear />
                <DatePicker v-model="filtroFechaDesde" dateFormat="dd/mm/yy" placeholder="Fecha desde" showIcon />
                <DatePicker v-model="filtroFechaHasta" dateFormat="dd/mm/yy" placeholder="Fecha hasta" showIcon />
                <Button icon="pi pi-search" label="Buscar" @click="() => buscar()" :loading="loading" />
            </div>

            <!-- Tabla resultados -->
            <DataTable :value="ordenes" :loading="loading" stripedRows selectionMode="single"
                v-model:selection="seleccionada" dataKey="_id" scrollable scrollHeight="380px"
                class="p-datatable-sm resultados-table" @row-dblclick="seleccionarOrden">
                <template #empty>
                    <div class="empty-msg">No se encontraron órdenes.</div>
                </template>
                <Column field="numeroOrden" header="#Orden" style="width: 90px; min-width: 90px" frozen />
                <Column header="Fecha" style="width: 95px; min-width: 95px">
                    <template #body="{ data }">
                        {{ formatDate(data.fechaCreacion) }}
                    </template>
                </Column>
                <Column header="Cliente" style="min-width: 140px">
                    <template #body="{ data }">
                        {{ data.cliente?.nombre ?? '—' }}
                    </template>
                </Column>
                <Column header="Teléfono" style="width: 110px; min-width: 110px">
                    <template #body="{ data }">
                        {{ data.cliente?.celular ?? '—' }}
                    </template>
                </Column>
                <Column header="Equipo" style="min-width: 120px">
                    <template #body="{ data }">
                        {{ [data.equipo?.marca, data.equipo?.modelo].filter(Boolean).join(' ') || '—' }}
                    </template>
                </Column>
                <Column field="estadoOrden" header="Estado" style="width: 100px; min-width: 100px">
                    <template #body="{ data }">
                        <Tag :value="data.estadoOrden" :severity="severidadEstado(data.estadoOrden)" />
                    </template>
                </Column>
                <Column header="Total" style="width: 90px; min-width: 90px">
                    <template #body="{ data }">
                        {{ formatCurrency(calcularTotal(data.refacciones, data.financiero)) }}
                    </template>
                </Column>
            </DataTable>

            <!-- Paginación -->
            <div class="pagination-row" v-if="paginacion">
                <span class="pag-info">
                    Página {{ paginacion.currentPage }} de {{ paginacion.totalPages }}
                    &nbsp;·&nbsp; {{ paginacion.totalItems }} resultado(s)
                </span>
                <Paginator :rows="paginacion.itemsPerPage" :totalRecords="paginacion.totalItems"
                    :first="(paginacion.currentPage - 1) * paginacion.itemsPerPage"
                    @page="onPageChange" template="PrevPageLink PageLinks NextPageLink" />
            </div>
        </div>

        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" severity="secondary" outlined @click="visible = false" />
            <Button label="Abrir Orden" icon="pi pi-folder-open" :disabled="!seleccionada" @click="seleccionarOrden" />
        </template>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Paginator from 'primevue/paginator'
import { useOrdenServicioService } from '../composables/useOrdenServicioService'
import { useOrdenServicio } from '../composables/useOrdenServicio';
import type { OrdenServicio } from '../models/orden-servicio'

const { calcularTotal } = useOrdenServicio()

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{
    (e: 'update:modelValue', v: boolean): void
    (e: 'seleccionar', orden: OrdenServicio): void
}>()

const visible = ref(props.modelValue)
watch(() => props.modelValue, v => { visible.value = v })
watch(visible, v => emit('update:modelValue', v))

const ordenService = useOrdenServicioService()

const loading = ref(false)
const query = ref('')
const filtroEstado = ref<string | null>(null)
const filtroFechaDesde = ref<Date | null>(null)
const filtroFechaHasta = ref<Date | null>(null)
const ordenes = ref<OrdenServicio[]>([])
const seleccionada = ref<OrdenServicio | null>(null)
const paginacion = ref<{ currentPage: number; totalPages: number; totalItems: number; itemsPerPage: number } | null>(null)
const paginaActual = ref(1)

const estadoOpciones = [
    { label: 'Pendiente', value: 'Pendiente' },
    { label: 'Autoriza',  value: 'Autoriza' },
    { label: 'Informa',   value: 'Informa' },
    { label: 'Refacción', value: 'Refacción' },
    { label: 'Entregar',  value: 'Entregar' },
    { label: 'Ninguno',   value: 'Ninguno' },
]


const buscar = async (pagina = 1) => {
    try {
        loading.value = true
        paginaActual.value = pagina
        if (query.value.trim()) {
            const resultados = await ordenService.buscarOrdenes(query.value.trim())
            ordenes.value = resultados
            paginacion.value = null
        } else {
            const params: Record<string, any> = { page: pagina, limit: 15 }
            if (filtroEstado.value) params.estado = filtroEstado.value
            if (filtroFechaDesde.value) params.fechaDesde = toISODate(filtroFechaDesde.value)
            if (filtroFechaHasta.value) params.fechaHasta = toISODate(filtroFechaHasta.value)

            const res = await ordenService.obtenerOrdenes(params)
            ordenes.value = res.data
            paginacion.value = res.pagination
        }
    } catch (e) {
        console.error('Error al buscar órdenes:', e)
    } finally {
        loading.value = false
    }
}

const onPageChange = (e: { page: number }) => buscar(e.page + 1)

const seleccionarOrden = () => {
    if (!seleccionada.value) return
    emit('seleccionar', seleccionada.value)
    visible.value = false
}

const formatDate = (date: Date | string | null): string => {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const formatCurrency = (v: number): string =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(v)


const toISODate = (d: Date) => d.toISOString().split('T')[0]

const severidadEstado = (estado: string): 'info' | 'warn' | 'success' | 'danger' | 'secondary' => {
    const map: Record<string, 'info' | 'warn' | 'success' | 'danger' | 'secondary'> = {
        Pendiente: 'warn',
        Autoriza:  'info',
        Informa:   'info',
        'Refacción': 'danger',
        Entregar:  'success',
        Ninguno:   'secondary',
    }
    return map[estado] ?? 'secondary'
}
</script>

<style scoped>
.busqueda-container {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
}

.filtros-row {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    flex-wrap: wrap;
}

.search-field {
    flex: 1;
    min-width: 200px;
}

.search-field :deep(.p-inputtext) {
    width: 100%;
}

.filtros-row :deep(.p-select),
.filtros-row :deep(.p-datepicker) {
    height: 36px;
    font-size: 13px;
}

.resultados-table :deep(.p-datatable-tbody > tr > td) {
    padding: 0.22rem 0.4rem;
    font-size: 13px;
}

.resultados-table :deep(.p-datatable-thead > tr > th) {
    padding: 0.3rem 0.4rem;
    font-size: 12px;
}

.resultados-table :deep(tr) {
    cursor: pointer;
}

.pagination-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.4rem;
}

.pag-info {
    font-size: 12px;
    color: #64748b;
}

.empty-msg {
    text-align: center;
    color: #94a3b8;
    padding: 1.5rem 0;
    font-size: 13px;
}
</style>
