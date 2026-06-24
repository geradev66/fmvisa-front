<template>
    <div class="admin-page">
        <Toast />

        <!-- ── Header ── -->
        <div class="page-header">
            <div class="header-brand">
                <div class="brand-icon"><i class="pi pi-wrench"></i></div>
                <div>
                    <h1 class="page-title">Técnicos</h1>
                    <p class="page-sub">Administración de técnicos de servicio</p>
                </div>
            </div>
            <div class="header-actions">
                <Button label="Volver" icon="pi pi-arrow-left" severity="secondary" outlined @click="router.push('/orden-servicio')" />
                <Button label="Nuevo Técnico" icon="pi pi-plus" @click="abrirCrear" />
            </div>
        </div>

        <!-- ── Filtros ── -->
        <div class="filtros-bar">
            <div class="filtros-left">
                <Select
                    v-model="filtroActivo"
                    :options="opcionesFiltroActivo"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Todos"
                    class="filtro-select"
                    showClear
                    @change="() => cargar"
                />
            </div>
            <span class="total-label">{{ pagination.totalItems }} técnico{{ pagination.totalItems !== 1 ? 's' : '' }}</span>
        </div>

        <!-- ── Tabla ── -->
        <div class="table-wrapper">
            <DataTable :value="items" :loading="loading" stripedRows dataKey="_id" responsiveLayout="scroll">
                <template #empty>
                    <div class="table-empty">
                        <i class="pi pi-wrench"></i>
                        <span>No hay técnicos registrados.</span>
                    </div>
                </template>

                <Column field="nombre" header="Nombre" style="min-width: 160px">
                    <template #body="{ data }">
                        <span class="nombre-bold">{{ data.nombre }}</span>
                    </template>
                </Column>
                <Column field="especialidad" header="Especialidad" style="min-width: 140px">
                    <template #body="{ data }">{{ data.especialidad ?? '—' }}</template>
                </Column>
                <Column field="telefono" header="Teléfono" style="width: 130px">
                    <template #body="{ data }">{{ data.telefono ?? '—' }}</template>
                </Column>
                <Column field="email" header="Email" style="min-width: 180px">
                    <template #body="{ data }">{{ data.email ?? '—' }}</template>
                </Column>
                <Column header="Activo" style="width: 90px; text-align: center">
                    <template #body="{ data }">
                        <i :class="data.activo ? 'pi pi-check-circle activo-si' : 'pi pi-times-circle activo-no'" />
                    </template>
                </Column>
                <Column header="Acciones" style="width: 120px; text-align: right" frozen alignFrozen="right">
                    <template #body="{ data }">
                        <div class="acciones-cell">
                            <Button icon="pi pi-pencil" size="small" text rounded severity="secondary" v-tooltip.top="'Editar'" @click="abrirEditar(data)" />
                            <Button icon="pi pi-trash"  size="small" text rounded severity="danger"    v-tooltip.top="'Eliminar'" @click="confirmarEliminar(data)" />
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
        <Dialog v-model:visible="dialogVisible" :header="editando ? 'Editar Técnico' : 'Nuevo Técnico'"
            modal :style="{ width: '440px' }" @hide="resetForm">
            <div class="form-grid">
                <div class="field field-full">
                    <label>Nombre <span class="req">*</span></label>
                    <InputText v-model="form.nombre" placeholder="Nombre completo" class="w-full" :class="{ 'p-invalid': errors.nombre }" />
                    <small v-if="errors.nombre" class="error-msg">{{ errors.nombre }}</small>
                </div>
                <div class="field field-full">
                    <label>Especialidad</label>
                    <InputText v-model="form.especialidad" placeholder="Ej. Electrónica, Refrigeración..." class="w-full" />
                </div>
                <div class="field">
                    <label>Teléfono</label>
                    <InputText v-model="form.telefono" placeholder="6641234567" class="w-full" />
                </div>
                <div class="field">
                    <label>Email</label>
                    <InputText v-model="form.email" placeholder="tecnico@empresa.com" class="w-full" />
                </div>
                <div class="field field-full" v-if="editando">
                    <div class="check-row">
                        <Checkbox v-model="form.activo" :binary="true" inputId="activo" />
                        <label for="activo" class="check-label">Técnico activo</label>
                    </div>
                </div>
            </div>
            <template #footer>
                <Button label="Cancelar" severity="secondary" text @click="dialogVisible = false" />
                <Button :label="editando ? 'Guardar cambios' : 'Crear técnico'" icon="pi pi-check" :loading="saving" @click="guardar" />
            </template>
        </Dialog>

        <!-- ── Dialog Confirmar Eliminación ── -->
        <Dialog v-model:visible="dialogEliminarVisible" header="Eliminar Técnico" modal :style="{ width: '360px' }">
            <div class="confirm-body">
                <i class="pi pi-exclamation-triangle confirm-icon"></i>
                <p>¿Deseas eliminar al técnico <strong>{{ itemAEliminar?.nombre }}</strong>?</p>
                <p class="confirm-sub">Esta acción no se puede deshacer.</p>
            </div>
            <template #footer>
                <Button label="Cancelar" severity="secondary" text @click="dialogEliminarVisible = false" />
                <Button label="Eliminar" icon="pi pi-trash" severity="danger" :loading="deleting" @click="eliminar" />
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
import Select from 'primevue/select'
import Checkbox from 'primevue/checkbox'
import { useToast } from '../composables/useToast'
import { useTecnicoService } from '../composables/useTecnicoService'
import type { Tecnico } from '../models/tecnico'

const router        = useRouter()
const toast         = useToast()
const tecnicoService = useTecnicoService()

const items      = ref<Tecnico[]>([])
const loading    = ref(false)
const filtroActivo = ref<boolean | null>(null)
const pagination = reactive({ currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 20 })

