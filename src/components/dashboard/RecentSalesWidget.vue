<template>
  <Card class="shadow-md">
    <template #content>
      <div v-if="selectedAuction">
        <!-- Aquí irán los detalles reales de los participantes -->
        <p class="text-gray-700">Participants for property ID: {{ selectedPropertyId }}</p>
      </div>

      <!-- Card Azul cuando no hay subasta seleccionada -->
      <div v-else class="bg-blue-50 border border-blue-200 text-blue-700 p-6 rounded-2xl text-center">
        <i class="pi pi-info-circle text-3xl mb-2 block"></i>
        <p class="text-lg font-semibold">No auction selected</p>
        <p>Please select one to view details.</p>
      </div>
    </template>
  </Card>
</template>

<script setup>
defineProps({
  selectedAuction: Object,
  selectedPropertyId: [Number, String, null]
});
</script>
