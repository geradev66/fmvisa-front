<template>
    <Card class="section-card refacciones-card">
        <template #title>
            <div class="card-title">
                <i class="pi pi-table"></i>
                <span>Refacciones / Partes</span>
            </div>
        </template>
        <template #content>
            <div class="refacciones-content">
                <div class="tabla-refacciones">
                <div class="tabla-actions">
                    <Button icon="pi pi-plus" label="Agregar refacción" severity="primary" size="small"
                        @click="abrirDialogoSeleccion" />
                    <Button icon="pi pi-file-edit" label="Agregar nueva refacción" severity="contrast" size="small"
                        @click="agregarFilaVacia" />
                    <Button icon="pi pi-trash" label="Eliminar" severity="danger" size="small" outlined
                        @click="eliminarRefaccion" :disabled="!refaccionSeleccionada" />
                    <!-- <Button icon="pi pi-bookmark" label="Nueva Refacción" severity="secondary" size="small"
                        @click="abrirDialogoAlta" /> -->
                </div>
                <ConceptosFijosCard :financiero="financiero" @update:financiero="emit('update:financiero', $event)" />
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
                     <Column field="pago" header="Pago" style="width: 100px; min-width: 100px">
                        <template #body="{ data }">{{ formatCurrency(data.pago) }}</template>
                        <template #editor="{ data, field }">
                            <InputNumber v-model="data[field]" mode="currency" currency="USD" locale="en-US"
                                style="width: 100%" />
                        </template>
                    </Column>
                    <!-- <Column field="formaPago" header="Pago" style="width: 100px; min-width: 100px">
                        <template #editor="{ data }">
                            <Select v-model="data.formaPago" :options="opcionesPago" placeholder="Seleccionar"
                                style="width: 100%" />
                        </template>
                    </Column> -->
                    <Column header="" style="width: 28px; min-width: 28px; text-align: center">
                        <template #body="{ data }">
                            <i v-if="data.guardandoEnCatalogo" class="pi pi-spin pi-spinner"
                               style="font-size: 13px; color: #3b82f6" title="Guardando en catálogo..." />
                            <i v-else-if="data.catalogId" class="pi pi-check-circle"
                               style="font-size: 13px; color: #22c55e" title="Guardada en catálogo" />
                            <i v-else-if="data.catalogId === null" class="pi pi-exclamation-circle"
                               style="font-size: 13px; color: #f59e0b" title="Sin guardar en catálogo" />
                        </template>
                    </Column>
                </DataTable>
                </div>
            </div>
        </template>
    </Card>

    <!-- ── Diálogo: Seleccionar refacción del catálogo ── -->
    <Dialog v-model:visible="dialogoSeleccionVisible" header="Seleccionar Refacción" modal
        style="width: 720px; max-width: 95vw">
        <div class="dialogo-seleccion">
            <InputText v-model="filtroTexto" placeholder="Buscar por nombre o aparato…"
                class="w-full mb-2" />
            <DataTable :value="refaccionesFiltradas" v-model:selection="catalogoSeleccionada"
                selectionMode="single" dataKey="_id" :loading="cargandoCatalogo"
                class="p-datatable-sm catalogo-table" stripedRows scrollable scrollHeight="320px">
                <Column selectionMode="single" headerStyle="width: 2.5rem" />
                <Column field="nombre" header="Nombre" style="min-width: 160px" />
                <Column field="aparato" header="Aparato" style="min-width: 110px" />
                <Column field="precio" header="Precio" style="width: 90px">
                    <template #body="{ data }">{{ formatCurrency(data.precio ?? null) }}</template>
                </Column>
                <Column field="existencias" header="Exist." style="width: 70px" />
                <Column field="ubicacion" header="Ubicación" style="min-width: 100px" />
            </DataTable>
        </div>
        <template #footer>
            <Button label="Cancelar" severity="secondary" size="small"
                @click="dialogoSeleccionVisible = false" />
            <Button label="Seleccionar" size="small" :disabled="!catalogoSeleccionada"
                @click="confirmarSeleccion" />
        </template>
    </Dialog>

    <!-- ── Diálogo: Alta de nueva refacción ── -->
    <Dialog v-model:visible="dialogoAltaVisible" header="Alta de Refacción" modal
        style="width: 90vh;">
        <div class="dialogo-alta">
            <div class="campo">
                <label>Nombre <span class="req">*</span></label>
                <InputText v-model="nuevaRefaccion.nombre" placeholder="Ej. Cable Flex Pantalla" class="w-full" />
            </div>
            <div class="campo">
                <label>Aparato <span class="req">*</span></label>
                <InputText v-model="nuevaRefaccion.aparato" placeholder="Ej. Laptop" class="w-full" />
            </div>
            <div class="campos-dobles">
                <div class="campo">
                    <label>Precio</label>
                    <InputNumber v-model="nuevaRefaccion.precio" mode="currency" currency="USD"
                        locale="en-US" class="w-full" />
                </div>
                <div class="campo">
                    <label>Costo</label>
                    <InputNumber v-model="nuevaRefaccion.costo" mode="currency" currency="USD"
                        locale="en-US" class="w-full" />
                </div>
            </div>
            <div class="campos-dobles">
                <div class="campo">
                    <label>Existencias</label>
                    <InputNumber v-model="nuevaRefaccion.existencias" :useGrouping="false" :min="0"
                        class="w-full" />
                </div>
                <div class="campo">
                    <label>Compra</label>
                    <InputNumber v-model="nuevaRefaccion.compra" mode="currency" currency="USD"
                        locale="en-US" class="w-full" />
                </div>
            </div>
            <div class="campo">
                <label>Ubicación</label>
                <InputText v-model="nuevaRefaccion.ubicacion" placeholder="Ej. Estante A1" class="w-full" />
            </div>
            <p v-if="errorAlta" class="error-msg">{{ errorAlta }}</p>
        </div>
        <template #footer>
            <Button label="Cancelar" severity="secondary" size="small" @click="cerrarDialogoAlta" />
            <Button label="Guardar" size="small" :loading="guardando" @click="guardarNuevaRefaccion" />
        </template>
    </Dialog>
    <!-- ── Diálogo: Seleccionar refacción a actualizar ── -->
    <Dialog v-model:visible="dialogoActualizarVisible" header="Seleccionar Refacción a Actualizar" modal
        style="width: 420px; max-width: 95vw">
        <div class="dialogo-seleccion">
            <Select v-model="refaccionActualizarSeleccionada"
                :options="catalogo"
                optionLabel="nombre"
                filter
                placeholder="Buscar y seleccionar refacción..."
                class="w-full mb-2"
                :itemTemplate="refaccionOptionTemplate"
            />
        </div>
        <template #footer>
            <Button label="Cancelar" severity="secondary" size="small" @click="cerrarDialogoActualizar" />
            <Button label="Editar" size="small" :disabled="!refaccionActualizarSeleccionada" @click="abrirFormularioActualizar" />
        </template>
    </Dialog>

    <!-- ── Diálogo: Formulario de actualización ── -->
    <Dialog v-model:visible="dialogoFormularioActualizarVisible" header="Actualizar Refacción" modal
        style="width: 480px; max-width: 95vw">
        <div class="dialogo-alta">
            <div class="campo">
                <label>Nombre <span class="req">*</span></label>
                <InputText v-model="refaccionActualizar.nombre" class="w-full" />
            </div>
            <div class="campo">
                <label>Aparato <span class="req">*</span></label>
                <InputText v-model="refaccionActualizar.aparato" class="w-full" />
            </div>
            <div class="campos-dobles">
                <div class="campo">
                    <label>Precio</label>
                    <InputNumber v-model="refaccionActualizar.precio" mode="currency" currency="USD"
                        locale="en-US" class="w-full" />
                </div>
                <div class="campo">
                    <label>Costo</label>
                    <InputNumber v-model="refaccionActualizar.costo" mode="currency" currency="USD"
                        locale="en-US" class="w-full" />
                </div>
            </div>
            <div class="campos-dobles">
                <div class="campo">
                    <label>Existencias</label>
                    <InputNumber v-model="refaccionActualizar.existencias" :useGrouping="false" :min="0"
                        class="w-full" />
                </div>
                <div class="campo">
                    <label>Compra</label>
                    <InputNumber v-model="refaccionActualizar.compra" mode="currency" currency="USD"
                        locale="en-US" class="w-full" />
                </div>
            </div>
            <div class="campo">
                <label>Ubicación</label>
                <InputText v-model="refaccionActualizar.ubicacion" class="w-full" />
            </div>
            <p v-if="errorActualizar" class="error-msg">{{ errorActualizar }}</p>
        </div>
        <template #footer>
            <Button label="Cancelar" severity="secondary" size="small" @click="cerrarFormularioActualizar" />
            <Button label="Guardar" size="small" :loading="guardandoActualizar" @click="guardarActualizarRefaccion" />
        </template>
    </Dialog>

    <!-- ── Diálogo: Seleccionar refacción para cambiar existencias ── -->
        <Dialog v-model:visible="dialogoSeleccionExistenciasVisible" header="Seleccionar Refacción para Cambiar Existencias" modal
            style="width: 420px; max-width: 95vw">
            <div class="dialogo-seleccion">
                <Select v-model="refaccionExistenciasSeleccionada"
                    :options="catalogo"
                    optionLabel="nombre"
                    filter
                    placeholder="Buscar y seleccionar refacción..."
                    class="w-full mb-2"
                    :itemTemplate="refaccionOptionTemplate"
                />
            </div>
            <template #footer>
                <Button label="Cancelar" severity="secondary" size="small" @click="cerrarDialogoSeleccionExistencias" />
                <Button label="Editar Existencias" size="small" :disabled="!refaccionExistenciasSeleccionada" @click="abrirFormularioExistencias" />
            </template>
        </Dialog>

        <!-- ── Diálogo: Formulario de existencias ── -->
        <Dialog v-model:visible="dialogoFormularioExistenciasVisible" header="Cambiar Existencias" modal
            style="width: 340px; max-width: 95vw">
            <div class="dialogo-alta">
                <div class="campo">
                    <label>Existencias</label>
                    <InputNumber v-model="existenciasActualizar" :useGrouping="false" :min="0" class="w-full" />
                </div>
                <p v-if="errorExistencias" class="error-msg">{{ errorExistencias }}</p>
            </div>
            <template #footer>
                <Button label="Cancelar" severity="secondary" size="small" @click="cerrarFormularioExistencias" />
                <Button label="Guardar" size="small" :loading="guardandoExistencias" @click="guardarExistencias" />
            </template>
        </Dialog>


