<template>
  <div class="">
    <div class="">
      <!-- Breadcrumb -->
      <Breadcrumb :home="home" :model="breadcrumbItems" class="mb-6" />

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-96">
        <ProgressSpinner />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <i class="pi pi-exclamation-triangle text-red-500 text-6xl mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">Error al cargar los datos</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <Button label="Volver" icon="pi pi-arrow-left" @click="router.push({ name: 'buscar-hipotecas' })" />
      </div>

      <!-- Content -->
      <div v-else-if="solicitud">
        <!-- Header Section -->
        <div class="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">{{ solicitud.codigo }}</h1>
              <p class="text-gray-600 mt-1">Detalles de la hipoteca</p>
            </div>
            <Tag :value="solicitud.estado" :severity="getEstadoSeverity(solicitud.estado)" class="text-lg px-4 py-2" />
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div class="bg-blue-50 rounded-xl p-4">
              <div class="text-sm text-blue-600 font-medium mb-1">VALOR GENERAL</div> 
              <div class="text-2xl font-bold text-blue-900">
                {{ formatCurrency(solicitud.valor_general?.amount, solicitud.valor_general?.currency) }}
              </div>
            </div>
            
            <div class="bg-green-50 rounded-xl p-4">
              <div class="text-sm text-green-600 font-medium mb-1">VALOR REQUERIDO</div>
              <div class="text-2xl font-bold text-green-900">
                {{ formatCurrency(solicitud.valor_requerido?.amount, solicitud.valor_requerido?.currency) }}
              </div>
            </div>
            
            <div class="bg-purple-50 rounded-xl p-4">
              <div class="text-sm text-purple-600 font-medium mb-1">INVERSORES</div>
              <div class="text-2xl font-bold text-purple-900">
                {{ solicitud.property_investors?.length || 0 }}
              </div>
            </div>
          </div>
        </div>

        <!-- Investor Information -->
        <div class="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="pi pi-user"></i>
            Información del Solicitante
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div class="text-sm text-gray-600 mb-1">Nombre</div>
              <div class="font-semibold text-gray-900">{{ solicitud.investor?.nombre || '-' }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-600 mb-1">Profesión</div>
              <div class="font-semibold text-gray-900">{{ solicitud.profesion_ocupacion || '-' }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-600 mb-1">Fuente de Ingreso</div>
              <div class="font-semibold text-gray-900">{{ solicitud.fuente_ingreso || '-' }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-600 mb-1">Ingreso Promedio</div>
              <div class="font-semibold text-gray-900">
                {{ formatCurrency(solicitud.ingreso_promedio, solicitud.currency?.codigo) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Configuración de Subasta -->
        <div class="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <i class="pi pi-cog"></i>
              Configuración de Subasta
            </h2>
            <div class="flex gap-2">
              <Button 
                label="Ver Cronograma" 
                icon="pi pi-calendar" 
                outlined 
                severity="info"
                @click="showCronogramaDialog = true" 
              />
              <Button 
                label="Ver Detalles" 
                icon="pi pi-info-circle" 
                outlined
                @click="showDetallesDialog = true" 
              />
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-purple-50 rounded-lg p-4">
              <div class="text-sm text-purple-600 font-medium mb-1">TEA</div>
              <div class="text-xl font-bold text-purple-900">{{ formatPercentage(solicitud.configuracion_subasta?.tea) }}</div>
              <div class="text-xs text-purple-600 mt-1">Anual</div>
            </div>
            
            <div class="bg-orange-50 rounded-lg p-4">
              <div class="text-sm text-orange-600 font-medium mb-1">TEM</div>
              <div class="text-xl font-bold text-orange-900">{{ formatPercentage(solicitud.configuracion_subasta?.tem) }}</div>
              <div class="text-xs text-orange-600 mt-1">Mensual</div>
            </div>
            
            <div class="bg-green-50 rounded-lg p-4">
              <div class="text-sm text-green-600 font-medium mb-1">Riesgo</div>
              <div class="text-xl font-bold text-green-900">{{ solicitud.configuracion_subasta?.riesgo || '-' }}</div>
            </div>
            
            <div class="bg-blue-50 rounded-lg p-4">
              <div class="text-sm text-blue-600 font-medium mb-1">Plazo</div>
              <div class="text-xl font-bold text-blue-900">{{ solicitud.configuracion_subasta?.plazo?.nombre || '-' }}</div>
            </div>
          </div>
          
          <div class="mt-4">
            <Tag :value="solicitud.configuracion_subasta?.tipo_cronograma" severity="info" class="text-base px-3 py-1" />
          </div>
        </div>

        <!-- Properties -->
        <div class="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="pi pi-home"></i>
            Propiedades ({{ solicitud.properties?.length || 0 }})
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="property in solicitud.properties" :key="property.id" class="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              <!-- Image Gallery -->
              <div class="relative h-48 bg-gray-200">
                <Galleria v-if="property.imagenes && property.imagenes.length > 0" 
                  :value="property.imagenes" 
                  :numVisible="5" 
                  containerStyle="max-width: 100%; height: 100%"
                  :showThumbnails="false"
                  :showIndicators="true"
                  :circular="true">
                  <template #item="slotProps">
                    <img :src="slotProps.item.url" :alt="slotProps.item.descripcion" class="w-full h-48 object-cover" />
                  </template>
                </Galleria>
                <div v-else class="flex items-center justify-center h-full">
                  <i class="pi pi-image text-gray-400 text-4xl"></i>
                </div>
                <Tag :value="property.estado" :severity="getEstadoSeverity(property.estado)" class="absolute top-2 right-2" />
              </div>
              
              <!-- Property Info -->
              <div class="p-4">
                <h3 class="font-bold text-lg text-gray-900 mb-2">{{ property.nombre }}</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex items-start gap-2">
                    <i class="pi pi-map-marker text-gray-500 mt-0.5"></i>
                    <span class="text-gray-700">
                      {{ property.direccion }}<br>
                      {{ property.distrito }}, {{ property.provincia }}<br>
                      {{ property.departamento }}
                    </span>
                  </div>
                  
                  <div class="flex items-center gap-2">
                    <i class="pi pi-building text-gray-500"></i>
                    <span class="text-gray-700">Tipo: {{ property.tipo_inmueble?.nombre || 'N/A' }}</span>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-2 mt-3 pt-3 border-t">
                    <div>
                      <div class="text-xs text-gray-600">Valor Estimado</div>
                      <div class="font-semibold text-gray-900">
                        {{ formatCurrency(property.valor_estimado?.amount, property.valor_estimado?.currency) }}
                      </div>
                    </div>
                    <div>
                      <div class="text-xs text-gray-600">Valor Subasta</div>
                      <div class="font-semibold text-green-600">
                        {{ formatCurrency(property.valor_subasta?.amount, property.valor_subasta?.currency) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-6 flex gap-3 justify-between">
          <Button label="Volver" icon="pi pi-arrow-left" outlined @click="router.push({ name: 'buscar-hipotecas' })" />
          <Button 
            label="Ofertar" 
            icon="pi pi-dollar" 
            severity="success" 
            size="large"
            @click="showOfertarDialog = true"
          />
        </div>
      </div>
    </div>

    <!-- Dialog Ver Cronograma -->
    <Dialog 
      v-model:visible="showCronogramaDialog" 
      modal 
      :style="{ width: '90vw', maxWidth: '1200px' }"
      :draggable="false"
      :dismissableMask="true">
      <template #header>
        <div class="flex items-center gap-2">
          <i class="pi pi-calendar text-2xl text-blue-600"></i>
          <span class="font-bold text-xl">Cronogramas de Pago</span>
        </div>
      </template>

      <TabView v-if="solicitud?.property_investors && solicitud.property_investors.length > 0">
        <TabPanel v-for="(investor, index) in solicitud.property_investors" :key="investor.id" 
          :header="`Inversor ${index + 1}`">
          
          <!-- Investor Config Info -->
          <div class="bg-gray-50 rounded-lg p-4 mb-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div class="text-sm text-gray-600 mb-1">TEA</div>
                <div class="text-lg font-bold text-purple-600">
                  {{ formatPercentage(investor.configuracion?.tea) }}
                </div>
              </div>
              <div>
                <div class="text-sm text-gray-600 mb-1">TEM</div>
                <div class="text-lg font-bold text-orange-600">
                  {{ formatPercentage(investor.configuracion?.tem) }}
                </div>
              </div>
              <div>
                <div class="text-sm text-gray-600 mb-1">Estado</div>
                <Tag :value="getEstadoConfigLabel(investor.configuracion?.estado)" 
                  :severity="investor.configuracion?.estado === 2 ? 'success' : 'warning'" />
              </div>
            </div>
          </div>
          
          <!-- Payment Schedule Table -->
          <DataTable :value="investor.payment_schedules" 
            responsiveLayout="scroll" 
            :paginator="true" 
            :rows="10"
            class="p-datatable-sm">
            
            <Column field="cuota" header="Cuota" sortable style="min-width: 5rem">
              <template #body="slotProps">
                <span class="font-semibold">#{{ slotProps.data.cuota }}</span>
              </template>
            </Column>
            
            <Column field="vencimiento" header="Vencimiento" sortable style="min-width: 10rem">
              <template #body="slotProps">
                <div class="flex items-center gap-2">
                  <i class="pi pi-calendar text-gray-500 text-sm"></i>
                  {{ formatDate(slotProps.data.vencimiento) }}
                </div>
              </template>
            </Column>
            
            <Column field="capital" header="Capital" sortable style="min-width: 10rem">
              <template #body="slotProps">
                <span class="font-semibold">
                  {{ formatCurrency(slotProps.data.capital, solicitud.currency?.codigo) }}
                </span>
              </template>
            </Column>
            
            <Column field="intereses" header="Intereses" sortable style="min-width: 10rem">
              <template #body="slotProps">
                <span class="text-purple-600 font-semibold">
                  {{ formatCurrency(slotProps.data.intereses, solicitud.currency?.codigo) }}
                </span>
              </template>
            </Column>
            
            <Column field="total_cuota" header="Total Cuota" sortable style="min-width: 10rem">
              <template #body="slotProps">
                <span class="font-bold text-green-600">
                  {{ formatCurrency(slotProps.data.total_cuota, solicitud.currency?.codigo) }}
                </span>
              </template>
            </Column>
            
            <Column field="estado" header="Estado" style="min-width: 8rem">
              <template #body="slotProps">
                <Tag :value="slotProps.data.estado" :severity="getEstadoPagoSeverity(slotProps.data.estado)" />
              </template>
            </Column>
          </DataTable>
          
          <!-- Summary -->
          <div class="mt-4 bg-blue-50 rounded-lg p-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div class="text-sm text-blue-600 mb-1">Total Capital</div>
                <div class="text-xl font-bold text-blue-900">
                  {{ formatCurrency(calculateTotal(investor.payment_schedules, 'capital'), solicitud.currency?.codigo) }}
                </div>
              </div>
              <div>
                <div class="text-sm text-purple-600 mb-1">Total Intereses</div>
                <div class="text-xl font-bold text-purple-900">
                  {{ formatCurrency(calculateTotal(investor.payment_schedules, 'intereses'), solicitud.currency?.codigo) }}
                </div>
              </div>
              <div>
                <div class="text-sm text-green-600 mb-1">Total a Pagar</div>
                <div class="text-xl font-bold text-green-900">
                  {{ formatCurrency(calculateTotal(investor.payment_schedules, 'total_cuota'), solicitud.currency?.codigo) }}
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
      </TabView>
      
      <div v-else class="text-center py-8 text-gray-500">
        <i class="pi pi-info-circle text-4xl mb-2"></i>
        <p>No hay cronogramas de pago disponibles</p>
      </div>

      <template #footer>
        <Button label="Cerrar" icon="pi pi-times" outlined @click="showCronogramaDialog = false" />
        <Button label="Exportar PDF" icon="pi pi-file-pdf" severity="danger" />
      </template>
    </Dialog>

    <!-- Dialog Ver Detalles -->
    <Dialog 
      v-model:visible="showDetallesDialog" 
      modal 
      :style="{ width: '50vw', maxWidth: '800px' }"
      :draggable="false"
      :dismissableMask="true">
      <template #header>
        <div class="flex items-center gap-2">
          <i class="pi pi-info-circle text-2xl text-blue-600"></i>
          <span class="font-bold text-xl">Detalles Completos</span>
        </div>
      </template>

      <div v-if="solicitud" class="space-y-6">
        <!-- Información General -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <i class="pi pi-file"></i>
            Información General
          </h3>
          <div class="grid grid-cols-2 gap-3 bg-gray-50 rounded-lg p-4">
            <div>
              <div class="text-sm text-gray-600">Código</div>
              <div class="font-semibold">{{ solicitud.codigo }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-600">Estado</div>
              <Tag :value="solicitud.estado" :severity="getEstadoSeverity(solicitud.estado)" />
            </div>
            <div>
              <div class="text-sm text-gray-600">Moneda</div>
              <div class="font-semibold">{{ solicitud.currency?.nombre }} ({{ solicitud.currency?.codigo }})</div>
            </div>
            <div>
              <div class="text-sm text-gray-600">Configuraciones</div>
              <div class="font-semibold">{{ solicitud.config_total }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-600">Fecha Creación</div>
              <div class="font-semibold">{{ formatDate(solicitud.created_at) }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-600">Última Actualización</div>
              <div class="font-semibold">{{ formatDate(solicitud.updated_at) }}</div>
            </div>
          </div>
        </div>

        <!-- Valores -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <i class="pi pi-money-bill"></i>
            Valores
          </h3>
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-blue-50 rounded-lg p-4">
              <div class="text-sm text-blue-600 mb-1">Valor General</div>
              <div class="text-2xl font-bold text-blue-900">
                {{ formatCurrency(solicitud.valor_general?.amount, solicitud.valor_general?.currency) }}
              </div>
            </div>
            <div class="bg-green-50 rounded-lg p-4">
              <div class="text-sm text-green-600 mb-1">Valor Requerido</div>
              <div class="text-2xl font-bold text-green-900">
                {{ formatCurrency(solicitud.valor_requerido?.amount, solicitud.valor_requerido?.currency) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Configuración de Subasta -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <i class="pi pi-cog"></i>
            Configuración de Subasta
          </h3>
          <div class="grid grid-cols-2 gap-3 bg-gray-50 rounded-lg p-4">
            <div>
              <div class="text-sm text-gray-600">TEA</div>
              <div class="font-bold text-purple-600">{{ formatPercentage(solicitud.configuracion_subasta?.tea) }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-600">TEM</div>
              <div class="font-bold text-orange-600">{{ formatPercentage(solicitud.configuracion_subasta?.tem) }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-600">Tipo Cronograma</div>
              <Tag :value="solicitud.configuracion_subasta?.tipo_cronograma" severity="info" />
            </div>
            <div>
              <div class="text-sm text-gray-600">Riesgo</div>
              <Tag :value="solicitud.configuracion_subasta?.riesgo || '-'" severity="warning" />
            </div>
            <div>
              <div class="text-sm text-gray-600">Plazo</div>
              <div class="font-semibold">{{ solicitud.configuracion_subasta?.plazo?.nombre || '-' }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-600">Estado Config</div>
              <Tag :value="getEstadoConfigLabel(solicitud.configuracion_subasta?.estado)" 
                :severity="solicitud.configuracion_subasta?.estado === 2 ? 'success' : 'warning'" />
            </div>
          </div>
        </div>

        <!-- Resumen de Inversores -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <i class="pi pi-users"></i>
            Inversores
          </h3>
          <div class="space-y-2">
            <div v-for="(investor, index) in solicitud.property_investors" :key="investor.id"
              class="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
              <div>
                <div class="font-semibold">Inversor {{ index + 1 }}</div>
                <div class="text-sm text-gray-600">
                  TEA: {{ formatPercentage(investor.configuracion?.tea) }} | 
                  TEM: {{ formatPercentage(investor.configuracion?.tem) }}
                </div>
              </div>
              <Tag :value="getEstadoConfigLabel(investor.configuracion?.estado)" 
                :severity="investor.configuracion?.estado === 2 ? 'success' : 'warning'" />
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="Cerrar" icon="pi pi-times" outlined @click="showDetallesDialog = false" />
      </template>
    </Dialog>

    <!-- Dialog Ofertar -->
    <Dialog 
      v-model:visible="showOfertarDialog" 
      modal 
      :style="{ width: '40vw', maxWidth: '600px' }"
      :draggable="false"
      :dismissableMask="true">
      <template #header>
        <div class="flex items-center gap-2">
          <i class="pi pi-dollar text-2xl text-green-600"></i>
          <span class="font-bold text-xl">Realizar Oferta</span>
        </div>
      </template>

      <div class="space-y-4">
        <!-- Información de la hipoteca -->
        <div class="bg-blue-50 rounded-lg p-4">
          <div class="text-sm text-blue-600 mb-2">Hipoteca</div>
          <div class="font-bold text-lg text-blue-900">{{ solicitud?.codigo }}</div>
          <div class="text-sm text-gray-600 mt-1">
            Valor requerido: {{ formatCurrency(solicitud?.valor_requerido?.amount, solicitud?.valor_requerido?.currency) }}
          </div>
        </div>

        <!-- Formulario de oferta -->
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Monto de la Oferta</label>
            <InputNumber 
              v-model="ofertaForm.monto" 
              mode="currency" 
              :currency="solicitud?.currency?.codigo || 'PEN'"
              locale="es-PE"
              class="w-full"
              :min="0"
              :max="solicitud?.valor_requerido?.amount"
              placeholder="Ingrese el monto"
            />
            <small class="text-gray-500">
              Máximo: {{ formatCurrency(solicitud?.valor_requerido?.amount, solicitud?.valor_requerido?.currency) }}
            </small>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">TEA Propuesta (%)</label>
            <InputNumber 
              v-model="ofertaForm.tea" 
              :minFractionDigits="2"
              :maxFractionDigits="2"
              class="w-full"
              :min="0"
              :max="100"
              suffix="%"
              placeholder="Ingrese la tasa anual"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Comentarios (Opcional)</label>
            <Textarea 
              v-model="ofertaForm.comentarios" 
              rows="3" 
              class="w-full"
              placeholder="Agregue comentarios adicionales sobre su oferta"
            />
          </div>
        </div>

        <!-- Resumen de la oferta -->
        <div class="bg-green-50 rounded-lg p-4">
          <div class="text-sm text-green-600 mb-2">Resumen de tu Oferta</div>
          <div class="space-y-1">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Monto:</span>
              <span class="font-semibold">{{ formatCurrency(ofertaForm.monto || 0, solicitud?.currency?.codigo) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">TEA:</span>
              <span class="font-semibold">{{ ofertaForm.tea || 0 }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">TEM (Estimado):</span>
              <span class="font-semibold">{{ calculateTEM(ofertaForm.tea) }}%</span>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" outlined @click="showOfertarDialog = false" />
        <Button 
          label="Confirmar Oferta" 
          icon="pi pi-check" 
          severity="success" 
          @click="submitOferta"
          :disabled="!ofertaForm.monto || !ofertaForm.tea"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { solicitudService } from '@/services/solicitud.js';
import Breadcrumb from 'primevue/breadcrumb';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Galleria from 'primevue/galleria';
import ProgressSpinner from 'primevue/progressspinner';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const solicitud = ref(null);
const loading = ref(true);
const error = ref(null);

// Dialog states
const showCronogramaDialog = ref(false);
const showDetallesDialog = ref(false);
const showOfertarDialog = ref(false);

// Oferta form
const ofertaForm = ref({
  monto: null,
  tea: null,
  comentarios: ''
});

const home = ref({ icon: 'pi pi-home', to: '/' });
const breadcrumbItems = computed(() => [
  { label: 'Subastas de hipotecas', to: { name: 'buscar-hipotecas' } },
  { label: 'Detalles de hipoteca' },
  { label: solicitud.value?.codigo || 'Cargando...' }
]);

const formatCurrency = (value, currency = 'PEN') => {
  if (value === null || value === undefined || isNaN(value)) return '-';
  
  const currencySymbols = {
    'USD': '$',
    'PEN': 'S/',
    'EUR': '€',
    'SOL': 'S/',
    'SOLES': 'S/'
  };
  const symbol = currencySymbols[currency?.toUpperCase()] || 'S/';
  return `${symbol}${new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}`;
};

const formatPercentage = (value) => {
  if (!value && value !== 0) return '0%';
  const numValue = parseFloat(value);
  return `${numValue.toFixed(2)}%`;
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-PE', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }).format(date);
};

const getEstadoSeverity = (estado) => {
  const severities = {
    'activa': 'success',
    'pendiente': 'warning',
    'inactiva': 'danger',
    'completada': 'info'
  };
  return severities[estado?.toLowerCase()] || 'secondary';
};

const getEstadoPagoSeverity = (estado) => {
  const severities = {
    'pagado': 'success',
    'pendiente': 'warning',
    'vencido': 'danger'
  };
  return severities[estado?.toLowerCase()] || 'secondary';
};

const getEstadoConfigLabel = (estado) => {
  const labels = {
    1: 'Pendiente',
    2: 'Activo',
    3: 'Inactivo'
  };
  return labels[estado] || 'Desconocido';
};

const calculateTotal = (schedules, field) => {
  if (!schedules || !Array.isArray(schedules)) return 0;
  return schedules.reduce((sum, schedule) => sum + (parseFloat(schedule[field]) || 0), 0);
};

const calculateTEM = (tea) => {
  if (!tea) return '0.00';
  // TEM = ((1 + TEA/100)^(1/12) - 1) * 100
  const temValue = (Math.pow(1 + tea / 100, 1 / 12) - 1) * 100;
  return temValue.toFixed(2);
};

const submitOferta = () => {
  if (!ofertaForm.value.monto || !ofertaForm.value.tea) {
    toast.add({ 
      severity: 'warn', 
      summary: 'Advertencia', 
      detail: 'Por favor complete todos los campos requeridos', 
      life: 3000 
    });
    return;
  }

  if (ofertaForm.value.monto > solicitud.value?.valor_requerido?.amount) {
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'El monto no puede exceder el valor requerido', 
      life: 3000 
    });
    return;
  }

  // Aquí iría la llamada al servicio para enviar la oferta
  console.log('Enviando oferta:', {
    solicitud_id: solicitud.value.id,
    monto: ofertaForm.value.monto,
    tea: ofertaForm.value.tea,
    comentarios: ofertaForm.value.comentarios
  });

  toast.add({ 
    severity: 'success', 
    summary: 'Éxito', 
    detail: 'Oferta enviada correctamente', 
    life: 3000 
  });

  showOfertarDialog.value = false;
  
  // Resetear formulario
  ofertaForm.value = {
    monto: null,
    tea: null,
    comentarios: ''
  };
};

const loadSolicitud = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const id = route.params.id;
    if (!id) {
      throw new Error('ID de solicitud no proporcionado');
    }
    
    const response = await solicitudService.getSolicitud(id);
    
    if (response.data.success) {
      solicitud.value = response.data.data;
    } else {
      throw new Error(response.data.message || 'Error al cargar la solicitud');
    }
  } catch (err) {
    console.error('Error loading solicitud:', err);
    error.value = err.message || 'Error al cargar los datos de la solicitud';
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: error.value, 
      life: 3000 
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadSolicitud();
});
</script>