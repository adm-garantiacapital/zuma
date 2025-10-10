<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-96">
      <ProgressSpinner />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
      <i class="pi pi-exclamation-triangle text-red-500 text-3xl mb-2"></i>
      <p class="text-red-700">{{ error }}</p>
      <Button label="Reintentar" icon="pi pi-refresh" @click="loadSolicitudes" class="mt-3" />
    </div>

    <!-- Content -->
    <div v-else-if="solicitudes.length > 0" class="space-y-6">
      <div v-for="solicitud in solicitudes" :key="solicitud.id" 
           class="bg-white rounded-2xl shadow-sm p-6">
        <div class="grid grid-cols-12 gap-6">
          
          <!-- Columna IZQUIERDA (6 columnas): Carrusel + Métricas + Botones -->
          <div class="col-span-12 lg:col-span-6">
            <!-- Selector de Propiedades -->
            <div class="flex gap-2 mb-4 overflow-x-auto pb-2">
              <Button 
                v-for="property in solicitud.properties" 
                :key="property.id"
                :label="property.nombre" 
                :severity="selectedPropertyId === property.id ? 'primary' : 'secondary'"
                size="small"
                outlined
                @click="selectProperty(property.id)"
                class="whitespace-nowrap"
              />
            </div>

            <!-- Image Gallery Carousel para propiedad seleccionada -->
            <div class="rounded-xl overflow-hidden mb-4">
              <Galleria 
                v-if="getSelectedPropertyImages(solicitud).length > 0"
                :value="getSelectedPropertyImages(solicitud)" 
                :numVisible="3" 
                :responsiveOptions="responsiveOptions"
                containerStyle="max-width: 100%"
                :showThumbnails="true"
                :showIndicators="true"
                :circular="true"
                :autoPlay="false"
                thumbnailsPosition="bottom">
                <template #item="slotProps">
                  <div class="relative">
                    <img :src="slotProps.item.url" :alt="slotProps.item.descripcion" 
                         class="w-full h-[400px] object-cover" />
                    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <h3 class="text-white font-bold">{{ slotProps.item.propertyName }}</h3>
                    </div>
                  </div>
                </template>
                <template #thumbnail="slotProps">
                  <img :src="slotProps.item.url" :alt="slotProps.item.descripcion" 
                       class="w-full h-16 object-cover" />
                </template>
              </Galleria>
              <div v-else class="flex items-center justify-center h-[400px] bg-gray-100 rounded-xl">
                <div class="text-center">
                  <i class="pi pi-image text-gray-400 text-5xl mb-3"></i>
                  <p class="text-gray-500">No hay imágenes</p>
                </div>
              </div>
            </div>

            <!-- Métricas debajo del carrusel -->
            <div class="grid grid-cols-2 gap-3 mb-4">
              <!-- Valor General -->
              <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div class="text-xs text-blue-700 font-semibold mb-1">VALOR GENERAL</div>
                <div class="text-xl font-bold text-blue-900">
                  {{ formatCurrency(solicitud?.valor_general?.amount, solicitud?.valor_general?.currency) }}
                </div>
              </div>

              <!-- TEA -->
              <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                <div class="text-xs text-purple-700 font-semibold mb-1">TEA</div>
                <div class="text-xl font-bold text-purple-900">
                  {{ formatPercentage(solicitud?.configuracion_subasta?.tea) }}
                </div>
              </div>

              <!-- TEM -->
              <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                <div class="text-xs text-orange-700 font-semibold mb-1">TEM</div>
                <div class="text-xl font-bold text-orange-900">
                  {{ formatPercentage(solicitud?.configuracion_subasta?.tem) }}
                </div>
              </div>

              <!-- Riesgo -->
              <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <div class="text-xs text-green-700 font-semibold mb-1">RIESGO</div>
                <div class="text-xl font-bold text-green-900">
                  {{ solicitud?.configuracion_subasta?.riesgo || 'N/A' }}
                </div>
              </div>
            </div>

            <!-- Botones debajo de las métricas -->
            <div class="space-y-2">
              <Button 
                label="Ver Detalle" 
                icon="pi pi-info-circle" 
                outlined
                fluid
                severity="info"
                @click="verDetalle(solicitud)"
              />
              <Button 
                label="Ver Cronograma" 
                icon="pi pi-calendar" 
                outlined 
                severity="secondary"
                fluid
                @click="verCronograma(solicitud)"
              />
            </div>
          </div>

          <!-- Columna DERECHA (6 columnas): Valor Requerido + Inversionistas + Botón Ofertar -->
          <div class="col-span-12 lg:col-span-6">
            <div class="h-full flex flex-col justify-between">
              
              <!-- Información de Valor Requerido -->
              <div class="space-y-4 mb-6">
                <!-- Código de Solicitud -->
                <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200">
                  <div class="text-sm text-indigo-700 font-semibold mb-1">CÓDIGO</div>
                  <div class="text-2xl font-bold text-indigo-900">
                    {{ solicitud?.codigo }}
                  </div>
                  <div class="text-xs text-indigo-600 mt-1">
                    Estado: <span class="capitalize font-medium">{{ solicitud?.estado }}</span>
                  </div>
                </div>

                <!-- Cronómetro de Subasta -->
                <div v-if="solicitud?.subasta && solicitud.estado === 'en_subasta'" 
                     class="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border-2 border-red-300 animate-pulse">
                  <div class="flex items-center justify-between mb-2">
                    <div class="text-sm text-red-700 font-semibold">
                      <i class="pi pi-clock mr-2"></i>TIEMPO RESTANTE
                    </div>
                    <Tag :value="solicitud.subasta.estado" severity="danger" />
                  </div>
                  <div class="text-3xl font-bold text-red-900 text-center mb-2">
                    {{ getCountdown(solicitud.subasta) }}
                  </div>
                  <div class="text-xs text-red-600 text-center">
                    Finaliza: {{ formatTime(solicitud.subasta.hora_fin) }}
                  </div>
                </div>

                <!-- Valor Requerido -->
                <div class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
                  <div class="flex items-center gap-3 mb-3">
                    <i class="pi pi-money-bill text-emerald-600 text-3xl"></i>
                    <div>
                      <div class="text-sm text-emerald-700 font-semibold">VALOR REQUERIDO</div>
                      <div class="text-3xl font-bold text-emerald-900">
                        {{ formatCurrency(solicitud?.valor_requerido?.amount, solicitud?.valor_requerido?.currency) }}
                      </div>
                    </div>
                  </div>
                  <div class="text-xs text-emerald-700">Monto solicitado por el deudor</div>
                </div>

                <!-- Inversionistas que han ofertado -->
                <div v-if="solicitudBids[solicitud.id] && solicitudBids[solicitud.id].length > 0" 
                     class="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                  <div class="flex items-center justify-between mb-3">
                    <h3 class="text-sm font-semibold text-yellow-700">
                      <i class="pi pi-users mr-2"></i>
                      Inversionistas Participando
                    </h3>
                    <Tag :value="solicitudBids[solicitud.id].length" severity="warning" />
                  </div>
                  <div class="space-y-2 max-h-60 overflow-y-auto">
                    <div 
                      v-for="(bid, index) in solicitudBids[solicitud.id]" 
                      :key="bid.id"
                      class="bg-white rounded-lg p-3 border border-yellow-100"
                    >
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <Tag :value="`#${index + 1}`" severity="info" class="text-xs" />
                          <span class="text-sm font-medium text-gray-700">
                            {{ bid.investor?.alias || 'Sin alias' }}
                          </span>
                        </div>
                        <div class="text-xs text-gray-500">
                          {{ formatDateTime(bid.created_at) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Botón de Acción -->
              <div>
                <Button 
                  :label="getActionButtonLabel(solicitud)" 
                  :icon="getActionButtonIcon(solicitud)"
                  rounded
                  :severity="getActionButtonSeverity(solicitud)"
                  :loading="participatingSolicitudId === solicitud.id"
                  :disabled="isAuctionExpired(solicitud.subasta)"
                  fluid
                  @click="handleAction(solicitud)"
                />
                <div v-if="isAuctionExpired(solicitud.subasta)" class="text-center mt-2">
                  <span class="text-xs text-red-600 font-semibold">
                    <i class="pi pi-times-circle mr-1"></i>Subasta finalizada
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Paginación -->
      <div v-if="totalPages > 1" class="flex justify-center mt-6">
        <Paginator 
          :rows="perPage" 
          :totalRecords="total" 
          :first="(currentPage - 1) * perPage"
          @page="loadSolicitudes($event.page + 1)" 
        />
      </div>
    </div>

    <!-- Estado vacío con diseño personalizado -->
    <div v-else-if="solicitudes.length === 0 && !loading"
         class="mb-10 rounded-3xl bg-[#6790FF] relative overflow-hidden p-6 min-h-[800px] flex items-center justify-center">
      <img src="/imagenes/landing/logo-zuma-blanco.svg" class="absolute top-6 left-6 w-[340px]" />
      <div class="text-center -translate-y-10">
        <h1 class="text-[#171717] text-4xl font-bold">
          ESTAMOS PREPARANDO
        </h1>
        <h1 class="text-[#171717] text-4xl font-bold">
          LA PROXIMA SUBASTA
        </h1>
      </div>
      <img src="/imagenes/zuma/alguna-duda.svg" class="absolute bottom-6 left-6 w-[380px]" />
      <img src="/imagenes/landing/nosotros.svg" class="absolute bottom-2 right-6 w-[580px]" />
    </div>

    <!-- Diálogo de Confirmación -->
    <Dialog v-model:visible="confirmDialog" modal header="Confirmar Participación" :style="{ width: '500px' }">
      <div v-if="selectedSolicitud" class="space-y-4">
        <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <i class="pi pi-exclamation-triangle text-amber-600 text-2xl mb-2"></i>
          <p class="text-amber-800 font-semibold mb-2">
            ¿Estás seguro de participar en esta subasta?
          </p>
          <p class="text-sm text-amber-700">
            Al confirmar, estarás comprometiéndote a participar en la subasta del inmueble.
          </p>
        </div>

        <div class="bg-gray-50 rounded-lg p-4 space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-600">Código:</span>
            <span class="font-semibold">{{ selectedSolicitud.codigo }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Valor Requerido:</span>
            <span class="font-bold text-emerald-600">
              {{ formatCurrency(selectedSolicitud.valor_requerido?.amount, selectedSolicitud.valor_requerido?.currency) }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">TEA:</span>
            <span class="font-semibold text-purple-600">
              {{ formatPercentage(selectedSolicitud.configuracion_subasta?.tea) }}
            </span>
          </div>
          <div v-if="selectedSolicitud.subasta" class="flex justify-between">
            <span class="text-gray-600">Tiempo Restante:</span>
            <span class="font-bold text-red-600">
              {{ getCountdown(selectedSolicitud.subasta) }}
            </span>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-2 justify-end">
          <Button label="Cancelar" icon="pi pi-times" severity="secondary" @click="confirmDialog = false" />
          <Button label="Confirmar Participación" icon="pi pi-check" severity="success" 
                  :loading="participatingSolicitudId === selectedSolicitud?.id"
                  @click="confirmarParticipacion" />
        </div>
      </template>
    </Dialog>

    <!-- Diálogo de Detalles -->
    <Dialog v-model:visible="detailDialog" modal header="Detalles de la Solicitud" :style="{ width: '900px' }"
        :closable="true">
        <div v-if="selectedSolicitud" class="space-y-6">
            <!-- Selector de Propiedades en el diálogo -->
            <div class="flex gap-2 overflow-x-auto pb-2">
              <Button 
                v-for="property in selectedSolicitud.properties" 
                :key="property.id"
                :label="property.nombre" 
                :severity="selectedPropertyId === property.id ? 'primary' : 'secondary'"
                size="small"
                outlined
                @click="selectProperty(property.id)"
                class="whitespace-nowrap"
              />
            </div>

            <!-- Carrusel de imágenes en el diálogo -->
            <div class="text-center">
                <Carousel :value="getSelectedPropertyImages(selectedSolicitud)" :numVisible="1" :numScroll="1"
                    :showIndicators="true" :showNavigators="true" class="auction-carousel">
                    <template #item="carouselSlot">
                        <div class="relative h-80">
                            <img :src="carouselSlot.data.url" 
                                 :alt="carouselSlot.data.descripcion"
                                class="w-full h-full object-cover rounded-lg" />
                        </div>
                    </template>
                </Carousel>
            </div>

            <!-- Información básica -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <template #title>Información General</template>
                    <template #content>
                        <div class="space-y-3 text-sm">
                            <div class="flex justify-between">
                                <span class="font-medium">Código:</span>
                                <span>{{ selectedSolicitud.codigo }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-medium">Estado:</span>
                                <Tag :value="selectedSolicitud.estado" 
                                     :severity="selectedSolicitud.estado === 'en_subasta' ? 'success' : 'secondary'" />
                            </div>
                            <div class="flex justify-between">
                                <span class="font-medium">Tipo Cronograma:</span>
                                <span class="capitalize">{{ selectedSolicitud.configuracion_subasta?.tipo_cronograma }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-medium">Riesgo:</span>
                                <Tag :value="selectedSolicitud.configuracion_subasta?.riesgo" severity="success" />
                            </div>
                        </div>
                    </template>
                </Card>

                <Card>
                    <template #title>Información Financiera</template>
                    <template #content>
                        <div class="space-y-3 text-sm">
                            <div class="flex justify-between">
                                <span class="font-medium">Valor General:</span>
                                <span class="font-bold text-blue-600">{{ formatCurrency(selectedSolicitud.valor_general?.amount, selectedSolicitud.valor_general?.currency) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-medium">Valor Requerido:</span>
                                <span class="font-bold text-purple-600">{{ formatCurrency(selectedSolicitud.valor_requerido?.amount, selectedSolicitud.valor_requerido?.currency) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-medium">TEA:</span>
                                <span class="font-bold text-purple-600">{{ formatPercentage(selectedSolicitud.configuracion_subasta?.tea) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-medium">TEM:</span>
                                <span class="font-bold text-orange-600">{{ formatPercentage(selectedSolicitud.configuracion_subasta?.tem) }}</span>
                            </div>
                        </div>
                    </template>
                </Card>
            </div>

            <!-- Propiedades asociadas -->
            <Card v-if="selectedSolicitud.properties && selectedSolicitud.properties.length > 0">
                <template #title>Propiedades Asociadas</template>
                <template #content>
                    <div class="space-y-4">
                        <div v-for="property in selectedSolicitud.properties" :key="property.id"
                             class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div class="flex items-center justify-between mb-2">
                                <h4 class="font-semibold text-gray-800">{{ property.nombre }}</h4>
                                <Tag :value="property.estado" 
                                     :severity="property.estado === 'activo' ? 'success' : 'secondary'" />
                            </div>
                            <div class="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span class="text-gray-600">Ubicación:</span>
                                    <p class="font-medium">{{ property.distrito }}, {{ property.provincia }}, {{ property.departamento }}</p>
                                </div>
                                <div>
                                    <span class="text-gray-600">Valor Estimado:</span>
                                    <p class="font-bold text-green-600">{{ formatCurrency(property.valor_estimado?.amount, property.valor_estimado?.currency) }}</p>
                                </div>
                            </div>
                            <div class="mt-2">
                                <span class="text-gray-600">Dirección:</span>
                                <p class="font-medium">{{ property.direccion }}</p>
                            </div>
                        </div>
                    </div>
                </template>
            </Card>
        </div>

        <template #footer>
            <div class="flex gap-2 justify-end">
                <Button label="Cerrar" icon="pi pi-times" severity="secondary" class="p-button-text"
                    @click="detailDialog = false" />
                <Button v-if="selectedSolicitud?.estado === 'en_subasta'" 
                        label="Participar en Subasta" 
                        icon="pi pi-money-bill" 
                        severity="contrast" 
                        rounded
                        :loading="participatingSolicitudId === selectedSolicitud.id"
                        :disabled="isAuctionExpired(selectedSolicitud.subasta)"
                        @click="detailDialog = false; handleAction(selectedSolicitud)" />
            </div>
        </template>
    </Dialog>

    <!-- Dialog para Cronograma -->
    <Dialog v-model:visible="scheduleDialog" modal header="Cronograma de Pagos" :style="{ width: '800px' }"
        :closable="true">
        <div v-if="selectedSolicitud" class="space-y-4">
            <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 class="font-semibold text-blue-800 mb-2">{{ selectedSolicitud.codigo }}</h4>
                <p class="text-blue-600 text-sm">Inversor: {{ selectedSolicitud.investor?.nombre }}</p>
                <p class="text-blue-600 text-sm">Valor Requerido: {{ formatCurrency(selectedSolicitud.valor_requerido?.amount, selectedSolicitud.valor_requerido?.currency) }}</p>
            </div>

            <!-- Selector de Cronograma -->
            <div v-if="selectedSolicitud.property_investors && selectedSolicitud.property_investors.length > 1" 
                 class="flex gap-2 mb-4">
                <Button 
                  v-for="(investor, index) in selectedSolicitud.property_investors" 
                  :key="investor.id"
                  :label="`Cronograma ${index + 1}`" 
                  :severity="selectedScheduleIndex === index ? 'primary' : 'secondary'"
                  size="small"
                  outlined
                  @click="selectSchedule(index)"
                />
            </div>

            <div v-if="scheduleData && scheduleData.length > 0">
                <DataTable :value="scheduleData" responsiveLayout="scroll" 
                          :paginator="true" :rows="10"
                          class="p-datatable-sm">
                    <Column field="cuota" header="Cuota" sortable />
                    <Column field="vencimiento" header="Vencimiento" sortable />
                    <Column field="capital" header="Capital" sortable>
                        <template #body="slotProps">
                            {{ formatCurrency(slotProps.data.capital) }}
                        </template>
                    </Column>
                    <Column field="intereses" header="Intereses" sortable>
                        <template #body="slotProps">
                            {{ formatCurrency(slotProps.data.intereses) }}
                        </template>
                    </Column>
                    <Column field="total_cuota" header="Total Cuota" sortable>
                        <template #body="slotProps">
                            <span class="font-bold text-green-600">
                                {{ formatCurrency(slotProps.data.total_cuota) }}
                            </span>
                        </template>
                    </Column>
                    <Column field="estado" header="Estado" sortable>
                        <template #body="slotProps">
                            <Tag :value="slotProps.data.estado" 
                                 :severity="slotProps.data.estado === 'pagado' ? 'success' : 'warning'" />
                        </template>
                    </Column>
                </DataTable>
            </div>
            <div v-else class="text-center py-8">
                <i class="pi pi-calendar-times text-5xl text-gray-400 mb-4"></i>
                <h5 class="text-lg font-semibold text-gray-600 mb-2">No hay cronograma disponible</h5>
                <p class="text-gray-400">El cronograma de pagos no está configurado para esta solicitud</p>
            </div>
        </div>

        <template #footer>
            <Button label="Cerrar" icon="pi pi-times" severity="secondary" 
                    @click="scheduleDialog = false" />
        </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import Galleria from 'primevue/galleria';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import ProgressSpinner from 'primevue/progressspinner';
import Paginator from 'primevue/paginator';
import Dialog from 'primevue/dialog';
import Carousel from 'primevue/carousel';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { auctionService } from '@/services/auctionService.js';
import { bidService } from '@/services/bid.js';
import * as XLSX from 'xlsx';

const toast = useToast();

const solicitudes = ref([]);
const loading = ref(false);
const error = ref(null);
const currentPage = ref(1);
const totalPages = ref(1);
const perPage = ref(15);
const total = ref(0);
const detailDialog = ref(false);
const scheduleDialog = ref(false);
const confirmDialog = ref(false);
const selectedSolicitud = ref(null);
const scheduleData = ref([]);
const selectedPropertyId = ref(null);
const selectedScheduleIndex = ref(0);
const participatingSolicitudId = ref(null);
const solicitudBids = ref({});
const countdownInterval = ref(null);
const currentTime = ref(new Date());

const responsiveOptions = ref([
  {
    breakpoint: '1024px',
    numVisible: 3
  },
  {
    breakpoint: '768px',
    numVisible: 2
  },
  {
    breakpoint: '560px',
    numVisible: 1
  }
]);

// Iniciar intervalo de actualización del tiempo
const startCountdownTimer = () => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value);
  }
  
  countdownInterval.value = setInterval(() => {
    currentTime.value = new Date();
  }, 1000);
};

// Detener intervalo
const stopCountdownTimer = () => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value);
    countdownInterval.value = null;
  }
};

// Calcular tiempo restante
const getCountdown = (subasta) => {
  if (!subasta || !subasta.hora_fin) return '--:--:--';
  
  try {
    const now = currentTime.value;
    const endDate = new Date(`${subasta.dia_subasta} ${subasta.hora_fin}`);
    
    const diff = endDate - now;
    
    if (diff <= 0) {
      return '00:00:00';
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  } catch (e) {
    return '--:--:--';
  }
};

// Verificar si la subasta expiró
const isAuctionExpired = (subasta) => {
  if (!subasta || !subasta.hora_fin) return false;
  
  try {
    const now = currentTime.value;
    const endDate = new Date(`${subasta.dia_subasta} ${subasta.hora_fin}`);
    return now >= endDate;
  } catch (e) {
    return false;
  }
};

// Formatear hora
const formatTime = (timeString) => {
  if (!timeString) return '-';
  
  try {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  } catch (e) {
    return '-';
  }
};

// Formatear fecha y hora completa
const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date);
  } catch (e) {
    return '-';
  }
};

// Seleccionar propiedad
const selectProperty = (propertyId) => {
  selectedPropertyId.value = propertyId;
};

// Obtener imágenes de la propiedad seleccionada
const getSelectedPropertyImages = (solicitud) => {
  if (!solicitud || !solicitud.properties) return [];
  
  const targetPropertyId = selectedPropertyId.value || (solicitud.properties[0]?.id || null);
  
  const property = solicitud.properties.find(p => p.id === targetPropertyId);
  if (!property) return [];
  
  const images = [];
  if (property.imagenes && Array.isArray(property.imagenes) && property.imagenes.length > 0) {
    property.imagenes.forEach(imagen => {
      images.push({
        url: imagen.url || '/Propiedades/no-image.png',
        descripcion: imagen.descripcion || 'Imagen de la propiedad',
        propertyName: property.nombre || 'Propiedad',
        propertyId: property.id
      });
    });
  }
  
  if (images.length === 0) {
    images.push({
      url: '/Propiedades/no-image.png',
      descripcion: 'Sin imagen disponible',
      propertyName: property.nombre || 'Propiedad',
      propertyId: property.id
    });
  }
  
  return images;
};

// Seleccionar cronograma
const selectSchedule = (index) => {
  selectedScheduleIndex.value = index;
  if (selectedSolicitud.value?.property_investors?.[index]?.payment_schedules) {
    scheduleData.value = selectedSolicitud.value.property_investors[index].payment_schedules;
  }
};

// Cargar ofertas para una solicitud
const loadBidsForSolicitud = async (solicitudId) => {
  try {
    const response = await bidService.getBySolicitudBid(solicitudId);
    if (response.data && response.data.success) {
      const bids = response.data.data || [];
      // Ordenar por fecha de creación (primero el más antiguo)
      bids.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      solicitudBids.value[solicitudId] = bids;
    }
  } catch (err) {
    console.error('Error al cargar ofertas:', err);
    solicitudBids.value[solicitudId] = [];
  }
};

// Cargar solicitudes desde la API
const loadSolicitudes = async (page = 1) => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await auctionService.getAuctions(page);
    
    if (response.data && response.data.success) {
      solicitudes.value = Array.isArray(response.data.data) ? response.data.data : [];
      currentPage.value = response.data.meta?.current_page || 1;
      totalPages.value = response.data.meta?.last_page || 1;
      perPage.value = response.data.meta?.per_page || 15;
      total.value = response.data.meta?.total || 0;
      
      // Cargar ofertas para cada solicitud
      solicitudes.value.forEach(solicitud => {
        if (solicitud.id) {
          loadBidsForSolicitud(solicitud.id);
        }
      });
    } else {
      solicitudes.value = [];
    }
  } catch (err) {
    console.error('Error al cargar solicitudes:', err);
    error.value = 'Error al cargar las solicitudes';
    solicitudes.value = [];
    
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'No se pudieron cargar las solicitudes', 
      life: 3000 
    });
  } finally {
    loading.value = false;
  }
};

