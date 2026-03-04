<template>
    <div class="orden-servicio-page" :style="{ zoom: zoom }">
        <!-- Header -->
        <div class="header-section">
            <div class="order-info">
                <div class="order-badge">
                    <i class="pi pi-hashtag"></i>
                </div>
                <div class="order-details">
                    <span class="order-label">Orden de Servicio</span>
                    <h1 class="order-number">{{ ordenNumero === '' ? 'Nueva Orden' : ordenNumero }}</h1>
                </div>
            </div>
            <div class="order-date">
                <span class="date-label">Fecha Actual</span>
                <div class="date-value">{{ fechaActual }}</div>
            </div>

            <!-- Zoom Control -->
            <div class="zoom-control">
                <span class="zoom-label"><i class="pi pi-search"></i> Zoom</span>
                <div class="zoom-actions">
                    <button class="zoom-btn" @click="zoomOut" :disabled="zoom <= 0.5" title="Reducir">
                        <i class="pi pi-minus"></i>
                    </button>
                    <span class="zoom-value">{{ Math.round(zoom * 100) }}%</span>
                    <button class="zoom-btn" @click="zoomIn" :disabled="zoom >= 1.5" title="Ampliar">
                        <i class="pi pi-plus"></i>
                    </button>
                    <button class="zoom-btn zoom-reset" @click="zoomReset" title="Restablecer">
                        <i class="pi pi-refresh"></i>
                    </button>
                </div>
                <input
                    type="range"
                    class="zoom-slider"
                    v-model.number="zoom"
                    min="0.5"
                    max="1.5"
                    step="0.05"
                />
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
            <Button label="Nueva Orden" icon="pi pi-plus" severity="primary" @click="crearNuevaOrden" />
            <Button label="Guardar" icon="pi pi-save" severity="secondary" outlined @click="guardarOrden" :loading="loading" />
            <Button label="Imprimir Ticket" icon="pi pi-print" severity="secondary" outlined @click="imprimirTicket" :disabled="!ordenId" />
            <Button label="Imprimir Orden" icon="pi pi-file" severity="secondary" outlined @click="imprimirOrdenCompleta" :disabled="!ordenId" />
            <Button label="Reporte Diario" icon="pi pi-calendar" severity="secondary" outlined />
            <Button label="Salida Equipos" icon="pi pi-box" severity="secondary" outlined />
            <Button label="Búsqueda" icon="pi pi-search" severity="secondary" outlined />
        </div>

        <!-- Main Content Grid -->
        <div class="content-grid">
            <!-- Left Column -->
            <div class="left-column">
                <!-- Datos del Cliente -->
                <ClienteForm v-model="cliente" />

                <!-- Información del Equipo -->
                <Card class="section-card">
                    <template #title>
                        <div class="card-title">
                            <i class="pi pi-wrench"></i>
                            <span>Información del Equipo</span>
                        </div>
                    </template>
                    <template #content>
                        <TabView>
                            <TabPanel value="0">
                                <template #header>
                                    <span class="tab-header">
                                        <i class="pi pi-wrench"></i>
                                        <span>Datos Equipo</span>
                                    </span>
                                </template>
                                <div class="form-grid">
                                    <div class="form-row">
                                        <div class="form-field">
                                            <label>Marca</label>
                                            <InputText v-model="equipo.marca" placeholder="Marca" />
                                        </div>
                                        <div class="form-field">
                                            <label>Modelo</label>
                                            <InputText v-model="equipo.modelo" placeholder="Modelo" />
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-field">
                                            <label>No. Serie</label>
                                            <InputText v-model="equipo.noSerie" placeholder="Número de serie" />
                                        </div>
                                        <div class="form-field">
                                            <label>Tipo Equipo</label>
                                            <InputText v-model="equipo.tipo" placeholder="Tipo de equipo" />
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-field flex-1">
                                            <label>Falla Reportada</label>
                                            <Textarea v-model="equipo.falla" rows="4" placeholder="Descripción de la falla reportada..." />
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-field flex-1">
                                            <label>Accesorios</label>
                                            <InputText v-model="equipo.accesorios" placeholder="Batería, cargador, tapa de cuerpo" />
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-field flex-1">
                                            <label>Observaciones</label>
                                            <Textarea v-model="equipo.observaciones" rows="4" placeholder="Descripción de las observaciones..." />
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-field flex-1">
                                            <label>Diagnóstico - Reporte Técnico</label>
                                            <Textarea v-model="equipo.diagnostico" rows="4" placeholder="Descripción del diagnóstico y reporte técnico..." />
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel value="1">
                                <template #header>
                                    <span class="tab-header">
                                        <i class="pi pi-calendar"></i>
                                        <span>Fechas</span>
                                    </span>
                                </template>
                                <div class="form-grid">
                                    <div class="form-row">
                                        <div class="form-field">
                                            <label>Autorización</label>
                                            <Calendar v-model="fechas.autorizacion" dateFormat="mm/dd/yy" showIcon />
                                        </div>
                                        <div class="form-field">
                                            <label>Fecha de pedido de refacción</label>
                                            <Calendar v-model="fechas.pedidoRefaccion" dateFormat="mm/dd/yy" showIcon />
                                        </div>
                                        <div class="form-field">
                                            <label>Número de pedido</label>
                                           <InputText placeholder="Ingrese el número de pedido" />
                                        </div>
                                    </div>
                                    
                                    <div class="form-row">
                                        <div class="form-field">
                                            <label>Salida</label>
                                            <Calendar v-model="fechas.salida" dateFormat="mm/dd/yy" showIcon />
                                        </div>
                                         <div class="form-field">
                                            <label>Fecha de llegada de refacción</label>
                                            <Calendar v-model="fechas.llegadaRefaccion" dateFormat="mm/dd/yy" showIcon />
                                        </div>
                                        <div class="form-field">
                                            <label>Fecha Ingreso</label>
                                            <Calendar v-model="fechas.ingreso" dateFormat="mm/dd/yy" showIcon />
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel value="2">
                                <template #header>
                                    <span class="tab-header">
                                        <i class="pi pi-clock"></i>
                                        <span>Pendiente</span>
                                    </span>
                                </template>
                                <div class="form-grid">
                                    <div class="form-row">
                                        <div class="form-field flex-1">
                                            <label>Pendiente por:</label>
                                            <Textarea v-model="estado.pendiente" rows="6" placeholder="Detalles pendientes..." />
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel value="3">
                                <template #header>
                                    <span class="tab-header">
                                        <i class="pi pi-send"></i>
                                        <span>Enviado A</span>
                                    </span>
                                </template>
                                <div class="form-grid">
                                    <div class="form-row">
                                        <div class="form-field">
                                            <label>Enviado A</label>
                                            <InputText v-model="estado.enviadoANombre" placeholder="Nombre del destinatario" />
                                        </div>
                                        <div class="form-field">
                                            <label>Fecha de Envío</label>
                                            <Calendar v-model="estado.fechaEnvio" dateFormat="mm/dd/yy" showIcon />
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-field flex-1">
                                            <label>Notas de Envío</label>
                                            <Textarea v-model="estado.notasEnvio" rows="4" placeholder="Detalles del envío..." />
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel value="4">
                                <template #header>
                                    <span class="tab-header">
                                        <i class="pi pi-user"></i>
                                        <span>Reparado Por</span>
                                    </span>
                                </template>
                                <div class="form-grid">
                                    <div class="form-row">
                                        <div class="form-field">
                                            <label>Reparado Por</label>
                                            <InputText v-model="estado.reparadoPor" placeholder="Nombre del técnico" />
                                        </div>
                                        <div class="form-field">
                                            <label>Fecha de Reparación</label>
                                            <Calendar v-model="estado.fechaReparacion" dateFormat="mm/dd/yy" showIcon />
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-field flex-1">
                                            <label>Descripción de Reparación</label>
                                            <Textarea v-model="estado.descripcionReparacion" rows="4" placeholder="Detalle del trabajo realizado..." />
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel value="5">
                                <template #header>
                                    <span class="tab-header">
                                        <i class="pi pi-history"></i>
                                        <span>Historial</span>
                                    </span>
                                </template>
                                <DataTable :value="historial" stripedRows>
                                    <Column field="fecha" header="Fecha"></Column>
                                    <Column field="accion" header="Acción"></Column>
                                    <Column field="usuario" header="Usuario"></Column>
                                </DataTable>
                            </TabPanel>
                        </TabView>
                    </template>
                </Card>

                <!-- Tabla de Refacciones / Partes -->
                <Card class="section-card">
                    <template #title>
                        <div class="card-title">
                            <i class="pi pi-table"></i>
                            <span>Refacciones / Partes</span>
                        </div>
                    </template>
                    <template #content>
                        <div class="tabla-refacciones">
                            <div class="tabla-actions">
                                <Button icon="pi pi-plus" label="Agregar fila" severity="primary" size="small" @click="agregarRefaccion" />
                                <Button icon="pi pi-trash" label="Eliminar seleccionada" severity="danger" size="small" outlined @click="eliminarRefaccion" :disabled="!refaccionSeleccionada" />
                            </div>
                            <DataTable
                                :value="refacciones"
                                v-model:selection="refaccionSeleccionada"
                                selectionMode="single"
                                dataKey="codigo"
                                editMode="cell"
                                @cell-edit-complete="onCellEditComplete"
                                class="p-datatable-sm refacciones-table"
                                stripedRows
                                scrollable
                            >
                                <Column field="codigo" header="Código" style="width: 80px; min-width: 80px" frozen>
                                    <template #body="{ data }">
                                        <span class="codigo-badge">{{ data.codigo }}</span>
                                    </template>
                                </Column>
                                <Column field="nombre" header="Nombre" style="min-width: 160px">
                                    <template #editor="{ data, field }">
                                        <InputText v-model="data[field]" style="width: 100%" />
                                    </template>
                                </Column>
                                <Column field="aparato" header="Aparato" style="min-width: 130px">
                                    <template #editor="{ data, field }">
                                        <InputText v-model="data[field]" style="width: 100%" />
                                    </template>
                                </Column>
                                <Column field="cantidad" header="Cantidad" style="width: 100px; min-width: 100px">
                                    <template #editor="{ data, field }">
                                        <InputNumber v-model="data[field]" :useGrouping="false" :min="0" style="width: 100%" />
                                    </template>
                                </Column>
                                <Column field="precio" header="Precio" style="width: 110px; min-width: 110px">
                                    <template #body="{ data }">{{ formatCurrency(data.precio) }}</template>
                                    <template #editor="{ data, field }">
                                        <InputNumber v-model="data[field]" mode="currency" currency="USD" locale="en-US" style="width: 100%" />
                                    </template>
                                </Column>
                                <Column field="costo" header="Costo" style="width: 110px; min-width: 110px">
                                    <template #body="{ data }">{{ formatCurrency(data.costo) }}</template>
                                    <template #editor="{ data, field }">
                                        <InputNumber v-model="data[field]" mode="currency" currency="USD" locale="en-US" style="width: 100%" />
                                    </template>
                                </Column>
                                <Column field="existencia" header="Existencia" style="width: 110px; min-width: 110px">
                                    <template #editor="{ data, field }">
                                        <InputNumber v-model="data[field]" :useGrouping="false" :min="0" style="width: 100%" />
                                    </template>
                                </Column>
                                <Column field="ubicacion" header="Ubicación" style="min-width: 130px">
                                    <template #editor="{ data, field }">
                                        <InputText v-model="data[field]" style="width: 100%" />
                                    </template>
                                </Column>
                                <Column field="compraCosto" header="Compra Costo" style="width: 130px; min-width: 130px">
                                    <template #body="{ data }">{{ formatCurrency(data.compraCosto) }}</template>
                                    <template #editor="{ data, field }">
                                        <InputNumber v-model="data[field]" mode="currency" currency="USD" locale="en-US" style="width: 100%" />
                                    </template>
                                </Column>
                            </DataTable>
                        </div>
                    </template>
                </Card>
            </div>

            <!-- Right Column -->
            <div class="right-column">
                <!-- Estado de la Orden -->
                <Card class="section-card">
                    <template #title>
                        <div class="card-title">
                            <i class="pi pi-info-circle"></i>
                            <span>Estado de la Orden</span>
                            <Tag :value="estadoOrden" :severity="getEstadoSeverity()" class="ml-auto" />
                        </div>
                    </template>
                    <template #content>
                        <div class="radio-section">
                            <h4 class="section-subtitle">PENDIENTE</h4>
                            <div class="radio-grid">
                                <div class="radio-option">
                                    <RadioButton v-model="estadoOrden" inputId="pendiente" value="Pendiente" />
                                    <label for="pendiente">Pendiente</label>
                                </div>
                                <div class="radio-option">
                                    <RadioButton v-model="estadoOrden" inputId="autoriza" value="Autoriza" />
                                    <label for="autoriza">Autoriza</label>
                                </div>
                                <div class="radio-option">
                                    <RadioButton v-model="estadoOrden" inputId="informa" value="Informa" />
                                    <label for="informa">Informa</label>
                                </div>
                                <div class="radio-option">
                                    <RadioButton v-model="estadoOrden" inputId="refaccion" value="Refacción" />
                                    <label for="refaccion">Refacción</label>
                                </div>
                                <div class="radio-option">
                                    <RadioButton v-model="estadoOrden" inputId="entregar" value="Entregar" />
                                    <label for="entregar">Entregar</label>
                                </div>
                                <div class="radio-option">
                                    <RadioButton v-model="estadoOrden" inputId="ninguno" value="Ninguno" />
                                    <label for="ninguno">Ninguno</label>
                                </div>
                            </div>
                        </div>

                        <Divider />

                        <div class="radio-section">
                            <h4 class="section-subtitle">
                                <i class="pi pi-bookmark"></i>
                                REFERENCIAS
                            </h4>
                            <div class="radio-grid">
                                <div class="radio-option">
                                    <RadioButton v-model="referencias" inputId="GarantíaDeReparacion" value="Garantia" />
                                    <label for="GarantíaDeReparacion">Garantía de reparación</label>
                                </div>
                                <div class="radio-option">
                                    <RadioButton v-model="referencias" inputId="sinReparacion" value="SinReparacion" />
                                    <label for="sinReparacion">Sin Reparación</label>
                                </div>
                                <div class="radio-option">
                                    <RadioButton v-model="referencias" inputId="noAutorizo" value="NoAutorizo" />
                                    <label for="noAutorizo">No Autorizo</label>
                                </div>
                                <div class="radio-option">
                                    <RadioButton v-model="referencias" inputId="reparado" value="Reparado" />
                                    <label for="reparado">Reparado</label>
                                </div>
                                <div class="radio-option">
                                    <RadioButton v-model="referencias" inputId="ningunRef" value="Ninguno" />
                                    <label for="ningunRef">Ninguno</label>
                                </div>
                            </div>
                        </div>

                        <Divider />

                        <div class="radio-section">
                            <h4 class="section-subtitle">
                                <i class="pi pi-credit-card"></i>
                                CARGOS
                            </h4>
                            <div class="radio-grid">
                                <div class="radio-option">
                                    <RadioButton v-model="tipoCargo" inputId="cargoRegular" value="CargoRegular" />
                                    <label for="cargoRegular">Cargo Regular</label>
                                </div>
                                <div class="radio-option">
                                    <RadioButton v-model="tipoCargo" inputId="sinCargo" value="SinCargo" />
                                    <label for="sinCargo">Sin Cargo</label>
                                </div>
                                <div class="radio-option">
                                    <RadioButton v-model="tipoCargo" inputId="garantiaVendor" value="GarantiaVendor" />
                                    <label for="garantiaVendor">Garantía de venta</label>
                                </div>
                            </div>
                        </div>
                    </template>
                </Card>

                <!-- Resumen Financiero -->
                <Card class="section-card">
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
                                <InputNumber v-model="financiero.presupuesto" mode="currency" currency="USD" locale="en-US" />
                            </div>
                            <div class="financial-row">
                                <label>Revisión</label>
                                <InputNumber v-model="financiero.revision" mode="currency" currency="USD" locale="en-US" />
                            </div>
                            <div class="financial-row">
                                <label>Anticipo</label>
                                <InputNumber v-model="financiero.anticipo" mode="currency" currency="USD" locale="en-US" />
                            </div>
                            <div class="financial-row">
                                <label>Pagos</label>
                                <InputNumber v-model="financiero.pagos" mode="currency" currency="USD" locale="en-US" />
                            </div>
                            <div class="financial-row">
                                <label>IVA</label>
                                <InputNumber v-model="financiero.iva" mode="currency" currency="USD" locale="en-US" />
                            </div>
                            <Divider />
                            <div class="financial-row total">
                                <label><strong>Total</strong></label>
                                <span class="total-value">${{ calcularSubtotal(financiero).toFixed(2) }}</span>
                            </div>
                        </div>
                    </template>
                </Card>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import RadioButton from 'primevue/radiobutton'
