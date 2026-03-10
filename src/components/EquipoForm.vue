<template>
    <Card class="section-card equipo-card">
        <template #title>
            <div class="card-title">
                <i class="pi pi-wrench"></i>
                <span>Información del Equipo</span>
            </div>
        </template>
        <template #content>
            <Tabs value="0">
                <TabList>
                    <Tab value="0"><span class="tab-header"><i class="pi pi-wrench"></i><span>Datos</span></span></Tab>
                    <Tab value="1"><span class="tab-header"><i class="pi pi-calendar"></i><span>Fechas</span></span>
                    </Tab>
                    <Tab value="2"><span class="tab-header"><i class="pi pi-clock"></i><span>Pendiente</span></span>
                    </Tab>
                    <Tab value="3"><span class="tab-header"><i class="pi pi-send"></i><span>Enviado A</span></span>
                    </Tab>
                    <Tab value="4"><span class="tab-header"><i class="pi pi-user"></i><span>Reparado</span></span></Tab>
                    <Tab value="5"><span class="tab-header"><i class="pi pi-history"></i><span>Historial</span></span>
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel value="0">
                        <div class="form-grid">
                            <div class="form-row">
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <InputText size="large" id="marca" :modelValue="equipo.marca"
                                            @update:modelValue="updateEquipo('marca', $event)" />
                                        <label for="marca">Marca</label>
                                    </FloatLabel>
                                </div>
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <InputText size="large" id="modelo" :modelValue="equipo.modelo"
                                            @update:modelValue="updateEquipo('modelo', $event)" />
                                        <label for="modelo">Modelo</label>
                                    </FloatLabel>
                                </div>
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <InputText size="large" id="noSerie" :modelValue="equipo.noSerie"
                                            @update:modelValue="updateEquipo('noSerie', $event)" />
                                        <label for="noSerie">No. Serie</label>
                                    </FloatLabel>
                                </div>
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <InputText size="large" id="tipo" :modelValue="equipo.tipo"
                                            @update:modelValue="updateEquipo('tipo', $event)" />
                                        <label for="tipo">Tipo</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <Textarea size="large" id="falla" :modelValue="equipo.falla"
                                            @update:modelValue="updateEquipo('falla', $event)" rows="2" auto-resize />
                                        <label for="falla">Falla Reportada</label>
                                    </FloatLabel>
                                </div>
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <Textarea size="large" id="accesorios" :modelValue="equipo.accesorios"
                                            @update:modelValue="updateEquipo('accesorios', $event)" rows="2"
                                            auto-resize />
                                        <label for="accesorios">Accesorios</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <Textarea size="large" id="observaciones" :modelValue="equipo.observaciones"
                                            @update:modelValue="updateEquipo('observaciones', $event)" rows="2"
                                            auto-resize />
                                        <label for="observaciones">Observaciones</label>
                                    </FloatLabel>
                                </div>
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <Textarea size="large" id="diagnostico" :modelValue="equipo.diagnostico"
                                            @update:modelValue="updateEquipo('diagnostico', $event)" rows="2"
                                            auto-resize />
                                        <label for="diagnostico">Diagnóstico</label>
                                    </FloatLabel>
                                </div>
                            </div>
                        </div>
                    </TabPanel>

                    <TabPanel value="1">
                        <div class="form-grid">
                            <div class="form-row">
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <label class="field-label">Ingreso</label>
                                        <DatePicker size="large" :modelValue="fechas.ingreso"
                                            @update:modelValue="updateFechas('ingreso', $event)" dateFormat="mm/dd/yy"
                                            showIcon />
                                    </FloatLabel>
                                </div>
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <label class="field-label">Salida</label>
                                        <DatePicker size="large" :modelValue="fechas.salida"
                                            @update:modelValue="updateFechas('salida', $event)" dateFormat="mm/dd/yy"
                                            showIcon />
                                    </FloatLabel>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <label class="field-label">Autorización</label>
                                        <DatePicker size="large" :modelValue="fechas.autorizacion"
                                            @update:modelValue="updateFechas('autorizacion', $event)"
                                            dateFormat="mm/dd/yy" showIcon />
                                    </FloatLabel>
                                </div>
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <label class="field-label">Pedido Refacción</label>
                                        <DatePicker size="large" :modelValue="fechas.pedidoRefaccion"
                                            @update:modelValue="updateFechas('pedidoRefaccion', $event)"
                                            dateFormat="mm/dd/yy" showIcon />
                                    </FloatLabel>
                                </div>
                            </div>
                            <div class="form-row">

                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <label class="field-label">Llegada Refacción</label>
                                        <DatePicker size="large" :modelValue="fechas.llegadaRefaccion"
                                            @update:modelValue="updateFechas('llegadaRefaccion', $event)"
                                            dateFormat="mm/dd/yy" showIcon />
                                    </FloatLabel>
                                </div>
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <InputText size="large" id="noPedido" v-model="noPedidoLocal" />
                                        <label for="noPedido">No. Pedido</label>
                                    </FloatLabel>
                                </div>
                            </div>
                        </div>
                    </TabPanel>

                    <TabPanel value="2">
                        <div class="form-grid">
                            <div class="form-row">
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <Textarea id="pendiente" :modelValue="estado.pendiente"
                                            @update:modelValue="updateEstado('pendiente', $event)" rows="8"
                                            auto-resize />
                                        <label for="pendiente">Pendiente por</label>
                                    </FloatLabel>
                                </div>
                            </div>
                        </div>
                    </TabPanel>

                    <TabPanel value="3">
                        <div class="form-grid">
                            <div class="form-row">
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <InputText size="large" id="enviadoANombre" :modelValue="estado.enviadoANombre"
                                            @update:modelValue="updateEstado('enviadoANombre', $event)" />
                                        <label for="enviadoANombre">Enviado A</label>
                                    </FloatLabel>
                                </div>
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <label class="field-label">Fecha Envío</label>
                                        <DatePicker size="large" :modelValue="estado.fechaEnvio"
                                            @update:modelValue="updateEstado('fechaEnvio', $event)"
                                            dateFormat="mm/dd/yy" showIcon />
                                    </FloatLabel>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <Textarea id="notasEnvio" :modelValue="estado.notasEnvio"
                                            @update:modelValue="updateEstado('notasEnvio', $event)" rows="3" />
                                        <label for="notasEnvio">Notas de Envío</label>
                                    </FloatLabel>
                                </div>
                            </div>
                        </div>
                    </TabPanel>

                    <TabPanel value="4">
                        <div class="form-grid">
                            <div class="form-row">
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <InputText size="large" id="reparadoPor" :modelValue="estado.reparadoPor"
                                            @update:modelValue="updateEstado('reparadoPor', $event)" />
                                        <label for="reparadoPor">Reparado Por</label>
                                    </FloatLabel>
                                </div>
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <label class="field-label">Fecha Reparación</label>
                                        <DatePicker size="large" :modelValue="estado.fechaReparacion"
                                            @update:modelValue="updateEstado('fechaReparacion', $event)"
                                            dateFormat="mm/dd/yy" showIcon />
                                    </FloatLabel>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <Textarea id="descripcionReparacion" :modelValue="estado.descripcionReparacion"
                                            @update:modelValue="updateEstado('descripcionReparacion', $event)"
                                            rows="3" />
                                        <label for="descripcionReparacion">Descripción</label>
                                    </FloatLabel>
                                </div>
                            </div>
                        </div>
                    </TabPanel>

                    <TabPanel value="5">
                        <DataTable :value="historial" stripedRows>
                            <Column field="fecha" header="Fecha"></Column>
                            <Column field="accion" header="Acción"></Column>
                            <Column field="usuario" header="Usuario"></Column>
                        </DataTable>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </template>
    </Card>

    <!-- Refacciones / Partes -->
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
import FloatLabel from 'primevue/floatlabel'
import Textarea from 'primevue/textarea'
import DatePicker from 'primevue/datepicker'
import InputNumber from 'primevue/inputnumber'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import type { Equipo } from '../models/equipo'
import type { Fechas, EstadoEquipo, HistorialItem } from '../models/orden-servicio'

