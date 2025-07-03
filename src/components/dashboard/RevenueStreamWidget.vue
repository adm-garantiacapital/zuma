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

<template>
  <div class="card">
    <div class="flex items-center justify-between mb-6">
      <div class="font-semibold text-xl mb-4 text-[#171717]">Ranking top 6 de subastas más altas</div>
    </div>

    <div class="space-y-3">
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
            style="mask-image: radial-gradient(ellipse at center, white 40%, transparent 70%); -webkit-mask-image: radial-gradient(ellipse at center, white 40%, transparent 70%);"
          >
            {{ property.id }}
          </div>

          <div
            class="absolute right-0 top-1/2 -translate-y-1/2 w-24 text-center text-6xl font-extrabold text-white opacity-40 pointer-events-none select-none"
            style="mask-image: radial-gradient(ellipse at center, white 40%, transparent 70%); -webkit-mask-image: radial-gradient(ellipse at center, white 40%, transparent 70%);"
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
