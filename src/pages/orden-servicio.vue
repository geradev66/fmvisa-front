<template>
    <div class="orden-servicio-page">
        <!-- Header -->
        <div class="header-section">
            <div class="order-info">
                <div class="order-badge">
                    <i class="pi pi-hashtag"></i>
                </div>
                <div class="order-details">
                    <span class="order-label">Orden de Servicio</span>
                    <h1 class="order-number">{{ ordenNumero }}</h1>
                </div>
            </div>
            <div class="order-date">
                <span class="date-label">Fecha Actual</span>
                <div class="date-value">{{ fechaActual }}</div>
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
                <Card class="section-card">
                    <template #title>
                        <div class="card-title">
                            <i class="pi pi-user"></i>
                            <span>Datos del Cliente</span>
                        </div>
                    </template>
                    <template #content>
                        <div class="form-grid">
                            <div class="form-row">
                                <div class="form-field flex-2">
                                    <label>Nombre</label>
                                    <InputText v-model="cliente.nombre" placeholder="Nombre completo" />
                                </div>
                                <div class="form-field">
                                    <label>Celular</label>
                                    <InputText v-model="cliente.celular" placeholder="Número de celular" />
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-field flex-2">
                                    <label>Domicilio</label>
                                    <InputText v-model="cliente.domicilio" placeholder="Dirección" />
                                </div>
                                <div class="form-field">
                                    <label>RFC</label>
                                    <InputText v-model="cliente.rfc" placeholder="RFC" />
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-field">
                                    <label>Colonia</label>
                                    <InputText v-model="cliente.colonia" placeholder="Colonia" />
                                </div>
                                <div class="form-field">
                                    <label>Ciudad</label>
                                    <InputText v-model="cliente.ciudad" placeholder="Ciudad" />
                                </div>
                                <div class="form-field">
                                    <label>Estado</label>
                                    <InputText v-model="cliente.estado" placeholder="Edo." />
                                </div>
                                <div class="form-field">
                                    <label>C.P.</label>
                                    <InputText v-model="cliente.cp" placeholder="C.P." />
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-field">
                                    <label>Email</label>
                                    <InputText v-model="cliente.email" placeholder="correo@ejemplo.com" />
                                </div>
                                <div class="form-field">
                                    <label>Teléfono</label>
                                    <InputText v-model="cliente.telefono" placeholder="Teléfono fijo" />
                                </div>
                                <div class="form-field">
                                    <label>Contacto</label>
                                    <InputText v-model="cliente.contacto" placeholder="Persona de contacto" />
                                </div>
                            </div>
                        </div>
                    </template>
                </Card>

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
                                            <label>Llegada de Refacción</label>
                                            <Calendar v-model="fechas.llegadaRefaccion" dateFormat="mm/dd/yy" showIcon />
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-field">
                                            <label>Salida</label>
                                            <Calendar v-model="fechas.salida" dateFormat="mm/dd/yy" showIcon />
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
                                    <RadioButton v-model="referencias" inputId="garantia" value="Garantia" />
                                    <label for="garantia">Garantía</label>
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
                                    <label for="garantiaVendor">Garantía Vendor</label>
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
                                <label><strong>Subtotal</strong></label>
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

// Composables
const { calcularSubtotal, calcularTotal } = useOrdenServicio()
const ordenService = useOrdenServicioService()
const router = useRouter()
const route = useRoute()
const toast = useToast()

// Estados
const loading = ref<boolean>(false)
const ordenId = ref<string | null>(null)

// Data
const ordenNumero = ref<string>('5460')
const fechaActual = ref<string>(new Date().toLocaleDateString('es-MX', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
}))

const cliente = ref<Cliente>({
    nombre: 'CESAR EDUARDO BASURTO',
    celular: '8119915324',
    domicilio: '',
    rfc: '',
    colonia: '',
    ciudad: '',
    estado: '',
    cp: '',
    email: 'AGENCIA@FMVISA.COM.MX',
    telefono: '',
    contacto: ''
})

const equipo = ref<Equipo>({
    marca: 'CANON',
    modelo: 'EOS R50',
    noSerie: '1234567890',
    tipo: 'CAMARA MIRRORLESS',
    falla: 'No enciende el equipo, se apaga solo después de unos segundos.',
    accesorios: 'Batería, cargador, tapa de cuerpo'
})

const fechas = ref<Fechas>({
    ingreso: new Date('2025-10-20'),
    salida: new Date('2025-11-05'),
    autorizacion: null,
    llegadaRefaccion: null
})

const estado = ref<EstadoEquipo>({
    pendiente: 'PAGO $300 EN EFECTIVO 5 NOV 25',
    enviadoANombre: '',
    fechaEnvio: null,
    notasEnvio: '',
    reparadoPor: '',
    fechaReparacion: null,
    descripcionReparacion: ''
})

const historial = ref<HistorialItem[]>([
    { fecha: '17/02/2026', accion: 'Creación de orden', usuario: 'Admin' },
    { fecha: '17/02/2026', accion: 'Actualización de datos', usuario: 'Admin' }
])

const estadoOrden = ref<EstadoOrden>('Refacción')
const referencias = ref<ReferenciaTipo>('Garantia')
const tipoCargo = ref<TipoCargo>('CargoRegular')

const financiero = ref<Financiero>({
    presupuesto: 0.00,
    revision: 300,
    anticipo: 300,
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
.header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    background: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
</style>