interface Props {
    equipo: Equipo
    fechas: Fechas
    estado: EstadoEquipo
    historial: HistorialItem[]
}

interface Emits {
    (e: 'update:equipo', value: Equipo): void
    (e: 'update:fechas', value: Fechas): void
    (e: 'update:estado', value: EstadoEquipo): void
    (e: 'update:historial', value: HistorialItem[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Local-only state
const noPedidoLocal = ref<string>('')

// Refacciones — fully local to this component
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
        compraCosto: null
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

// Update helpers — emit immutable copies upward
const updateEquipo = (field: keyof Equipo, value: any) => {
    emit('update:equipo', { ...props.equipo, [field]: value })
}

const updateFechas = (field: keyof Fechas, value: any) => {
    emit('update:fechas', { ...props.fechas, [field]: value })
}

const updateEstado = (field: keyof EstadoEquipo, value: any) => {
    emit('update:estado', { ...props.estado, [field]: value })
}
</script>

<style scoped>
.section-card {
    padding: var(--section-card-padding);
}


.equipo-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 0;
}

.refacciones-card {
    flex-shrink: 0;
        flex: 1;

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

/* =============================================
   FORM STYLES
   ============================================= */
.form-grid {
    display: flex;
    flex-direction: column;
    gap: var(--form-grid-gap);
}

.form-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
    gap: var(--form-grid-gap);
}

.form-field {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
}

.form-field :deep(.p-floatlabel) {
    width: 100%;
}

.form-field :deep(.p-inputtext),
.form-field :deep(.p-textarea) {
    width: 100%;
}


.form-field :deep(.p-textarea) {
    resize: none;
}

.form-field :deep(.p-datepicker) {
    width: 100%;
}

.form-field :deep(.p-datepicker .p-button) {
    padding: 0 0.4rem;
    height: 30px;
    font-size: 13px;
}



/* =============================================
   TABS
   ============================================= */


.tab-header {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: small;
}

.tab-header i {
    font-size: small;
    color: var(--tab-icon-color);
}

/* =============================================
   REFACCIONES TABLE
   ============================================= */
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
