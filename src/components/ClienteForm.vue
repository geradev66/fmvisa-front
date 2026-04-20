<template>
    <Card class="section-card">
        <template #content>
            <div v-if="loading" class="loading-overlay">
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" animationDuration="1s" />
                <p class="loading-text">Cargando datos...</p>
            </div>
            <br>
            <div class="form-grid" :class="{ 'form-disabled': loading }">
                <div class="form-row">
                    <div ref="clienteWrapperRef" class="form-field flex-2 cliente-busqueda-wrapper">
                        <FloatLabel variant="on">
                            <InputText id="nombre" ref="nombreInput" :modelValue="modelValue.nombre"
                                @update:modelValue="updateField('nombre', $event)"
                                @keydown="onNombreKeydown"
                                :disabled="loading" />
                            <label for="nombre">Nombre</label>
                        </FloatLabel>
                        <Transition name="dropdown">
                            <div v-if="filteredClientes.length > 0 && !modelValue._id && mostrarSugerencias" class="clientes-options">
                                <div class="clientes-options-header">
                                    <i class="pi pi-user"></i>
                                    <span>Clientes encontrados ({{ filteredClientes.length }})</span>
                                </div>
                                <ul ref="listaClientesRef">
                                    <li
                                        v-for="(item, idx) in filteredClientes"
                                        :key="item._id"
                                        :class="{ 'cliente-activo': idx === indiceSugerencia }"
                                        @click="selectCliente(item)"
                                        @mouseenter="indiceSugerencia = idx"
                                    >
                                        <span class="cliente-nombre">{{ item.nombre }}</span>
                                        <span class="cliente-detalle">{{ item.celular }}</span>
                                    </li>
                                </ul>
                            </div>
                        </Transition>
                    </div>
                    <small v-if="!modelValue._id" class="info-nuevo-cliente">
                        <i class="pi pi-info-circle"></i> Se creará cliente al guardar la orden.
                    </small>
                </div>
                <div class="form-row flex-2">
                    <div class="form-field">
                        <FloatLabel variant="on">
                            <InputText id="celular" :modelValue="modelValue.celular"
                                @update:modelValue="updateField('celular', $event)" :disabled="loading" />
                            <label for="celular">Celular</label>
                        </FloatLabel>
                    </div>
                    <div class="form-field">
                        <FloatLabel variant="on">
                            <InputText id="telefono" :modelValue="modelValue.telefono"
                                @update:modelValue="updateField('telefono', $event)" :disabled="loading" />
                            <label for="telefono">Teléfono Alternativo</label>
                        </FloatLabel>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-field flex-2">
                        <FloatLabel variant="on">
                            <InputText id="domicilio" :modelValue="modelValue.domicilio"
                                @update:modelValue="updateField('domicilio', $event)" :disabled="loading" />
                            <label for="domicilio">Domicilio</label>
                        </FloatLabel>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-field">
                        <FloatLabel variant="on">
                            <InputText id="email" :modelValue="modelValue.email"
                                @update:modelValue="updateField('email', $event)" :disabled="loading" />
                            <label for="email">Email</label>
                        </FloatLabel>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-field">
                        <FloatLabel variant="on">
                            <InputText id="contacto" :modelValue="modelValue.contacto"
                                @update:modelValue="updateField('contacto', $event)" :disabled="loading" />
                            <label for="contacto">Contacto</label>
                        </FloatLabel>
                    </div>
                </div>
                <EstadoOrdenForm
                    :estadoOrden="estadoOrden"
                    :referencias="referencias"
                    :tipoCargo="tipoCargo"
                    @update:estadoOrden="emit('update:estadoOrden', $event)"
                    @update:referencias="emit('update:referencias', $event)"
                    @update:tipoCargo="emit('update:tipoCargo', $event)"
                />
            </div>
        </template>
        <template #footer>
            <div style="display: flex; justify-content: space-between; gap: 1rem;">
                <Button v-if="props.modelValue._id" class="save-button p-button-info" style="width: 100%;"
                    :loading="loading" :disabled="loading" @click="emit('update:modelValue', {
                        _id: '',
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
                    })">
                    <span class="pi pi-times"></span>
                    Limpiar Cliente
                </Button>
                <Button v-if="props.modelValue._id" class="save-button p-button-warn" :loading="loading"
                    style="width: 100%;" :disabled="loading">
                    <span class="pi pi-save" @click="actualizarCliente()"></span>
                    Actualizar Cliente
                </Button>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import EstadoOrdenForm from './EstadoOrdenForm.vue'

import { useClienteService } from '../composables/useClienteService'
import { ref, onBeforeMount, computed, onUnmounted } from 'vue'
import { useToast } from '../composables/useToast'
import { type Cliente } from '../models/cliente'
import type { EstadoOrden, ReferenciaTipo, TipoCargo } from '../models/orden-servicio'

interface Props {
    modelValue: Cliente
    estadoOrden: EstadoOrden
    referencias: ReferenciaTipo
    tipoCargo: TipoCargo
}

