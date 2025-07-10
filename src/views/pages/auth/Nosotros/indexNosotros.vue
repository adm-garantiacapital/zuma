<template>
  <div class="bg-surface-0 dark:bg-surface-900">
    <div id="home" class="landing-wrapper">
      <TopbarWidget />
      <section class="pt-0 pb-10 bg-gradient-to-br from-[#EDEAE4] to-[#F5F2EC]">

        <div class="max-w-7xl mx-auto lg:px-20 grid grid-cols-12 gap-10">
          <div class="col-span-4 py-20">
            <img src="/imagenes/landing/nosotros.svg" alt="Imagen nosotros" class="w-full" />
          </div>
          <div class="col-span-8 bg-[url(/imagenes/landing/cuadrado-girado.svg)] bg-cover bg-center py-20">
            <h1 class="pt-4 px-20 text-center text-white font-normal font-noto">Nuestro <b>propósito</b> es <b class="text-[#FF4929]">democratizar</b> el acceso a instrumentos de <b>inversión</b></h1>
          </div>
        </div>

        <div class="bg-white">
          <div class="max-w-5xl mx-auto px-4 lg:px-20">
            <p class="mb-0 py-10 text-center text-[#171717] text-lg leading-relaxed">Buscamos ofrecer una <b>diversidad</b> de herramientas de <b>inversión</b> que estén al alcance del común de los bolsillos. En las sociedades donde operamos, la mayoría de las personas <b>aún no rentabilizan</b> adecuadamente sus excedentes. En muchos casos por desconocimiento o temor. Las alternativas de inversión disponibles en el mercado están orientadas a personas de alto patrimonio. Aquellos que cuentan con pequeños excedentes, <b>no son tomados en cuenta</b>. Es así que nace <img src="/imagenes/landing/logo-zuma.svg" alt="Logo zuma" class="w-12 inline-block" />, una plataforma creada para <b>conectar, educar y crear riqueza,</b> dirigida para aquellos que recién se inician en el mundo de las inversiones o que buscan algo diferente</p>
          </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 lg:px-20">
          <div class="text-center py-10">
            <h2 class="inline-block text-[#171717] me-2 my-0 font-noto">Invertir no solo es para unos pocos.</h2>
            <h1 class="inline-block text-[#6790FF] my-0 font-noto">Es para ti.</h1>
            <p class="text-center text-[#171717] text-lg leading-relaxed">En <img src="/imagenes/landing/logo-zuma.svg" alt="Logo zuma" class="w-12 inline-block" /> construimos una comunidad de inversionistas. Oportunidades claras, sin letra pequeña.</p>
          </div>

          <div class="grid grid-cols-12 gap-[3rem]">
            <div class="col-span-12 md:col-span-6 relative">
              <div class="bg-[#171717] rounded-[30px] py-1 px-12 text-white absolute top-3 -left-8">
                <h3 class="m-0 text-white font-normal text-center">Misión</h3>
              </div>
              <div class="bg-[#FF4929] rounded-[70px] py-[5.31rem] px-2 lg:px-10">
                <h3 class="m-0 text-[#171717] font-normal text-center font-noto">Brindar el acceso a alternativas de forma <b>ágil, fácil y confiable</b>.</h3>
              </div>
            </div>
            <div class="col-span-12 md:col-span-6 relative">
              <div class="bg-[#171717] rounded-[30px] py-1 px-12 text-white absolute top-3 -left-8">
                <h3 class="m-0 text-white font-normal text-center">Visión</h3>
              </div>
              <div class="bg-[#FF4929] rounded-[70px] py-16 px-2 lg:px-10">
                <h3 class="m-0 text-[#171717] font-normal text-center font-noto">Convertirnos en el Marketplace <b>líder</b> de <b>inversiones</b> en Latinoamérica.</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterWidget />
    </div>
  </div>
</template>

<script setup>
import TopbarWidget from '@/components/landing/TopbarWidget.vue'
import FooterWidget from '@/components/landing/FooterWidget.vue'
</script>