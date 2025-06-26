<script setup>
import { ref, onMounted } from 'vue';
import { auctionService } from '@/services/auctionService.js';

const menu = ref(null);
const auctions = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const perPage = ref(15);
const total = ref(0);

// Dialog para ofertas
const bidDialog = ref(false);
const selectedAuction = ref(null);
const bidAmount = ref('');
const submittingBid = ref(false);

const items = ref([
    { label: 'Agregar Nueva', icon: 'pi pi-fw pi-plus', command: () => addNewAuction() },
    { label: 'Actualizar', icon: 'pi pi-fw pi-refresh', command: () => loadAuctions() }
]);

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

const addNewAuction = () => {
    console.log('Add new auction');
};

const openBidDialog = (auction) => {
    selectedAuction.value = auction;
    bidAmount.value = '';
    bidDialog.value = true;
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

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN'
    }).format(amount);
};

onMounted(() => {
    loadAuctions();
});
</script>

<template>
    <div class="card">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
            <div class="font-semibold text-xl flex items-center gap-2">
                Subastas
            </div>
            <div>            </div>
        </div>

        <ul class="">
            <li v-for="auction in auctions" :key="auction.id">
                <Carousel :value="getAuctionImages(auction)" :numVisible="1" :numScroll="1" :showIndicators="true"
                    :showNavigators="true">
                    <template #item="carouselSlot">
                        <div class="relative">
                            <img :src="carouselSlot.data" :alt="auction.nombre"/>
                        </div>
                    </template>
                </Carousel>
                <div class="flex gap-4">

                    <!-- Información -->
                    <div class="flex-grow">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="font-semibold text-lg">{{ auction.nombre }}</h3>
                            <Tag :value="getTimeRemaining(auction.finalizacion).text"
                                :severity="getTimeRemaining(auction.finalizacion).urgent ? 'danger' : 'success'"
                                icon="pi pi-clock" />
                        </div>

                        <p class="text-sm mb-2 flex items-center gap-1">
                            <i class="pi pi-map-marker"></i>
                            {{ auction.distrito }}
                        </p>

                        <p class="text-sm mb-3">{{ auction.descripcion }}</p>

                        <div class="flex justify-between items-center">
                            <div class="text-lg font-bold text-green-600">
                                {{ formatCurrency(auction.monto) }}
                            </div>

                            <div class="flex gap-2">
                                <Button label="Ofertar" icon="pi pi-money-bill" class="p-button-sm" severity="success"
                                    @click="openBidDialog(auction)"
                                    :disabled="getTimeRemaining(auction.finalizacion).urgent && getTimeRemaining(auction.finalizacion).text === 'Finalizada'" />
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        </ul>

        <!-- Paginación -->
        <Paginator v-if="totalPages > 1" :rows="perPage" :totalRecords="total" :first="(currentPage - 1) * perPage"
            @page="loadAuctions($event.page + 1)" class="mt-6" />

        <!-- Dialog para ofertas -->
        <Dialog v-model:visible="bidDialog" modal header="Hacer una oferta" :style="{ width: '450px' }"
            :closable="true">
            <template #header>
                <div class="flex items-center gap-2">
                    <i class="pi pi-money-bill"></i>
                    <span>Hacer una oferta</span>
                </div>
            </template>

            <div v-if="selectedAuction" class="space-y-4">
                <!-- Info de la propiedad -->
                <Message severity="warn">
                    <div class="p-4 rounded-lg">
                        <div class="flex items-center gap-4">
                            <img :src="selectedAuction.foto" :alt="selectedAuction.nombre"
                                class="w-16 h-16 rounded-lg object-cover" />
                            <div>
                                <h4 class="font-semibold">{{ selectedAuction.nombre }}</h4>
                                <p class="text-sm">{{ selectedAuction.distrito }}</p>
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
                    <InputNumber id="bidAmount" v-model="bidAmount" :min="parseFloat(selectedAuction.monto) + 0.01"
                        :step="0.01" placeholder="Ingresa tu oferta" class="w-full" currency="PEN" locale="es-PE"
                        :class="{ 'p-invalid': bidAmount && parseFloat(bidAmount) <= parseFloat(selectedAuction.monto) }" />
                    <small v-if="bidAmount && parseFloat(bidAmount) <= parseFloat(selectedAuction.monto)"
                        class="p-error">
                        La oferta debe ser mayor a la actual
                    </small>
                </div>

                <!-- Información adicional -->
                <Message>
                    <div class="text-sm">
                        <p class="font-medium mb-1">Información importante:</p>
                        <ul class="text-xs space-y-1 ml-4">
                            <li>• Tu oferta es vinculante</li>
                            <li>• Tiempo restante: <strong>{{ getTimeRemaining(selectedAuction.finalizacion).text
                                    }}</strong></li>
                            <li>• Recibirás notificaciones de cambios</li>
                        </ul>
                    </div>
                </Message>
            </div>

            <template #footer>
                <div class="flex gap-2 justify-end">
                    <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="bidDialog = false" />
                    <Button label="Confirmar oferta" icon="pi pi-check" severity="success" @click="submitBid"
                        :loading="submittingBid"
                        :disabled="!bidAmount || parseFloat(bidAmount) <= parseFloat(selectedAuction?.monto || 0)" />
                </div>
            </template>
        </Dialog>
    </div>
</template>