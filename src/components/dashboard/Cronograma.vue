<template>
  <Dialog
    :visible="visible"
    @update:visible="emit('update:visible', $event)"
    modal
    header="Cronograma de Pagos"
    :style="{ width: '1300px' }"
  >
    <div v-if="loading" class="text-center py-6">Cargando...</div>

    <DataTable
      v-else
      :value="cronograma"
      :paginator="true"
      :rows="10"
      :rowsPerPageOptions="[5, 10, 20]"
      responsiveLayout="scroll"
    >
      <Column field="cuota" header="Cuota" />
      <Column field="vencimiento" header="Vencimiento" />
      <Column field="saldo_inicial" header="Saldo Inicial" />
      <Column field="capital" header="Capital" />
      <Column field="intereses" header="Intereses" />
      <Column field="cuota_neta" header="Cuota Neta" />
      <Column field="igv" header="IGV" />
      <Column field="total_cuota" header="Total Cuota" />
      <Column field="saldo_final" header="Saldo Final" />

      <!-- Estado con TAG -->
      <Column header="Estado">
        <template #body="{ data }">
          <Tag
            :value="data.estado"
            :severity="getTagSeverity(data.estado)"
            class="capitalize"
          />
        </template>
      </Column>
    </DataTable>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import { paymentScheduleService } from '@/services/paymentScheduleService'

const props = defineProps({
  propertyId: Number,
  visible: Boolean
})
const emit = defineEmits(['update:visible'])

const cronograma = ref([])
const loading = ref(false)

// Cargar datos cuando se abre
watch(() => props.visible, async (val) => {
  if (val && props.propertyId) {
    loading.value = true
    try {
      const res = await paymentScheduleService.getByPropertyId(props.propertyId)
      cronograma.value = res.data.data
    } catch (error) {
      console.error('Error al cargar cronograma:', error)
    } finally {
      loading.value = false
    }
  }
})

// Tag de color según estado
const getTagSeverity = (estado) => {
  switch (estado) {
    case 'pendiente':
      return 'info'
    case 'pagado':
      return 'success'
    case 'vencido':
      return 'danger'
    default:
      return 'warning'
  }
}
</script>