import Divider from 'primevue/divider'
import Tag from 'primevue/tag'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Textarea from 'primevue/textarea'
import Calendar from 'primevue/calendar'
import InputNumber from 'primevue/inputnumber'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import type { 
    Cliente, 
    Equipo, 
    Fechas, 
    EstadoEquipo, 
    HistorialItem, 
    Financiero,
    EstadoOrden,
    ReferenciaTipo,
    TipoCargo,
    OrdenServicio
} from '../models/orden-servicio'
import { useOrdenServicio } from '../composables/useOrdenServicio'
import { useOrdenServicioService } from '../composables/useOrdenServicioService'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from '../composables/useToast'
import { useClienteService } from '../composables/useClienteService'
import { useEquipoService } from '../composables/useEquipoService'
import ClienteForm from '../components/ClienteForm.vue'


// Composables
const { calcularSubtotal, calcularTotal } = useOrdenServicio()
const ordenService = useOrdenServicioService()
const clienteService = useClienteService();
const equipoService = useEquipoService();


const router = useRouter()
const route = useRoute()
const toast = useToast()

// Zoom
const zoom = ref<number>(1)
const zoomStep = 0.1
const zoomIn = () => { zoom.value = Math.min(1.5, parseFloat((zoom.value + zoomStep).toFixed(2))) }
const zoomOut = () => { zoom.value = Math.max(0.5, parseFloat((zoom.value - zoomStep).toFixed(2))) }
const zoomReset = () => { zoom.value = 1 }

