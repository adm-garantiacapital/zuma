<template>
  <section class="text-center bg-white">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 py-4 gap-10 px-4 max-w-6xl mx-auto">

      <!-- Item 1 -->
      <div
        v-animateonscroll="{ enterClass: 'animate-enter fade-in-10 slide-in-from-t-20 animate-duration-1000' }"
        class="flex flex-col items-center px-4 py-6"
      >
        <div class="flex items-baseline gap-1">
          <span class="text-4xl font-extrabold text-[#FF4929]">+</span>
          <p class="text-3xl font-extrabold text-[#171717]">$160M</p>
        </div>
        <p class="mt-2 text-lg text-[#171717] font-semibold">Prestados</p>
      </div>

      <!-- Item 2 -->
      <div
        v-animateonscroll="{ enterClass: 'animate-enter fade-in-10 slide-in-from-t-20 animate-duration-1000' }"
        class="flex flex-col items-center px-4 py-6"
      >
        <div class="flex items-baseline gap-1">
          <span class="text-4xl font-extrabold text-[#FF4929]">+</span>
          <p class="text-3xl font-extrabold text-[#171717]">1300</p>
        </div>
        <p class="mt-2 text-lg text-[#171717] font-semibold">Clientes atendidos</p>
      </div>

      <!-- Item 3 -->
      <div
        v-animateonscroll="{ enterClass: 'animate-enter fade-in-10 slide-in-from-t-20 animate-duration-1000' }"
        class="flex flex-col items-center px-4 py-6"
      >
        <div class="flex items-baseline gap-1">
          <span class="text-4xl font-extrabold text-[#FF4929]">+</span>
          <p class="text-3xl font-extrabold text-[#171717]">15K</p>
        </div>
        <p class="mt-2 text-lg text-[#171717] font-semibold">Facturas descontadas</p>
      </div>

      <!-- Item 4 -->
      <div
        v-animateonscroll="{ enterClass: 'animate-enter fade-in-10 slide-in-from-t-20 animate-duration-1000' }"
        class="flex flex-col items-center px-4 py-6"
      >
        <div class="flex items-baseline gap-1">
          <span class="text-4xl font-extrabold text-[#FF4929]">+</span>
          <p class="text-3xl font-extrabold text-[#171717]">$110M</p>
        </div>
        <p class="mt-2 text-lg text-[#171717] font-semibold">En hipotecas</p>
      </div>

    </div>
  </section>
</template>