// Mostrar diálogo de confirmación
const mostrarConfirmacion = (solicitud) => {
  selectedSolicitud.value = solicitud;
  confirmDialog.value = true;
};

// Confirmar participación
const confirmarParticipacion = async () => {
  if (!selectedSolicitud.value) return;
  
  await participarEnSubasta(selectedSolicitud.value);
  confirmDialog.value = false;
};

// Participar en subasta
const participarEnSubasta = async (solicitud) => {
  if (!solicitud.id) {
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'ID de solicitud no válido', 
      life: 3000 
    });
    return;
  }

  participatingSolicitudId.value = solicitud.id;
  
  try {
    const response = await bidService.create(solicitud.id);
    
    if (response.data && response.data.success) {
      toast.add({ 
        severity: 'success', 
        summary: 'Éxito', 
        detail: 'Has participado en la subasta correctamente', 
        life: 3000 
      });
      
      await loadBidsForSolicitud(solicitud.id);
      
      emit('auctionSelected', solicitud);
    } else {
      throw new Error(response.data?.message || 'Error al participar en la subasta');
    }
  } catch (err) {
    console.error('Error al participar en subasta:', err);
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: err.response?.data?.message || 'No se pudo participar en la subasta', 
      life: 3000 
    });
  } finally {
    participatingSolicitudId.value = null;
  }
};