// Estados
const loading = ref<boolean>(false)
const ordenId = ref<string | null>(null)

// Data
const ordenNumero = ref<string>('')
const fechaActual = ref<string>(new Date().toLocaleDateString('es-MX', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
}))

const cliente = ref<Cliente>({
    nombre: '',
    celular: '',
    domicilio: '',
    rfc: '',
    colonia: '',
    ciudad: '',
    estado: '',
    cp: '',
    email: '',
    telefono: '',
    contacto: ''
})

const equipo = ref<Equipo>({
    marca: '',
    modelo: '',
    noSerie: '',
    tipo: '',
    falla: '',
    accesorios: ''
})

const fechas = ref<Fechas>({
    ingreso: null,
    salida: null,
    autorizacion: null,
    llegadaRefaccion: null
})

const estado = ref<EstadoEquipo>({
    pendiente: '',
    enviadoANombre: '',
    fechaEnvio: null,
    notasEnvio: '',
    reparadoPor: '',
    fechaReparacion: null,
    descripcionReparacion: ''
})

const historial = ref<HistorialItem[]>([])

// Tabla Refacciones / Partes
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
    // Re-numerar códigos
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

const estadoOrden = ref<EstadoOrden>('Refacción')
const referencias = ref<ReferenciaTipo>('Garantia')
const tipoCargo = ref<TipoCargo>('CargoRegular')

