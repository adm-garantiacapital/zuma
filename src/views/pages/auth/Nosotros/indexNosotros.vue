<template>

  <div id="home" class="landing-wrapper bg-[#edeae4]">
    <TopbarWidget />
    <section class="pt-0 pb-10">

      <div class="max-w-7xl mx-auto lg:px-20 grid grid-cols-12 gap-10">
        <div class="col-span-4 py-20">
          <img src="/imagenes/landing/nosotros.svg" alt="Imagen nosotros" class="w-full" />
        </div>
        <div class="col-span-8 bg-[url(/imagenes/landing/cuadrado-girado.svg)] bg-cover bg-center py-20">
          <h1 class="pt-4 px-20 text-center text-white font-normal font-noto">Nuestro <b>propósito</b> es <b
              class="text-[#FF4929]">democratizar</b> el acceso a instrumentos de <b>inversión</b></h1>
        </div>
      </div>

      <div class="bg-white">
        <div class="max-w-5xl mx-auto px-4 lg:px-20">
          <p class="mb-0 py-10 text-center text-[#171717] text-lg leading-relaxed">Buscamos ofrecer una
            <b>diversidad</b> de herramientas de <b>inversión</b> que estén al alcance del común de los bolsillos. En
            las sociedades donde operamos, la mayoría de las personas <b>aún no rentabilizan</b> adecuadamente sus
            excedentes. En muchos casos por desconocimiento o temor. Las alternativas de inversión disponibles en el
            mercado están orientadas a personas de alto patrimonio. Aquellos que cuentan con pequeños excedentes,
            <b>no son tomados en cuenta</b>. Es así que nace <img src="/imagenes/landing/logo-zuma.svg" alt="Logo zuma"
              class="w-12 inline-block" />, una plataforma creada para <b>conectar, educar y crear
              riqueza,</b> dirigida para aquellos que recién se inician en el mundo de las inversiones o que buscan
            algo diferente
          </p>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 lg:px-20">
        <div class="text-center py-10">
          <h2 class="inline-block text-[#171717] me-2 my-0 font-noto">Invertir no solo es para unos pocos.</h2>
          <h1 class="inline-block text-[#6790FF] my-0 font-noto">Es para ti.</h1>
          <p class="text-center text-[#171717] text-lg leading-relaxed">En <img src="/imagenes/landing/logo-zuma.svg"
              alt="Logo zuma" class="w-12 inline-block" /> construimos una comunidad de inversionistas.
            <b>Oportunidades
              claras, sin letra pequeña.</b>
          </p>
        </div>

        <div class="grid grid-cols-12 gap-[3rem]">
          <div class="col-span-12 md:col-span-6 relative">
            <div class="bg-[#171717] rounded-[30px] py-1 px-10 text-white absolute top-3 -left-8">
              <h3 class="m-0 text-white font-normal text-center">Misión</h3>
            </div>
            <div class="bg-[#FF4929] rounded-[70px] py-10 px-2 lg:px-10">
              <h3 class="m-0 text-[#171717] font-normal text-center font-noto">Brindar el acceso<br>a alternativas
                de<br>
                forma <b>ágil, fácil y<br> confiable</b>.</h3>
            </div>
          </div>
          <div class="col-span-12 md:col-span-6 relative">
            <div class="bg-[#171717] rounded-[30px] py-1 px-10 text-white absolute top-3 -left-8">
              <h3 class="m-0 text-white font-normal text-center">Visión</h3>
            </div>
            <div class="bg-[#FF4929] rounded-[70px] py-10 px-2 lg:px-10">
              <h3 class="m-0 text-[#171717] font-normal text-center font-noto">Convertirnos en el<br> Marketplace
                <b>líder</b> de<br> <b>inversiones</b> alternativas<br> en Latinoamérica.
              </h3>
            </div>
          </div>
        </div>
      </div>
      <div class="max-w-[91rem] mx-auto px-4 lg:px-20">
        <div class="bg-[url(/imagenes/landing/logo-zuma-blanco-m.svg)] bg-center bg-repeat-x w-full h-[100px]"
          style="background-size: 30px;">
        </div>
      </div>
      <div class="max-w-7xl mx-auto px-4 lg:px-20">
        <div class="grid grid-cols-12 gap-0 max-w-6xl mx-auto">
          <div class="col-span-12 md:col-span-6 px-5 mb-10">



            <div class="bg-white rounded-xl p-10">
              <label class="block text-sm font-medium mb-1 text-[#171717]">Nombre y Apellido</label>
              <div class="rounded-xl mb-5">
                <input ref="textInput" type="text" @change="pruebaZuma" placeholder="Ingresa tu nombre completo"
                  class="w-full h-full py-3 px-5 rounded-xl text-[#171717] bg-gray-100 border border-gray-300" />
              </div>
              <label class="block text-sm font-medium mb-1 text-[#171717]">Teléfono</label>
              <div class="rounded-xl mb-5">
                <input ref="textInput" type="text" @change="pruebaZuma" placeholder="Ej. +51 999 888 777"
                  class="w-full h-full py-3 px-5 rounded-xl text-[#171717] bg-gray-100 border border-gray-300" />
              </div>
              <label class="block text-sm font-medium mb-1 text-[#171717]">Correo electrónico</label>
              <div class="rounded-xl mb-5">
                <input ref="textInput" type="text" @change="pruebaZuma" placeholder="tu@email.com"
                  class="w-full h-full py-3 px-5 rounded-xl text-[#171717] bg-gray-100 border border-gray-300" />
              </div>
              <label class="block text-sm font-medium mb-1 text-[#171717]">Producto de Interés</label>
              <div class="rounded-xl mb-5">
                <input ref="textInput" type="text" @change="pruebaZuma" placeholder="Selecciona un producto"
                  class="w-full h-full py-3 px-5 rounded-xl text-[#171717] bg-gray-100 border border-gray-300" />
              </div>
              <label class="block text-sm font-medium mb-1 text-[#171717]">Mensaje</label>
              <div class="rounded-xl mb-5">
                <textarea ref="textInput" type="text" @change="pruebaZuma" placeholder="Cuéntanos cómo podemos ayudarte"
                  class="w-full h-full py-3 px-5 rounded-xl text-[#171717] bg-gray-100 border border-gray-300" />
              </div>

              <label class="inline-flex items-center space-x-2 cursor-pointer">
                <input type="checkbox"
                  class="accent-[#6790FF] w-5 h-5 rounded border-gray-300 focus:ring-2 focus:ring-[#6790FF]" />
                <span class="text-[#171717] text-base text-xs leading-none">Autorizo el uso de mis datos personales para
                  fines
                  comerciales
                  y de marketing, de acuerdo con la política de privacidad de Zuma</span>
              </label>

              <Button label="Enviar Mensaje" severity="warn" rounded
                class="!border-none w-full !px-5 !py-2 !mt-7 !rounded-xl !bg-[#171717] !text-white hover:!bg-[#6790FF] transition-all duration-300" />

            </div>
          </div>
          <div class="col-span-12 md:col-span-6 px-5 mb-10">

            <div class="py-[10rem]">
              <h1 class="m-0 text-[#171717] font-normal text-center font-noto text-medium text-6xl">¿Requieres
                asesoría?</h1>
              <img src="/imagenes/landing/asesoria.svg" alt="Logo zuma" class="w-3/4 ps-4 mt-6 relative mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <FooterWidget />
  </div>

</template>

<script setup>
import FooterWidget from '@/components/landing/FooterWidget.vue';
import TopbarWidget from '@/components/landing/TopbarWidget.vue';
</script>