<template>
  <!-- Sin inversiones -->
  <div v-if="!lastInvestment">
    <div class="col-span-2 lg:col-span-1 border rounded-xl">
      <div class="border-general-grey rounded-3xl bg-white relative p-10">
        <h5 class="text-[#171717] font-semibold">Última hipoteca</h5>
        <div class="text-center my-20">
          <p class="font-bold mb-3 fill-[#171717]">¡Ups, aún no tienes una hipoteca registrada!</p>
          <svg xmlns='http://www.w3.org/2000/svg' class="fill-[#171717] mx-auto" width='169.333' height='228' viewBox='0 0 127 171'>
            <path
              d='M106.5 2.3c-3.3.5-6.1 1.1-6.3 1.2-.4.4 9.8 53.8 10.4 54.4.2.2 2.8 0 5.9-.4l5.6-.7-.6-3.1c-.7-3.9-6.5-50.2-6.5-51.6 0-1.2-.2-1.2-8.5.2zM44 16.1C25.6 18.8 10.1 31.7 4 49.4c-8.1 23.5 2.9 50.3 24.8 60.8l6.9 3.3-2.6 4.9c-2.5 4.9-2.6 5.5-2.9 27.8l-.3 22.8H51v-3c0-2.2-.5-3-1.8-3-1 0-2.8-.7-4-1.6-2.1-1.5-2.2-2.1-2.2-18.6 0-19.2.5-21 7-24.7 6.5-3.6 13.6-2.4 18.9 3.2 2 2.2 2.8 5.6 5.8 23.3 1.9 11.5 3.6 21 3.9 21.3.4.4 15.3-1.5 18.5-2.5 1.1-.3 1.4-1.3 1.1-3.4-.4-2.5-.9-3-3.1-3-5.5 0-6.2-1.5-9.1-19.1-2.7-16.3-4.3-21.2-8.4-25.8l-2.1-2.3 2.5-1.6c7.2-4.7 14.3-12.9 18.3-21.1 3.7-7.8 4.1-9.2 4.5-18.7.4-8.4.1-11.4-1.6-17.1-5.7-18.6-21.5-32.2-40.9-35.2-3.9-.6-7.5-1-8-1-.4.1-3.3.5-6.3 1zm23.2 14.1c8 3.7 15.2 10.7 19.1 18.7 2.9 6.1 3.2 7.4 3.2 16.6 0 8.8-.3 10.7-2.7 15.7C75.2 106 43.1 112 24 93 3.3 72.2 12.1 37.7 40.5 28.3c6.6-2.1 19.9-1.2 26.7 1.9z' />
            <path
              d='M43.7 35.6c-.3.3-.3 2-.1 3.7.5 2.9.2 3.4-3.2 5.2-5.3 2.8-7.9 6.8-7.9 11.9 0 8.9 4.3 12.3 17 13.6 9.3 1 10 1.2 11.5 4.1 1.8 3.2-2.8 6.9-8.4 6.9-3.7 0-4.8-.5-7-3.1-2.5-2.9-3-3.1-7.2-2.4-4.3.6-4.5.8-4 3.3 1 4 6.8 9 12.1 10.3 4 1 4.5 1.4 4.5 4 0 3.4.5 3.7 5.3 3.1 3.8-.4 3.9-.5 3.3-3.8-.6-3.1-.4-3.5 3.3-5.3 7.4-3.8 10.6-11.5 7.8-18.3-2.2-5.3-5.4-6.9-15.9-8-10-1-11.8-1.8-11.8-5.4 0-6.6 12.7-7.2 15.1-.7.7 1.7 9.3 0 9.7-1.8.7-3.5-8-10.9-12.6-10.9-2.1 0-3.2-1.8-3.2-5.1 0-1.5-.7-1.9-3.8-1.9-2.1 0-4.1.3-4.5.6zM115.4 63c-2.9 1.1-5.4 4.9-5.4 7.8 0 3.2 5.2 8.2 8.5 8.2 3.4 0 8.5-5 8.5-8.4 0-5.2-6.8-9.6-11.6-7.6z' />
          </svg>
          <p class="mt-3 text-[#171717]">Cuando inviertas en una propiedad, aparecerá aquí.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Con inversión -->
  <div v-else class="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="font-semibold text-xl">Última hipoteca</div>
    </div>

    <!-- Datos de la propiedad -->
    <div class="mb-6">
      <!-- Dirección -->
      <div class="flex items-center justify-between mb-2">
        <div class="font-bold text-xl text-[#1F2937]">
          <i class="pi pi-map-marker text-blue-500 mr-2"></i>
          {{ lastInvestment.property.direccion }}, {{ lastInvestment.property.distrito }},
          {{ lastInvestment.property.provincia }}, {{ lastInvestment.property.departamento }}
        </div>
        <Tag
            :value="lastInvestment.property.riesgo"
            :severity="getSeverity(lastInvestment.property.riesgo)"
            class="font-semibold"
          />
      </div>

      <!-- Descripción -->
      <div class="text-sm text-gray-600 whitespace-pre-line mb-3">
        <i class="pi pi-info-circle text-gray-500 mr-2"></i>
        {{ lastInvestment.property.descripcion }}
      </div>

      <!-- Info adicional -->
      <div class="grid grid-cols-2 gap-4 text-sm text-gray-700">
        <div class="flex items-center">
          <i class="pi pi-clock text-indigo-500 mr-2"></i>
          <span><strong>Plazo:</strong> {{ lastInvestment.property.deadlines_id }}</span>
        </div>
        <div class="flex items-center">
          <i class="pi pi-percentage text-green-500 mr-2"></i>
          <span><strong>TEA:</strong> {{ lastInvestment.property.tea }}%</span>
        </div>
        <div class="flex items-center">
          <i class="pi pi-percentage text-orange-500 mr-2"></i>
          <span><strong>TEM:</strong> {{ lastInvestment.property.tem }}%</span>
        </div>
        <div class="flex items-center">
          <i class="pi pi-dollar text-teal-500 mr-2"></i>
          <span><strong>Moneda:</strong> {{ lastInvestment.property.currency_id }}</span>
        </div>
      </div>
    </div>

    <!-- Monto y cuotas -->
    <div class="mb-5">
      <div class="text-sm mb-2">Monto de la hipoteca</div>
      <div class="flex items-center text-3xl font-bold leading-tight">
        <div>
          S/ {{ Number(lastInvestment.property.valor_estimado).toLocaleString('es-PE', { minimumFractionDigits: 2 }) }}
        </div>
        <div class="ml-4 text-base font-normal">
          {{ lastInvestment.cuotas_totales }} cuotas
        </div>
      </div>
    </div>

    <!-- Avance -->
    <div class="mb-6">
      <div class="flex justify-between text-sm mb-2">
        <div class="flex items-center gap-2">
          <span>Cuotas pendientes:</span>
          <span class="font-semibold text-blue-700">{{ lastInvestment.cuotas_pendientes }}</span>
        </div>
        <div class="flex items-center gap-1 text-sm text-red-600 font-semibold">
          <i class="pi pi-exclamation-triangle"></i>
          {{ lastInvestment.cuotas_vencidas }} vencida<span v-if="lastInvestment.cuotas_vencidas !== 1">s</span>
        </div>
      </div>

      <!-- Barra de progreso -->
      <div
        class="rounded-full overflow-hidden h-3 mb-3"
        :class="{
          'bg-red-200': isOverdue,
          'bg-gray-200': !isOverdue
        }"
      >
        <ProgressBar
          :value="progressPercentage"
          :showValue="false"
          class="h-full"
          :pt="{
            value: {
              class: isOverdue ? 'bg-red-600' : 'bg-blue-600'
            }
          }"
        />
      </div>

      <!-- Próxima fecha de pago + saldo pendiente -->
      <div class="flex items-center justify-between mb-1">
        <div class="flex items-center text-sm">
          <i
            class="pi pi-clock mr-2"
            :class="{
              'text-red-500': isOverdue,
              'text-blue-500': !isOverdue
            }"
          ></i>
          <span
            :class="{
              'text-red-600': isOverdue,
              'text-gray-700': !isOverdue
            }"
          >
            Próxima fecha de pago:
          </span>
          <span
            class="ml-2 font-semibold"
            :class="{
              'text-red-600': isOverdue,
              'text-gray-800': !isOverdue
            }"
          >
            {{ lastInvestment.proxima_fecha_pago }}
          </span>
        </div>

        <div class="text-sm font-medium">
          S/ {{ Number(lastInvestment.saldo_pendiente_total).toLocaleString('es-PE', { minimumFractionDigits: 2 }) }}
        </div>
      </div>
    </div>

    <!-- Botón detalles -->
    <div class="pt-2">
      <Button label="Revisar detalles" severity="contrast" variant="outlined" class="w-full"
        @click="handleReviewDetails" rounded />
    </div>
  <Cronograma v-model:visible="showCronograma" :propertyId="lastInvestment.id" />
    <!-- Cronograma -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import ProgressBar from 'primevue/progressbar'
import Cronograma from './Cronograma.vue'
import { investorDashboardService } from '@/services/investorDashboardService'

const lastInvestment = ref(null)
const progressPercentage = ref(0)
const isOverdue = ref(false)
const showCronograma = ref(false)

const handleReviewDetails = () => {
  if (!lastInvestment.value?.id) return
  showCronograma.value = true
}


onMounted(async () => {
  try {
    const response = await investorDashboardService.getLastInvestment()
    lastInvestment.value = response.data

    const pagadas = lastInvestment.value.cuotas_pagadas || 0
    const totales = lastInvestment.value.cuotas_totales || 1
    progressPercentage.value = Math.round((pagadas / totales) * 100)

    const hoy = new Date()
    const proxima = new Date(lastInvestment.value.proxima_fecha_pago)
    isOverdue.value = proxima < hoy
  } catch (error) {
    console.error('Error al cargar la inversión:', error)
  }
})
const getSeverity = (riesgo) => {
  switch (riesgo) {
    case 'A+':
      return 'success'
    case 'A':
      return 'info'
    case 'B':
      return 'warn'
    case 'C':
    case 'D':
      return 'danger'
    default:
      return 'secondary'
  }
}

</script>