const financiero = ref<Financiero>({
    presupuesto: 0.00,
    revision: 0.00,
    anticipo: 0.00,
    pagos: 0.00,
    iva: 0.00
})

// Methods
const getEstadoSeverity = (): string => {
    const severityMap: Record<EstadoOrden, string> = {
        'Pendiente': 'warning',
        'Autoriza': 'success',
        'Informa': 'info',
        'Refacción': 'primary',
        'Entregar': 'success',
        'Ninguno': 'secondary'
    }
    return severityMap[estadoOrden.value] || 'secondary'
}

// Funciones del servicio
const crearNuevaOrden = () => {
    // Limpiar formulario
    ordenId.value = null
    ordenNumero.value = ''
    cliente.value = {
        nombre: '',
        celular: '',
        domicilio: '',
        rfc: '',
        colonia: '',
        ciudad: '',
        estado: '',
        cp: '',
        email: '',
        telefono: '',
        contacto: ''
    }
    equipo.value = {
        marca: '',
        modelo: '',
        noSerie: '',
        tipo: '',
        falla: '',
        accesorios: ''
    }
    fechas.value = {
        ingreso: new Date(),
        salida: null,
        autorizacion: null,
        llegadaRefaccion: null
    }
    toast.showInfo('Formulario listo para una nueva orden', 'Nueva Orden')
    estado.value = {
        pendiente: '',
        enviadoANombre: '',
        fechaEnvio: null,
        notasEnvio: '',
        reparadoPor: '',
        fechaReparacion: null,
        descripcionReparacion: ''
    }
    estadoOrden.value = 'Pendiente'
    referencias.value = 'Ninguno'
    tipoCargo.value = 'CargoRegular'
    financiero.value = {
        presupuesto: 0.00,
        revision: 0.00,
        anticipo: 0.00,
        pagos: 0.00,
        iva: 0.00
    }
}

