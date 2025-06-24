<script setup>
import { ref, onMounted, watch } from 'vue'
import { propertyService } from '@/services/propertyService.js'

const props = defineProps({
  property_id: {
    type: [String, Number],
    required: true
  }
})

const investments = ref([])
const totalRecords = ref(0)
const loading = ref(true)
const currentPage = ref(1)
const perPage = 10 // coincide con tu backend

const loadInvestments = async (page = 1) => {
  loading.value = true
  try {
    const response = await propertyService.getPropertyInvestments(props.property_id, page)
    investments.value = response.data.data
    totalRecords.value = response.data.meta.total
  } catch (error) {
    console.error('Error al cargar inversiones:', error)
  } finally {
    loading.value = false
  }
}

watch(() => props.property_id, () => {
  currentPage.value = 1
  loadInvestments(1)
})

watch(currentPage, (page) => {
  loadInvestments(page)
})

onMounted(() => {
  loadInvestments(currentPage.value)
})
</script>

<template>
  <div class="card">
    <div class="font-semibold text-xl mb-4">Inversiones</div>

    <DataTable
      :value="investments"
      :rows="perPage"
      :paginator="true"
      :totalRecords="totalRecords"
      lazy
      dataKey="id"
      :loading="loading"
      :first="(currentPage - 1) * perPage"
      @page="(e) => currentPage.value = e.page + 1"
      responsiveLayout="scroll"
    >
      <!-- Columna: Inversor (con avatar) -->
      <Column header="Inversor" style="width: 30%">
        <template #body="{ data }">
          <div class="flex items-center gap-3">
            <Avatar :label="data.inversor.charAt(0).toUpperCase()" shape="circle" class="bg-blue-500 text-white" />
            <span class="font-medium">{{ data.inversor }}</span>
          </div>
        </template>
      </Column>

      <!-- Columna: Monto invertido -->
      <Column field="monto_invertido" header="Monto" style="width: 20%">
        <template #body="{ data }">
          <span class="text-green-600 font-semibold">S/ {{ parseFloat(data.monto_invertido).toFixed(2) }}</span>
        </template>
      </Column>

      <!-- Columna: Fecha -->
      <Column field="fecha_inversion" header="Fecha" style="width: 20%">
        <template #body="{ data }">
          <span>{{ data.fecha_inversion }}</span>
        </template>
      </Column>

      <!-- Columna: Ranking -->
      <Column field="Ranking" header="Ranking" style="width: 30%">
        <template #body="{ data }">
          <Tag value="Sigue pujando" severity="info" v-if="data.Ranking === 'Sigue pujando'" />
          <span v-else>{{ data.Ranking }}</span>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