// Formatear moneda con validación
const formatCurrency = (value, currency = 'PEN') => {
  if (value === null || value === undefined || isNaN(value)) return 'S/ 0.00';
  
  const currencySymbols = {
    'USD': '$',
    'PEN': 'S/',
    'EUR': '€',
    'SOL': 'S/',
    'SOLES': 'S/'
  };
  const symbol = currencySymbols[currency?.toUpperCase()] || 'S/';
  
  try {
    return `${symbol}${new Intl.NumberFormat('es-PE', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }).format(value)}`;
  } catch (e) {
    return `${symbol}0.00`;
  }
};

// Formatear porcentaje con validación
const formatPercentage = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '0.00%';
  
  try {
    const numValue = parseFloat(value);
    
    if (numValue <= 1) {
      return `${(numValue * 100).toFixed(2)}%`;
    } else if (numValue > 100) {
      return `${(numValue / 100).toFixed(2)}%`;
    } else {
      return `${numValue.toFixed(2)}%`;
    }
  } catch (e) {
    return '0.00%';
  }
};

// Obtener etiqueta del botón de acción
const getActionButtonLabel = (solicitud) => {
  if (!solicitud) return 'Ver Información';
  
  const estado = solicitud.estado || '';
  if (estado === 'en_subasta') {
    if (isAuctionExpired(solicitud.subasta)) {
      return 'Subasta Finalizada';
    }
    return 'Participar en Subasta';
  }
  if (estado === 'pendiente') return 'En Proceso';
  if (estado === 'aprobado') return 'Ver Detalles';
  return 'Ver Información';
};

