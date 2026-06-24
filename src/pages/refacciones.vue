<template>
    <div class="admin-page">
        <Toast />

        <!-- ── Header ── -->
        <div class="page-header">
            <div class="header-brand">
                <div class="brand-icon"><i class="pi pi-box"></i></div>
                <div>
                    <h1 class="page-title">Refacciones</h1>
                    <p class="page-sub">Catálogo de refacciones y partes</p>
                </div>
            </div>
            <div class="header-actions">
                <Button label="Volver" icon="pi pi-arrow-left" severity="secondary" outlined @click="router.push('/orden-servicio')" />
                <Button label="Nueva Refacción" icon="pi pi-plus" @click="abrirCrear" />
            </div>
        </div>

        <!-- ── Filtros / Búsqueda ── -->
        <div class="filtros-bar">
            <div class="filtros-left">
                <InputText v-model="busqueda" placeholder="Buscar por nombre o aparato..." class="filtro-busqueda" @input="onBusqueda" />
            </div>
            <span class="total-label">{{ pagination.totalItems }} refacción{{ pagination.totalItems !== 1 ? 'es' : '' }}</span>
        </div>

        <!-- ── Tabla ── -->
        <div class="table-wrapper">
            <DataTable :value="items" :loading="loading" stripedRows dataKey="_id" responsiveLayout="scroll">
                <template #empty>
                    <div class="table-empty">
                        <i class="pi pi-box"></i>
                        <span>No hay refacciones registradas.</span>
                    </div>
                </template>

                <Column field="nombre" header="Nombre" style="min-width: 160px">
                    <template #body="{ data }">
                        <span class="nombre-bold">{{ data.nombre }}</span>
                    </template>
                </Column>
                <Column field="aparato" header="Aparato" style="min-width: 120px" />
                <Column field="precio" header="Precio" style="width: 110px; text-align: right">
                    <template #body="{ data }">
                        <span class="monto-cell">{{ formatMonto(data.precio) }}</span>
                    </template>
                </Column>
                <Column field="costo" header="Costo" style="width: 110px; text-align: right">
                    <template #body="{ data }">
                        <span class="monto-cell muted">{{ formatMonto(data.costo) }}</span>
                    </template>
                </Column>
                <Column field="existencias" header="Existencias" style="width: 110px; text-align: center">
                    <template #body="{ data }">
                        <span :class="['existencias-badge', { 'sin-stock': (data.existencias ?? 0) === 0 }]">
                            {{ data.existencias ?? 0 }}
                        </span>
                    </template>
                </Column>
                <Column field="ubicacion" header="Ubicación" style="min-width: 110px">
                    <template #body="{ data }">{{ data.ubicacion ?? '—' }}</template>
                </Column>
                <Column header="Acciones" style="width: 130px; text-align: right" frozen alignFrozen="right">
                    <template #body="{ data }">
                        <div class="acciones-cell">
                            <Button icon="pi pi-chart-bar" size="small" text rounded severity="info"      v-tooltip.top="'Inventario'" @click="abrirInventario(data)" />
                            <Button icon="pi pi-pencil"    size="small" text rounded severity="secondary" v-tooltip.top="'Editar'"     @click="abrirEditar(data)" />
                            <Button icon="pi pi-trash"     size="small" text rounded severity="danger"    v-tooltip.top="'Eliminar'"   @click="confirmarEliminar(data)" />
                        </div>
                    </template>
                </Column>
            </DataTable>

            <div class="paginacion" v-if="pagination.totalPages > 1">
                <Button icon="pi pi-chevron-left"  text rounded :disabled="pagination.currentPage <= 1" @click="cambiarPagina(pagination.currentPage - 1)" />
                <span class="pag-info">Página {{ pagination.currentPage }} de {{ pagination.totalPages }}</span>
                <Button icon="pi pi-chevron-right" text rounded :disabled="pagination.currentPage >= pagination.totalPages" @click="cambiarPagina(pagination.currentPage + 1)" />
            </div>
        </div>

        <!-- ── Dialog Crear / Editar ── -->
        <Dialog v-model:visible="dialogVisible" :header="editando ? 'Editar Refacción' : 'Nueva Refacción'"
            modal :style="{ width: '70vh' }" @hide="resetForm">
            <div class="form-grid">
                <div class="field field-full">
                    <label>Nombre <span class="req">*</span></label>
                    <InputText v-model="form.nombre" placeholder="Nombre de la refacción" class="w-full" :class="{ 'p-invalid': errors.nombre }" />
                    <small v-if="errors.nombre" class="error-msg">{{ errors.nombre }}</small>
                </div>
                <div class="field field-full">
                    <label>Aparato <span class="req">*</span></label>
                    <InputText v-model="form.aparato" placeholder="Ej. Lavadora, Televisor..." class="w-full" :class="{ 'p-invalid': errors.aparato }" />
                    <small v-if="errors.aparato" class="error-msg">{{ errors.aparato }}</small>
                </div>
                <div class="field">
                    <label>Precio de venta</label>
                    <InputNumber v-model="form.precio" mode="currency" currency="USD" locale="en-US" class="w-full" :min="0" />
                </div>
                <div class="field">
                    <label>Costo</label>
                    <InputNumber v-model="form.costo" mode="currency" currency="USD" locale="en-US" class="w-full" :min="0" />
                </div>
                <div class="field">
                    <label>Existencias</label>
                    <InputNumber disabled v-model="form.existencias" :useGrouping="false" :min="0" class="w-full" />
                </div>
                <div class="field">
                    <label>Ubicación</label>
                    <InputText v-model="form.ubicacion" placeholder="Ej. Estante A3" class="w-full" />
                </div>
            </div>
            <template #footer>
                <Button label="Cancelar" severity="secondary" text @click="dialogVisible = false" />
                <Button :label="editando ? 'Guardar cambios' : 'Crear refacción'" icon="pi pi-check" :loading="saving" @click="guardar" />
            </template>
        </Dialog>

        <!-- ── Dialog Confirmar Eliminación ── -->
        <Dialog v-model:visible="dialogEliminarVisible" header="Eliminar Refacción" modal :style="{ width: '360px' }">
            <div class="confirm-body">
                <i class="pi pi-exclamation-triangle confirm-icon"></i>
                <p>¿Deseas eliminar <strong>{{ itemAEliminar?.nombre }}</strong>?</p>
                <p class="confirm-sub">Esta acción no se puede deshacer.</p>
            </div>
            <template #footer>
                <Button label="Cancelar" severity="secondary" text @click="dialogEliminarVisible = false" />
                <Button label="Eliminar" icon="pi pi-trash" severity="danger" :loading="deleting" @click="eliminar" />
            </template>
        </Dialog>

        <!-- ══════════════════════════════════════
             Dialog Historial de Inventario
             ══════════════════════════════════════ -->
        <Dialog v-model:visible="dialogInventarioVisible" header="Inventario" modal :style="{ width: '780px' }" :closable="true">
            <div v-if="loadingInventario" class="inv-loading">
                <i class="pi pi-spin pi-spinner" style="font-size:1.5rem"></i>
                <span>Cargando historial...</span>
            </div>
            <template v-else-if="historial">
                <!-- Resumen de la refacción -->
                <div class="inv-header">
                    <div class="inv-info">
                        <p class="inv-nombre">{{ historial.refaccion.nombre }}</p>
                        <p class="inv-aparato">{{ historial.refaccion.aparato }}<span v-if="historial.refaccion.ubicacion"> · {{ historial.refaccion.ubicacion }}</span></p>
                    </div>
                    <div class="inv-stats">
                        <div class="stat-chip stat-stock">
                            <span class="stat-val">{{ historial.existenciasActuales }}</span>
                            <span class="stat-lbl">En stock</span>
                        </div>
                        <div class="stat-chip stat-entrada">
                            <span class="stat-val">+{{ historial.totalEntradas }}</span>
                            <span class="stat-lbl">Entradas</span>
                        </div>
                        <div class="stat-chip stat-salida">
                            <span class="stat-val">-{{ historial.totalSalidas }}</span>
                            <span class="stat-lbl">Salidas</span>
                        </div>
                    </div>
                    <Button label="Nuevo movimiento" icon="pi pi-plus" size="small" @click="abrirNuevoMovimiento" />
                </div>

                <!-- Tabla de movimientos -->
                <DataTable :value="historial.movimientos" class="inv-table" size="small" stripedRows
                    :emptyMessage="'Sin movimientos registrados'">
                    <Column header="Fecha" style="width: 140px">
                        <template #body="{ data }">{{ formatFechaHora(data.createdAt) }}</template>
                    </Column>
                    <Column header="Tipo" style="width: 90px">
                        <template #body="{ data }">
                            <span :class="['tipo-badge', 'tipo-' + data.tipo]">{{ data.tipo }}</span>
                        </template>
                    </Column>
                    <Column header="Cantidad" style="width: 90px; text-align: right">
                        <template #body="{ data }">
                            <span :class="data.tipo === 'entrada' ? 'cant-pos' : 'cant-neg'">
                                {{ data.tipo === 'entrada' ? '+' : data.tipo === 'salida' ? '-' : '±' }}{{ Math.abs(data.cantidad) }}
                            </span>
                        </template>
                    </Column>
                    <Column header="Antes" style="width: 75px; text-align: right">
                        <template #body="{ data }">{{ data.existenciasAntes }}</template>
                    </Column>
                    <Column header="Después" style="width: 80px; text-align: right">
                        <template #body="{ data }">{{ data.existenciasDespues }}</template>
                    </Column>
                    <Column header="Descripción">
                        <template #body="{ data }">{{ data.descripcion || '—' }}</template>
                    </Column>
                    <Column header="Orden" style="width: 110px">
                        <template #body="{ data }">
                            <span v-if="data.ordenServicioId && typeof data.ordenServicioId === 'object'" class="orden-chip">
                                {{ data.ordenServicioId.numeroOrden }}
                            </span>
                            <span v-else class="muted">—</span>
                        </template>
                    </Column>
                    <Column header="" style="width: 50px">
                        <template #body="{ data }">
                            <Button icon="pi pi-trash" size="small" text rounded severity="danger"
                                v-tooltip.top="'Revertir movimiento'" @click="confirmarEliminarMovimiento(data)" />
                        </template>
                    </Column>
                </DataTable>
            </template>
            <template #footer>
                <Button label="Cerrar" severity="secondary" text @click="dialogInventarioVisible = false" />
            </template>
        </Dialog>

        <!-- ══════════════════════════════════════
             Dialog Nuevo Movimiento
             ══════════════════════════════════════ -->
        <Dialog v-model:visible="dialogMovimientoVisible" header="Registrar Movimiento" modal :style="{ width: '420px' }" @hide="resetMovimientoForm">
            <div class="form-grid">
                <div class="field field-full">
                    <label>Tipo de movimiento <span class="req">*</span></label>
                    <div class="tipo-selector">
                        <button v-for="t in tiposMovimiento" :key="t.value"
                            :class="['tipo-btn', 'tipo-btn--' + t.value, { 'tipo-btn--active': movForm.tipo === t.value }]"
                            @click="movForm.tipo = t.value">
                            <i :class="t.icon"></i> {{ t.label }}
                        </button>
                    </div>
                </div>
                <div class="field field-full">
                    <label>Cantidad <span class="req">*</span></label>
                    <small v-if="movForm.tipo === 'ajuste'" class="hint">Para reducir stock usa un número negativo.</small>
                    <InputNumber v-model="movForm.cantidad" :min="movForm.tipo === 'ajuste' ? undefined : 1"
                        :useGrouping="false" class="w-full" :class="{ 'p-invalid': movErrors.cantidad }" />
                    <small v-if="movErrors.cantidad" class="error-msg">{{ movErrors.cantidad }}</small>
                </div>
                <div class="field">
                    <label>Costo unitario</label>
                    <InputNumber v-model="movForm.costoUnitario" mode="currency" currency="USD" locale="en-US" class="w-full" :min="0" />
                </div>
                <div class="field field-full">
                    <label>Descripción</label>
                    <InputText v-model="movForm.descripcion" placeholder="Ej. Compra a proveedor ABC" class="w-full" />
                </div>
            </div>
            <template #footer>
                <Button label="Cancelar" severity="secondary" text @click="dialogMovimientoVisible = false" />
                <Button label="Registrar" icon="pi pi-check" :loading="savingMovimiento" @click="registrarMovimiento" />
            </template>
        </Dialog>

        <!-- Confirmar eliminar movimiento -->
        <Dialog v-model:visible="dialogEliminarMovVisible" header="Revertir Movimiento" modal :style="{ width: '360px' }">
            <div class="confirm-body">
                <i class="pi pi-exclamation-triangle confirm-icon"></i>
                <p>Se revertirá este movimiento y se ajustarán las existencias.</p>
                <p class="confirm-sub">Esta acción no se puede deshacer.</p>
            </div>
            <template #footer>
                <Button label="Cancelar" severity="secondary" text @click="dialogEliminarMovVisible = false" />
                <Button label="Revertir" icon="pi pi-undo" severity="danger" :loading="deletingMov" @click="eliminarMovimiento" />
            </template>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Toast from 'primevue/toast'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import { useToast } from '../composables/useToast'
