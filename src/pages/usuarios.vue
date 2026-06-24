<template>
    <div class="usuarios-page">
        <Toast />

        <!-- ── Header ── -->
        <div class="page-header">
            <div class="header-brand">
                <div class="brand-icon"><i class="pi pi-users"></i></div>
                <div>
                    <h1 class="page-title">Usuarios</h1>
                    <p class="page-sub">Administración de acceso al sistema</p>
                </div>
            </div>
            <Button label="Nuevo Usuario" icon="pi pi-plus" @click="abrirCrear" />
        </div>

        <!-- ── Filtros ── -->
        <div class="filtros-bar">
            <div class="filtros-left">
                <Select
                    v-model="filtroRol"
                    :options="opcionesRolFiltro"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Todos los roles"
                    class="filtro-rol"
                    showClear
                    @change="() => cargarUsuarios()"
                />
            </div>
            <span class="total-label">{{ pagination.totalItems }} usuario{{ pagination.totalItems !== 1 ? 's' : '' }}</span>
        </div>

        <!-- ── Tabla ── -->
        <div class="table-wrapper">
            <DataTable
                :value="usuarios"
                :loading="loading"
                stripedRows
                class="usuarios-table"
                dataKey="_id"
                responsiveLayout="scroll"
            >
                <template #empty>
                    <div class="table-empty">
                        <i class="pi pi-users"></i>
                        <span>No hay usuarios registrados.</span>
                    </div>
                </template>

                <Column header="Nombre" style="min-width: 180px">
                    <template #body="{ data }">
                        <div class="usuario-nombre">
                            <span class="nombre-full">{{ data.firstName }} {{ data.lastName }}</span>
                        </div>
                    </template>
                </Column>

                <Column field="email" header="Email" style="min-width: 200px" />

                <Column field="phone" header="Teléfono" style="width: 130px">
                    <template #body="{ data }">{{ data.phone ?? '—' }}</template>
                </Column>

                <Column header="Rol" style="width: 110px">
                    <template #body="{ data }">
                        <Tag :value="labelRol(data.role)" :severity="severityRol(data.role)" />
                    </template>
                </Column>

                <Column header="Verificado" style="width: 105px; text-align: center">
                    <template #body="{ data }">
                        <i :class="data.isVerified ? 'pi pi-check-circle verificado' : 'pi pi-times-circle no-verificado'" />
                    </template>
                </Column>

                <Column header="Técnico vinculado" style="min-width: 150px">
                    <template #body="{ data }">
                        <span v-if="data.tecnico" class="tecnico-nombre">{{ data.tecnico.nombre }}</span>
                        <span v-else class="muted">—</span>
                    </template>
                </Column>

                <Column header="Creado" style="width: 130px">
                    <template #body="{ data }">
                        <span class="fecha-cell">{{ formatFecha(data.createdAt) }}</span>
                    </template>
                </Column>

                <Column header="Acciones" style="width: 160px; text-align: right" frozen alignFrozen="right">
                    <template #body="{ data }">
                        <div class="acciones-cell">
                            <Button icon="pi pi-pencil" size="small" text rounded severity="secondary"
                                v-tooltip.top="'Editar'" @click="abrirEditar(data)" />
                            <Button icon="pi pi-lock" size="small" text rounded severity="warn"
                                v-tooltip.top="'Cambiar contraseña'" @click="abrirCambiarPassword(data)" />
                            <Button icon="pi pi-trash" size="small" text rounded severity="danger"
                                v-tooltip.top="'Eliminar'" @click="confirmarEliminar(data)" />
                        </div>
                    </template>
                </Column>
            </DataTable>

            <!-- Paginación -->
            <div class="paginacion" v-if="pagination.totalPages > 1">
                <Button icon="pi pi-chevron-left" text rounded :disabled="pagination.currentPage <= 1"
                    @click="cambiarPagina(pagination.currentPage - 1)" />
                <span class="pag-info">Página {{ pagination.currentPage }} de {{ pagination.totalPages }}</span>
                <Button icon="pi pi-chevron-right" text rounded :disabled="pagination.currentPage >= pagination.totalPages"
                    @click="cambiarPagina(pagination.currentPage + 1)" />
            </div>
        </div>

        <!-- ═══════════════════════════════════
             Dialog Crear / Editar Usuario
             ═══════════════════════════════════ -->
        <Dialog v-model:visible="dialogVisible" :header="editando ? 'Editar Usuario' : 'Nuevo Usuario'"
            modal :style="{ width: '70vh' }" @hide="resetForm">
            <div class="form-grid">
                <div class="field">
                    <label>Nombre <span class="req">*</span></label>
                    <InputText v-model="form.firstName" placeholder="Nombre" class="w-full" :class="{ 'p-invalid': errors.firstName }" />
                    <small v-if="errors.firstName" class="error-msg">{{ errors.firstName }}</small>
                </div>
                <div class="field">
                    <label>Apellido <span class="req">*</span></label>
                    <InputText v-model="form.lastName" placeholder="Apellido" class="w-full" :class="{ 'p-invalid': errors.lastName }" />
                    <small v-if="errors.lastName" class="error-msg">{{ errors.lastName }}</small>
                </div>
                <div class="field field-full">
                    <label>Email <span class="req">*</span></label>
                    <InputText v-model="form.email" placeholder="correo@empresa.com" class="w-full" :class="{ 'p-invalid': errors.email }" />
                    <small v-if="errors.email" class="error-msg">{{ errors.email }}</small>
                </div>
                <div class="field field-full" v-if="!editando">
                    <label>Contraseña <span class="req">*</span></label>
                    <Password v-model="form.password" placeholder="Contraseña" class="w-full" toggleMask :feedback="false"
                        :class="{ 'p-invalid': errors.password }" />
                    <small v-if="errors.password" class="error-msg">{{ errors.password }}</small>
                </div>
                <div class="field">
                    <label>Teléfono</label>
                    <InputText v-model="form.phone" placeholder="6641234567" class="w-full" />
                </div>
                <div class="field">
                    <label>Rol <span class="req">*</span></label>
                    <Select v-model="form.role" :options="opcionesRol" optionLabel="label" optionValue="value"
                        placeholder="Seleccionar rol" class="w-full" />
                </div>
                <div class="field field-full" v-if="form.role === 'employee'">
                    <label>Técnico vinculado <span class="req">*</span></label>
                    <Select v-model="form.tecnicoId" :options="tecnicos" optionLabel="nombre" optionValue="_id"
                        placeholder="Seleccionar técnico" class="w-full" :class="{ 'p-invalid': errors.tecnicoId }"
                        :loading="loadingTecnicos" filter filterPlaceholder="Buscar técnico" />
                    <small v-if="errors.tecnicoId" class="error-msg">{{ errors.tecnicoId }}</small>
                </div>
                <div class="field field-full" v-if="editando">
                    <div class="verificado-row">
                        <Checkbox v-model="form.isVerified" :binary="true" inputId="isVerified" />
                        <label for="isVerified" class="checkbox-label">Usuario verificado</label>
                    </div>
                </div>
            </div>
            <template #footer>
                <Button label="Cancelar" severity="secondary" text @click="dialogVisible = false" />
                <Button :label="editando ? 'Guardar cambios' : 'Crear usuario'" icon="pi pi-check"
                    :loading="saving" @click="guardarUsuario" />
            </template>
        </Dialog>

        <!-- ═══════════════════════════════════
             Dialog Cambiar Contraseña
             ═══════════════════════════════════ -->
        <Dialog v-model:visible="dialogPasswordVisible" header="Cambiar Contraseña" modal :style="{ width: '380px' }">
            <div class="form-grid">
                <div class="field field-full">
                    <label>Nueva contraseña <span class="req">*</span></label>
                    <Password v-model="nuevaPassword" placeholder="Nueva contraseña" class="w-full" toggleMask :feedback="false"
                        :class="{ 'p-invalid': errorPassword }" />
                    <small v-if="errorPassword" class="error-msg">{{ errorPassword }}</small>
                </div>
            </div>
            <template #footer>
                <Button label="Cancelar" severity="secondary" text @click="dialogPasswordVisible = false" />
                <Button label="Cambiar contraseña" icon="pi pi-lock" :loading="savingPassword" @click="cambiarPassword" />
            </template>
        </Dialog>

        <!-- ═══════════════════════════════════
             Dialog Confirmar Eliminación
             ═══════════════════════════════════ -->
        <Dialog v-model:visible="dialogEliminarVisible" header="Eliminar Usuario" modal :style="{ width: '380px' }">
            <div class="confirm-body">
                <i class="pi pi-exclamation-triangle confirm-icon"></i>
                <p>¿Deseas eliminar al usuario <strong>{{ usuarioAEliminar?.firstName }} {{ usuarioAEliminar?.lastName }}</strong>?</p>
                <p class="confirm-sub">Esta acción no se puede deshacer.</p>
            </div>
            <template #footer>
                <Button label="Cancelar" severity="secondary" text @click="dialogEliminarVisible = false" />
                <Button label="Eliminar" icon="pi pi-trash" severity="danger" :loading="deleting" @click="eliminarUsuario" />
            </template>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import Toast from 'primevue/toast'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import Checkbox from 'primevue/checkbox'
