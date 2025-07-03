<script setup>
import { ref, onMounted } from 'vue'
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'
import Tag from 'primevue/tag'
import { investorDashboardService } from '@/services/investorDashboardService'

const lastInvestment = ref(null)
const progressPercentage = ref(0)
const remainingAmount = ref(0)
const financedAmount = ref(0)
const daysRemaining = ref(0)

const handleReviewDetails = () => {
  console.log('Revisar detalles clicked')
}

onMounted(async () => {
  try {
    const response = await investorDashboardService.getLastInvestment()
    lastInvestment.value = response.data

    // Simulación: usa 50% financiado como en tu maqueta
    progressPercentage.value = 50
    financedAmount.value = lastInvestment.value.property.valor_estimado * (progressPercentage.value / 100)
    remainingAmount.value = lastInvestment.value.property.valor_estimado - financedAmount.value

    // Simulación: días restantes (en caso no tengas un campo real)
    daysRemaining.value = 60
  } catch (error) {
    console.error('Error al cargar la última inversión:', error)
  }
})
</script>

<template>
  <div class="card" v-if="lastInvestment">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="font-semibold text-xl">Última hipoteca</div>
    </div>

    <!-- Company / Property Information -->
    <div class="mb-4">
      <div class="text-sm mb-2">Código único</div>
      <div class="flex items-center justify-between">
        <div class="font-bold text-xl">{{ lastInvestment.property.nombre }}</div>
        <Tag severity="info" value="A+" class="font-semibold" />
      </div>
    </div>

    <!-- Amount Section -->
    <div class="mb-5">
      <div class="text-sm mb-2">Monto a financiar</div>
      <div class="flex items-center text-3xl font-bold leading-tight">
        <div>
          S/ {{ Number(lastInvestment.property.valor_estimado).toLocaleString('es-PE', { minimumFractionDigits: 2 }) }}
        </div>
        <div class="ml-4 text-base font-normal">
          {{ progressPercentage }}% financiada
        </div>
      </div>
    </div>

    <!-- Progress and Details -->
    <div class="mb-6">
      <div class="flex justify-between text-sm mb-2">
        <span>Tasa mensual</span>
        <span class="font-semibold">
          {{ lastInvestment.property.tem ?? '15.5%' }}
        </span>
      </div>

      <ProgressBar :value="progressPercentage" :showValue="false" :style="{ height: '12px' }" class="mb-3" />

      <div class="flex items-center justify-between">
        <div class="flex items-center text-sm">
          <i class="pi pi-clock mr-2 text-blue-500"></i>
          <span>Cierre inversión</span>
          <span class="ml-2 font-semibold text-gray-800">{{ daysRemaining }} días</span>
        </div>
        <div class="text-sm">
          Faltan S/ {{ Number(remainingAmount).toLocaleString('es-PE', { minimumFractionDigits: 2 }) }}
        </div>
      </div>
    </div>

    <!-- Action Button -->
    <div class="pt-2">
      <Button label="Revisar detalles" severity="contrast" variant="outlined" class="w-full"
        @click="handleReviewDetails" rounded />
    </div>
  </div>
</template>
