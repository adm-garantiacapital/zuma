<template>
  <div class="bg-[#f3f4fc] rounded-2xl p-4 md:p-6">
    <h1 class="text-xl md:text-2xl font-bold text-black mb-2">Mi billetera</h1>

    <div class="flex flex-col md:flex-row md:flex-wrap justify-between items-start md:items-center gap-4">
      <!-- Texto -->
      <h6 class="text-sm md:text-base md:max-w-md">
        Puedes utilizar ambas monedas al momento de hacer la inversión
      </h6>

      <!-- Saldos disponibles -->
      <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <!-- Saldo PEN -->
        <div class="w-full sm:w-auto">
          <div class="bg-white px-4 py-3 md:px-6 md:py-4 rounded-2xl shadow-sm w-full sm:w-56 space-y-1">
            <div class="flex gap-1 mb-2">
              <img src="https://flagcdn.com/w40/pe.png" alt="PEN" class="w-5 h-5 rounded-full" />
              <span class="text-sm font-semibold text-[#171717]">PEN</span>
            </div>
            <i class="pi pi-wallet text-2xl md:text-3xl text-[#171717] inline-block me-2"></i>
            <p class="text-xs md:text-sm text-gray-700 inline-block">Saldo disponible</p>
            <p class="text-lg md:text-xl font-bold text-[#171717]">S/ {{ saldoPEN }}</p>
          </div>
        </div>

        <!-- Saldo USD -->
        <div class="w-full sm:w-auto">
          <div class="bg-white px-4 py-3 md:px-6 md:py-4 rounded-2xl shadow-sm w-full sm:w-56 space-y-1">
            <div class="flex gap-1 mb-2">
              <img src="https://flagcdn.com/w40/us.png" alt="USD" class="w-5 h-5 rounded-full" />
              <span class="text-sm font-semibold text-[#171717]">USD</span>
            </div>
            <i class="pi pi-wallet text-2xl md:text-3xl text-[#171717] inline-block me-2"></i>
            <p class="text-xs md:text-sm text-gray-700 inline-block">Saldo disponible</p>
            <p class="text-lg md:text-xl font-bold text-[#171717]">$ {{ saldoUSD }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import reportsService from '@/services/reportsService';
import { onMounted, ref } from 'vue';

const saldoPEN = ref('0.00');
const saldoUSD = ref('0.00');

onMounted(async () => {
  try {
    const { data } = await reportsService.getBalances();
    if (data.success && Array.isArray(data.data)) {
      for (const balance of data.data) {
        if (balance.currency === 'PEN') {
          saldoPEN.value = Number(balance.amount).toLocaleString('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
        } else if (balance.currency === 'USD') {
          saldoUSD.value = Number(balance.amount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
        }
      }
    }
  } catch (error) {
    console.error('Error al obtener saldos:', error);
  }
});
</script>

<style scoped>
.pi-wallet {
  color: #111827;
}
</style>