import { useToast } from '../composables/useToast'
import { useUsuarioService } from '../composables/useUsuarioService'
import { useTecnicoService } from '../composables/useTecnicoService'
import type { Usuario, UserRole } from '../models/usuario'
import type { Tecnico } from '../models/tecnico'

const toast = useToast()
const usuarioService = useUsuarioService()
const tecnicoService = useTecnicoService()

// ── Estado principal ──────────────────────────────────
const usuarios    = ref<Usuario[]>([])
const loading     = ref(false)
const filtroRol   = ref<string | null>(null)
const pagination  = reactive({ currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 20 })

const tecnicos        = ref<Tecnico[]>([])
const loadingTecnicos = ref(false)

// ── Dialog crear/editar ───────────────────────────────
const dialogVisible = ref(false)
const editando      = ref(false)
const saving        = ref(false)
const usuarioId     = ref<string | null>(null)

const form = reactive({
    firstName: '',
    lastName:  '',
    email:     '',
    password:  '',
    phone:     '',
    role:      'user' as UserRole,
    tecnicoId: '' as string | null,
    isVerified: false
})
const errors = reactive<Record<string, string>>({})

// ── Dialog cambiar contraseña ─────────────────────────
const dialogPasswordVisible = ref(false)
const savingPassword        = ref(false)
const nuevaPassword         = ref('')
const errorPassword         = ref('')
const usuarioPassword       = ref<Usuario | null>(null)

