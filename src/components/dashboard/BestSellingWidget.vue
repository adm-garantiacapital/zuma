<script setup>
import { ref, onMounted } from 'vue';
import { auctionService } from '@/services/auctionService.js';
import FormularioCronograma from './FormularioCronograma.vue';
import { paymentScheduleService } from '@/services/paymentScheduleService'

const auctions = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const perPage = ref(15);
const total = ref(0);
const scheduleDialog = ref(false);
const scheduleData = ref([]);
// Dialog para ofertas
const bidDialog = ref(false);
const selectedAuction = ref(null);
const bidAmount = ref('');
const submittingBid = ref(false);

// Dialog para detalles completos
const detailDialog = ref(false);

// Simular múltiples fotos para el carrusel
const getAuctionImages = (auction) => {
    return [
        auction.foto,
        auction.foto, // En tu API real, tendrías un array de fotos
        auction.foto
    ];
};

// Computed para calcular tiempo restante
const getTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;

    if (diff <= 0) return { text: 'Finalizada', urgent: true };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    let text = '';
    let urgent = false;

    if (days > 0) {
        text = `${days}d ${hours}h`;
    } else if (hours > 0) {
        text = `${hours}h ${minutes}m`;
        urgent = hours < 2;
    } else {
        text = `${minutes}m`;
        urgent = true;
    }

    return { text, urgent };
};

// Calcular rentabilidad potencial
const calculatePotentialReturn = (auction) => {
    const current = parseFloat(auction.monto);
    const estimated = parseFloat(auction.valor_estimado);
    return ((estimated - current) / current * 100).toFixed(2);
};

// Cargar subastas
const loadAuctions = async (page = 1) => {
    try {
        loading.value = true;
        const response = await auctionService.getAuctions(page);

        auctions.value = response.data.data;
        currentPage.value = response.data.meta.current_page;
        totalPages.value = response.data.meta.last_page;
        perPage.value = response.data.meta.per_page;
        total.value = response.data.meta.total;
    } catch (error) {
        console.error('Error loading auctions:', error);
    } finally {
        loading.value = false;
    }
};

const openBidDialog = (auction) => {
    selectedAuction.value = auction;
    bidAmount.value = '';
    bidDialog.value = true;
};

const openDetailDialog = (auction) => {
    selectedAuction.value = auction;
    detailDialog.value = true;
};

const submitBid = async () => {
    if (!bidAmount.value || parseFloat(bidAmount.value) <= parseFloat(selectedAuction.value.monto)) {
        return;
    }

    try {
        submittingBid.value = true;

        await auctionService.placeBid({
            property_id: selectedAuction.value.id,
            monto_invertido: parseFloat(bidAmount.value)
        });

        bidDialog.value = false;
        loadAuctions(currentPage.value);

    } catch (error) {
        console.error('Error al hacer la oferta:', error.response?.data || error.message);
    } finally {
        submittingBid.value = false;
    }
};

const openScheduleDialog = async (auction) => {
  try {
    const response = await paymentScheduleService.getByPropertyId(auction.property_id); // 👈 aquí
    scheduleData.value = response.data;
    scheduleDialog.value = true;
  } catch (error) {
    console.error('Error al cargar el cronograma:', error);
  }
};


const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN'
    }).format(amount);
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-PE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

onMounted(() => {
    loadAuctions();
});
</script>