import { useRefaccionService } from '../composables/useRefaccionService'
import { useMovimientoInventarioService } from '../composables/useMovimientoInventarioService'
import type { Refaccion } from '../models/refaccion'
import type { MovimientoInventario, HistorialRefaccionResponse, TipoMovimiento } from '../models/movimiento-inventario'

const router          = useRouter()
const toast           = useToast()
const refaccionService = useRefaccionService()
const movimientoService = useMovimientoInventarioService()

const items      = ref<Refaccion[]>([])
const loading    = ref(false)
const busqueda   = ref('')
const pagination = reactive({ currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 20 })

let busquedaTimer: ReturnType<typeof setTimeout> | null = null
function onBusqueda() {
    if (busquedaTimer) clearTimeout(busquedaTimer)
    busquedaTimer = setTimeout(() => cargar(1), 350)
}

// ── Dialog crear/editar ──
const dialogVisible = ref(false)
const editando      = ref(false)
const saving        = ref(false)
const itemId        = ref<string | null>(null)

const form = reactive({
    nombre:      '',
    aparato:     '',
    precio:      null as number | null,
    costo:       null as number | null,
    existencias: null as number | null,
    ubicacion:   ''
})
const errors = reactive<Record<string, string>>({})

// ── Inventario ──
const dialogInventarioVisible  = ref(false)
const loadingInventario        = ref(false)
const historial                = ref<HistorialRefaccionResponse | null>(null)
const refaccionInventarioId    = ref<string | null>(null)

