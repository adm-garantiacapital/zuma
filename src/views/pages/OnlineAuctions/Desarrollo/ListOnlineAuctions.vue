<template>
    <br>
    <Breadcrumb :home="home" :model="items" class="mb-4" />
    <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 xl:col-span-6">
            <!-- Componente de subastas -->
            <BestSellingWidget @auction-selected="handleAuctionSelected" />
        </div>
        <div class="col-span-12 xl:col-span-6">
            <!-- Componente de participantes -->
            <RecentSalesWidget 
                :selected-property-id="selectedPropertyId" 
                :selected-auction="selectedAuction" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import BestSellingWidget from '@/components/dashboard/BestSellingWidget.vue';
import RecentSalesWidget from '@/components/dashboard/RecentSalesWidget.vue';

const home = ref({ icon: 'pi pi-home' });
const items = ref([{ label: 'Subasta hipotecas' }, { label: 'Online' }]);

// Estado para comunicación entre componentes
const selectedPropertyId = ref(null);
const selectedAuction = ref(null);

// Manejar selección de subasta
const handleAuctionSelected = (auction) => {
    selectedPropertyId.value = auction.property_id;
    selectedAuction.value = auction;
    console.log('Subasta seleccionada:', auction);
};
</script>