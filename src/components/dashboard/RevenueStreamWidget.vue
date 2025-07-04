<template>
  <div>
    <!-- Mostrar mensaje si no hay datos -->
    <div v-if="properties.length === 0">
<div class="col-span-2 lg:col-span-1 border rounded-xl">
      <div class="border-general-grey rounded-3xl bg-white relative p-10">
        <h5 class="text-[#171717] m-0 font-semibold w-full m-0 text-[#171717]">Ranking top 6 de subastas más altas</h5>
        <div class="text-center my-20">
          <p class="font-bold mt-0 mb-3 fill-[#171717]">¡Ups, aún no hay subastas registradas!</p>
          <svg xmlns='http://www.w3.org/2000/svg' class="fill-[#171717] relative mx-auto" width='169.333' height='228'
            version='1.0' viewBox='0 0 127 171'>
            <path
              d='M106.5 2.3c-3.3.5-6.1 1.1-6.3 1.2-.4.4 9.8 53.8 10.4 54.4.2.2 2.8 0 5.9-.4l5.6-.7-.6-3.1c-.7-3.9-6.5-50.2-6.5-51.6 0-1.2-.2-1.2-8.5.2zM44 16.1C25.6 18.8 10.1 31.7 4 49.4c-8.1 23.5 2.9 50.3 24.8 60.8l6.9 3.3-2.6 4.9c-2.5 4.9-2.6 5.5-2.9 27.8l-.3 22.8H51v-3c0-2.2-.5-3-1.8-3-1 0-2.8-.7-4-1.6-2.1-1.5-2.2-2.1-2.2-18.6 0-19.2.5-21 7-24.7 6.5-3.6 13.6-2.4 18.9 3.2 2 2.2 2.8 5.6 5.8 23.3 1.9 11.5 3.6 21 3.9 21.3.4.4 15.3-1.5 18.5-2.5 1.1-.3 1.4-1.3 1.1-3.4-.4-2.5-.9-3-3.1-3-5.5 0-6.2-1.5-9.1-19.1-2.7-16.3-4.3-21.2-8.4-25.8l-2.1-2.3 2.5-1.6c7.2-4.7 14.3-12.9 18.3-21.1 3.7-7.8 4.1-9.2 4.5-18.7.4-8.4.1-11.4-1.6-17.1-5.7-18.6-21.5-32.2-40.9-35.2-3.9-.6-7.5-1-8-1-.4.1-3.3.5-6.3 1zm23.2 14.1c8 3.7 15.2 10.7 19.1 18.7 2.9 6.1 3.2 7.4 3.2 16.6 0 8.8-.3 10.7-2.7 15.7C75.2 106 43.1 112 24 93 3.3 72.2 12.1 37.7 40.5 28.3c6.6-2.1 19.9-1.2 26.7 1.9z' />
            <path
              d='M43.7 35.6c-.3.3-.3 2-.1 3.7.5 2.9.2 3.4-3.2 5.2-5.3 2.8-7.9 6.8-7.9 11.9 0 8.9 4.3 12.3 17 13.6 9.3 1 10 1.2 11.5 4.1 1.8 3.2-2.8 6.9-8.4 6.9-3.7 0-4.8-.5-7-3.1-2.5-2.9-3-3.1-7.2-2.4-4.3.6-4.5.8-4 3.3 1 4 6.8 9 12.1 10.3 4 1 4.5 1.4 4.5 4 0 3.4.5 3.7 5.3 3.1 3.8-.4 3.9-.5 3.3-3.8-.6-3.1-.4-3.5 3.3-5.3 7.4-3.8 10.6-11.5 7.8-18.3-2.2-5.3-5.4-6.9-15.9-8-10-1-11.8-1.8-11.8-5.4 0-6.6 12.7-7.2 15.1-.7.7 1.7 9.3 0 9.7-1.8.7-3.5-8-10.9-12.6-10.9-2.1 0-3.2-1.8-3.2-5.1 0-1.5-.7-1.9-3.8-1.9-2.1 0-4.1.3-4.5.6zM115.4 63c-2.9 1.1-5.4 4.9-5.4 7.8 0 3.2 5.2 8.2 8.5 8.2 3.4 0 8.5-5 8.5-8.4 0-5.2-6.8-9.6-11.6-7.6z' />
          </svg>
          <p class="mt-3 m-0 text-[#171717]">Cuando se registren subastas, se verán aquí desde la más grande hasta la menor.</p>
        </div>
      </div>
    </div>
    </div>

    <!-- Lista de propiedades si hay datos -->
    <div v-else>
      <div
        v-for="property in properties"
        :key="property.id"
        :class="[
          'flex items-center justify-between p-4 rounded-xl transition-all duration-200 relative overflow-hidden',
          property.bgColor,
          property.isTop3 ? 'shadow-lg' : 'border border-gray-200'
        ]"
      >
        <template v-if="property.isTop3">
          <div
            class="absolute left-0 top-1/2 -translate-y-1/2 w-24 text-center text-6xl font-extrabold text-white opacity-40 pointer-events-none select-none"
            style="mask-image: radial-gradient(ellipse at center, white 40%, transparent 70%)"
          >
            {{ property.id }}
          </div>

          <div
            class="absolute right-0 top-1/2 -translate-y-1/2 w-24 text-center text-6xl font-extrabold text-white opacity-40 pointer-events-none select-none"
            style="mask-image: radial-gradient(ellipse at center, white 40%, transparent 70%)"
          >
            {{ property.id }}
          </div>
        </template>

        <div class="flex items-center space-x-4 relative z-10">
          <div class="relative">
            <div
              :class="[
                'w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm',
                property.isTop3 ? 'bg-white bg-opacity-20 border border-white border-opacity-30' : 'bg-gray-100'
              ]"
            >
              <i
                :class="[
                  property.icon,
                  'text-lg',
                  property.isTop3 ? 'text-white drop-shadow-sm' : 'text-gray-600'
                ]"
              ></i>
            </div>

            <Badge
              v-if="property.isTop3"
              :value="property.id.toString()"
              severity="contrast"
              class="absolute -top-1 -right-1 !bg-gray-900 !text-white !text-xs !w-6 !h-6 !flex !items-center !justify-center !rounded-full shadow-lg"
            />
          </div>

          <div>
            <div
              :class="[
                'font-semibold text-lg',
                property.isTop3 ? 'text-white drop-shadow-sm' : 'text-gray-900'
              ]"
            >
              {{ property.name }}
            </div>
            <div
              :class="[
                'text-sm font-medium',
                property.isTop3 ? 'text-white text-opacity-95 drop-shadow-sm' : 'text-gray-600'
              ]"
            >
              {{ property.amount }}
            </div>
          </div>
        </div>

        <div
          v-if="property.isTop3"
          class="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none"
        ></div>
        <div
          v-if="property.isTop3"
          class="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/5 pointer-events-none"
        ></div>

        <div
          v-if="!property.isTop3"
          class="text-2xl font-bold text-gray-400 relative z-10"
        >
          {{ property.id }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Badge from 'primevue/badge'
import { investorDashboardService } from '@/services/investorDashboardService'

const properties = ref([])

const top3Icons = [
  { icon: 'pi pi-trophy', bgColor: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600' },
  { icon: 'pi pi-chart-line', bgColor: 'bg-gradient-to-br from-red-500 via-red-600 to-rose-700' },
  { icon: 'pi pi-heart', bgColor: 'bg-gradient-to-br from-cyan-400 via-cyan-500 to-teal-600' }
]

const defaultIcon = 'pi pi-home'
const defaultBg = 'bg-gray-50'

onMounted(async () => {
  try {
    const response = await investorDashboardService.getInvestorRanking()

    properties.value = response.data.map((item, index) => {
      const amount = parseFloat(item.amount || 0)

      return {
        id: index + 1,
        name: item.property_name,
        amount: `S/ ${amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`,
        isTop3: index < 3,
        icon: index < 3 ? top3Icons[index].icon : defaultIcon,
        bgColor: index < 3 ? top3Icons[index].bgColor : defaultBg
      }
    })
  } catch (error) {
    console.error('Error al cargar el ranking de subastas:', error)
  }
})
</script>