async function abrirInventario(r: Refaccion) {
    if (!r._id) return
    refaccionInventarioId.value   = r._id
    historial.value               = null
    loadingInventario.value       = true
    dialogInventarioVisible.value = true
    try {
        historial.value = await movimientoService.historialRefaccion(r._id)
    } catch (e: any) {
        toast.showError(e?.response?.data?.message ?? 'Error al cargar el historial')
        dialogInventarioVisible.value = false
    } finally {
        loadingInventario.value = false
    }
}

// ── Nuevo movimiento ──
const dialogMovimientoVisible = ref(false)
const savingMovimiento        = ref(false)
const tiposMovimiento = [
    { value: 'entrada' as TipoMovimiento, label: 'Entrada', icon: 'pi pi-arrow-down' },
    { value: 'salida'  as TipoMovimiento, label: 'Salida',  icon: 'pi pi-arrow-up'   },
    { value: 'ajuste'  as TipoMovimiento, label: 'Ajuste',  icon: 'pi pi-sync'       }
]
const movForm = reactive({
    tipo:          'entrada' as TipoMovimiento,
    cantidad:      null as number | null,
    costoUnitario: null as number | null,
    descripcion:   ''
})
const movErrors = reactive<Record<string, string>>({})

function abrirNuevoMovimiento() {
    resetMovimientoForm()
    dialogMovimientoVisible.value = true
}