</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import Select from 'primevue/select'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { useRefaccionService } from '../composables/useRefaccionService'
import ConceptosFijosCard from './ConceptosFijosCard.vue'
import type { Refaccion as RefaccionModel, RefaccionCreate } from '../models/refaccion'
import type { RefaccionItem, Financiero } from '../models/orden-servicio'

interface Props {
    modelValue: RefaccionItem[]
    financiero: Financiero
}

interface Emits {
    (e: 'update:modelValue', v: RefaccionItem[]): void
    (e: 'update:financiero', v: Financiero): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// ── Alias local ──
type RefaccionPartida = RefaccionItem

const opcionesPago = ['Efectivo', 'Tarjeta', 'Transferencia', 'Cheques', 'Otro']

const refaccionService = useRefaccionService()

// ── Estado de la tabla ──
const refacciones = ref<RefaccionItem[]>(props.modelValue && props.modelValue.length > 0 ? [...props.modelValue] : [])
const refaccionSeleccionada = ref<RefaccionItem | null>(null)

// Sincronizar cuando el padre reemplaza el array (ej. nueva orden o restaurar borrador)
// La bandera evita que el watch de refacciones emita de vuelta al padre y genere un ciclo infinito
let sincronizandoDesdeParent = false
watch(() => props.modelValue, (val) => {
    sincronizandoDesdeParent = true
    refacciones.value = val && val.length > 0 ? [...val] : []
    sincronizandoDesdeParent = false
})
// flush:'sync' hace que este watcher dispare INMEDIATAMENTE al mutar el array,
// así la bandera sigue activa cuando se evalúa y se omite el emit al padre
watch(refacciones, (val) => {
    if (!sincronizandoDesdeParent) emit('update:modelValue', val)
}, { deep: true, flush: 'sync' })

// ── Catálogo cargado del servicio ──
const catalogo = ref<RefaccionModel[]>([])
const cargandoCatalogo = ref(false)

onMounted(async () => {
    cargandoCatalogo.value = true
    try {
        const res = await refaccionService.obtenerRefacciones({ limit: 1000 })
        catalogo.value = res.data
    } catch (e) {
        console.error('Error cargando catálogo de refacciones', e)
    } finally {
        cargandoCatalogo.value = false
    }
})

// ── Diálogo selección ──
const dialogoSeleccionVisible = ref(false)
const filtroTexto = ref('')
const catalogoSeleccionada = ref<RefaccionModel | null>(null)

const refaccionesFiltradas = computed(() => {
    if (!filtroTexto.value) return catalogo.value
    const q = filtroTexto.value.toLowerCase()
    return catalogo.value.filter(r =>
        r.nombre.toLowerCase().includes(q) ||
        r.aparato.toLowerCase().includes(q)
    )
})

const abrirDialogoSeleccion = () => {
    catalogoSeleccionada.value = null
    filtroTexto.value = ''
    dialogoSeleccionVisible.value = true
}

const confirmarSeleccion = () => {
    if (!catalogoSeleccionada.value) return
    const r = catalogoSeleccionada.value
    const nextCodigo = refacciones.value.length > 0
        ? Math.max(...refacciones.value.map(p => p.codigo)) + 1
        : 1
    refacciones.value.push({
        codigo: nextCodigo,
        nombre: r.nombre,
        aparato: r.aparato,
        cantidad: 1,
        precio: r.precio ?? null,
        costo: r.costo ?? null,
        existencia: r.existencias ?? null,
        ubicacion: r.ubicacion ?? '',
        compraCosto: r.compra ?? null,
        fechaPresupuesto: null,
        formaPago: undefined,
        catalogId: r._id ?? null,
        guardandoEnCatalogo: false
    })
    dialogoSeleccionVisible.value = false
}

// ── Diálogo alta ──
const dialogoAltaVisible = ref(false)
const guardando = ref(false)
const errorAlta = ref('')

const nuevaRefaccion = ref<RefaccionCreate>({
    nombre: '',
    aparato: '',
    precio: undefined,
    costo: undefined,
    existencias: undefined,
    ubicacion: '',
    compra: undefined
})

// const abrirDialogoAlta = () => {
//     nuevaRefaccion.value = {
//         nombre: '',
//         aparato: '',
//         precio: undefined,
//         costo: undefined,
//         existencias: undefined,
//         ubicacion: '',
//         compra: undefined
//     }
//     errorAlta.value = ''
//     dialogoAltaVisible.value = true
// }

const cerrarDialogoAlta = () => {
    dialogoAltaVisible.value = false
}

const guardarNuevaRefaccion = async () => {
    if (!nuevaRefaccion.value.nombre.trim() || !nuevaRefaccion.value.aparato.trim()) {
        errorAlta.value = 'Nombre y Aparato son obligatorios.'
        return
    }
    errorAlta.value = ''
    guardando.value = true
    try {
        const creada = await refaccionService.crearRefaccion(nuevaRefaccion.value)
        catalogo.value.push(creada)
        dialogoAltaVisible.value = false
    } catch (e) {
        console.error('Error creando refacción', e)
        errorAlta.value = 'Ocurrió un error al guardar. Intenta de nuevo.'
    } finally {
        guardando.value = false
    }
}

const agregarFilaVacia = () => {
    const nextCodigo = refacciones.value.length > 0
        ? Math.max(...refacciones.value.map(p => p.codigo)) + 1
        : 1
    refacciones.value.push({
        codigo: nextCodigo,
        nombre: '',
        aparato: '',
        cantidad: 1,
        precio: null,
        costo: null,
        existencia: null,
        ubicacion: '',
        compraCosto: null,
        fechaPresupuesto: null,
        formaPago: undefined,
        catalogId: null,
        guardandoEnCatalogo: false
    })
}

// ── Tabla ──
const eliminarRefaccion = () => {
    if (!refaccionSeleccionada.value) return
    refacciones.value = refacciones.value.filter(r => r.codigo !== refaccionSeleccionada.value!.codigo)
    refacciones.value.forEach((r, i) => { r.codigo = i + 1 })
    refaccionSeleccionada.value = null
}

// Mapeo de campos de la tabla a campos del catálogo (excluye existencia)
const CAMPO_A_CATALOGO: Partial<Record<keyof RefaccionPartida, keyof import('../models/refaccion').RefaccionUpdate>> = {
    nombre: 'nombre',
    aparato: 'aparato',
    precio: 'precio',
    costo: 'costo',
    ubicacion: 'ubicacion',
    compraCosto: 'compra',
}

const onCellEditComplete = async (event: any) => {
    const { data, newValue, field } = event

    // Siempre mutar a través del array reactivo para que Vue rastree los cambios
    const fila = refacciones.value.find(r => r.codigo === data.codigo)
    if (!fila) return
    ;(fila as any)[field] = newValue

    // ── Caso 1: fila nueva → crear en catálogo cuando tenga nombre y aparato ──
    if (
        fila.catalogId === null &&
        fila.nombre?.trim() &&
        fila.aparato?.trim() &&
        !fila.guardandoEnCatalogo
    ) {
        fila.guardandoEnCatalogo = true
        try {
            const creada = await refaccionService.crearRefaccion({
                nombre: fila.nombre,
                aparato: fila.aparato,
                precio: fila.precio ?? undefined,
                costo: fila.costo ?? undefined,
                existencias: fila.existencia ?? undefined,
                ubicacion: fila.ubicacion ?? '',
                compra: fila.compraCosto ?? undefined
            })
            catalogo.value.push(creada)
            fila.catalogId = creada._id ?? `local-${Date.now()}`
        } catch (e) {
            console.error('Error guardando refacción nueva en catálogo', e)
        } finally {
            fila.guardandoEnCatalogo = false
        }
        return
    }

    // ── Caso 2: fila existente → sincronizar campo modificado vía PATCH ──
    const campoCatalogo = CAMPO_A_CATALOGO[field as keyof RefaccionPartida]
    if (fila.catalogId && campoCatalogo && !fila.guardandoEnCatalogo) {
        fila.guardandoEnCatalogo = true
        try {
            const dto: Partial<import('../models/refaccion').RefaccionUpdate> = {
                [campoCatalogo]: newValue ?? undefined
            }
            const actualizada = await refaccionService.patchRefaccion(fila.catalogId, dto)
            const idx = catalogo.value.findIndex(r => r._id === actualizada._id)
            if (idx !== -1) catalogo.value[idx] = actualizada
        } catch (e) {
            console.error('Error sincronizando campo en catálogo', e)
        } finally {
            fila.guardandoEnCatalogo = false
        }
    }
}

const formatCurrency = (value: number | null): string => {
    if (value == null) return '—'
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

// ── Actualizar refacción ──
const dialogoActualizarVisible = ref(false)
const refaccionActualizarSeleccionada = ref<RefaccionModel | null>(null)
const dialogoFormularioActualizarVisible = ref(false)
const refaccionActualizar = ref<any>({})
const guardandoActualizar = ref(false)
const errorActualizar = ref('')


const refaccionOptionTemplate = (option: RefaccionModel) => {
    if (!option) return ''
    return `${option.nombre} (${option.aparato}) - ${option.ubicacion ?? ''}`
}

// const abrirDialogoActualizar = () => {
//     refaccionActualizarSeleccionada.value = null
//     dialogoActualizarVisible.value = true
// }
const cerrarDialogoActualizar = () => {
    dialogoActualizarVisible.value = false
}
const abrirFormularioActualizar = () => {
    if (!refaccionActualizarSeleccionada.value) return
    refaccionActualizar.value = { ...refaccionActualizarSeleccionada.value }
    errorActualizar.value = ''
    dialogoActualizarVisible.value = false
    dialogoFormularioActualizarVisible.value = true
}
const cerrarFormularioActualizar = () => {
    dialogoFormularioActualizarVisible.value = false
    // Regresar al selector para poder elegir otra refacción si se desea
    dialogoActualizarVisible.value = true
}
const guardarActualizarRefaccion = async () => {
    if (!refaccionActualizar.value.nombre.trim() || !refaccionActualizar.value.aparato.trim()) {
        errorActualizar.value = 'Nombre y Aparato son obligatorios.'
        return
    }
    errorActualizar.value = ''
    guardandoActualizar.value = true
    try {
        const actualizada = await refaccionService.actualizarRefaccion(refaccionActualizar.value.id, refaccionActualizar.value)
        // Actualiza en el catálogo local
        const idx = catalogo.value.findIndex(r => r._id === actualizada._id)
        if (idx !== -1) catalogo.value[idx] = actualizada
        dialogoFormularioActualizarVisible.value = false
        dialogoActualizarVisible.value = false
    } catch (e) {
        errorActualizar.value = 'Ocurrió un error al actualizar.'
    } finally {
        guardandoActualizar.value = false
    }
}

// ── Cambiar existencias ──
// ── Cambiar existencias (nuevo flujo con selector y formulario) ──
const dialogoSeleccionExistenciasVisible = ref(false)
const dialogoFormularioExistenciasVisible = ref(false)
const refaccionExistenciasSeleccionada = ref<RefaccionModel | null>(null)
const existenciasActualizar = ref<number | null>(null)
const guardandoExistencias = ref(false)
const errorExistencias = ref('')

// const abrirDialogoExistencias = () => {
//     refaccionExistenciasSeleccionada.value = null
//     dialogoSeleccionExistenciasVisible.value = true
// }
const cerrarDialogoSeleccionExistencias = () => {
    dialogoSeleccionExistenciasVisible.value = false
}
const abrirFormularioExistencias = () => {
    if (!refaccionExistenciasSeleccionada.value) return
    existenciasActualizar.value = refaccionExistenciasSeleccionada.value.existencias ?? 0
    errorExistencias.value = ''
    dialogoSeleccionExistenciasVisible.value = false
    dialogoFormularioExistenciasVisible.value = true
}
const cerrarFormularioExistencias = () => {
    dialogoFormularioExistenciasVisible.value = false
    // Regresar al selector para poder elegir otra refacción si se desea
    dialogoSeleccionExistenciasVisible.value = true
}
const guardarExistencias = async () => {
    if (existenciasActualizar.value == null || existenciasActualizar.value < 0) {
        errorExistencias.value = 'El valor debe ser mayor o igual a 0.'
        return
    }
    errorExistencias.value = ''
    guardandoExistencias.value = true
    try {
        if (!refaccionExistenciasSeleccionada.value || !refaccionExistenciasSeleccionada.value._id) {
            errorExistencias.value = 'No hay refacción seleccionada.'
            return
        }
        const actualizada = await refaccionService.actualizarRefaccion(refaccionExistenciasSeleccionada.value._id, { _id: refaccionExistenciasSeleccionada.value._id, existencias: existenciasActualizar.value })
        const idx = catalogo.value.findIndex(r => r._id === actualizada._id)
        if (idx !== -1) catalogo.value[idx] = actualizada
        dialogoFormularioExistenciasVisible.value = false
        dialogoSeleccionExistenciasVisible.value = false
    } catch (e) {
        errorExistencias.value = 'Ocurrió un error al actualizar existencias.'
    } finally {
        guardandoExistencias.value = false
    }
}

defineExpose({ refacciones })
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
    color: var(--text-color);
}

.card-title i {
    color: #3b82f6;
}

.refacciones-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    gap: 0.3rem;
}

.tabla-refacciones {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow: hidden;
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

/* ── Diálogos ── */
.dialogo-seleccion,
.dialogo-alta {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.catalogo-table :deep(.p-datatable-tbody > tr > td) {
    padding: 0.2rem 0.4rem;
    font-size: 13px;
}

.catalogo-table :deep(.p-datatable-thead > tr > th) {
    padding: 0.3rem 0.4rem;
    font-size: 12px;
}

.campo {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
}

.campo label {
    font-size: 12px;
    font-weight: 600;
    color: #475569;
}

.req {
    color: #ef4444;
}

.campos-dobles {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
}

.w-full {
    width: 100%;
}

.mb-2 {
    margin-bottom: 0.5rem;
}

.error-msg {
    color: #ef4444;
    font-size: 12px;
    margin: 0;
}
</style>
