<template>
  <div class="bg-[#f3f4fc] rounded-2xl p-6">
    <h1 class="text-2xl font-bold text-black mb-2">Mi billetera</h1>

    <div class="flex flex-wrap justify-between items-center gap-4">
      <!-- Texto -->
      <h6>
        Puedes utilizar ambas monedas al momento de hacer la inversión
      </h6>

      <!-- Saldos disponibles -->
      <div class="flex gap-4">
        <!-- Saldo PEN -->
        <div class="flex flex-col items-center">
          <div class="flex items-center gap-1 mb-2">
            <img src="https://flagcdn.com/w40/pe.png" alt="PEN" class="w-5 h-5 rounded-full" />
            <span class="text-sm font-semibold text-black">PEN</span>
          </div>

          <div class="bg-white px-6 py-4 rounded-2xl shadow-sm w-56 text-center space-y-1">
            <i class="pi pi-wallet text-3xl text-black"></i>
            <p class="text-sm text-gray-700">Saldo disponible</p>
            <p class="text-xl font-bold text-black">S/ {{ saldoPEN }}</p>
          </div>
        </div>

        <!-- Saldo USD -->
        <div class="flex flex-col items-center">
          <div class="flex items-center gap-1 mb-2">
            <img src="https://flagcdn.com/w40/us.png" alt="USD" class="w-5 h-5 rounded-full" />
            <span class="text-sm font-semibold text-black">USD</span>
          </div>

          <div class="bg-white px-6 py-4 rounded-2xl shadow-sm w-56 text-center space-y-1">
            <i class="pi pi-wallet text-3xl text-black"></i>
            <p class="text-sm text-gray-700">Saldo disponible</p>
            <p class="text-xl font-bold text-black">$ {{ saldoUSD }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import reportsService from '@/services/reportsService';

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