function resetMovimientoForm() {
    movForm.tipo          = 'entrada'
    movForm.cantidad      = null
    movForm.costoUnitario = null
    movForm.descripcion   = ''
    Object.keys(movErrors).forEach(k => delete movErrors[k])
}

async function registrarMovimiento() {
    Object.keys(movErrors).forEach(k => delete movErrors[k])
    if (movForm.cantidad === null || movForm.cantidad === 0)
        movErrors.cantidad = 'La cantidad es requerida'
    if (movForm.tipo !== 'ajuste' && (movForm.cantidad ?? 0) < 1)
        movErrors.cantidad = 'La cantidad debe ser mayor a 0'
    if (Object.keys(movErrors).length) return

    if (!refaccionInventarioId.value) return
    savingMovimiento.value = true
    try {
        await movimientoService.registrarMovimiento({
            refaccionId:   refaccionInventarioId.value,
            tipo:          movForm.tipo,
            cantidad:      movForm.cantidad!,
            costoUnitario: movForm.costoUnitario ?? undefined,
            descripcion:   movForm.descripcion   || undefined
        })
        toast.showSuccess('Movimiento registrado')
        dialogMovimientoVisible.value = false
        // Recargar historial y tabla principal
        historial.value = await movimientoService.historialRefaccion(refaccionInventarioId.value)
        cargar(pagination.currentPage)
    } catch (e: any) {
        toast.showError(e?.response?.data?.message ?? 'Error al registrar el movimiento')
    } finally {
        savingMovimiento.value = false
    }
}