// ── Dialog eliminar ───────────────────────────────────
const dialogEliminarVisible = ref(false)
const deleting              = ref(false)
const usuarioAEliminar      = ref<Usuario | null>(null)

// ── Opciones ──────────────────────────────────────────
const opcionesRol = [
    { label: 'Usuario',   value: 'user'     },
    { label: 'Admin',     value: 'admin'    },
    { label: 'Empleado',  value: 'employee' }
]
const opcionesRolFiltro = [
    { label: 'Usuario',   value: 'user'     },
    { label: 'Admin',     value: 'admin'    },
    { label: 'Empleado',  value: 'employee' }
]

// ── Helpers de visualización ──────────────────────────
function labelRol(role: string): string {
    return { user: 'Usuario', admin: 'Admin', employee: 'Empleado' }[role] ?? role
}
function severityRol(role: string): string {
    return { admin: 'danger', employee: 'info', user: 'secondary' }[role] ?? 'secondary'
}
function formatFecha(val?: string): string {
    if (!val) return '—'
    return new Date(val).toLocaleDateString('es-MX')
}

// ── Carga de datos ────────────────────────────────────
async function cargarUsuarios(page = 1) {
    loading.value = true
    try {
        const params: Record<string, any> = { page, limit: 20 }
        if (filtroRol.value) params.role = filtroRol.value
        const res = await usuarioService.listarUsuarios(params)
        usuarios.value = res.data
        Object.assign(pagination, res.pagination)
    } catch (e: any) {
        toast.showError('Error al cargar usuarios', e?.response?.data?.message ?? 'Error desconocido')
    } finally {
        loading.value = false
    }
}

