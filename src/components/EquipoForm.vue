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
                                <div class="form-field equipo-busqueda-wrapper" style="position: relative; grid-column: 1 / -1;" ref="busquedaWrapperRef">
                                    <FloatLabel variant="on">
                                        <InputText
                                            id="buscar-equipo"
                                            :modelValue="busquedaEquipo"
                                            @update:modelValue="onBusquedaEquipoChange"
                                            @keydown="onBusquedaKeydown"
                                            placeholder="Buscar por tipo, marca, modelo o serie..."
                                            autocomplete="off"
                                        />
                                        <label for="buscar-equipo">Buscar equipo existente</label>
                                    </FloatLabel>
                                    <Transition name="dropdown">
                                        <div v-if="equiposSugeridos.length > 0 && mostrarSugerenciasEquipo" class="equipos-options">
                                            <div class="equipos-found">
                                                <i class="pi pi-desktop"></i>
                                                <span>Equipos encontrados ({{ equiposSugeridos.length }})</span>
                                            </div>
                                            <ul ref="listaEquiposRef">
                                                <li
                                                    v-for="(item, idx) in equiposSugeridos"
                                                    :key="item._id"
                                                    :class="{ 'equipo-activo': idx === indiceSugerencia }"
                                                    @click="seleccionarEquipo(item)"
                                                    @mouseenter="indiceSugerencia = idx"
                                                >
                                                    <span class="equipo-nombre">{{ item.marca }} {{ item.modelo }}</span>
                                                    <span class="equipo-serie">S/N: {{ item.tipo }}</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </Transition>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <InputText size="small" id="marca" :modelValue="equipo.marca"
                                            @update:modelValue="updateEquipo('marca', $event)" />
                                        <label for="marca">Tipo</label>
                                    </FloatLabel>
                                </div>
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <InputText size="small" id="modelo" :modelValue="equipo.modelo"
                                            @update:modelValue="updateEquipo('modelo', $event)" />
                                        <label for="modelo">Marca</label>
                                    </FloatLabel>
                                </div>
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <InputText size="small" id="noSerie" :modelValue="equipo.noSerie"
                                            @update:modelValue="updateEquipo('noSerie', $event)" />
                                        <label for="noSerie">Modelo</label>
                                    </FloatLabel>
                                </div>
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <InputText size="small" id="tipo" :modelValue="equipo.tipo"
                                            @update:modelValue="updateEquipo('tipo', $event)" />
                                        <label for="tipo">Serie</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <Textarea size="small" id="falla" :modelValue="equipo.falla"
                                            @update:modelValue="updateEquipo('falla', $event)" rows="2" auto-resize />
                                        <label for="falla">Falla Reportada</label>
                                    </FloatLabel>
                                </div>
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <Textarea size="small" id="accesorios" :modelValue="equipo.accesorios"
                                            @update:modelValue="updateEquipo('accesorios', $event)" rows="2"
                                            auto-resize />
                                        <label for="accesorios">Accesorios</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <Textarea size="small" id="observaciones" :modelValue="equipo.observaciones"
                                            @update:modelValue="updateEquipo('observaciones', $event)" rows="2"
                                            auto-resize />
                                        <label for="observaciones">Diagnóstico</label>
                                    </FloatLabel>
                                </div>
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <Textarea size="small" id="diagnostico" :modelValue="equipo.diagnostico"
                                            @update:modelValue="updateEquipo('diagnostico', $event)" rows="2"
                                            auto-resize />
                                        <label for="diagnostico">Observaciones</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <Textarea size="small" id="pendiente" :modelValue="equipo.pendiente"
                                            @update:modelValue="updateEquipo('pendiente', $event)" rows="2"
                                            auto-resize />
                                        <label for="pendiente">Pendiente</label>
                                    </FloatLabel>
                                </div>
                                    <div class="radio-section">
                                        <span class="section-subtitle"> Forma de Pago</span>
                                        <div class="radio-grid">
                                            <div class="radio-option">
                                                <RadioButton :modelValue="equipo.formaPago" @update:modelValue="onFormaPagoChange" inputId="efectivo" value="Efectivo" />
                                                <label for="efectivo">Efectivo</label>
                                            </div>
                                            <div class="radio-option">
                                                <RadioButton :modelValue="equipo.formaPago" @update:modelValue="onFormaPagoChange" inputId="tarjeta" value="Tarjeta" />
                                                <label for="tarjeta">Tarjeta</label>
                                            </div>
                                            <div class="radio-option">
                                                <RadioButton :modelValue="equipo.formaPago" @update:modelValue="onFormaPagoChange" inputId="transferencia" value="Transferencia" />
                                                <label for="transferencia">Transferencia</label>
                                            </div>
                                            <div class="radio-option">
                                                <RadioButton :modelValue="equipo.formaPago" @update:modelValue="onFormaPagoChange" inputId="otro" value="Otro" />
                                                <label for="otro">Otro</label>
                                            </div>
                                        </div>
                                        <div v-if="equipo.formaPago === 'Otro'" class="otro-pago-field">
                                            <FloatLabel variant="on">
                                                <InputText
                                                    size="small"
                                                    id="formaPagoEspecifique"
                                                    :modelValue="equipo.formaPagoEspecifique"
                                                    @update:modelValue="updateEquipo('formaPagoEspecifique', $event)"
                                                />
                                                <label for="formaPagoEspecifique">Especifique</label>
                                            </FloatLabel>
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
                                            @update:modelValue="updateFechas('presupuesto', $event)" 
                                            showIcon />
                                    </FloatLabel>
                                </div>

                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <label class="field-label">Fecha de Salida</label>
                                        <DatePicker size="large" :modelValue="fechas.salida"
                                            @update:modelValue="updateFechas('salida', $event)" 
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
                                            showIcon />
                                    </FloatLabel>
                                </div>
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <label class="field-label">Pedido Refacción</label>
                                        <DatePicker size="large" :modelValue="fechas.pedidoRefaccion"
                                            @update:modelValue="updateFechas('pedidoRefaccion', $event)"
                                            showIcon />
                                    </FloatLabel>
                                </div>
                            </div>
                            <div class="form-row">

                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <label class="field-label">Llegada Refacción</label>
                                        <DatePicker size="large" :modelValue="fechas.llegadaRefaccion"
                                            @update:modelValue="updateFechas('llegadaRefaccion', $event)"
                                            showIcon />
                                    </FloatLabel>
                                </div>
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <InputText size="large" id="noPedido" v-model="estado.noPedido" />
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
                                            showIcon />
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
                                        <label for="Reparado por"></label>
                                        <div class="tecnico-select-row">
                                            <Select
                                                :modelValue="estado.reparadoPor"
                                                @update:modelValue="updateEstado('reparadoPor', $event)"
                                                :options="tecnicosNombres"
                                                :loading="cargandoTecnicos"
                                                filter
                                                placeholder="Seleccionar técnico..."
                                                class="tecnico-select"
                                            />
                                            <Button
                                                icon="pi pi-plus"
                                                severity="secondary"
                                                size="small"
                                                @click="abrirDialogoTecnico"
                                                v-tooltip="'Nuevo técnico'"
                                            />
                                        </div>
                                </div>
                                <div class="form-field">
                                    <FloatLabel variant="on">
                                        <label class="field-label">Fecha Reparación</label>
                                        <DatePicker size="large" :modelValue="estado.fechaReparacion"
                                            @update:modelValue="updateEstado('fechaReparacion', $event)"
                                            showIcon />
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

    <!-- Diálogo: Nuevo Técnico -->
    <Dialog v-model:visible="dialogoTecnicoVisible" header="Nuevo Técnico" :modal="true" :style="{ width: '420px' }">
        <div class="dialogo-tecnico">
            <div class="campo">
                <label>Nombre <span class="req">*</span></label>
                <InputText v-model="nuevoTecnico.nombre" class="w-full" placeholder="Nombre completo" />
                <p v-if="errorTecnico" class="error-msg">{{ errorTecnico }}</p>
            </div>
            <div class="campos-dobles">
                <div class="campo">
                    <label>Especialidad</label>
                    <InputText v-model="nuevoTecnico.especialidad" class="w-full" />
                </div>
                <div class="campo">
                    <label>Teléfono</label>
                    <InputText v-model="nuevoTecnico.telefono" class="w-full" />
                </div>
            </div>
            <div class="campo">
                <label>Email</label>
                <InputText v-model="nuevoTecnico.email" class="w-full" type="email" />
            </div>
        </div>
        <template #footer>
            <Button label="Cancelar" severity="secondary" @click="dialogoTecnicoVisible = false" :disabled="guardandoTecnico" />
            <Button label="Guardar" icon="pi pi-check" @click="guardarNuevoTecnico" :loading="guardandoTecnico" />
        </template>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import Textarea from 'primevue/textarea'
