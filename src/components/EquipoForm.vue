<template>
    <Card class="section-card equipo-card">
        <template #content>
            <Tabs value="0">
                <TabList>
                    <Tab value="0"><span class="tab-header"><i class="pi pi-wrench"></i><span>Datos</span></span></Tab>
                    <Tab value="1"><span class="tab-header"><i class="pi pi-calendar"></i><span>Fechas</span></span>
                    </Tab>
                    <Tab value="2"><span class="tab-header"><i class="pi pi-send"></i><span>Enviado A</span></span>
                    </Tab>
                    <Tab value="3"><span class="tab-header"><i class="pi pi-user"></i><span>Reparado</span></span></Tab>
                    <Tab value="4"><span class="tab-header"><i class="pi pi-history"></i><span>Historial</span></span>
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
                                        <label for="marca">Tipo</label>
                                    </FloatLabel>
                                </div>
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <InputText size="large" id="modelo" :modelValue="equipo.modelo"
                                            @update:modelValue="updateEquipo('modelo', $event)" />
                                        <label for="modelo">Marca</label>
                                    </FloatLabel>
                                </div>
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <InputText size="large" id="noSerie" :modelValue="equipo.noSerie"
                                            @update:modelValue="updateEquipo('noSerie', $event)" />
                                        <label for="noSerie">Modelo</label>
                                    </FloatLabel>
                                </div>
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <InputText size="large" id="tipo" :modelValue="equipo.tipo"
                                            @update:modelValue="updateEquipo('tipo', $event)" />
                                        <label for="tipo">Serie</label>
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
                                        <label for="observaciones">Diagnóstico</label>
                                    </FloatLabel>
                                </div>
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <Textarea size="large" id="diagnostico" :modelValue="equipo.diagnostico"
                                            @update:modelValue="updateEquipo('diagnostico', $event)" rows="2"
                                            auto-resize />
                                        <label for="diagnostico">Observaciones</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <Textarea size="large" id="pendiente" :modelValue="equipo.pendiente"
                                            @update:modelValue="updateEquipo('pendiente', $event)" rows="2"
                                            auto-resize />
                                        <label for="pendiente">Pendiente</label>
                                    </FloatLabel>
                                </div>
                                    <div class="radio-section">
                                        <h4 class="section-subtitle"> Forma de Pago</h4>
                                        <div class="radio-grid">
                                            <div class="radio-option">
                                                <RadioButton :modelValue="equipo.formaPago" @update:modelValue="updateEquipo('formaPago', $event)" inputId="efectivo" value="Efectivo" />
                                                <label for="efectivo">Efectivo</label>
                                            </div>
                                            <div class="radio-option">
                                                <RadioButton :modelValue="equipo.formaPago" @update:modelValue="updateEquipo('formaPago', $event)" inputId="tarjeta" value="Tarjeta" />
                                                <label for="tarjeta">Tarjeta</label>
                                            </div>
                                            <div class="radio-option">
                                                <RadioButton :modelValue="equipo.formaPago" @update:modelValue="updateEquipo('formaPago', $event)" inputId="transferencia" value="Transferencia" />
                                                <label for="transferencia">Transferencia</label>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </TabPanel>

                    <TabPanel value="1">
                        <div class="form-grid">
                            <div class="form-row">


                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <label class="field-label">Fecha de Presupuesto</label>
                                        <DatePicker size="large" :modelValue="fechas.presupuesto"
                                            @update:modelValue="updateFechas('presupuesto', $event)" dateFormat="mm/dd/yy"
                                            showIcon />
                                    </FloatLabel>
                                </div>

                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <label class="field-label">Fecha de Salida</label>
                                        <DatePicker size="large" :modelValue="fechas.salida"
                                            @update:modelValue="updateFechas('salida', $event)" dateFormat="mm/dd/yy"
                                            showIcon />
                                    </FloatLabel>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <label class="field-label">Fecha de Autorización</label>
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

                    <TabPanel value="3">
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

                    <TabPanel value="4">
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import Textarea from 'primevue/textarea'
import DatePicker from 'primevue/datepicker'
import RadioButton from 'primevue/radiobutton'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
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


.radio-grid {
    display: flex;
    gap: 1.5rem;
}

.radio-option {
    display: flex;
    align-items: center;
    gap: 0.25rem;
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

</style>
