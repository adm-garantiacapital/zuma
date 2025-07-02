<template>
  <Dialog v-model:visible="visible" maximizable modal header="Simulador de Cronograma de Pagos"
    :style="{ width: '70rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">

    <!-- Mensaje de validación de balance - Diseño elegante -->
    <div v-if="validationMessage && !scheduleDataPreview.length" class="mb-6">
      <div class="relative overflow-hidden">
        <!-- Tarjeta principal con gradiente -->
        <div class="bg-gradient-to-br from-orange-50 to-red-50 border-l-4 border-orange-400 rounded-xl p-6 shadow-lg">
          <!-- Icono y título -->
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                <i class="pi pi-exclamation-triangle text-white text-xl"></i>
              </div>
            </div>
            
            <div class="flex-1">
              <!-- Título principal -->
              <h3 class="text-lg font-bold text-gray-800 mb-3">
                Validación de Balance
              </h3>
              
              <!-- Mensaje principal -->
              <div class="bg-white/70 backdrop-blur-sm rounded-lg p-4 mb-4 border border-orange-200">
                <div class="flex items-center gap-3">
                  <i class="pi pi-wallet text-orange-500 text-lg"></i>
                  <p class="text-gray-700 font-medium">{{ validationMessage.balance }}</p>
                </div>
              </div>
              
              <!-- Mensaje de conversión si existe -->
              <div v-if="validationMessage.conversion" class="space-y-4">
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                  <div class="flex items-start gap-3">
                    <i class="pi pi-info-circle text-blue-500 text-lg mt-0.5"></i>
                    <div>
                      <p class="text-blue-800 font-medium mb-3">{{ validationMessage.conversion }}</p>
                      
                      <!-- Botón de conversión elegante -->
                      <Button 
                        label="Convertir Moneda" 
                        icon="pi pi-refresh" 
                        class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 border-0 px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        @click="handleCurrencyConversion" 
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Mensaje de ayuda -->
              <div class="mt-4 flex items-center gap-2 text-sm text-gray-600">
                <i class="pi pi-lightbulb text-yellow-500"></i>
                <span>Puedes recargar tu billetera o convertir tus fondos disponibles</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Efecto decorativo -->
        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/20 to-red-200/20 rounded-full -translate-y-8 translate-x-8"></div>
        <div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-300/10 to-yellow-300/10 rounded-full translate-y-4 -translate-x-4"></div>
      </div>
      
      <!-- Estadísticas adicionales si están disponibles -->
      <div v-if="validationMessage.additionalInfo" class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-lg p-4 shadow-md border border-gray-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <i class="pi pi-dollar text-green-600"></i>
            </div>
            <div>
              <p class="text-sm text-gray-600">Balance Disponible</p>
              <p class="font-bold text-gray-800">{{ validationMessage.additionalInfo.balance || 'N/A' }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg p-4 shadow-md border border-gray-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <i class="pi pi-credit-card text-blue-600"></i>
            </div>
            <div>
              <p class="text-sm text-gray-600">Cuota Requerida</p>
              <p class="font-bold text-gray-800">{{ validationMessage.additionalInfo.requiredAmount || 'N/A' }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg p-4 shadow-md border border-gray-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <i class="pi pi-globe text-purple-600"></i>
            </div>
            <div>
              <p class="text-sm text-gray-600">Moneda</p>
              <p class="font-bold text-gray-800">{{ validationMessage.additionalInfo.currency || 'N/A' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla de selección de plazos -->
    <div v-if="!scheduleData && scheduleDataPreview.length > 0" class="mb-5">
      <DataTable v-model:selection="selectedPlazo" :value="scheduleDataPreview" responsiveLayout="scroll"
        class="p-datatable-sm" dataKey="deadline_id" selectionMode="single">
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <div class="flex items-center gap-2">
              <h3 class="text-lg font-semibold mb-3">Selecciona un plazo de financiamiento</h3>
            </div>
          </div>
        </template>
        <Column selectionMode="single" style="width: 3rem" :exportable="false"></Column>
        <Column field="plazo_meses" header="Plazo (meses)" sortable style="min-width: 12rem" />
        <Column field="cuota_mensual" header="Cuota mensual (S/)" sortable style="min-width: 12rem" />
        <Column field="total_pagado" header="Total a pagar (S/)" sortable style="min-width: 12rem" />
        <Column header="">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button label="Ver cronograma" icon="pi pi-eye" size="small"
                :severity="form.plazo_id === slotProps.data.deadline_id ? 'primary' : 'secondary'"
                @click="selectPlazo(slotProps.data.deadline_id)" />

              <Button label="Exportar" icon="pi pi-file-excel" size="small" severity="success"
                :disabled="selectedPlazo?.deadline_id !== slotProps.data.deadline_id"
                @click="exportPreviewToExcel(slotProps.data)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Tabla de cuotas del cronograma -->
    <div v-else-if="scheduleData">
        <DataTable v-model:selection="selectedCuotas" :value="scheduleData.cronograma_final.pagos" dataKey="cuota"
        :paginator="true" :rows="rows" :totalRecords="totalRecords" :lazy="true" :first="(currentPage - 1) * rows"
        @page="onPage" :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReportTemplate RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} cuotas" responsiveLayout="scroll"
        class="p-datatable-sm" :loading="loading" selectionMode="multiple">
        <template #header>
          <div class="flex justify-between items-center mb-3">
        <span class="text-lg font-semibold">Cronograma detallado de pagos</span>
        <div class="flex gap-2">
          <Button label="Exportar a Excel" icon="pi pi-file-excel" severity="success" size="small"
            @click="handleExportToExcel" :loading="exportLoading" />
          <Button label="Cambiar plazo" icon="pi pi-arrow-left" severity="secondary" size="small"
            @click="volverASeleccion" />
        </div>
      </div>
        </template>
        <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
        <Column field="cuota" header="Cuota" sortable />
        <Column field="vcmto" header="Vencimiento" sortable />
        <Column field="saldo_inicial" header="Saldo Inicial" sortable />
        <Column field="capital" header="Capital" sortable />
        <Column field="interes" header="Interés" sortable />
        <Column field="cuota_neta" header="Cuota Neta" sortable />
        <Column field="igv" header="IGV" sortable />
        <Column field="total_cuota" header="Total Cuota" sortable />
        <Column field="saldo_final" header="Saldo Final" sortable />
      </DataTable>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, watch, defineExpose } from 'vue'
import { simulationService } from '@/services/simulationService.js'
import { useExport } from '@/composables/useExport.js'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const visible = ref(false)
const propertyId = ref(null)

const form = ref({ plazo_id: null })
const scheduleDataPreview = ref([]) // Opciones de plazo
const scheduleData = ref(null) // Cronograma final con pagos
const selectedCuotas = ref([])
const selectedPlazo = ref(null) // Para la selección single de plazo
const rows = ref(10)
const currentPage = ref(1)
const totalRecords = ref(0)
const loading = ref(false)
const filters = ref({})

// Nueva variable para manejar mensajes de validación
const validationMessage = ref(null)

// Composable para exportaciones
const { exportLoading, exportCronogramaToExcel } = useExport()

// Watcher para sincronizar la selección de plazo
watch(selectedPlazo, (newVal) => {
  if (newVal && newVal.deadline_id) {
    form.value.plazo_id = newVal.deadline_id
  }
})

// Abrir el modal y cargar plazos
const open = async (id) => {
  propertyId.value = id
  visible.value = true
  scheduleData.value = null
  form.value.plazo_id = null
  selectedPlazo.value = null
  currentPage.value = 1
  validationMessage.value = null
  scheduleDataPreview.value = []

  try {
    const response = await simulationService.getAvailableTerms(id)
    const responseData = response.data.data
    
    // Verificar si hay cuadro de amortización o solo mensajes de validación
    if (responseData.cuadro_amortizacion && responseData.cuadro_amortizacion.length > 0) {
      scheduleDataPreview.value = responseData.cuadro_amortizacion
      validationMessage.value = null
    } else {
      // No hay cuadro de amortización, mostrar mensajes de validación
      scheduleDataPreview.value = []
      validationMessage.value = {
        balance: responseData.mensaje_validacion_balance,
        conversion: responseData.mensaje_conversion_sugerida,
        type: responseData.mensaje_conversion_sugerida ? 'info' : 'warn'
      }
    }
    
  } catch (e) {
    console.error("Error obteniendo cuadro de amortización:", e)
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'No se pudo cargar la información de la propiedad', 
      life: 3000 
    })
  }
}