// ── Eliminar movimiento ──
const dialogEliminarMovVisible = ref(false)
const deletingMov              = ref(false)
const movAEliminar             = ref<MovimientoInventario | null>(null)

function confirmarEliminarMovimiento(m: MovimientoInventario) {
    movAEliminar.value            = m
    dialogEliminarMovVisible.value = true
}

async function eliminarMovimiento() {
    if (!movAEliminar.value?._id) return
    deletingMov.value = true
    try {
        await movimientoService.eliminarMovimiento(movAEliminar.value._id)
        toast.showSuccess('Movimiento revertido')
        dialogEliminarMovVisible.value = false
        if (refaccionInventarioId.value) {
            historial.value = await movimientoService.historialRefaccion(refaccionInventarioId.value)
            cargar(pagination.currentPage)
        }
    } catch (e: any) {
        toast.showError(e?.response?.data?.message ?? 'Error al revertir el movimiento')
    } finally {
        deletingMov.value = false
    }
}

function formatFechaHora(val?: string): string {
    if (!val) return '—'
    const d = new Date(val)
    return `${d.toLocaleDateString('es-MX')} ${d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`
}

// ── Dialog eliminar refacción ──
const dialogEliminarVisible = ref(false)
const deleting              = ref(false)
const itemAEliminar         = ref<Refaccion | null>(null)

function formatMonto(val?: number | null): string {
    if (val == null) return '—'
    return `$ ${val.toFixed(2)}`
}

async function cargar(page = 1) {
    loading.value = true
    try {
        const params: any = { page, limit: 20 }
        if (busqueda.value.trim()) params.q = busqueda.value.trim()
        const res = await refaccionService.obtenerRefacciones(params)
        items.value = res.data
        Object.assign(pagination, res.pagination)
    } catch (e: any) {
        toast.showError(e?.response?.data?.message ?? 'Error al cargar refacciones')
    } finally {
        loading.value = false
    }
}

function cambiarPagina(page: number) { cargar(page) }

function resetForm() {
    form.nombre      = ''
    form.aparato     = ''
    form.precio      = null
    form.costo       = null
    form.existencias = null
    form.ubicacion   = ''
    Object.keys(errors).forEach(k => delete errors[k])
    itemId.value   = null
    editando.value = false
}

function abrirCrear() {
    resetForm()
    dialogVisible.value = true
}