const guardarOrden = async () => {
    try {
        loading.value = true
        
        const ordenData: OrdenServicio = {
            id: ordenId.value || undefined,
            numeroOrden: ordenNumero.value,
            fechaCreacion: new Date(),
            cliente: cliente.value,
            equipo: equipo.value,
            fechas: fechas.value,
            estado: estado.value,
            estadoOrden: estadoOrden.value,
            referencias: referencias.value,
            tipoCargo: tipoCargo.value,
            financiero: financiero.value,
            historial: historial.value
        }

        if (ordenId.value) {
            // Actualizar orden existente
            await ordenService.actualizarOrden(ordenId.value, {
                ...ordenData,
                id: ordenId.value
            })
            toast.showSuccess(`Orden #${ordenNumero.value} actualizada correctamente`, 'Orden Actualizada')
        } else {
            // Crear nueva orden
            const nuevaOrden = await ordenService.crearOrden({
                cliente: cliente.value,
                equipo: equipo.value,
                fechas: fechas.value
            })
            ordenId.value = nuevaOrden.id || null
            ordenNumero.value = nuevaOrden.numeroOrden
            toast.showSuccess(`Orden #${nuevaOrden.numeroOrden} creada exitosamente`, 'Orden Creada')
        }

        // Agregar entrada al historial
        historial.value.push({
            fecha: new Date().toLocaleDateString('es-MX'),
            accion: ordenId.value ? 'Actualización de orden' : 'Creación de orden',
            usuario: 'Usuario Actual'
        })
    } catch (error: any) {
        console.error('Error al guardar orden:', error)
        const errorMessage = error.response?.data?.message || 'Error al guardar la orden. Por favor intenta de nuevo.'
        toast.showError(errorMessage, 'Error al Guardar')
    } finally {
        loading.value = false
    }
}

