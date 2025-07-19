<script setup>
import { ref, onMounted } from 'vue';
import { auctionService } from '@/services/auctionService.js';
import FormularioCronograma from './FormularioCronograma.vue';
import { paymentScheduleService } from '@/services/paymentScheduleService'
import { investmentService } from '@/services/investmentService.js';

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
const bidAmount = ref('');
const submittingBid = ref(false);

// Dialog para detalles completos
const detailDialog = ref(false);

// Simular múltiples fotos para el carrusel
const getAuctionImages = (auction) => {
    return Array.isArray(auction.foto) ? auction.foto : [auction.foto];
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
    if (
        !bidAmount.value ||
        parseFloat(bidAmount.value) <= parseFloat(selectedAuction.value.monto_actual_mayor)
    ) {
        return;
    }

    try {
        submittingBid.value = true;

        await investmentService.invest({
            auction_id: selectedAuction.value.subasta.id, // Corregido: usar subasta.id
            amount: parseFloat(bidAmount.value)
        });

        bidDialog.value = false;
        await loadAuctions(currentPage.value);

    } catch (error) {
        console.error('Error al invertir:', error.response?.data || error.message);
    } finally {
        submittingBid.value = false;
    }
};

const openScheduleDialog = async (auction) => {
    try {
        console.log('Auction data:', auction);
        console.log('Property investor ID:', auction.property_investor_id);

        if (!auction.property_investor_id) {
            console.error('No se encontró property_investor_id en los datos de la subasta');
            $toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se encontró el identificador de la inversión',
                life: 3000
            });
            return;
        }

        loading.value = true;

        // ✅ Aquí se realiza correctamente la petición
        const response = await paymentScheduleService.getByPropertyInvestor(auction.property_investor_id);

        // ✅ Verifica si response.data contiene un array o un objeto con array
        scheduleData.value = Array.isArray(response.data) ? response.data : response.data.data;

        // Abre el diálogo con los datos listos
        selectedAuction.value = auction;
        scheduleDialog.value = true;

    } catch (error) {
        console.error('Error al abrir el cronograma:', error);
        $toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo abrir el cronograma de pagos',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};

// También asegúrate de que selectedAuction esté definido:
const selectedAuction = ref(null);

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
    <div v-if="auctions.length > 0" class="mb-10 rounded-3xl bg-[#F0F1F9] relative overflow-hidden p-6">
        <ul class="space-y-6">
            <li v-for="auction in auctions" :key="auction.id"
                class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">

                <!-- NUEVO LAYOUT: Grid Principal -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-0">

                    <!-- COLUMNA IZQUIERDA: Imagen y detalles básicos -->
                    <div class="p-6">
                        <!-- Carrusel de imágenes -->
                        <Carousel :value="getAuctionImages(auction)" :numVisible="1" :numScroll="1"
                            :showIndicators="true" :showNavigators="true" class="auction-carousel mb-4">
                            <template #item="carouselSlot">
                                <div class="relative h-48">
                                    <img :src="carouselSlot.data" :alt="auction.nombre"
                                        class="w-full h-full object-cover rounded-lg" />
                                </div>
                            </template>
                        </Carousel>

                        <!-- Título y ubicación -->
                        <div class="mb-4">
                            <h3 class="font-bold text-xl text-gray-800 mb-1">{{ auction.nombre }}</h3>
                            <p class="text-sm text-gray-600 flex items-center gap-1">
                                <i class="pi pi-map-marker text-red-500"></i>
                                {{ auction.distrito }}, {{ auction.provincia }}, {{ auction.departamento }}
                            </p>
                        </div>

                        <!-- Descripción -->
                        <p class="text-gray-700 mb-4 line-clamp-2">{{ auction.descripcion }}</p>

                        <!-- Información financiera compacta -->
                        <div class="grid grid-cols-2 gap-3 mb-4">
                            <!-- Valor estimado -->
                            <div class="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                <p class="text-xs text-blue-600 font-medium uppercase tracking-wide">Valor Estimado</p>
                                <p class="text-lg font-bold text-blue-700">{{ formatCurrency(auction.valor_estimado) }}
                                </p>
                            </div>
                            <!-- TEA -->
                            <div class="bg-purple-50 p-3 rounded-lg border border-purple-200">
                                <p class="text-xs text-purple-600 font-medium uppercase tracking-wide">TEA</p>
                                <p class="text-lg font-bold text-purple-700">{{ auction.tea }}%</p>
                                <p class="text-xs text-purple-600">Anual</p>
                            </div>
                        </div>

                        <!-- TEM y Riesgo -->
                        <div class="grid grid-cols-2 gap-3 mb-4">
                            <!-- TEM -->
                            <div class="bg-orange-50 p-3 rounded-lg border border-orange-200">
                                <p class="text-xs text-orange-600 font-medium uppercase tracking-wide">TEM</p>
                                <p class="text-lg font-bold text-orange-700">{{ auction.tem }}%</p>
                                <p class="text-xs text-orange-600">Mensual</p>
                            </div>
                            <!-- Riesgo -->
                            <div class="bg-green-50 p-3 rounded-lg border border-green-200">
                                <p class="text-xs text-green-600 font-medium uppercase tracking-wide">Riesgo</p>
                                <p class="text-lg font-bold text-green-700">{{ auction.riesgo }}</p>
                            </div>
                        </div>

                        <!-- Botones de acción -->
                        <div class="flex flex-col gap-2">
                            <Button label="Ver Detalles" icon="pi pi-info-circle" class="p-button-outlined w-full"
                                severity="info" @click="openDetailDialog(auction)" />
                            <Button label="Ver Cronograma" icon="pi pi-calendar" severity="secondary"
                                @click="openScheduleDialog(auction)" class="w-full" />
                        </div>
                    </div>

                    <!-- COLUMNA DERECHA: Oferta actual e inversionistas -->
                    <div class="bg-gray-50 p-6 flex flex-col">
                        <!-- Header con tiempo -->
                        <div class="mb-4 text-center">
                            <Tag :value="getTimeRemaining(auction.subasta.tiempo_finalizacion).text"
                                :severity="getTimeRemaining(auction.subasta.tiempo_finalizacion).urgent ? 'danger' : 'success'"
                                icon="pi pi-clock" class="text-sm font-semibold mb-2" />
                            <p class="text-xs text-gray-600">Finaliza: {{ formatDate(auction.subasta.tiempo_finalizacion) }}</p>
                            <p class="text-xs text-gray-500">Estado: <span class="font-medium capitalize">{{ auction.subasta.estado }}</span></p>
                        </div>

                        <!-- Oferta actual destacada -->
                        <div class="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                            <p class="text-sm text-green-600 font-medium uppercase tracking-wide text-center">Oferta
                                Actual</p>
                            <p class="text-2xl font-bold text-green-700 text-center">{{
                                formatCurrency(auction.monto_actual_mayor) }}</p>
                            <p class="text-sm text-green-600 text-center">PEN</p>
                        </div>

                        <!-- Inversionistas -->
                        <div class="flex-1">
                            <h4 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <i class="pi pi-users"></i>
                                Inversionistas ({{ auction.total_inversionistas }})
                            </h4>

                            <!-- Lista de inversionistas -->
                            <div v-if="auction.inversionistas_pujando && auction.inversionistas_pujando.length > 0"
                                class="space-y-2 mb-4">
                                <div v-for="(inversionista, index) in auction.inversionistas_pujando.slice(0, 3)"
                                    :key="index"
                                    class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                                    <div class="flex items-center gap-2">
                                        <div
                                            class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                            {{ index + 1 }}
                                        </div>
                                        <div>
                                            <p class="font-semibold text-sm">{{ inversionista.nombre }}</p>
                                            <p class="text-xs text-gray-500">{{
                                                formatDate(inversionista.fecha_inversion) }}</p>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <p class="font-bold text-green-600 text-sm">{{
                                            formatCurrency(inversionista.monto) }}</p>
                                        <p v-if="index === 0" class="text-xs text-green-500">Mejor oferta</p>
                                    </div>
                                </div>

                                <!-- Mostrar más inversionistas si hay -->
                                <div v-if="auction.inversionistas_pujando.length > 3" class="text-center">
                                    <small class="text-gray-600">
                                        +{{ auction.inversionistas_pujando.length - 3 }} inversionistas más
                                    </small>
                                </div>
                            </div>

                            <!-- Estado vacío -->
                            <div v-else class="text-center py-6">
                                <i class="pi pi-user-plus text-3xl text-gray-400 mb-2"></i>
                                <p class="text-gray-500 text-sm">No hay inversionistas aún</p>
                                <p class="text-gray-400 text-xs">¡Sé el primero en hacer una oferta!</p>
                            </div>
                        </div>

                        <!-- Botón de ofertar -->
                        <div class="mt-auto">
                            <Button label="Ofertar" icon="pi pi-money-bill" class="w-full" severity="contrast"
                                @click="openBidDialog(auction)"
                                :disabled="getTimeRemaining(auction.subasta.tiempo_finalizacion).urgent && getTimeRemaining(auction.subasta.tiempo_finalizacion).text === 'Finalizada'" />
                        </div>
                    </div>
                </div>
            </li>
        </ul>

        <!-- Paginación -->
        <Paginator v-if="totalPages > 1" :rows="perPage" :totalRecords="total" :first="(currentPage - 1) * perPage"
            @page="loadAuctions($event.page + 1)" class="mt-6" />
    </div>

    <!-- Dialog para ofertas -->
    <Dialog v-model:visible="bidDialog" modal header="Hacer una oferta" :style="{ width: '500px' }" :closable="true">
        <template #header>
            <div class="flex items-center gap-2">
                <i class="pi pi-money-bill"></i>
                <span>Hacer una oferta</span>
            </div>
        </template>

        <div v-if="selectedAuction" class="space-y-4">
            <Message severity="info">
                <div class="p-4 rounded-lg">
                    <div class="flex items-center gap-4">
                        <img :src="Array.isArray(selectedAuction.foto) ? selectedAuction.foto[0] : selectedAuction.foto" 
                             :alt="selectedAuction.nombre"
                            class="w-16 h-16 rounded-lg object-cover" />
                        <div>
                            <h4 class="font-semibold">{{ selectedAuction.nombre }}</h4>
                            <p class="text-sm">{{ selectedAuction.distrito }}, {{ selectedAuction.provincia }}</p>
                            <p class="text-lg font-bold">
                                Oferta actual: {{ formatCurrency(selectedAuction.monto_actual_mayor) }}
                            </p>
                        </div>
                    </div>
                </div>
            </Message>

            <div class="field">
                <label for="bidAmount" class="block text-sm font-medium mb-2">
                    Tu oferta (mínimo: {{ formatCurrency(parseFloat(selectedAuction.monto_actual_mayor) + 0.01) }})
                </label>
                <InputNumber id="bidAmount" v-model="bidAmount"
                    :min="parseFloat(selectedAuction.monto_actual_mayor) + 0.01" :step="0.01"
                    placeholder="Ingresa tu oferta" class="w-full" currency="PEN" locale="es-PE"
                    :class="{ 'p-invalid': bidAmount && parseFloat(bidAmount) <= parseFloat(selectedAuction.monto_actual_mayor) }" />
                <small v-if="bidAmount && parseFloat(bidAmount) <= parseFloat(selectedAuction.monto_actual_mayor)"
                    class="p-error">
                    La oferta debe ser mayor a la actual
                </small>
            </div>

            <Message>
                <div class="text-sm">
                    <p class="font-medium mb-1">Información importante:</p>
                    <ul class="text-xs space-y-1 ml-4">
                        <li>• Tu oferta es vinculante</li>
                        <li>• TEA: {{ selectedAuction.tea }}% | TEM: {{ selectedAuction.tem }}%</li>
                        <li>• Tiempo restante: <strong>{{ getTimeRemaining(selectedAuction.subasta.tiempo_finalizacion).text
                                }}</strong>
                        </li>
                        <li>• Hay {{ selectedAuction.total_inversionistas }} inversionistas compitiendo</li>
                        <li>• Recibirás notificaciones de cambios</li>
                        <li>• Cronograma: {{ selectedAuction.tipo_cronograma }}</li>
                        <li>• Riesgo: {{ selectedAuction.riesgo }}</li>
                    </ul>
                </div>
            </Message>
        </div>

        <template #footer>
            <div class="flex gap-2 justify-end">
                <Button label="Cancelar" icon="pi pi-times" severity="secondary" class="p-button-text"
                    @click="bidDialog = false" />
                <Button label="Confirmar oferta" icon="pi pi-check" severity="contrast" rounded @click="submitBid"
                    :loading="submittingBid"
                    :disabled="!bidAmount || parseFloat(bidAmount) <= parseFloat(selectedAuction?.monto_actual_mayor || 0)" />
            </div>
        </template>
    </Dialog>

    <!-- Dialog para detalles -->
    <Dialog v-model:visible="detailDialog" modal header="Detalles de la Propiedad" :style="{ width: '900px' }"
    :closable="true">
    <div v-if="selectedAuction" class="space-y-6">
        <!-- Carrusel de imágenes en el diálogo -->
        <div class="text-center">
            <Carousel :value="getAuctionImages(selectedAuction)" :numVisible="1" :numScroll="1"
                :showIndicators="true" :showNavigators="true" class="auction-carousel">
                <template #item="carouselSlot">
                    <div class="relative h-80">
                        <img :src="carouselSlot.data" :alt="selectedAuction.nombre"
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
                        <div class="flex justify-between">
                            <span class="font-medium">Tipo Cronograma:</span>
                            <span class="capitalize">{{ selectedAuction.tipo_cronograma }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-medium">Riesgo:</span>
                            <Tag :value="selectedAuction.riesgo" severity="success" />
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
                            <span class="font-bold text-green-600">{{
                                formatCurrency(selectedAuction.monto_actual_mayor) }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-medium">Valor Estimado:</span>
                            <span class="font-bold text-blue-600">{{ formatCurrency(selectedAuction.valor_estimado)
                                }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-medium">Valor Requerido:</span>
                            <span class="font-bold text-purple-600">{{ formatCurrency(selectedAuction.valor_requerido)
                                }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-medium">Valor Subasta:</span>
                            <span class="font-bold text-orange-600">{{ formatCurrency(selectedAuction.valor_subasta)
                                }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-medium">TEA:</span>
                            <span class="font-bold text-purple-600">{{ selectedAuction.tea }}%</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-medium">TEM:</span>
                            <span class="font-bold text-orange-600">{{ selectedAuction.tem }}%</span>
                        </div>
                    </div>
                </template>
            </Card>
        </div>

        <!-- Información de Subasta -->
        <Card>
            <template #title>Información de Subasta</template>
            <template #content>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="font-medium">Estado:</span>
                            <Tag :value="selectedAuction.subasta.estado" 
                                 :severity="selectedAuction.subasta.estado === 'activa' ? 'success' : 'secondary'" />
                        </div>
                        <div class="flex justify-between">
                            <span class="font-medium">Monto Inicial:</span>
                            <span class="font-bold">{{ formatCurrency(selectedAuction.subasta.monto_inicial) }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-medium">Día de Subasta:</span>
                            <span>{{ formatDate(selectedAuction.subasta.dia_subasta) }}</span>
                        </div>
                    </div>
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="font-medium">Hora Inicio:</span>
                            <span>{{ selectedAuction.subasta.hora_inicio }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-medium">Hora Fin:</span>
                            <span>{{ selectedAuction.subasta.hora_fin }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-medium">Tiempo Restante:</span>
                            <Tag :value="getTimeRemaining(selectedAuction.subasta.tiempo_finalizacion).text"
                                :severity="getTimeRemaining(selectedAuction.subasta.tiempo_finalizacion).urgent ? 'danger' : 'success'" />
                        </div>
                    </div>
                </div>
            </template>
        </Card>

        <!-- TABLA COMPLETA DE INVERSIONISTAS EN DETALLE -->
        <Card>
            <template #title>
                <div class="flex items-center gap-2">
                    <i class="pi pi-users"></i>
                    Inversionistas Participando ({{ selectedAuction.total_inversionistas }})
                </div>
            </template>
            <template #content>
                <div
                    v-if="selectedAuction.inversionistas_pujando && selectedAuction.inversionistas_pujando.length > 0">
                    <DataTable :value="selectedAuction.inversionistas_pujando" responsiveLayout="scroll"
                        :paginator="selectedAuction.inversionistas_pujando.length > 5" :rows="5"
                        class="p-datatable-sm">
                        <Column field="nombre" header="Inversionista" sortable>
                            <template #body="slotProps">
                                <div class="flex items-center gap-2">
                                    <div
                                        class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        {{ slotProps.data.nombre.charAt(0).toUpperCase() }}
                                    </div>
                                    <span class="font-medium">{{ slotProps.data.nombre }}</span>
                                </div>
                            </template>
                        </Column>
                        <Column field="monto" header="Monto Ofertado" sortable>
                            <template #body="slotProps">
                                <span class="font-bold text-green-600">{{ formatCurrency(slotProps.data.monto)
                                    }}</span>
                            </template>
                        </Column>
                        <Column field="fecha_inversion" header="Fecha de Oferta" sortable>
                            <template #body="slotProps">
                                <span class="text-sm">{{ formatDate(slotProps.data.fecha_inversion) }}</span>
                            </template>
                        </Column>
                        <Column header="Posición">
                            <template #body="slotProps">
                                <Tag :value="`#${slotProps.index + 1}`"
                                    :severity="slotProps.index === 0 ? 'success' : slotProps.index === 1 ? 'warning' : 'secondary'" />
                            </template>
                        </Column>
                    </DataTable>
                </div>
                <div v-else class="text-center py-8">
                    <i class="pi pi-user-plus text-5xl text-gray-400 mb-4"></i>
                    <h5 class="text-lg font-semibold text-gray-600 mb-2">No hay inversionistas aún</h5>
                    <p class="text-gray-400">¡Sé el primero en hacer una oferta en esta subasta!</p>
                </div>
            </template>
        </Card>

        <!-- Descripción completa -->
        <Card>
            <template #title>Descripción</template>
            <template #content>
                <p class="text-gray-700">{{ selectedAuction.descripcion }}</p>
            </template>
        </Card>
    </div>

    <template #footer>
        <div class="flex gap-2 justify-end">
            <Button label="Cerrar" icon="pi pi-times" severity="secondary" class="p-button-text"
                @click="detailDialog = false" />
            <Button label="Hacer Oferta" icon="pi pi-money-bill" severity="contrast" rounded
                @click="detailDialog = false; openBidDialog(selectedAuction)"
                :disabled="getTimeRemaining(selectedAuction.subasta.tiempo_finalizacion).urgent && getTimeRemaining(selectedAuction.subasta.tiempo_finalizacion).text === 'Finalizada'" />
        </div>
    </template>
</Dialog>

    <!-- Formulario Cronograma -->
    <FormularioCronograma v-model:visible="scheduleDialog" :data="scheduleData" />
    
    <!-- Estado vacío -->
    <div v-if="auctions.length === 0 && !loading"
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

</template>