const opcionesFiltroActivo = [
    { label: 'Activos',   value: true  },
    { label: 'Inactivos', value: false }
]

// ── Dialog crear/editar ──
const dialogVisible = ref(false)
const editando      = ref(false)
const saving        = ref(false)
const itemId        = ref<string | null>(null)
const form = reactive({ nombre: '', especialidad: '', telefono: '', email: '', activo: true })
const errors = reactive<Record<string, string>>({})

// ── Dialog eliminar ──
const dialogEliminarVisible = ref(false)
const deleting              = ref(false)
const itemAEliminar         = ref<Tecnico | null>(null)

async function cargar(page = 1) {
    loading.value = true
    try {
        const params: any = { page, limit: 20 }
        if (filtroActivo.value !== null) params.activo = filtroActivo.value
        const res = await tecnicoService.obtenerTecnicos(params)
        items.value = res.data
        Object.assign(pagination, res.pagination)
    } catch (e: any) {
        toast.showError(e?.response?.data?.message ?? 'Error al cargar técnicos')
    } finally {
        loading.value = false
    }
}

function cambiarPagina(page: number) { cargar(page) }

function resetForm() {
    form.nombre       = ''
    form.especialidad = ''
    form.telefono     = ''
    form.email        = ''
    form.activo       = true
    Object.keys(errors).forEach(k => delete errors[k])
    itemId.value  = null
    editando.value = false
}

function abrirCrear() {
    resetForm()
    dialogVisible.value = true
}

function abrirEditar(t: Tecnico) {
    resetForm()
    editando.value      = true
    itemId.value        = t._id ?? null
    form.nombre         = t.nombre
    form.especialidad   = t.especialidad ?? ''
    form.telefono       = t.telefono ?? ''
    form.email          = t.email ?? ''
    form.activo         = t.activo
    dialogVisible.value = true
}

function validar(): boolean {
    Object.keys(errors).forEach(k => delete errors[k])
    if (!form.nombre.trim()) errors.nombre = 'El nombre es requerido'
    return Object.keys(errors).length === 0
}

async function guardar() {
    if (!validar()) return
    saving.value = true
    try {
        if (editando.value && itemId.value) {
            await tecnicoService.actualizarTecnico(itemId.value, {
                _id: itemId.value,
                nombre:       form.nombre,
                especialidad: form.especialidad || undefined,
                telefono:     form.telefono     || undefined,
                email:        form.email        || undefined,
                activo:       form.activo
            })
            toast.showSuccess('Técnico actualizado correctamente')
        } else {
            await tecnicoService.crearTecnico({
                nombre:       form.nombre,
                especialidad: form.especialidad || undefined,
                telefono:     form.telefono     || undefined,
                email:        form.email        || undefined,
                activo:       true
            })
            toast.showSuccess('Técnico creado correctamente')
        }
        dialogVisible.value = false
        cargar(pagination.currentPage)
    } catch (e: any) {
        toast.showError(e?.response?.data?.message ?? 'Error al guardar')
    } finally {
        saving.value = false
    }
}

function confirmarEliminar(t: Tecnico) {
    itemAEliminar.value       = t
    dialogEliminarVisible.value = true
}

async function eliminar() {
    if (!itemAEliminar.value?._id) return
    deleting.value = true
    try {
        await tecnicoService.eliminarTecnico(itemAEliminar.value._id)
        toast.showSuccess('Técnico eliminado')
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
    max-width: 1000px;
    margin: 0 auto;
    padding: 1.5rem 1rem;
    font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
    gap: 1rem;
    flex-wrap: wrap;
}
.header-brand { display: flex; align-items: center; gap: 0.75rem; }
.header-actions { display: flex; gap: 0.5rem; }
.brand-icon {
    width: 44px; height: 44px;
    background: #fef3c7; color: #b45309;
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
.filtros-left { display: flex; gap: 0.5rem; }
.filtro-select { min-width: 160px; }
.total-label   { font-size: 0.85rem; color: #6b7280; }

.table-wrapper {
    background: #fff;
    border: 1px solid #dde1ea;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.06);
}
.table-empty {
    display: flex; flex-direction: column; align-items: center;
    gap: 0.5rem; padding: 3rem; color: #9ca3af;
}
.table-empty i { font-size: 2rem; opacity: 0.4; }

.nombre-bold  { font-weight: 600; color: #1e2740; }
.activo-si    { color: #0e9f6e; font-size: 1.1rem; }
.activo-no    { color: #e02424; font-size: 1.1rem; }
.acciones-cell { display: flex; justify-content: flex-end; gap: 0.25rem; }

.paginacion {
    display: flex; justify-content: center; align-items: center;
    gap: 0.5rem; padding: 0.75rem; border-top: 1px solid #dde1ea;
}
.pag-info { font-size: 0.85rem; color: #6b7280; }

.form-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem 1rem; padding: 0.25rem 0;
}
.field { display: flex; flex-direction: column; gap: 0.35rem; }
.field-full { grid-column: 1 / -1; }
.field label { font-weight: 600; font-size: 0.88rem; color: #374151; }
.req       { color: #e02424; }
.error-msg { color: #e02424; font-size: 0.8rem; }
.check-row  { display: flex; align-items: center; gap: 0.5rem; }
.check-label { font-size: 0.9rem; cursor: pointer; }

.confirm-body {
    display: flex; flex-direction: column; align-items: center;
    gap: 0.5rem; padding: 0.5rem 0; text-align: center;
}
.confirm-icon { font-size: 2.5rem; color: #f59e0b; }
.confirm-sub  { font-size: 0.85rem; color: #9ca3af; margin: 0; }
</style>
