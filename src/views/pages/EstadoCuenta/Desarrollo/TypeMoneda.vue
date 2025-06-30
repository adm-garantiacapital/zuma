<template>
  <h5>Estados de cuenta</h5>
  <Tabs value="0">
    <div class="flex justify-between items-center">
      <TabList>
        <Tab value="0" as="div" class="flex items-center gap-2">
          <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle" />
          <span class="font-bold whitespace-nowrap">PEN</span>
        </Tab>
        <Tab value="1" as="div" class="flex items-center gap-2">
          <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/onyamalimba.png" shape="circle" />
          <span class="font-bold whitespace-nowrap">USD</span>
        </Tab>
      </TabList>
      <div class="flex gap-2">
        <!-- Botón para mostrar/ocultar montos -->
        <Button
          :icon="showAmounts ? 'pi pi-eye' : 'pi pi-eye-slash'"
          severity="secondary"
          variant="text"
          rounded
          @click="toggleAmounts"
          v-tooltip.top="showAmounts ? 'Ocultar montos' : 'Mostrar montos'"
        />
        <Button
          label="Depósito"
          icon="pi pi-plus"
          iconPos="left"
          severity="contrast"
          rounded
          @click="showDepositoDialog = true"
        />
        <Button
          label="Retiro"
          icon="pi pi-minus"
          iconPos="left"
          severity="contrast"
          variant="outlined"
          rounded
          @click="showRetiroDialog = true"
        />
      </div>
    </div>
    <TabPanels>
      <TabPanel value="0" as="div" class="m-0 mt-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="rounded-2xl shadow-md p-4 bg-white">
            <h6 class="text-gray-500">Saldo disponible</h6>
            <p class="text-xl font-bold text-green-600">
              {{ showAmounts ? 'S/ 12,000.00' : 'S/ ••••••' }}
            </p>
          </div>
          <div class="rounded-2xl shadow-md p-4 bg-white">
            <h6 class="text-gray-500">Total invertido</h6>
            <p class="text-xl font-bold text-blue-600">
              {{ showAmounts ? 'S/ 50,000.00' : 'S/ ••••••' }}
            </p>
          </div>
          <div class="rounded-2xl shadow-md p-4 bg-white">
            <h6 class="text-gray-500">Retorno esperado</h6>
            <p class="text-xl font-bold text-orange-500">
              {{ showAmounts ? 'S/ 5,500.00' : 'S/ ••••••' }}
            </p>
          </div>
        </div>
      </TabPanel>
      <TabPanel value="1" as="div" class="m-0 mt-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="rounded-2xl shadow-md p-4 bg-white">
            <h6 class="text-gray-500">Saldo disponible</h6>
            <p class="text-xl font-bold text-green-600">
              {{ showAmounts ? '$ 3,200.00' : '$ ••••••' }}
            </p>
          </div>
          <div class="rounded-2xl shadow-md p-4 bg-white">
            <h6 class="text-gray-500">Total invertido</h6>
            <p class="text-xl font-bold text-blue-600">
              {{ showAmounts ? '$ 15,000.00' : '$ ••••••' }}
            </p>
          </div>
          <div class="rounded-2xl shadow-md p-4 bg-white">
            <h6 class="text-gray-500">Retorno esperado</h6>
            <p class="text-xl font-bold text-orange-500">
              {{ showAmounts ? '$ 1,750.00' : '$ ••••••' }}
            </p>
          </div>
        </div>
      </TabPanel>
    </TabPanels>
  </Tabs>
  <!-- Diálogos -->
  <AddDeposito v-model:visible="showDepositoDialog" />
  <AddRetiro v-model:visible="showRetiroDialog" />
</template>

<script setup>
import { ref } from 'vue'
import AddDeposito from './AddDeposito.vue'
import AddRetiro from './AddRetiro.vue'

const showDepositoDialog = ref(false)
const showRetiroDialog = ref(false)
const showAmounts = ref(true) // Controla si se muestran los montos

// Función para alternar la visibilidad de los montos
const toggleAmounts = () => {
  showAmounts.value = !showAmounts.value
}
</script>