interface Emits {
    (e: 'update:modelValue', value: Cliente): void
    (e: 'update:estadoOrden', value: EstadoOrden): void
    (e: 'update:referencias', value: ReferenciaTipo): void
    (e: 'update:tipoCargo', value: TipoCargo): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const clienteService = useClienteService();

const loading = ref(false)
const clientes = ref<Cliente[]>([])
const mostrarSugerencias = ref(false)
const indiceSugerencia = ref(-1)
const clienteWrapperRef = ref<HTMLElement | null>(null)
const listaClientesRef = ref<HTMLElement | null>(null)

const cerrarSugerencias = () => {
    mostrarSugerencias.value = false
    indiceSugerencia.value = -1
}

const onClickOutside = (e: MouseEvent) => {
    if (clienteWrapperRef.value && !clienteWrapperRef.value.contains(e.target as Node)) {
        cerrarSugerencias()
    }
}

const onNombreKeydown = (e: KeyboardEvent) => {
    const total = filteredClientes.value.length
    if (!mostrarSugerencias.value || total === 0) return
    if (e.key === 'ArrowDown' || e.key === 'Tab') {
        e.preventDefault()
        indiceSugerencia.value = (indiceSugerencia.value + 1) % total
        scrollClienteVisible()
    } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        indiceSugerencia.value = (indiceSugerencia.value - 1 + total) % total
        scrollClienteVisible()
    } else if (e.key === 'Enter') {
        e.preventDefault()
        if (indiceSugerencia.value >= 0) {
            selectCliente(filteredClientes.value[indiceSugerencia.value] as any)
        }
    } else if (e.key === 'Escape') {
        cerrarSugerencias()
    }
}

const scrollClienteVisible = () => {
    if (!listaClientesRef.value) return
    const items = listaClientesRef.value.querySelectorAll('li')
    items[indiceSugerencia.value]?.scrollIntoView({ block: 'nearest' })
}

const toast = useToast();

const filteredClientes = computed(() => {
    if (!props.modelValue.nombre) {
        return []
    }
    const query = props.modelValue.nombre.toLowerCase()
    return clientes.value.filter(cliente =>
        cliente.nombre.toLowerCase().includes(query)
    )
})


onBeforeMount(async () => {
    loading.value = true
    try {
        const response = await clienteService.obtenerClientes();
        clientes.value = response.data;
    } catch (error) {
        console.error('Error fetching clientes:', error)
    } finally {
        loading.value = false
    }
    document.addEventListener('mousedown', onClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('mousedown', onClickOutside)
})


const updateField = (field: keyof Cliente, value: any) => {
    if (field === 'nombre') {
        mostrarSugerencias.value = true
        indiceSugerencia.value = -1
    }
    emit('update:modelValue', {
        ...props.modelValue,
        [field]: value
    })
}

const selectCliente = (cliente: Cliente) => {
    cerrarSugerencias()
    emit('update:modelValue', cliente)
}

const actualizarCliente = async () => {
    toast.showInfo('Funcionalidad de actualizar cliente aún no implementada', 'Próximamente')
}
</script>

<style scoped>
.info-nuevo-cliente {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.75rem;
    color: var(--info-text);
    background: var(--info-bg);
    border: 1px solid var(--info-border);
    border-radius: 4px;
    padding: 0.35rem 0.6rem;
    margin-top: 0.25rem;
    width: 100%;
}

/* Buscador cliente */
.cliente-busqueda-wrapper {
    position: relative;
}

.clientes-options {
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
}

.clientes-options-header {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 0.75rem;
    background: var(--surface-section);
    border-bottom: 1px solid var(--border-subtle);
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;

    i {
        font-size: 0.85rem;
        color: var(--text-faint);
    }
}

.clientes-options ul {
    list-style: none;
    margin: 0;
    padding: 0;
    max-height: 220px;
    overflow-y: auto;
}

.clientes-options li {
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

    &.cliente-activo {
        background: var(--surface-selected);
    }
}

.cliente-nombre {
    font-weight: 600;
    color: var(--text-primary);
}

.cliente-detalle {
    font-size: 12px;
    color: var(--text-muted);
    flex-shrink: 0;
}

/* Transition */
.dropdown-enter-active,
.dropdown-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}

.save-button {
    margin-top: 1rem;
    display: block;
    margin-left: auto;
}

.section-card {
    padding: var(--section-card-padding);
}

.card-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: var(--card-title-font-size);
    font-weight: 600;
    color: var(--text-primary);
}

.card-title i {
    color: var(--icon-accent);
}

.form-grid {
    display: flex;
    flex-direction: column;
    gap: var(--form-grid-gap);
}

.form-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--form-grid-gap);
}

.form-field {
    display: flex;
    flex-direction: column;
    gap: var(--form-grid-gap);
}

.form-field.flex-1 {
    grid-column: span 1;
}

.form-field.flex-2 {
    grid-column: span 2;
}

.form-field :deep(.p-floatlabel) {
    width: 100%;
}

.form-field :deep(.p-inputtext) {
    width: 100%;
}

.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--overlay-loading);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10;
    border-radius: 8px;
}

.loading-text {
    margin-top: 1rem;
    color: var(--text-muted);
    font-size: 0.875rem;
    font-weight: 500;
}

.form-disabled {
    opacity: 0.6;
    pointer-events: none;
}

.section-card {
    position: relative;
}
</style>
