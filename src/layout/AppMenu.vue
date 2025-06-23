<script setup>
import { ref } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import AppMenuItem from './AppMenuItem.vue';
const { toggleMenu } = useLayout();

const model = ref([
    {
        items: [
            { label: 'Mi billetera', icon: 'pi pi-wallet', to: '/' }
        ]
    },
    {
        items: [
            { label: 'Buscar hipotecas', icon: 'pi pi-search', to: '/uikit/table' }
        ]
    },
    {
        items: [
            { label: 'Online', icon: 'pi pi-globe', to: '/uikit/input' }
        ]
    },
    {
        items: [
            { label: 'Mi dashboard', icon: 'pi pi-chart-line', to: '/uikit/formlayout' }
        ]
    },
    {
        items: [
            {
                label: 'Información bancaria',
                icon: 'pi pi-bank',
                items: [
                    {
                        label: 'Cuentas',
                        icon: 'pi pi-credit-card',
                        to: '/auth/login'
                    },
                    {
                        label: 'Estados de cuenta',
                        icon: 'pi pi-file',
                        to: '/auth/error'
                    }
                ]
            }
        ]
    }
]);
</script>
<template>
    <ul class="layout-menu">
        <br>
        <div class="layout-topbar-logo-container">
            <router-link to="/" class="layout-topbar-logo">
                <svg xmlns="http://www.w3.org/2000/svg" width="115" height="32" viewBox="0 0 141 32" fill="none">
                    <g clip-path="url(#clip0_2984_14683)">
                        <path
                            d="M49.7217 19.0546C49.7217 22.6972 47.1846 26.3682 42.3372 26.3682C37.4898 26.3682 34.9527 22.683 34.9527 19.0546V1.05396H29.2266V19.3947C29.2266 22.8956 30.5447 26.0422 32.9542 28.2533C35.3213 30.4502 38.6663 31.655 42.3372 31.655C46.0224 31.655 49.3532 30.4502 51.7202 28.2533C54.1156 26.028 55.4479 22.8815 55.4479 19.3947V1.05396H49.7217V19.0546Z"
                            fill="#101010" />
                        <path
                            d="M25.9237 5.53285V1.05396H0.992159V6.11397H18.2699L0 26.3257V30.9179H26.9159V25.7729H7.6538L25.9237 5.53285Z"
                            fill="#101010" />
                        <path
                            d="M108.741 28.0548C107.012 28.0548 105.623 26.6658 105.623 24.9366V12.8464C105.623 5.47611 100.903 0.331055 94.142 0.331055C90.1734 0.331055 86.4599 2.17364 84.3197 5.16429C82.222 2.13111 79.288 0.331055 76.0564 0.331055C69.9617 0.331055 67.6372 5.16429 67.6372 5.16429V1.05391H57.9141V3.917H58.7787C60.5079 3.917 61.8969 5.30602 61.8969 7.03522V30.9179H71.62V28.0548H70.7554C69.0262 28.0548 67.6372 26.9067 67.6372 25.1917V12.7472C67.6372 8.77858 70.2735 5.64619 74.6532 5.64619C78.1683 5.64619 80.8896 8.50928 80.8896 12.6055V30.9179H90.6128V28.0548H89.7482C88.019 28.0548 86.63 26.6658 86.63 24.9366V12.7472C86.63 8.77858 89.2521 5.64619 93.6318 5.64619C97.2177 5.64619 99.8966 8.62267 99.8966 12.7472V30.9179H109.606V28.0548H108.741Z"
                            fill="#101010" />
                        <path
                            d="M135.274 1.05391V5.16429C135.274 5.16429 130.923 0.331055 124.446 0.331055C115.771 0.331055 108.713 7.262 108.713 15.9363C108.713 15.9646 108.713 15.9788 108.713 16.0072C108.713 16.0355 108.713 16.0497 108.713 16.078C108.713 24.7523 115.771 31.6833 124.446 31.6833C130.923 31.6833 135.274 26.8501 135.274 26.8501V30.9604H141.001V15.993V1.05391H135.274ZM135.274 16.0639C135.274 21.8893 130.54 26.6233 124.715 26.6233C118.89 26.6233 114.156 21.8893 114.156 16.0639C114.156 16.0355 114.156 16.0213 114.156 15.993C114.156 15.9646 114.156 15.9505 114.156 15.9221C114.156 10.0967 118.89 5.36272 124.715 5.36272C130.54 5.36272 135.274 10.0967 135.274 15.9221C135.274 15.9505 135.274 15.9646 135.274 15.993C135.26 16.0213 135.274 16.0355 135.274 16.0639Z"
                            fill="#101010" />
                    </g>
                    <defs>
                        <clipPath id="clip0_2984_14683">
                            <rect width="141" height="31.3381" fill="white" transform="translate(0 0.331055)" />
                        </clipPath>
                    </defs>
                </svg>
            </router-link>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 26 22" fill="none"
                @click="toggleMenu" class="menu-toggle-btn">
                <rect x="1.51078" y="1.5267" width="22.7718" height="19.1942" rx="5.31803"
                    transform="rotate(-0.620767 1.51078 1.5267)" stroke="#101010" stroke-width="2" />
                <line x1="11.0977" y1="20.5049" x2="11.0977" y2="1.35933" stroke="#101010" stroke-width="2" />
                <path d="M5.39844 6.86353H7.79163" stroke="#101010" stroke-width="2" stroke-linecap="round" />
                <path d="M5.39844 11.1711H7.79163" stroke="#101010" stroke-width="2" stroke-linecap="round" />
            </svg>
        </div>
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped>
.layout-topbar-logo-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    width: 100%;
}

.menu-toggle-btn {
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
}
</style>