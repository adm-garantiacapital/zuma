<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <div
    class="py-4 px-6 md:px-12 lg:px-20 flex items-center justify-between bg-[#6790FF] rounded-b-2xl shadow-lg relative lg:static">

    <!-- Logo -->
    <RouterLink to="/" class="flex items-center">
      <img src="/imagenes/landing/logo-zuma.svg" alt="Logo Zuma" class="w-28" />
    </RouterLink>

    <!-- Botón hamburguesa solo en móvil -->
    <Button class="lg:!hidden" text severity="secondary" rounded v-styleclass="{
      selector: '@next',
      enterFromClass: 'hidden',
      enterActiveClass: 'animate-scalein',
      leaveToClass: 'hidden',
      leaveActiveClass: 'animate-fadeout',
      hideOnOutsideClick: true
    }">
      <i class="pi pi-bars text-white text-2xl"></i>
    </Button>

    <!-- Menú -->
    <div
      class="absolute lg:static w-full top-full left-0 lg:w-auto lg:flex hidden flex-col lg:flex-row bg-white lg:bg-transparent shadow-md lg:shadow-none rounded-xl lg:rounded-none z-30 px-6 lg:px-0 backdrop-blur-md">
      <div class="ml-auto flex flex-col lg:flex-row items-center gap-4 lg:gap-8 w-full lg:w-auto py-4 lg:py-0">

        <!-- Enlaces -->
        <ul class="flex flex-col lg:flex-row items-center gap-4 lg:gap-8 text-center">
          <li>
            <RouterLink to="/nosotros"
              class="text-[#171717] font-semibold text-lg hover:text-[#ffffff] transition duration-300">
              Nosotros
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/productos"
              class="text-[#171717] font-semibold text-lg hover:text-[#ffffff] transition duration-300">
              Productos
            </RouterLink>
          </li>
          <!--
          <li>
            <RouterLink to="/inversiones"
              class="text-[#171717] font-semibold text-lg hover:text-[#ffffff] transition duration-300">
              Inversiones
            </RouterLink>
          </li>
          -->
          <li>
            <RouterLink to="/prestamos"
              class="text-[#171717] font-semibold text-lg hover:text-[#ffffff] transition duration-300">
              Préstamos
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/contactanos"
              class="text-[#171717] font-semibold text-lg hover:text-[#ffffff] transition duration-300">
              Contáctanos
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/blog"
              class="text-[#171717] font-semibold text-lg hover:text-[#ffffff] transition duration-300">
              Blog
            </RouterLink>
          </li>
        </ul>

        <!-- Botones -->
        <div class="flex flex-col lg:flex-row gap-3 w-full lg:w-auto mt-4 lg:mt-0 border-t lg:border-0 pt-4 lg:pt-0">
          <RouterLink to="/login" class="w-full lg:w-auto">
            <Button label="Iniciar Sesión" text rounded severity="contrast" class="hover:bg-white hover:!text-[#6790FF] transition-all duration-300 w-full" />
          </RouterLink>
          <RouterLink to="/registrarte" class="w-full lg:w-auto" >
            <Button label="Registrarme" severity="warn" rounded  class="bg-white text-[#6790FF] hover:bg-[#ffffffcc] transition-all duration-300 w-full" />
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
