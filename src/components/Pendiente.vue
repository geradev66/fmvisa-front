<script lang="ts" setup>
import Card from 'primevue/card';
import FloatLabel from 'primevue/floatlabel';
import Textarea from 'primevue/textarea';
</script>

<template>
    <Card class="pendiente">
        <template #title>
            <div class="card-title">
                <i class="pi pi-exclamation-triangle"></i>
                Pendiente
             </div>
    </template>

    <template #content>
        <FloatLabel variant="on">
         <Textarea id="on_label" rows="5" cols="30" style="resize: none" class="campo" />
         <label for="on_label" class="titulo">Pendiente</label>
        </FloatLabel>
    </template>
</Card> 
</template>
<style scope>
.pendiente {
    margin-top: 1rem;
    width: 100% !important;
    padding: 1rem;
}

.campo{
    margin-top: 1rem;
    width: 100%;
}

.titulo{
    margin-top:1rem;
}
</style>
