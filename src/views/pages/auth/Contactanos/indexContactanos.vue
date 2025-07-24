<template>
  <div id="home" class="landing-wrapper bg-[#edeae4]">
    <TopbarWidget />

    <h1 class="pt-4 px-20 text-center text-[#171717] font-normal font-noto"><b>Contáctanos </b></h1>

    <h3 class="font-medium text-xl text-center max-w-xl mx-auto">Completa el formulario y uno de nuestros asesores se
      pondrá en contacto contigo.</h3>

    <div class="max-w-7xl mx-auto px-4 mt-12 lg:px-20">
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
        <div class="col-span-12 md:col-span-6 px-5 mb-10 relative">
          <div class="bg-white rounded-xl p-10">
            <h3 class="font-medium text-xl text-center max-w-xl mx-auto m-0">Recibe atención personalizada</h3>
            <div class="bg-[#23c347] rounded-xl py-3 px-5 text-center mt-6 relative">
              <h4 class="m-0 text-white font-normal text-center text-medium text-2xl leading-none ps-16">
                <i class="pi pi-whatsapp !text-5xl absolute left-16 top-3"></i>
                Chatea con<br> nosotros
              </h4>
            </div>
          </div>

          <div class="p-2 text-center">
            <img src="/imagenes/landing/ayuda.svg" alt="Logo zuma"
              class="h-[100px] ps-4 mt-6 relative mx-auto inline-block" />
            <div class="relative inline-block">
              <h4 class="m-0 ps-5 text-[#171717] font-normal text-center text-medium text-3xl relative top-8">Estamos
                aquí<br>para
                <b class="text-[#6790FF]">ayudarte.</b>
              </h4>
            </div>
          </div>

          <div class="bg-white rounded-xl p-10 mt-8">
            <h3 class="font-medium text-xl text-center max-w-xl mx-auto m-0 leading-none">¡Sé el primero en enterarte de
              las
              subastas!</h3>
            <p class="font-normal text-sm text-center max-w-xl mx-auto m-0 leading-none pt-3">Déjanos tu correo
              electrónico y
              recibe
              notificaciones sobre <b>nuevas oportunidades de inversión</b></p>
            <div class="rounded-xl mb-5 mt-[15px]">
              <input ref="textInput" type="text" @change="pruebaZuma" placeholder="Selecciona un producto"
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
          </div>


        </div>
      </div>
    </div>


    <FooterWidget />
  </div>
</template>

<script setup>
import FooterWidget from '@/components/landing/FooterWidget.vue';
import TopbarWidget from '@/components/landing/TopbarWidget.vue';
</script>