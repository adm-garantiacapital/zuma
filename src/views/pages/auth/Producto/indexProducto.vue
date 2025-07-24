<template>
  <div id="home" class="landing-wrapper bg-[#edeae4]">
    <TopbarWidget />

    <h1 class="pt-4 px-20 text-center text-[#171717] font-normal font-noto">Nuestros <b>productos</b></h1>

    <h3 class="font-medium text-xl text-center max-w-2xl mx-auto">Descubre nuestras <b
        class="text-[#FF4929] font-bold text-2xl">alternativas de
        inversión</b> diseñadas para diferentes perfiles y horizonte de inversión</h3>

    <div class="grid grid-cols-12 gap-0 max-w-6xl mx-auto mt-12">
      <div class="col-span-12 md:col-span-4 px-5 mb-10">
        <div class="bg-white rounded-[50px] relative h-[340px] text-center shadow-md">
          <h3 class=" font-medium text-2xl text-[#171717] pt-14 leading-none"><b>Facturas</b></h3>
          <img src="/imagenes/landing/facturas.svg" alt="Imagen principal" class="h-[170px] w-full mt-10 mb-6 px-14" />
          <Button label="Quiero saber más" severity="warn" rounded @click="facturas = true"
            class="!text-lg !px-10 !py-2 !relative !border-none !-bottom-6 !mx-auto !bg-[#6790FF] !text-white hover:!bg-[#6790FF] transition-all duration-300" />
        </div>
      </div>
      <div class="col-span-12 md:col-span-4 px-5 mb-10">
        <div class="bg-white rounded-[50px] relative h-[340px] text-center shadow-md">
          <h3 class=" font-medium text-2xl text-[#171717] pt-10 leading-none">Préstamos con <br><b>Garantía</b></h3>
          <img src="/imagenes/landing/garantia-hipotecaria.svg" alt="Imagen principal"
            class="h-[170px] w-full mt-8 mb-4 px-14" />
          <Button label="Quiero ser el ganador" severity="warn" rounded @click="prestamos = true"
            class="!text-lg !px-10 !py-2 !relative !border-none !-bottom-8 !mx-auto !bg-[#6790FF] !text-white hover:!bg-[#6790FF] transition-all duration-300" />
        </div>
      </div>
      <div class="col-span-12 md:col-span-4 px-5 mb-10">
        <div class="bg-white rounded-[50px] relative h-[340px] text-center shadow-md">
          <h3 class=" font-medium text-2xl text-[#171717] pt-10 leading-none">Depósito<br> a<b> plazo fijo</b></h3>
          <img src="/imagenes/landing/depositos-plazo.svg" alt="Imagen principal"
            class="h-[170px] w-full mt-8 mb-4 px-14" />
          <Button label="Gloria a ti señor" severity="warn" rounded @click="depositos = true"
            class="!text-lg !px-10 !py-2 !relative !border-none !-bottom-8 !mx-auto !bg-[#6790FF] !text-white hover:!bg-[#6790FF] transition-all duration-300" />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-0 max-w-6xl mx-auto mt-16">
      <div class="col-span-12 md:col-span-12 px-5 mb-20">
        <div class="bg-white rounded-[50px] relative text-center shadow-md pt-10">

          <img src="/imagenes/landing/advertencia.svg" alt="Imagen principal" class="h-[100px] w-full mb-2 px-14" />
          <h3 class="font-medium text-2xl mt-0 text-[#171717] leading-none"><b class="text-3xl">Advertencia</b><br>de
            riesgo
          </h3>
          <div class="bg-[#edeae4] rounded-[50px] text-center mt-8 mx-20 p-5">
            <h4 class="m-0 text-xl font-noto leading-none text-[#171717]"><span class="text-sm">Como diría la
                abuela:</span><br> “Nunca pongas todos los huevos en una misma canasta.”
            </h4>
          </div>
          <p class="mt-8 px-10 max-w-4xl mx-auto text-[#171717]">Toda oportunidad de inversión presenta un riesgo.
            Existe la posibilidad que el retorno ofrecido por la oportunidad de inversión, no se cumpla. Inclusive, como
            casi todas las inversiones, es posible, que pierdas el íntegro de tu capital. Por ello, recomendamos que
            diversifiques tus inversiones.</p>
          <p class="mt-8 mb-0 px-10 max-w-4xl mx-auto text-[#171717] text-lg font-medium">Conoce qué tipo de
            inversionista eres</p>
          <Button label="Accede al Quiz – Perfil de Riesgo" severity="warn" rounded
            class="!text-lg !px-10 !py-2 !relative !border-none !-bottom-6 !mx-auto !bg-[#6790FF] !text-white hover:!bg-[#6790FF] transition-all duration-300" />
        </div>
      </div>
    </div>

    <FooterWidget />
  </div>

  <Dialog v-model:visible="facturas" modal class="!bg-white !overflow-hidden !rounded-[50px]"
    :style="{ width: '40rem' }">
    <template #header>
      <div class="inline-flex"></div>
    </template>
    <h1 class="text-[#171717] block m-0 text-center relative -top-3">Facturas</h1>
    <div class="text-center">
      <div class="bg-[#edeae4] rounded-[50px] px-3 inline-block">
        <h5 class="text-[#FF4929] block m-0 text-center font-bold">Invierte desde $25</h5>
      </div>
    </div>
    <p class="text-[#171717] mt-10 px-10">¡Bienvenido al mundo del factoring! Esta alternativa de inversión está
      orientada
      para aquel inversionista que tiene un horizonte de inversión corto. Las rentabilidades anuales van desde un 10% a
      un
      22% anual (TEA). Al invertir en una cuenta por pagar, te conviertes en acreedor indirecto de las empresas más
      grandes
      y prestigiosas de tu país. Invierte desde $25. Easy.
    </p>
    <div class="flex justify-end gap-2">
      <Button label="Quiero saber más" severity="warn" rounded @click="facturas = false"
        class="!text-lg !px-10 !py-2 !my-6 !border-none !mx-auto !bg-[#FF4929] !text-white hover:!bg-[#6790FF] transition-all duration-300" />
    </div>
  </Dialog>

  <Dialog v-model:visible="prestamos" modal class="!bg-white !overflow-hidden !rounded-[50px]"
    :style="{ width: '40rem' }">
    <template #header>
      <div class="inline-flex"></div>
    </template>
    <h1 class="text-[#171717] block m-0 text-center relative -top-3">Préstamos con Garantía</h1>
    <div class="text-center">
      <div class="bg-[#edeae4] rounded-[50px] px-3 inline-block">
        <h5 class="text-[#FF4929] block m-0 text-center font-bold">1 solo ganador</h5>
      </div>
    </div>
    <p class="text-[#171717] mt-10 px-10">Plazos largos y montos altos. Todos los días, empresas o personas requieren de
      capital de forma rápida. Para mala suerte de ellos, el sistema financiero tradicional todavía se presenta lento y
      burocrático en sus procesos de evaluación y aprobación. Por ello en Zuma, recibimos a diario muchas de estas
      solicitudes, las cuales, después de una evaluación y depuración, de considerarlas apropiadas, ponemos a
      disposición
      de nuestra comunidad de inversionistas. Todas las operaciones cuentan con garantías de respaldo. Lamentablemente,
      para cada oportunidad de inversión que se presente, puede a ver un solo inversionista ganador.
    </p>
    <div class="flex justify-end gap-2">
      <Button label="Quiero ser el ganador" severity="warn" rounded @click="prestamos = false"
        class="!text-lg !px-10 !py-2 !my-6 !border-none !mx-auto !bg-[#FF4929] !text-white hover:!bg-[#6790FF] transition-all duration-300" />
    </div>
  </Dialog>

  <Dialog v-model:visible="depositos" modal class="!bg-white !overflow-hidden !rounded-[50px]"
    :style="{ width: '40rem' }">
    <template #header>
      <div class="inline-flex"></div>
    </template>
    <h1 class="text-[#171717] block m-0 text-center relative -top-3">Depósitos a Plazo</h1>
    <div class="text-center">
      <div class="bg-[#edeae4] rounded-[50px] px-3 inline-block">
        <h5 class="text-[#FF4929] block m-0 text-center font-bold">1 solo ganador</h5>
      </div>
    </div>
    <p class="text-[#171717] mt-10 px-10">Esta alternativa la conocen todos y es la favorita de nuestro inversionista
      xxxx. Diversos plazos de inversión para tickets medianos. Pero claro, en Zuma, no te vamos a presentar el banco
      tradicional AAA que te paga 1 – 3% anual. ¡No! Presentamos alternativas del mercado con mayor rendimiento de
      instituciones más pequeñas, pero con cobertura del Seguro de Depósito. Así, si inviertes el monto adecuado, pase
      lo
      que pase, tu capital está garantizado.
    </p>
    <div class="flex justify-end gap-2">
      <Button label="Gloria a ti señor" severity="warn" rounded @click="depositos = false"
        class="!text-lg !px-10 !py-2 !my-6 !border-none !mx-auto !bg-[#FF4929] !text-white hover:!bg-[#6790FF] transition-all duration-300" />
    </div>
  </Dialog>

</template>

<script setup>
import FooterWidget from '@/components/landing/FooterWidget.vue';
import TopbarWidget from '@/components/landing/TopbarWidget.vue';
import { ref } from 'vue';

const facturas = ref(false);
const prestamos = ref(false);
const depositos = ref(false);
</script>