async function cargarTecnicos() {
    if (tecnicos.value.length) return
    loadingTecnicos.value = true
    try {
        const res = await tecnicoService.obtenerTecnicos({ limit: 200, activo: true })
        tecnicos.value = res.data
    } catch {
        // non-fatal — dropdown will be empty
    } finally {
        loadingTecnicos.value = false
    }
}

function cambiarPagina(page: number) {
    cargarUsuarios(page)
}

// ── CRUD dialogs ──────────────────────────────────────
function resetForm() {
    form.firstName  = ''
    form.lastName   = ''
    form.email      = ''
    form.password   = ''
    form.phone      = ''
    form.role       = 'user'
    form.tecnicoId  = null
    form.isVerified = false
    Object.keys(errors).forEach(k => delete errors[k])
    usuarioId.value = null
    editando.value  = false
}

function abrirCrear() {
    resetForm()
    cargarTecnicos()
    dialogVisible.value = true
}

function abrirEditar(u: Usuario) {
    resetForm()
    editando.value      = true
    usuarioId.value     = u._id ?? null
    form.firstName      = u.firstName
    form.lastName       = u.lastName
    form.email          = u.email
    form.phone          = u.phone ?? ''
    form.role           = u.role
    form.tecnicoId      = u.tecnico?._id ?? null
    form.isVerified     = u.isVerified
    cargarTecnicos()
    dialogVisible.value = true
}

function validarForm(): boolean {
    Object.keys(errors).forEach(k => delete errors[k])
    if (!form.firstName.trim())  errors.firstName  = 'El nombre es requerido'
    if (!form.lastName.trim())   errors.lastName   = 'El apellido es requerido'
    if (!form.email.trim())      errors.email      = 'El email es requerido'
    if (!editando.value && !form.password.trim()) errors.password = 'La contraseña es requerida'
    if (form.role === 'employee' && !form.tecnicoId) errors.tecnicoId = 'Selecciona un técnico'
    return Object.keys(errors).length === 0
}

async function guardarUsuario() {
    if (!validarForm()) return
    saving.value = true
    try {
        if (editando.value && usuarioId.value) {
            const dto: any = {
                firstName:  form.firstName,
                lastName:   form.lastName,
                email:      form.email,
                phone:      form.phone || undefined,
                role:       form.role,
                isVerified: form.isVerified
            }
            if (form.role === 'employee' && form.tecnicoId) dto.tecnicoId = form.tecnicoId
            await usuarioService.actualizarUsuario(usuarioId.value, dto)
            toast.showSuccess('Usuario actualizado')
        } else {
            const dto: any = {
                firstName: form.firstName,
                lastName:  form.lastName,
                email:     form.email,
                password:  form.password,
                phone:     form.phone || undefined,
                role:      form.role
            }
            if (form.role === 'employee' && form.tecnicoId) dto.tecnicoId = form.tecnicoId
            await usuarioService.crearUsuario(dto)
            toast.showSuccess('Usuario creado')
        }
        dialogVisible.value = false
        cargarUsuarios(pagination.currentPage)
    } catch (e: any) {
        const msg = e?.response?.data?.message ?? 'Error al guardar'
        const apiErrors: string[] = e?.response?.data?.errors ?? []
        if (apiErrors.length) {
            toast.showError('Error de validación', apiErrors.join(', '))
        } else {
            toast.showError('Error', msg)
        }
    } finally {
        saving.value = false
    }
}

