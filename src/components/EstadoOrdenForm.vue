<template>
    <Card class="section-card estado-card">
        <template #title>
            <div class="card-title">
                <i class="pi pi-info-circle"></i>
                <span>Estado de la Orden</span>
                <Tag :value="estadoOrden" :severity="getEstadoSeverity()" class="ml-auto" />
            </div>
        </template>
        <template #content>
            <div class="radio-section">
                <h4 class="section-subtitle"> PENDIENTE POR</h4>
                <div class="radio-grid">
                    <div class="radio-option">
                        <RadioButton :modelValue="estadoOrden" @update:modelValue="emit('update:estadoOrden', $event)" inputId="autoriza" value="Autoriza" />
                        <label for="autoriza">Autorizar</label>
                    </div>
                    <div class="radio-option">
                        <RadioButton :modelValue="estadoOrden" @update:modelValue="emit('update:estadoOrden', $event)" inputId="informa" value="Informa" />
                        <label for="informa">Información</label>
                    </div>
                    <div class="radio-option">
                        <RadioButton :modelValue="estadoOrden" @update:modelValue="emit('update:estadoOrden', $event)" inputId="refaccion" value="Refacción" />
                        <label for="refaccion">Refacción</label>
                    </div>
                    <div class="radio-option">
                        <RadioButton :modelValue="estadoOrden" @update:modelValue="emit('update:estadoOrden', $event)" inputId="entregar" value="Entregar" />
                        <label for="entregar">Entregar</label>
                    </div>
                    <div class="radio-option">
                        <RadioButton :modelValue="estadoOrden" @update:modelValue="emit('update:estadoOrden', $event)" inputId="ninguno" value="Ninguno" />
                        <label for="ninguno">Ninguno</label>
                    </div>
                </div>
            </div>
            <div class="radio-section">
                <h4 class="section-subtitle"><i class="pi pi-bookmark"></i> REFERENCIAS</h4>
                <div class="radio-grid">
                    <div class="radio-option">
                        <RadioButton :modelValue="referencias" @update:modelValue="emit('update:referencias', $event)" inputId="GarantíaDeReparacion" value="Garantia" />
                        <label for="GarantíaDeReparacion">Gtia. reparación</label>
                    </div>
                    <div class="radio-option">
                        <RadioButton :modelValue="referencias" @update:modelValue="emit('update:referencias', $event)" inputId="sinReparacion" value="SinReparacion" />
                        <label for="sinReparacion">Sin Reparación</label>
                    </div>
                    <div class="radio-option">
                        <RadioButton :modelValue="referencias" @update:modelValue="emit('update:referencias', $event)" inputId="noAutorizo" value="NoAutorizo" />
                        <label for="noAutorizo">No Autorizo</label>
                    </div>
                    <div class="radio-option">
                        <RadioButton :modelValue="referencias" @update:modelValue="emit('update:referencias', $event)" inputId="reparado" value="Reparado" />
                        <label for="reparado" class="label-destacado">Reparado</label>
                    </div>
                    <div class="radio-option">
                    </div>
                    <div class="radio-option">
                        <RadioButton :modelValue="referencias" @update:modelValue="emit('update:referencias', $event)" inputId="ningunRef" value="Ninguno" />
                        <label for="ningunRef">Ninguno</label>
                    </div>
                </div>
            </div>
            <div class="radio-section">
                <h4 class="section-subtitle"><i class="pi pi-credit-card"></i> CARGOS</h4>
                <div class="radio-grid">
                    <div class="radio-option">
                        <RadioButton :modelValue="tipoCargo" @update:modelValue="emit('update:tipoCargo', $event)" inputId="cargoRegular" value="CargoRegular" />
                        <label for="cargoRegular">Cargo</label>
                    </div>
                    <div class="radio-option">
                        <RadioButton :modelValue="tipoCargo" @update:modelValue="emit('update:tipoCargo', $event)" inputId="sinCargo" value="SinCargo" />
                        <label for="sinCargo">Sin Cargo</label>
                    </div>
                    <div class="radio-option">
                        <RadioButton :modelValue="tipoCargo" @update:modelValue="emit('update:tipoCargo', $event)" inputId="garantiaVendor" value="GarantiaVendor" />
                        <label for="garantiaVendor">Gtia. de venta</label>
                    </div>
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import RadioButton from 'primevue/radiobutton'
import Tag from 'primevue/tag'
import type { EstadoOrden, ReferenciaTipo, TipoCargo } from '../models/orden-servicio'

interface Props {
    estadoOrden: EstadoOrden
    referencias: ReferenciaTipo
    tipoCargo: TipoCargo
}

interface Emits {
    (e: 'update:estadoOrden', value: EstadoOrden): void
    (e: 'update:referencias', value: ReferenciaTipo): void
    (e: 'update:tipoCargo', value: TipoCargo): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const getEstadoSeverity = (): string => {
    const severityMap: Record<EstadoOrden, string> = {
        'Pendiente': 'warning',
        'Autoriza': 'success',
        'Informa': 'info',
        'Refacción': 'primary',
        'Entregar': 'success',
        'Ninguno': 'secondary'
    }
    return severityMap[props.estadoOrden] || 'secondary'
}
</script>

<style scoped>
.estado-card {
    flex: 1;
    min-height: 0;
    overflow: hidden;
}

.section-card {
    padding: var(--section-card-padding);
}

.card-title {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 13px;
    font-weight: 600;
    font-size: var(--card-title-font-size);
    color: var(--text-color);
    padding: 0;
    margin: 0;
}

.card-title i {
    color: #3b82f6;
    font-size: var(--card-title-font-size);
}


.section-subtitle {
    font-size: .9rem;
    font-weight: 600;
    color: #64748b;
    margin-bottom: 0.4rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.radio-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.2rem 0.4rem;
}

.radio-option {
    display: flex;
    align-items: center;
    gap: 0.28rem;
}

.radio-option label {
    font-size: .9rem;
    color: #475569;
    cursor: pointer;
    line-height: 1.2;
}

.label-destacado {
    font-size: 1.05rem !important;
    font-weight: 700;
    color: #0f172a;
}


:deep(.p-divider) {
    margin: 0.3rem 0;
}
</style>