<template>
    <div class="mb-10 rounded-3xl bg-[#F0F1F9] relative overflow-hidden p-6">
        <ul class="space-y-6">
            <li v-for="auction in auctions" :key="auction.id" 
                class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                
                <!-- Carrusel de imágenes -->
                <Carousel :value="getAuctionImages(auction)" :numVisible="1" :numScroll="1" 
                    :showIndicators="true" :showNavigators="true" class="auction-carousel">
                    <template #item="carouselSlot">
                        <div class="relative h-64">
                            <img :src="carouselSlot.data" :alt="auction.nombre" 
                                class="w-full h-full object-cover"/>
                        </div>
                    </template>
                </Carousel>

                <div class="p-6">
                    <!-- Header con título y tiempo -->
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="font-bold text-xl text-gray-800 mb-1">{{ auction.nombre }}</h3>
                            <p class="text-sm text-gray-600 flex items-center gap-1">
                                <i class="pi pi-map-marker text-red-500"></i>
                                {{ auction.distrito }}, {{ auction.provincia }}, {{ auction.departamento }}
                            </p>
                        </div>
                        <Tag :value="getTimeRemaining(auction.finalizacion).text"
                            :severity="getTimeRemaining(auction.finalizacion).urgent ? 'danger' : 'success'"
                            icon="pi pi-clock" class="text-sm font-semibold" />
                    </div>

                    <!-- Descripción -->
                    <p class="text-gray-700 mb-4 line-clamp-2">{{ auction.descripcion }}</p>

                    <!-- Grid de información financiera -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <!-- Oferta actual -->
                        <div class="bg-green-50 p-3 rounded-lg border border-green-200">
                            <p class="text-xs text-green-600 font-medium uppercase tracking-wide">Oferta Actual</p>
                            <p class="text-lg font-bold text-green-700">{{ formatCurrency(auction.monto) }}</p>
                            <p class="text-xs text-green-600">{{ auction.Moneda }}</p>
                        </div>

                        <!-- Valor estimado -->
                        <div class="bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <p class="text-xs text-blue-600 font-medium uppercase tracking-wide">Valor Estimado</p>
                            <p class="text-lg font-bold text-blue-700">{{ formatCurrency(auction.valor_estimado) }}</p>
                            <p class="text-xs text-blue-600">Potencial: +{{ calculatePotentialReturn(auction) }}%</p>
                        </div>

                        <!-- TEA -->
                        <div class="bg-purple-50 p-3 rounded-lg border border-purple-200">
                            <p class="text-xs text-purple-600 font-medium uppercase tracking-wide">TEA</p>
                            <p class="text-lg font-bold text-purple-700">{{ auction.tea }}%</p>
                            <p class="text-xs text-purple-600">Anual</p>
                        </div>

                        <!-- TEM -->
                        <div class="bg-orange-50 p-3 rounded-lg border border-orange-200">
                            <p class="text-xs text-orange-600 font-medium uppercase tracking-wide">TEM</p>
                            <p class="text-lg font-bold text-orange-700">{{ auction.tem }}%</p>
                            <p class="text-xs text-orange-600">Mensual</p>
                        </div>
                    </div>

                    <!-- Información adicional -->
                    <div class="bg-gray-50 p-4 rounded-lg mb-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div class="flex justify-between">
                                <span class="text-gray-600">Meses de pago:</span>
                                <span class="font-semibold">{{ auction.deadlines_id || 'No definido' }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Moneda:</span>
                                <span class="font-semibold">#{{ auction.Moneda }}</span>
                            </div>
                            <div class="flex justify-between md:col-span-2">
                                <span class="text-gray-600">Finaliza:</span>
                                <span class="font-semibold">{{ formatDate(auction.finalizacion) }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Botones de acción -->
                    <div class="flex flex-col gap-3">
                        <!-- Fila con 2 botones -->
                        <div class="flex gap-3">
                            <Button label="Ver Detalles" icon="pi pi-info-circle"
                                class="p-button-outlined w-1/2" severity="info"
                                @click="openDetailDialog(auction)" />

                            <Button label="Ofertar" icon="pi pi-money-bill"
                                class="w-1/2" rounded severity="contrast"
                                @click="openBidDialog(auction)"
                                :disabled="getTimeRemaining(auction.finalizacion).urgent && getTimeRemaining(auction.finalizacion).text === 'Finalizada'" />
                        </div>

                        <!-- Botón debajo a todo el ancho -->
                        <Button label="Ver Cronograma" icon="pi pi-calendar" severity="secondary" rounded
                            @click="openScheduleDialog(auction)" />

                    </div>

                </div>
            </li>
        </ul>

        <!-- Paginación -->
        <Paginator v-if="totalPages > 1" :rows="perPage" :totalRecords="total" 
            :first="(currentPage - 1) * perPage"
            @page="loadAuctions($event.page + 1)" class="mt-6" />

        <!-- Dialog para ofertas -->
        <Dialog v-model:visible="bidDialog" modal header="Hacer una oferta" 
            :style="{ width: '500px' }" :closable="true">
            <template #header>
                <div class="flex items-center gap-2">
                    <i class="pi pi-money-bill"></i>
                    <span>Hacer una oferta</span>
                </div>
            </template>

            <div v-if="selectedAuction" class="space-y-4">
                <!-- Info de la propiedad -->
                <Message severity="info">
                    <div class="p-4 rounded-lg">
                        <div class="flex items-center gap-4">
                            <img :src="selectedAuction.foto" :alt="selectedAuction.nombre"
                                class="w-16 h-16 rounded-lg object-cover" />
                            <div>
                                <h4 class="font-semibold">{{ selectedAuction.nombre }}</h4>
                                <p class="text-sm">{{ selectedAuction.distrito }}, {{ selectedAuction.provincia }}</p>
                                <p class="text-lg font-bold">
                                    Oferta actual: {{ formatCurrency(selectedAuction.monto) }}
                                </p>
                            </div>
                        </div>
                    </div>
                </Message>

                <!-- Campo de oferta -->
                <div class="field">
                    <label for="bidAmount" class="block text-sm font-medium mb-2">
                        Tu oferta (mínimo: {{ formatCurrency(parseFloat(selectedAuction.monto) + 0.01) }})
                    </label>
                    <InputNumber id="bidAmount" v-model="bidAmount" 
                        :min="parseFloat(selectedAuction.monto) + 0.01"
                        :step="0.01" placeholder="Ingresa tu oferta" class="w-full" 
                        currency="PEN" locale="es-PE"
                        :class="{ 'p-invalid': bidAmount && parseFloat(bidAmount) <= parseFloat(selectedAuction.monto) }" />
                    <small v-if="bidAmount && parseFloat(bidAmount) <= parseFloat(selectedAuction.monto)"
                        class="p-error">
                        La oferta debe ser mayor a la actual
                    </small>
                </div>

                <!-- Información financiera -->
                <div class="grid grid-cols-2 gap-3 text-sm">
                    <div class="bg-green-50 p-3 rounded">
                        <span class="text-green-600 font-medium">Rentabilidad potencial:</span>
                        <p class="font-bold">+{{ calculatePotentialReturn(selectedAuction) }}%</p>
                    </div>
                </div>

                <!-- Información adicional -->
                <Message>
                    <div class="text-sm">
                        <p class="font-medium mb-1">Información importante:</p>
                        <ul class="text-xs space-y-1 ml-4">
                            <li>• Tu oferta es vinculante</li>
                            <li>• TEA: {{ selectedAuction.tea }}% | TEM: {{ selectedAuction.tem }}%</li>
                            <li>• Tiempo restante: <strong>{{ getTimeRemaining(selectedAuction.finalizacion).text }}</strong></li>
                            <li>• Recibirás notificaciones de cambios</li>
                        </ul>
                    </div>
                </Message>
            </div>

            <template #footer>
                <div class="flex gap-2 justify-end">
                    <Button label="Cancelar" icon="pi pi-times" class="p-button-text" 
                        @click="bidDialog = false" />
                    <Button label="Confirmar oferta" icon="pi pi-check" severity="contrast" rounded
                        @click="submitBid" :loading="submittingBid"
                        :disabled="!bidAmount || parseFloat(bidAmount) <= parseFloat(selectedAuction?.monto || 0)" />
                </div>
            </template>
        </Dialog>

        <!-- Dialog para detalles completos -->
        <Dialog v-model:visible="detailDialog" modal header="Detalles de la Propiedad" 
            :style="{ width: '700px' }" :closable="true">
            <div v-if="selectedAuction" class="space-y-6">
                <!-- Imagen principal -->
                <div class="text-center">
                    <img :src="selectedAuction.foto" :alt="selectedAuction.nombre"
                        class="w-full h-64 object-cover rounded-lg" />
                </div>

                <!-- Información básica -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <template #title>Información General</template>
                        <template #content>
                            <div class="space-y-3 text-sm">
                                <div class="flex justify-between">
                                    <span class="font-medium">Nombre:</span>
                                    <span>{{ selectedAuction.nombre }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="font-medium">Departamento:</span>
                                    <span>{{ selectedAuction.departamento }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="font-medium">Provincia:</span>
                                    <span>{{ selectedAuction.provincia }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="font-medium">Distrito:</span>
                                    <span>{{ selectedAuction.distrito }}</span>
                                </div>
                            </div>
                        </template>
                    </Card>

                    <Card>
                        <template #title>Información Financiera</template>
                        <template #content>
                            <div class="space-y-3 text-sm">
                                <div class="flex justify-between">
                                    <span class="font-medium">Oferta Actual:</span>
                                    <span class="font-bold text-green-600">{{ formatCurrency(selectedAuction.monto) }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="font-medium">Valor Estimado:</span>
                                    <span class="font-bold text-blue-600">{{ formatCurrency(selectedAuction.valor_estimado) }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="font-medium">TEA:</span>
                                    <span class="font-bold text-purple-600">{{ selectedAuction.tea }}%</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="font-medium">TEM:</span>
                                    <span class="font-bold text-orange-600">{{ selectedAuction.tem }}%</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="font-medium">Moneda:</span>
                                    <span>{{ selectedAuction.Moneda }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="font-medium">Meses de pago:</span>
                                    <span>{{ selectedAuction.deadlines_id }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="font-medium">Rentabilidad Potencial:</span>
                                    <span class="font-bold text-green-600">+{{ calculatePotentialReturn(selectedAuction) }}%</span>
                                </div>
                            </div>
                        </template>
                    </Card>
                </div>

                <!-- Descripción completa -->
                <Card>
                    <template #title>Descripción</template>
                    <template #content>
                        <p class="text-gray-700">{{ selectedAuction.descripcion }}</p>
                    </template>
                </Card>

                <!-- Información de tiempo -->
                <Card>
                    <template #title>Información de Subasta</template>
                    <template #content>
                        <div class="space-y-3 text-sm">
                            <div class="flex justify-between">
                                <span class="font-medium">Fecha de Finalización:</span>
                                <span>{{ formatDate(selectedAuction.finalizacion) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-medium">Tiempo Restante:</span>
                                <Tag :value="getTimeRemaining(selectedAuction.finalizacion).text"
                                    :severity="getTimeRemaining(selectedAuction.finalizacion).urgent ? 'danger' : 'success'" />
                            </div>
                        </div>
                    </template>
                </Card>
            </div>

            <template #footer>
                <div class="flex gap-2 justify-end">
                    <Button label="Cerrar" icon="pi pi-times" class="p-button-text" 
                        @click="detailDialog = false" />
                    <Button label="Hacer Oferta" icon="pi pi-money-bill" severity="contrast" rounded
                        @click="detailDialog = false; openBidDialog(selectedAuction)"
                        :disabled="getTimeRemaining(selectedAuction.finalizacion).urgent && getTimeRemaining(selectedAuction.finalizacion).text === 'Finalizada'" />
                </div>
            </template>
        </Dialog>

        <FormularioCronograma
            v-model:visible="scheduleDialog"
            :data="scheduleData"
            />


        </div>
</template>

<style scoped>
</style>