<template>
  <div id="hero" class="flex flex-col items-center px-6 lg:px-20 pb-16 pt-5 space-y-12">
    <div class="max-w-7xl mx-auto px-10 lg:px-20 grid grid-cols-12 gap-10"></div>
    <!-- HERO PRINCIPAL -->
    <div class="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl px-4" data-aos="fade-up"
      data-aos-duration="1000">
      <!-- Texto -->
      <div class="md:w-1/2 mb-10 md:mb-0" data-aos="fade-right" data-aos-delay="200">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-light text-[#171717] font-noto pe-0 md:pe-20">
          <img src="/imagenes/landing/logo-zuma.svg" alt="Logo Zuma" class="inline-block w-48 lg:w-64 mb-5" />,
          <br><b>invierte</b> fácil, <b>gana</b> seguro
        </h1>
        <ul class="mt-10 space-y-3 text-xl text-[#171717]">
          <li class="flex items-center gap-3 font-medium pe-20">
            <!-- <i class="pi pi-check text-xl text-[#171717]"></i> -->
            <span>La única plataforma de <b>crowfactoring</b> que invierte junto a ti en todas las operaciones</span>
          </li>
          <!--<li class="flex items-center gap-3 font-medium">
            <i class="pi pi-check text-xl text-[#171717]"></i>
            <span>Gana seguro</span>
          </li> -->
        </ul>
      </div>

      <!-- Imagen -->
      <div class="md:w-1/2 flex justify-center md:justify-end" data-aos="zoom-in" data-aos-delay="400">
        <div class="bg-white rounded-full p-6 overflow-hidden">
          <img src="/imagenes/landing/principal.svg" alt="Imagen principal"
            class="w-full py-4 px-12 md:py-10 md:px-16" />
        </div>
      </div>
    </div>


    <!-- Línea divisoria -->
    <div class="w-full border-t border-gray-300" data-aos="fade-in" data-aos-delay="600"></div>

    <!-- BOTONES DE INVERSIÓN -->
    <div class="flex flex-col md:flex-row items-center justify-center gap-6 max-w-3xl px-5" data-aos="fade-up"
      data-aos-delay="800">

      <!-- Botón 1 -->
      <a href="https://zuma.com.pe/factoring" target="_blank" rel="noopener noreferrer">
        <div
          class="w-96 h-28 bg-white hover:bg-[#6790FF] hover:text-white transition-all duration-300 rounded-full flex items-center gap-6 shadow-md cursor-pointer px-8 hover:scale-110 group">
          <div
            class="w-24 h-24 rounded-full relative items-center justify-center transition-all duration-300 group-hover:scale-110">
            <img src="/imagenes/landing/circulo.svg" alt="Factoring"
              class="w-14 h-14 absolute top-4 left-5 group-hover:scale-110 group-hover:opacity-0" />
            <img src="/imagenes/landing/circulo-saltando.svg" alt="Factoring"
              class="w-14 h-14 absolute top-4 left-5 opacity-0 group-hover:scale-110 group-hover:opacity-100" />
          </div>
          <span class="text-[#171717] group-hover:text-white text-xl font-semibold leading-tight">
            Invierte en Factoring
          </span>
        </div>
      </a>

      <!-- Botón 2 -->
      <a href="https://zuma.com.pe/hipotecas" target="_blank" rel="noopener noreferrer">
        <div
          class="w-96 h-28 bg-white hover:bg-[#6790FF] hover:text-white transition-all duration-300 rounded-full flex items-center gap-6 shadow-md cursor-pointer px-8 hover:scale-110 group">
          <div
            class="w-24 h-24 rounded-full relative items-center justify-center transition-all duration-300 group-hover:scale-110">
            <img src="/imagenes/landing/triangulo.svg" alt="Factoring"
              class="w-14 h-14 absolute top-4 left-5 group-hover:scale-110 group-hover:opacity-0" />
            <img src="/imagenes/landing/triangulo-saltando.svg" alt="Factoring"
              class="w-14 h-14 absolute top-4 left-5 opacity-0 group-hover:scale-110 group-hover:opacity-100" />
          </div>
          <span class="text-[#171717] group-hover:text-white text-xl font-semibold leading-tight ps-10">
            Invierte en Préstamos Hipotecarios
          </span>
        </div>
      </a>

      <!-- Botón 3 -->
      <a href="https://zuma.com.pe/tasas-fijas" target="_blank" rel="noopener noreferrer">
        <div
          class="w-96 h-28 bg-white hover:bg-[#6790FF] hover:text-white transition-all duration-300 rounded-full flex items-center gap-6 shadow-md cursor-pointer px-8 hover:scale-110 group">
          <div
            class="w-24 h-24 rounded-full relative items-center justify-center transition-all duration-300 group-hover:scale-110">
            <img src="/imagenes/landing/cuadrado.svg" alt="Factoring"
              class="w-14 h-14 absolute top-4 left-5 group-hover:scale-110 group-hover:opacity-0" />
            <img src="/imagenes/landing/cuadrado-saltando.svg" alt="Factoring"
              class="w-14 h-14 absolute top-4 left-5 opacity-0 group-hover:scale-110 group-hover:opacity-100" />
          </div>
          <span class="text-[#171717] group-hover:text-white text-xl font-semibold leading-tight">
            Invierte en<br>Tasas Fijas
          </span>
        </div>
      </a>
    </div>
  </div>
</template>