function abrirEditar(r: Refaccion) {
    resetForm()
    editando.value      = true
    itemId.value        = r._id ?? null
    form.nombre         = r.nombre
    form.aparato        = r.aparato
    form.precio         = r.precio      ?? null
    form.costo          = r.costo       ?? null
    form.existencias    = r.existencias ?? null
    form.ubicacion      = r.ubicacion   ?? ''
    dialogVisible.value = true
}

function validar(): boolean {
    Object.keys(errors).forEach(k => delete errors[k])
    if (!form.nombre.trim())  errors.nombre  = 'El nombre es requerido'
    if (!form.aparato.trim()) errors.aparato = 'El aparato es requerido'
    return Object.keys(errors).length === 0
}

async function guardar() {
    if (!validar()) return
    saving.value = true
    try {
        const dto: any = {
            nombre:      form.nombre,
            aparato:     form.aparato,
            precio:      form.precio      ?? undefined,
            costo:       form.costo       ?? undefined,
            existencias: form.existencias ?? undefined,
            ubicacion:   form.ubicacion   || undefined
        }
        if (editando.value && itemId.value) {
            await refaccionService.actualizarRefaccion(itemId.value, { _id: itemId.value, ...dto })
            toast.showSuccess('Refacción actualizada correctamente')
        } else {
            await refaccionService.crearRefaccion(dto)
            toast.showSuccess('Refacción creada correctamente')
        }
        dialogVisible.value = false
        cargar(pagination.currentPage)
    } catch (e: any) {
        toast.showError(e?.response?.data?.message ?? 'Error al guardar')
    } finally {
        saving.value = false
    }
}

function confirmarEliminar(r: Refaccion) {
    itemAEliminar.value       = r
    dialogEliminarVisible.value = true
}

async function eliminar() {
    if (!itemAEliminar.value?._id) return
    deleting.value = true
    try {
        await refaccionService.eliminarRefaccion(itemAEliminar.value._id)
        toast.showSuccess('Refacción eliminada')
        dialogEliminarVisible.value = false
        cargar(pagination.currentPage)
    } catch (e: any) {
        toast.showError(e?.response?.data?.message ?? 'Error al eliminar')
    } finally {
        deleting.value = false
    }
}

onMounted(() => cargar())
</script>

<style scoped>
.admin-page {
    max-width: 1100px;
    margin: 0 auto;
    padding: 1.5rem 1rem;
    font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
}

