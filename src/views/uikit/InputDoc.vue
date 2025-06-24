<template>
    <Breadcrumb :home="home" :model="items" class="mb-4" />
    <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 xl:col-span-6">
            <BestSellingWidget />

        </div>
        <div class="col-span-12 xl:col-span-6">
            <RecentSalesWidget />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import BestSellingWidget from '@/components/dashboard/BestSellingWidget.vue';
import RecentSalesWidget from '@/components/dashboard/RecentSalesWidget.vue';
const home = ref({ icon: 'pi pi-home' });
const items = ref([{ label: 'Subasta hipotecas' }, { label: 'Online' }]);
</script>
