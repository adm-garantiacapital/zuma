<template>
  <Dialog
    :visible="internalVisible"
    @update:visible="emit('update:visible', $event)"
    modal
    header="Cronograma de Pagos"
    :style="{ width: '700px' }"
  >
    <DataTable :value="schedules" :paginator="true" :rows="5" responsiveLayout="scroll">
      <Column field="cuota" header="Cuota" />
      <Column field="vencimiento" header="Vencimiento" />
      <Column field="capital" header="Capital" />
      <Column field="intereses" header="Intereses" />
      <Column field="total_cuota" header="Total Cuota" />
      <Column field="estado" header="Estado" />
    </DataTable>

    <template #footer>
      <Button label="Cerrar" icon="pi pi-times" @click="emit('update:visible', false)" />
    </template>
  </Dialog>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  visible: Boolean,
  schedules: Array
});

const emit = defineEmits(['update:visible']);

const internalVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
});
</script>