.page-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 1.25rem; gap: 1rem; flex-wrap: wrap;
}
.header-brand   { display: flex; align-items: center; gap: 0.75rem; }
.header-actions { display: flex; gap: 0.5rem; }
.brand-icon {
    width: 44px; height: 44px;
    background: #d1fae5; color: #065f46;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem; flex-shrink: 0;
}
.page-title { margin: 0; font-size: 1.35rem; font-weight: 800; color: #1e2740; }
.page-sub   { margin: 0; font-size: 0.8rem; color: #6b7280; }

.filtros-bar {
    display: flex; align-items: center; justify-content: space-between;
    gap: 0.75rem; margin-bottom: 1rem; flex-wrap: wrap;
}
.filtros-left      { display: flex; gap: 0.5rem; flex: 1; }
.filtro-busqueda   { min-width: 260px; max-width: 380px; }
.total-label       { font-size: 0.85rem; color: #6b7280; white-space: nowrap; }

.table-wrapper {
    background: #fff; border: 1px solid #dde1ea; border-radius: 10px;
    overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.06);
}
.table-empty {
    display: flex; flex-direction: column; align-items: center;
    gap: 0.5rem; padding: 3rem; color: #9ca3af;
}
.table-empty i { font-size: 2rem; opacity: 0.4; }

.nombre-bold { font-weight: 600; color: #1e2740; }
.monto-cell  { font-variant-numeric: tabular-nums; font-size: 0.875rem; }
.muted       { color: #9ca3af; }

.existencias-badge {
    display: inline-block;
    background: #d1fae5; color: #065f46;
    font-weight: 700; font-size: 0.8rem;
    padding: 1px 10px; border-radius: 12px;
}
.existencias-badge.sin-stock { background: #fee2e2; color: #b91c1c; }

.acciones-cell { display: flex; justify-content: flex-end; gap: 0.25rem; }

.paginacion {
    display: flex; justify-content: center; align-items: center;
    gap: 0.5rem; padding: 0.75rem; border-top: 1px solid #dde1ea;
}
.pag-info { font-size: 0.85rem; color: #6b7280; }

.form-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem 1rem; padding: 0.25rem 0;
}
.field      { display: flex; flex-direction: column; gap: 0.35rem; }
.field-full { grid-column: 1 / -1; }
.field label { font-weight: 600; font-size: 0.88rem; color: #374151; }
.req       { color: #e02424; }
.error-msg { color: #e02424; font-size: 0.8rem; }

.confirm-body {
    display: flex; flex-direction: column; align-items: center;
    gap: 0.5rem; padding: 0.5rem 0; text-align: center;
}
.confirm-icon { font-size: 2.5rem; color: #f59e0b; }
.confirm-sub  { font-size: 0.85rem; color: #9ca3af; margin: 0; }

/* ── Inventario dialog ── */
.inv-loading {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 2rem; color: #6b7280; justify-content: center;
}
.inv-header {
    display: flex; align-items: center; gap: 1rem;
    padding: 0 0 1rem; margin-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb; flex-wrap: wrap;
}
.inv-info { flex: 1; min-width: 160px; }
.inv-nombre  { margin: 0; font-size: 1rem; font-weight: 700; color: #1e2740; }
.inv-aparato { margin: 0.15rem 0 0; font-size: 0.82rem; color: #6b7280; }

.inv-stats { display: flex; gap: 0.5rem; }
.stat-chip {
    display: flex; flex-direction: column; align-items: center;
    padding: 0.35rem 0.75rem; border-radius: 8px; min-width: 64px;
}
.stat-val { font-size: 1.15rem; font-weight: 800; line-height: 1; }
.stat-lbl { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.04em; font-weight: 600; }
.stat-stock   { background: #eff6ff; color: #1d4ed8; }
.stat-entrada { background: #dcfce7; color: #15803d; }
.stat-salida  { background: #fee2e2; color: #b91c1c; }

.inv-table { font-size: 0.83rem; }

.tipo-badge {
    display: inline-block; font-size: 0.7rem; font-weight: 700;
    padding: 2px 8px; border-radius: 10px; text-transform: capitalize;
}
.tipo-entrada { background: #dcfce7; color: #15803d; }
.tipo-salida  { background: #fee2e2; color: #b91c1c; }
.tipo-ajuste  { background: #fef9c3; color: #854d0e; }

.cant-pos { color: #15803d; font-weight: 700; }
.cant-neg { color: #b91c1c; font-weight: 700; }
.orden-chip {
    font-size: 0.75rem; font-weight: 600;
    background: #e8edff; color: #3b5bdb;
    padding: 1px 7px; border-radius: 10px;
}
.hint { color: #9ca3af; font-size: 0.78rem; }

/* ── Tipo-selector buttons ── */
.tipo-selector { display: flex; gap: 0.5rem; }
.tipo-btn {
    flex: 1; display: flex; align-items: center; justify-content: center;
    gap: 0.4rem; padding: 0.55rem 0.75rem; border-radius: 6px; border: 1.5px solid #d1d5db;
    background: #f9fafb; color: #374151; font-size: 0.85rem; font-weight: 600;
    cursor: pointer; transition: all 0.15s;
}
.tipo-btn:hover { border-color: #9ca3af; background: #f3f4f6; }
.tipo-btn--entrada.tipo-btn--active { border-color: #16a34a; background: #dcfce7; color: #15803d; }
.tipo-btn--salida.tipo-btn--active  { border-color: #dc2626; background: #fee2e2; color: #b91c1c; }
.tipo-btn--ajuste.tipo-btn--active  { border-color: #ca8a04; background: #fef9c3; color: #854d0e; }
</style>