import DatePicker from 'primevue/datepicker'
import RadioButton from 'primevue/radiobutton'
import Select from 'primevue/select'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import type { Equipo } from '../models/equipo'
import type { Fechas, EstadoEquipo, HistorialItem } from '../models/orden-servicio'
import type { TecnicoCreate } from '../models/tecnico'
import { useTecnicoService } from '../composables/useTecnicoService'
import { useEquipoService } from '../composables/useEquipoService'

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
// ── Búsqueda de equipo existente ──
const equipoService = useEquipoService()
const todosLosEquipos = ref<Equipo[]>([])
const busquedaEquipo = ref('')
const mostrarSugerenciasEquipo = ref(false)
const indiceSugerencia = ref(-1)
const busquedaWrapperRef = ref<HTMLElement | null>(null)
const listaEquiposRef = ref<HTMLElement | null>(null)

const cerrarSugerencias = () => {
    mostrarSugerenciasEquipo.value = false
    indiceSugerencia.value = -1
}

const onClickOutside = (e: MouseEvent) => {
    if (busquedaWrapperRef.value && !busquedaWrapperRef.value.contains(e.target as Node)) {
        cerrarSugerencias()
    }
}

const onBusquedaKeydown = (e: KeyboardEvent) => {
    const total = equiposSugeridos.value.length
    if (!mostrarSugerenciasEquipo.value || total === 0) return
    if (e.key === 'ArrowDown' || e.key === 'Tab') {
        e.preventDefault()
        indiceSugerencia.value = (indiceSugerencia.value + 1) % total
        scrollSugerenciaVisible()
    } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        indiceSugerencia.value = (indiceSugerencia.value - 1 + total) % total
        scrollSugerenciaVisible()
    } else if (e.key === 'Enter') {
        e.preventDefault()
        if (indiceSugerencia.value >= 0) {
            seleccionarEquipo(equiposSugeridos.value[indiceSugerencia.value] as any)
        }
    } else if (e.key === 'Escape') {
        cerrarSugerencias()
    }
}