// Obtener ícono del botón de acción
const getActionButtonIcon = (solicitud) => {
  if (!solicitud) return 'pi pi-info-circle';
  
  const estado = solicitud.estado || '';
  if (estado === 'en_subasta') {
    if (isAuctionExpired(solicitud.subasta)) {
      return 'pi pi-lock';
    }
    return 'pi pi-bolt';
  }
  if (estado === 'pendiente') return 'pi pi-clock';
  if (estado === 'aprobado') return 'pi pi-check-circle';
  return 'pi pi-info-circle';
};

// Obtener severidad del botón de acción
const getActionButtonSeverity = (solicitud) => {
  if (!solicitud) return 'info';
  
  const estado = solicitud.estado || '';
  if (estado === 'en_subasta') {
    if (isAuctionExpired(solicitud.subasta)) {
      return 'secondary';
    }
    return 'contrast';
  }
  if (estado === 'pendiente') return 'warning';
  if (estado === 'aprobado') return 'success';
  return 'info';
};

// Manejar acción del botón
const handleAction = (solicitud) => {
  if (!solicitud) return;
  
  const estado = solicitud.estado || '';
  if (estado === 'en_subasta' && !isAuctionExpired(solicitud.subasta)) {
    mostrarConfirmacion(solicitud);
  } else {
    verDetalle(solicitud);
  }
};

// Ver detalle
const verDetalle = (solicitud) => {
  selectedSolicitud.value = solicitud;
  if (solicitud.properties && solicitud.properties.length > 0) {
    selectedPropertyId.value = solicitud.properties[0].id;
  }
  detailDialog.value = true;
};

// Ver cronograma
const verCronograma = async (solicitud) => {
  selectedSolicitud.value = solicitud;
  selectedScheduleIndex.value = 0;
  
  if (solicitud.property_investors && solicitud.property_investors.length > 0) {
    const selectedInvestor = solicitud.property_investors[selectedScheduleIndex.value];
    if (selectedInvestor.payment_schedules && selectedInvestor.payment_schedules.length > 0) {
      scheduleData.value = selectedInvestor.payment_schedules;
    } else {
      scheduleData.value = [];
    }
  } else {
    scheduleData.value = [];
  }
  
  scheduleDialog.value = true;
};

// Definir emits
const emit = defineEmits(['auctionSelected', 'detailSelected', 'scheduleSelected']);

// Cargar datos al montar
onMounted(() => {
  loadSolicitudes();
  startCountdownTimer();
});

// Limpiar al desmontar
onUnmounted(() => {
  stopCountdownTimer();
});
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>