const cargarOrden = async (id: string) => {
    try {
        loading.value = true
        const orden = await ordenService.obtenerOrden(id)
        
        // Cargar datos en el formulario
        ordenId.value = orden.id || null
        ordenNumero.value = orden.numeroOrden
        cliente.value = orden.cliente
        equipo.value = orden.equipo
        fechas.value = orden.fechas
        estado.value = orden.estado
        estadoOrden.value = orden.estadoOrden
        referencias.value = orden.referencias
        tipoCargo.value = orden.tipoCargo
        financiero.value = orden.financiero
        historial.value = orden.historial
    } catch (error) {
        console.error('Error al cargar orden:', error)
        alert('Error al cargar la orden.')
    } finally {
        loading.value = false
    }
}

const imprimirTicket = async () => {
    if (!ordenId.value) {
        toast.showWarning('Debe guardar la orden primero', 'Orden no Guardada')
        return
    }
    try {
        loading.value = true
        const blob = await ordenService.imprimirTicket(ordenId.value)
        const url = window.URL.createObjectURL(blob)
        window.open(url, '_blank')
        toast.showSuccess('Ticket generado correctamente', 'Impresión Exitosa')
    } catch (error) {
        console.error('Error al imprimir ticket:', error)
        toast.showError('Error al imprimir el ticket', 'Error de Impresión')
    } finally {
        loading.value = false
    }
}

const imprimirOrdenCompleta = async () => {
    if (!ordenId.value) {
        toast.showWarning('Debe guardar la orden primero', 'Orden no Guardada')
        return
    }
    try {
        loading.value = true
        const blob = await ordenService.imprimirOrden(ordenId.value)
        const url = window.URL.createObjectURL(blob)
        window.open(url, '_blank')
        toast.showSuccess('Orden completa generada correctamente', 'Impresión Exitosa')
    } catch (error) {
        console.error('Error al imprimir orden:', error)
        toast.showError('Error al imprimir la orden', 'Error de Impresión')
    } finally {
        loading.value = false
    }
}

// Lifecycle
onMounted(() => {
    // Si hay un ID en la ruta, cargar la orden
    const id = route.params.id as string
    if (id) {
        cargarOrden(id)
    }
})
</script>

