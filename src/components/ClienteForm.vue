<template>
    <Card class="section-card">
        <template #title>
            <div class="card-title">
                <i class="pi pi-user"></i>
                <span>Datos del Cliente</span>
            </div>
        </template>
        <template #content>
            <div v-if="loading" class="loading-overlay">
                <ProgressSpinner 
                    style="width: 50px; height: 50px" 
                    strokeWidth="4" 
                    animationDuration="1s"
                />
                <p class="loading-text">Cargando datos...</p>
            </div>
            <div class="form-grid" :class="{ 'form-disabled': loading }">
                <div class="form-row">
                    <div class="form-field flex-2">
                        <label>Nombre</label>
                        <InputText 
                            ref="nombreInput"
                            :modelValue="modelValue.nombre" 
                            @update:modelValue="updateField('nombre', $event)"
                            placeholder="Nombre completo"
                            :disabled="loading"
                        />
                        <div v-if="filteredClientes.length > 0 && !modelValue.id" class="clientes-options">
                            <small class="clientes-found">Clientes encontrados:</small>
                            <ul>
                                <li @click="selectCliente(item)" v-for="item in filteredClientes" :key="item.id">{{ item.nombre }}</li>
                            </ul>
                        </div>
                    </div>
                    <div class="form-field">
                        <label>Celular</label>
                        <InputText 
                            :modelValue="modelValue.celular" 
                            @update:modelValue="updateField('celular', $event)"
                            placeholder="Número de celular"
                            :disabled="loading"
                        />
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-field flex-2">
                        <label>Domicilio</label>
                        <InputText 
                            :modelValue="modelValue.domicilio" 
                            @update:modelValue="updateField('domicilio', $event)"
                            placeholder="Dirección"
                            :disabled="loading"
                        />
                    </div>
                    <div class="form-field">
                        <label>RFC</label>
                        <InputText 
                            :modelValue="modelValue.rfc" 
                            @update:modelValue="updateField('rfc', $event)"
                            placeholder="RFC"
                            :disabled="loading"
                        />
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-field">
                        <label>Colonia</label>
                        <InputText 
                            :modelValue="modelValue.colonia" 
                            @update:modelValue="updateField('colonia', $event)"
                            placeholder="Colonia"
                            :disabled="loading"
                        />
                    </div>
                    <div class="form-field">
                        <label>Ciudad</label>
                        <InputText 
                            :modelValue="modelValue.ciudad" 
                            @update:modelValue="updateField('ciudad', $event)"
                            placeholder="Ciudad"
                            :disabled="loading"
                        />
                    </div>
                    <div class="form-field">
                        <label>Estado</label>
                        <InputText 
                            :modelValue="modelValue.estado" 
                            @update:modelValue="updateField('estado', $event)"
                            placeholder="Edo."
                            :disabled="loading"
                        />
                    </div>
                    <div class="form-field">
                        <label>C.P.</label>
                        <InputText 
                            :modelValue="modelValue.cp" 
                            @update:modelValue="updateField('cp', $event)"
                            placeholder="C.P."
                            :disabled="loading"
                        />
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-field">
                        <label>Email</label>
                        <InputText 
                            :modelValue="modelValue.email" 
                            @update:modelValue="updateField('email', $event)"
                            placeholder="correo@ejemplo.com"
                            :disabled="loading"
                        />
                    </div>
                    <div class="form-field">
                        <label>Teléfono</label>
                        <InputText 
                            :modelValue="modelValue.telefono" 
                            @update:modelValue="updateField('telefono', $event)"
                            placeholder="Teléfono fijo"
                            :disabled="loading"
                        />
                    </div>
                    <div class="form-field">
                        <label>Contacto</label>
                        <InputText 
                            :modelValue="modelValue.contacto" 
                            @update:modelValue="updateField('contacto', $event)"
                            placeholder="Persona de contacto"
                            :disabled="loading"
                        />
                    </div>
                </div>
            </div>
        </template>
        <template #footer>
            <div style="display: flex; justify-content: space-between; gap: 1rem;">
                <Button 
                v-if="props.modelValue.id" 
                class="save-button p-button-info"
                style="width: 100%;"
                :loading="loading"
                :disabled="loading"
                @click="emit('update:modelValue', {
                    id: '',
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
                })"
            >
                <span class="pi pi-times"></span>
                Limpiar Cliente
            </Button>         
            <Button 
                v-if="props.modelValue.id" 
                class="save-button p-button-warn"
                :loading="loading"
                style="width: 100%;"
                :disabled="loading"
            >
                <span class="pi pi-save" @click="actualizarCliente()"></span>
                Actualizar Cliente
            </Button>
            <Button 
                v-else 
                class="save-button p-button-success"
                :loading="loading"
                style="width: 100%;"
                :disabled="loading"
            >
                <span @click="guardarCliente()" class="pi pi-save"></span>
                Guardar Cliente
            </Button>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'

import { useClienteService } from '../composables/useClienteService'
import { ref, onBeforeMount, computed } from 'vue'

// import type { AutoCompleteCompleteEvent } from 'primevue'

import { useToast } from '../composables/useToast'
import { type Cliente } from '../models/cliente'

interface Props {
    modelValue: Cliente
}

interface Emits {
    (e: 'update:modelValue', value: Cliente): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const clienteService = useClienteService();

const loading = ref(false)
const clientes = ref<Cliente[]>([])

// @ts-ignore const nombreInput = ref<any>(null)


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
        console.log('Clientes obtenidos:', clientes.value)
    } catch (error) {
        console.error('Error fetching clientes:', error)
    } finally {
        loading.value = false
    }
})


const updateField = (field: keyof Cliente, value: any) => {
    console.log(`Updating field ${field} with value:`, value)
    emit('update:modelValue', {
        ...props.modelValue,
        [field]: value
    })
}

// const searchClientes = async (event: AutoCompleteCompleteEvent) => {
//     try {
//         console.log('Searching clientes with query:', event.query)
//         // clientes.value = response.data
//     } catch (error) {
//         console.error('Error searching clientes:', error)
//     }
// }

const selectCliente = (cliente: Cliente) => {
    emit('update:modelValue', cliente)
}

const guardarCliente = async () => {
    toast.showInfo('Funcionalidad de guardar cliente aún no implementada', 'Próximamente')
}

const actualizarCliente = async () => {
    toast.showInfo('Funcionalidad de actualizar cliente aún no implementada', 'Próximamente')
}
</script>

<style scoped>

.clientes-found {
    font-size: 0.75rem;
    color: #555;
    margin-bottom: 0.25rem;
    margin-left: 0.5rem;
}

.clientes-options {
    margin-top: 0.5rem;
    background: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 4px;
    max-height: 150px;
    overflow-y: auto;
    animation: fadeIn 0.3s ease;
    position: absolute;
    z-index: 1000;
    top: 6.5rem;
    width: 50rem;

    ul {
        list-style: none;
        margin: 0;
        padding: 0;

        li {
            padding: 0.5rem;
            border-bottom: 1px solid #eee;

            &:hover {
                background: #e6f7ff;
                cursor: pointer;
            }
        }
    }
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.save-button {
    margin-top: 1rem;
    display: block;
    margin-left: auto;
}

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

.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10;
    border-radius: 8px;
}

.loading-text {
    margin-top: 1rem;
    color: #64748b;
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
