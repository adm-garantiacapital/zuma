<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
    <div
        class="py-6 px-10 md:px-15 lg:px-20 flex items-center justify-between relative lg:static bg-[#6790FF] rounded-b-xl drop-shadow-lg">

        <RouterLink to="/" class="flex items-center">
            <img src="/imagenes/landing/logo-zuma.svg" alt="Logo Zuma" class="inline-block w-28" />
        </RouterLink>

        <Button class="lg:!hidden" text severity="secondary" rounded v-styleclass="{
            selector: '@next',
            enterFromClass: 'hidden',
            enterActiveClass: 'animate-scalein',
            leaveToClass: 'hidden',
            leaveActiveClass: 'animate-fadeout',
            hideOnOutsideClick: true
        }">
            <i class="pi pi-bars !text-2xl"></i>
        </Button>

        <div
            class="items-center grow hidden lg:flex absolute lg:static w-full left-0 top-full px-12 lg:px-0 z-20 rounded-border">
            <div class="ml-auto flex items-center gap-8">
                <!-- Menú -->
                <ul
                    class="list-none p-0 m-0 flex lg:items-center select-none flex-col lg:flex-row cursor-pointer gap-8">

                    <li>
                        <RouterLink to="/nosotros" class="px-0 py-4 text-[#171717] font-medium text-xl">
                            <span>Nosotros</span>
                        </RouterLink>
                    </li>

                    <li>
                        <RouterLink to="/productos" class="px-0 py-4 text-[#171717] font-medium text-xl">
                            <span>Productos</span>
                        </RouterLink>
                    </li>

                    <li>
                        <RouterLink to="/contactanos" class="px-0 py-4 text-[#171717] font-medium text-xl">
                            <span>Contáctanos</span>
                        </RouterLink>
                    </li>

                    <li>
                        <RouterLink to="/blog" class="px-0 py-4 text-[#171717] font-medium text-xl">
                            <span>Blog</span>
                        </RouterLink>
                    </li>
                </ul>

                <div class="flex border-t lg:border-t-0 border-surface py-4 lg:py-0 mt-4 lg:mt-0 gap-2">
                    <RouterLink to="/login">
                        <Button label="Iniciar Sesión" severity="contrast" variant="text" rounded
                            class="bg-white !text-[#171717]" />
                    </RouterLink>

                    <RouterLink to="/registrarte">
                        <Button label="Regístrate" severity="secondary" rounded class="bg-white !text-[#171717]" />
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>