// Manejar conversión de moneda (placeholder para tu lógica)
const handleCurrencyConversion = () => {
  toast.add({ 
    severity: 'info', 
    summary: 'Conversión de moneda', 
    detail: 'Función de conversión de moneda pendiente de implementar', 
    life: 3000 
  })
  // Aquí puedes implementar la lógica para convertir la moneda
  // Por ejemplo, abrir otro modal o redirigir a una página de conversión
}

// Selección de plazo y generación de cronograma
const selectPlazo = (id) => {
  form.value.plazo_id = id
  // Actualizar la selección en la tabla
  selectedPlazo.value = scheduleDataPreview.value.find(item => item.deadline_id === id)
  currentPage.value = 1
  generateSchedule()
}

const generateSchedule = async () => {
  if (!form.value.plazo_id || !propertyId.value) return

  try {
    loading.value = true

    const payload = {
      property_id: propertyId.value,
      deadline_id: form.value.plazo_id
    }

    const response = await simulationService.generate(payload, {
      page: currentPage.value,
      per_page: rows.value
    })

    scheduleData.value = response.data.data
    totalRecords.value = response.data.data.cronograma_final.pagination.total
  } catch (e) {
    console.error("Error generando cronograma:", e)
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'No se pudo generar el cronograma', 
      life: 3000 
    })
  } finally {
    loading.value = false
  }
}