<style scoped>
.orden-servicio-page {
    padding: 1.5rem;
    background: #f8f9fa;
    min-height: 100vh;
}

/* Header */
.orden-servicio-page {
    transition: zoom 0.2s ease;
}

.header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    background: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Zoom Control */
.zoom-control {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0.5rem 0.85rem;
    min-width: 160px;
}

.zoom-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #64748b;
    display: flex;
    align-items: center;
    gap: 0.3rem;
}

.zoom-actions {
    display: flex;
    align-items: center;
    gap: 0.4rem;
}

.zoom-btn {
    width: 26px;
    height: 26px;
    border: 1px solid #cbd5e1;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    color: #475569;
    transition: background 0.15s, border-color 0.15s;
    padding: 0;
}

.zoom-btn:hover:not(:disabled) {
    background: #3b82f6;
    border-color: #3b82f6;
    color: white;
}

.zoom-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.zoom-btn.zoom-reset {
    color: #64748b;
}

.zoom-value {
    font-size: 0.8rem;
    font-weight: 700;
    color: #1e293b;
    min-width: 38px;
    text-align: center;
}

.zoom-slider {
    width: 100%;
    accent-color: #3b82f6;
    cursor: pointer;
    height: 4px;
}

.order-info {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.order-badge {
    background: #3b82f6;
    color: white;
    width: 60px;
    height: 60px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
}

.order-details {
    display: flex;
    flex-direction: column;
}

.order-label {
    font-size: 0.875rem;
    color: #64748b;
}

.order-number {
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
    color: #1e293b;
}

.order-date {
    text-align: right;
}

.date-label {
    font-size: 0.875rem;
    color: #64748b;
    display: block;
}

.date-value {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
}

/* Action Buttons */
.action-buttons {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
}

.action-buttons :deep(.p-button) {
    font-size: 0.875rem;
}

/* Content Grid */
.content-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1.5rem;
}

@media (max-width: 1200px) {
    .content-grid {
        grid-template-columns: 1fr;
    }
}

/* Cards */
.section-card {
    margin-bottom: 1.5rem;
}

.card-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
}

.card-title i {
    color: #3b82f6;
}

/* Form Grid */
.form-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.form-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-field.flex-1 {
    grid-column: span 1;
}

.form-field.flex-2 {
    grid-column: span 2;
}

.form-field label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #475569;
}

.form-field :deep(.p-inputtext) {
    width: 100%;
}

/* Radio Sections */
.radio-section {
    margin-bottom: 1rem;
}

.section-subtitle {
    font-size: 0.75rem;
    font-weight: 600;
    color: #64748b;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.radio-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
}

.radio-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.radio-option label {
    font-size: 0.875rem;
    color: #475569;
    cursor: pointer;
}

/* Financial Grid */
.financial-grid {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.financial-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
}

.financial-row label {
    font-size: 0.875rem;
    color: #475569;
    flex-shrink: 0;
}

.financial-row :deep(.p-inputnumber) {
    width: 140px;
    max-width: 140px;
    flex-shrink: 0;
}

.financial-row :deep(.p-inputnumber-input) {
    width: 100%;
    max-width: 100%;
    text-align: right;
}

.financial-row.total {
    margin-top: 0.5rem;
}

.total-value {
    font-size: 1.125rem;
    font-weight: 700;
    color: #1e293b;
}

/* Tabs */
.tab-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.tab-header i {
    font-size: 0.875rem;
}

:deep(.p-tabview-nav) {
    background: transparent;
}

:deep(.p-tabview-panels) {
    padding: 1rem 0;
}

/* DataTable */
:deep(.p-datatable) {
    font-size: 0.875rem;
}

/* Tabla Refacciones */
.tabla-refacciones {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.tabla-actions {
    display: flex;
    gap: 0.5rem;
}

.refacciones-table :deep(.p-datatable-tbody > tr > td) {
    padding: 0.35rem 0.5rem;
}

.refacciones-table :deep(.p-datatable-thead > tr > th) {
    padding: 0.5rem;
    font-size: 0.8rem;
    white-space: nowrap;
}

.codigo-badge {
    display: inline-block;
    background: #e2e8f0;
    color: #475569;
    border-radius: 4px;
    padding: 2px 8px;
    font-weight: 600;
    font-size: 0.8rem;
}
</style>