function abrirCambiarPassword(u: Usuario) {
    usuarioPassword.value       = u
    nuevaPassword.value         = ''
    errorPassword.value         = ''
    dialogPasswordVisible.value = true
}

async function cambiarPassword() {
    if (!nuevaPassword.value.trim()) {
        errorPassword.value = 'La contraseña es requerida'
        return
    }
    if (!usuarioPassword.value?._id) return
    savingPassword.value = true
    try {
        await usuarioService.cambiarPassword(usuarioPassword.value._id, { password: nuevaPassword.value })
        toast.showSuccess('Contraseña actualizada')
        dialogPasswordVisible.value = false
    } catch (e: any) {
        toast.showError('Error', e?.response?.data?.message ?? 'Error al cambiar contraseña')
    } finally {
        savingPassword.value = false
    }
}

function confirmarEliminar(u: Usuario) {
    usuarioAEliminar.value       = u
    dialogEliminarVisible.value  = true
}

async function eliminarUsuario() {
    if (!usuarioAEliminar.value?._id) return
    deleting.value = true
    try {
        await usuarioService.eliminarUsuario(usuarioAEliminar.value._id)
        toast.showSuccess('Usuario eliminado')
        dialogEliminarVisible.value = false
        cargarUsuarios(pagination.currentPage)
    } catch (e: any) {
        toast.showError('Error', e?.response?.data?.message ?? 'Error al eliminar')
    } finally {
        deleting.value = false
    }
}

onMounted(() => cargarUsuarios())
</script>

<style scoped>
.usuarios-page {
    max-width: 1100px;
    margin: 0 auto;
    padding: 1.5rem 1rem;
    font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
}

/* ── Header ── */
.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
    gap: 1rem;
    flex-wrap: wrap;
}
.header-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}
.brand-icon {
    width: 44px;
    height: 44px;
    background: #e8edff;
    color: #3b5bdb;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    flex-shrink: 0;
}
.page-title {
    margin: 0;
    font-size: 1.35rem;
    font-weight: 800;
    color: #1e2740;
}
.page-sub {
    margin: 0;
    font-size: 0.8rem;
    color: #6b7280;
}

/* ── Filtros ── */
.filtros-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
}
.filtros-left { display: flex; gap: 0.5rem; align-items: center; }
.filtro-rol   { min-width: 180px; }
.total-label  { font-size: 0.85rem; color: #6b7280; }

/* ── Tabla ── */
.table-wrapper {
    background: #fff;
    border: 1px solid #dde1ea;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.06);
}
.table-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 3rem;
    color: #9ca3af;
}
.table-empty i { font-size: 2rem; opacity: 0.4; }

.usuario-nombre .nombre-full { font-weight: 600; color: #1e2740; }
.muted     { color: #9ca3af; }
.verificado    { color: #0e9f6e; font-size: 1.1rem; }
.no-verificado { color: #e02424; font-size: 1.1rem; }
.tecnico-nombre { font-size: 0.85rem; }
.fecha-cell { font-size: 0.82rem; color: #6b7280; }

.acciones-cell {
    display: flex;
    justify-content: flex-end;
    gap: 0.25rem;
}

/* ── Paginación ── */
.paginacion {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    border-top: 1px solid #dde1ea;
}
.pag-info { font-size: 0.85rem; color: #6b7280; }

/* ── Form dialogs ── */
.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.9rem 1rem;
    padding: 0.25rem 0;
}
.field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}
.field-full { grid-column: 1 / -1; }
.field label {
    font-weight: 600;
    font-size: 0.88rem;
    color: #374151;
}
.req { color: #e02424; }
.error-msg { color: #e02424; font-size: 0.8rem; }

.verificado-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
.checkbox-label { font-size: 0.9rem; cursor: pointer; }

/* ── Confirm dialog ── */
.confirm-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0;
    text-align: center;
}
.confirm-icon {
    font-size: 2.5rem;
    color: #f59e0b;
}
.confirm-sub { font-size: 0.85rem; color: #9ca3af; margin: 0; }
</style>