// Volver a vista de selección de plazo
const volverASeleccion = () => {
  scheduleData.value = null
  form.value.plazo_id = null
  selectedPlazo.value = null
  selectedCuotas.value = []
}

// Paginación
const onPage = (event) => {
  currentPage.value = (event.page ?? 0) + 1
  rows.value = event.rows
  generateSchedule()
}

// Función para manejar la exportación
const handleExportToExcel = async () => {
  if (!scheduleData.value) return

  try {
    // Obtener todos los datos del cronograma para la exportación
    const payload = {
      property_id: propertyId.value,
      deadline_id: form.value.plazo_id
    }

    // Solicitar todos los datos sin paginación para la exportación
    const response = await simulationService.generate(payload, {
      page: 1,
      per_page: totalRecords.value // Obtener todos los registros
    })

    const allData = response.data.data.cronograma_final.pagos
    const plazoInfo = scheduleDataPreview.value.find(p => p.deadline_id === form.value.plazo_id)

    // Usar el composable para exportar
    const result = await exportCronogramaToExcel(allData, plazoInfo?.plazo_meses)

    if (result.success) {
      console.log(`Archivo exportado: ${result.fileName}`)
      toast.add({ 
        severity: 'success', 
        summary: 'Éxito', 
        detail: 'Cronograma exportado correctamente', 
        life: 3000 
      })
    } else {
      console.error('Error en la exportación:', result.error)
      toast.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'No se pudo exportar el cronograma', 
        life: 3000 
      })
    }

  } catch (e) {
    console.error("Error obteniendo datos para exportar:", e)
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'Error al obtener los datos para exportar', 
      life: 3000 
    })
  }
}

const exportPreviewToExcel = async (plazoData) => {
  try {
    exportLoading.value = true

    const payload = {
      property_id: propertyId.value,
      deadline_id: plazoData.deadline_id
    }

    const response = await simulationService.generate(payload, {
      page: 1,
      per_page: 9999 // puedes ajustar si sabes el total exacto
    })

    const allData = response.data.data.cronograma_final.pagos
    const result = await exportCronogramaToExcel(allData, plazoData.plazo_meses)

    if (result.success) {
      console.log(`Archivo exportado: ${result.fileName}`)
      toast.add({ 
        severity: 'success', 
        summary: 'Éxito', 
        detail: 'Cronograma exportado correctamente', 
        life: 3000 
      })
    } else {
      console.error('Error en la exportación:', result.error)
      toast.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'No se pudo exportar el cronograma', 
        life: 3000 
      })
    }

  } catch (e) {
    console.error('Error exportando cronograma desde vista previa:', e)
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'Error al exportar el cronograma', 
      life: 3000 
    })
  } finally {
    exportLoading.value = false
  }
}

defineExpose({ open })
</script>