const scrollSugerenciaVisible = () => {
    if (!listaEquiposRef.value) return
    const items = listaEquiposRef.value.querySelectorAll('li')
    items[indiceSugerencia.value]?.scrollIntoView({ block: 'nearest' })
}

onMounted(async () => {
    try {
        const res = await equipoService.obtenerEquipos({ limit: 1000 })
        todosLosEquipos.value = res.data
    } catch (e) {
        console.error('Error cargando equipos', e)
    }
    document.addEventListener('mousedown', onClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('mousedown', onClickOutside)
})

const equiposSugeridos = computed(() => {
    const q = busquedaEquipo.value.trim().toLowerCase()
    if (!q) return []
    return todosLosEquipos.value.filter(e =>
        e.marca?.toLowerCase().includes(q) ||
        e.modelo?.toLowerCase().includes(q) ||
        e.noSerie?.toLowerCase().includes(q) ||
        e.tipo?.toLowerCase().includes(q)
    ).slice(0, 8)
})

const onBusquedaEquipoChange = (val: string | undefined) => {
    busquedaEquipo.value = val || ''
    indiceSugerencia.value = -1
    mostrarSugerenciasEquipo.value = true
}

const seleccionarEquipo = (equipo: Equipo) => {
    emit('update:equipo', { ...equipo })
    busquedaEquipo.value = `${equipo.marca} ${equipo.modelo} - S/N: ${equipo.tipo}`
    cerrarSugerencias()
}
const tecnicoService = useTecnicoService()
const tecnicosNombres = ref<string[]>([])
const cargandoTecnicos = ref(false)

onMounted(async () => {
    cargandoTecnicos.value = true
    try {
        const res = await tecnicoService.obtenerTecnicos({ activo: true, limit: 1000 })
        tecnicosNombres.value = res.data.map(t => t.nombre)
    } catch (e) {
        console.error('Error cargando técnicos', e)
    } finally {
        cargandoTecnicos.value = false
    }
})

// ── Diálogo nuevo técnico ──
const dialogoTecnicoVisible = ref(false)
const guardandoTecnico = ref(false)
const errorTecnico = ref('')
const nuevoTecnico = ref<TecnicoCreate>({ nombre: '', especialidad: '', telefono: '', email: '' })

const abrirDialogoTecnico = () => {
    nuevoTecnico.value = { nombre: '', especialidad: '', telefono: '', email: '' }
    errorTecnico.value = ''
    dialogoTecnicoVisible.value = true
}

const guardarNuevoTecnico = async () => {
    if (!nuevoTecnico.value.nombre.trim()) {
        errorTecnico.value = 'El nombre es obligatorio.'
        return
    }
    errorTecnico.value = ''
    guardandoTecnico.value = true
    try {
        const creado = await tecnicoService.crearTecnico(nuevoTecnico.value)
        tecnicosNombres.value.push(creado.nombre)
        updateEstado('reparadoPor', creado.nombre)
        dialogoTecnicoVisible.value = false
    } catch (e) {
        errorTecnico.value = 'Error al guardar el técnico.'
    } finally {
        guardandoTecnico.value = false
    }
}

// Update helpers — emit immutable copies upward
const updateEquipo = (field: keyof Equipo, value: any) => {
    emit('update:equipo', { ...props.equipo, [field]: value })
}

const onFormaPagoChange = (value: string) => {
    const nextEquipo: Equipo = { ...props.equipo, formaPago: value }
    if (value !== 'Otro') {
        nextEquipo.formaPagoEspecifique = ''
    }
    emit('update:equipo', nextEquipo)
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

.otro-pago-field {
    margin-top: 0.75rem;
    max-width: 240px;
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


.section-subtitle {
    font-size: .9rem;
    font-weight: 600;
    color: var(--text-muted);
    margin-bottom: 0.4rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
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

.tecnico-select-row {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    width: 100%;
}

.tecnico-select {
    flex: 1;
}

/* Búsqueda equipo */
.equipos-options {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    z-index: 1000;
    background: var(--surface-overlay);
    border: 1px solid var(--border-subtle);
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    overflow: hidden;

    ul {
        list-style: none;
        margin: 0;
        padding: 0;
        max-height: 220px;
        overflow-y: auto;

        li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0.75rem;
            border-bottom: 1px solid var(--border-faint);
            cursor: pointer;
            font-size: 13px;
            transition: background 0.15s ease;

            &:last-child {
                border-bottom: none;
            }

            &:hover {
                background: var(--surface-hover);
            }

            &.equipo-activo {
                background: var(--surface-selected);
            }
        }
    }
}

.equipos-found {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding: 0.5rem 0.75rem;
    background: var(--surface-section);
    border-bottom: 1px solid var(--border-subtle);

    i {
        font-size: 0.85rem;
        color: var(--text-faint);
    }
}

.equipo-nombre {
    font-weight: 600;
    color: var(--text-primary);
}

.equipo-serie {
    font-size: 12px;
    color: var(--text-muted);
}

/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}

/* Diálogo técnico */
.dialogo-tecnico {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.campo {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
}

.campo label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
}

.campos-dobles {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
}

.w-full {
    width: 100%;
}

.req {
    color: #ef4444;
}

.error-msg {
    color: #ef4444;
    font-size: 12px;
    margin: 0;
}
</style>
