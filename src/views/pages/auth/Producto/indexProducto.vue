<template>
  <div id="home" class="landing-wrapper bg-[#edeae4]">
    <TopbarWidget />

    <h1 class="pt-4 px-20 text-center text-[#171717] font-normal font-noto">Nuestros <b>productos</b></h1>

    <h3 class="font-medium text-xl text-center max-w-2xl mx-auto">Descubre nuestras <b
        class="text-[#FF4929] font-bold text-2xl">alternativas de
        inversión</b> diseñadas para diferentes perfiles y horizonte de inversión</h3>

    <div class="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto mt-12">
      <div class="w-full md:w-1/3 px-5 mb-10">
        <div class="relative h-[340px]">
          <div class="bg-white rounded-[50px] h-[340px] text-center shadow-md absolute w-full z-0">
            <h3 class="font-medium text-2xl text-[#171717] pt-14 leading-none"><b>Inversiones en Facturas</b></h3>
            <img src="/imagenes/landing/facturas.svg" alt="Imagen principal"
              class="h-[170px] w-full mt-10 mb-6 px-14" />
          </div>
          <div class="absolute -bottom-4 left-0 right-0 z-50 flex justify-center">
            <Button label="Quiero saber más" severity="warn" rounded @click="facturas = true"
              class="!text-lg !px-8 !py-2 !border-none !mx-auto !bg-[#6790FF] !text-white hover:!bg-[#FF4929] transition-all duration-300" />
          </div>
        </div>

      </div>
      <div class="w-full md:w-1/3 px-5 mb-10">
        <div class="relative h-[340px]">
          <div class="bg-white rounded-[50px] h-[340px] text-center shadow-md absolute w-full z-0">
            <h3 class="font-medium text-2xl text-[#171717] pt-10 leading-none">Inversiones en <br>Préstamos con <b>Garantía</b></h3>
            <img src="/imagenes/landing/garantia-hipotecaria.svg" alt="Imagen principal"
              class="h-[170px] w-full mt-8 mb-4 px-14" />
          </div>

          <div class="absolute -bottom-4 left-0 right-0 z-50 flex justify-center">
            <Button label="Quiero ser el ganador" severity="warn" rounded @click="prestamos = true"
              class="!text-lg !px-8 !py-2 !border-none !mx-auto !bg-[#6790FF] !text-white hover:!bg-[#FF4929] transition-all duration-300" />
          </div>
        </div>

      </div>
      

    </div>

    <div class="grid grid-cols-12 gap-0 max-w-6xl mx-auto mt-16">
      <div class="col-span-12 md:col-span-12 px-5 mb-20">
        <div class="bg-white rounded-[50px] relative text-center pt-10">          
          <div class="bg-[#edeae4] rounded-[50px] text-center mt-4 mx-20 p-5 flex justify-center">
            <img src="/imagenes/landing/advertencia.svg" alt="Imagen principal" class="h-[50px] w-[50px]" />
            <h4 class="m-0 text-xl font-noto leading-none text-[#171717]"><span class="text-sm">Como diría la
                abuela:</span><br> "Nunca pongas todos los huevos en una misma canasta."
            </h4>
          </div>
          <p class="mt-8 px-10 max-w-4xl mx-auto text-[#171717] text-justify">
            Toda oportunidad de inversión presenta un riesgo. Existe la posibilidad que el retorno ofrecido por la oportunidad de inversión, 
            no se cumpla como uno espera. 
            Por ello, recomendamos que diversifiques tus inversiones. Para mayor información, comunícate con nuestros asesores.
          </p>
          <p class="mt-8 mb-0 px-10 max-w-4xl mx-auto text-[#171717] text-lg font-medium">Conoce qué tipo de
            inversionista eres</p>
          <Button label="Accede al Quiz - Perfil de Riesgo" severity="warn" rounded @click="redireccionQuiz('https://tally.so/r/wMoaR8')"
            class="!text-lg !px-8 !py-2 !relative !border-none !-bottom-6 !mx-auto !bg-[#6790FF] !text-white hover:!bg-[#6790FF] 
            transition-all duration-300" />
        </div>
      </div>
    </div>

    <FooterWidget />
  </div>

  <Dialog v-model:visible="facturas" modal class="!bg-white !overflow-hidden !rounded-[50px] !px-5"
    :style="{ width: '40rem', marginLeft: '20px', marginRight: '20px' }">
    <template #header>
      <div class="inline-flex"></div>
    </template>
    <h1 class="text-[#171717] block m-0 text-center relative -top-3">Facturas</h1>
    <div class="text-center">
      <div class="bg-[#edeae4] rounded-[50px] px-3 inline-block">
        <h5 class="text-[#FF4929] block m-0 text-center font-bold">Invierte desde $25 o S/. 100</h5>
      </div>
    </div>
    <p class="text-[#171717] mt-10 px-10 text-justify">
      Todos los días, empresas o personas requieren de capital de forma rápida.
      En la actualidad, el sistema financiero tradicional todavía se presenta lento
      y burocrático en sus procesos de evaluación y aprobación. Por ello en
      Zuma, recibimos a diario muchas de estas solicitudes, las cuales, después
      de un filtro y una evaluación integral, las ponemos a disposición de nuestra
      comunidad de inversionistas. Todas las solicitudes de préstamo cuentan
      con garantías hipotecarias. Ten presente, que en cada oportunidad de
      inversión solo hay un ganador
    </p>
    <div class="flex justify-end gap-2">
      <Button label="Quiero Invertir" severity="warn" rounded @click="() => registrarYRedirigir(1, 'https://zuma.com.pe/factoring/registrarme')"
        class="!text-lg !px-10 !py-2 !my-6 !border-none !mx-auto !bg-[#FF4929] !text-white hover:!bg-[#6790FF] transition-all duration-300" />
    </div>
  </Dialog>

  <Dialog v-model:visible="prestamos" modal class="!bg-white !overflow-hidden !rounded-[50px]"
    :style="{ width: '40rem', marginLeft: '20px', marginRight: '20px' }">
    <template #header>
      <div class="inline-flex"></div>
    </template>
    <h1 class="text-[#171717] block m-0 text-center relative -top-3">Préstamos con Garantía</h1>
    <div class="text-center">
      <div class="bg-[#edeae4] rounded-[50px] px-3 inline-block">
        <h5 class="text-[#FF4929] block m-0 text-center font-bold">1 solo ganador</h5>
      </div>
    </div>
    <p class="text-[#171717] mt-10 px-10 text-justify">Plazos largos y montos altos. Todos los días, empresas o personas
      requieren de
      capital de forma rápida. Para mala suerte de ellos, el sistema financiero tradicional todavía se presenta lento y
      burocrático en sus procesos de evaluación y aprobación. Por ello en Zuma, recibimos a diario muchas de estas
      solicitudes, las cuales, después de una evaluación y depuración, de considerarlas apropiadas, ponemos a
      disposición
      de nuestra comunidad de inversionistas. Todas las operaciones cuentan con garantías de respaldo. Lamentablemente,
      para cada oportunidad de inversión que se presente, puede a ver un solo inversionista ganador.
    </p>
    <div class="flex justify-end gap-2">
      <Button
        label="Quiero ser el ganador"
        severity="warn"
        rounded
        @click="registrarYRedirigir(2, '/hipotecas')"
        class="!text-lg !px-10 !py-2 !my-6 !border-none !mx-auto !bg-[#FF4929] !text-white hover:!bg-[#6790FF] transition-all duration-300"
      />

    </div>
  </Dialog>

  <Dialog v-model:visible="depositos" modal class="!bg-white !overflow-hidden !rounded-[50px]"
    :style="{ width: '40rem', marginLeft: '20px', marginRight: '20px' }">
    <template #header>
      <div class="inline-flex"></div>
    </template>
    <h1 class="text-[#171717] block m-0 text-center relative -top-3">Depósitos a Plazo</h1>
    <div class="text-center">
      <div class="bg-[#edeae4] rounded-[50px] px-3 inline-block">
        <h5 class="text-[#FF4929] block m-0 text-center font-bold">1 solo ganador</h5>
      </div>
    </div>
    <p class="text-[#171717] mt-10 px-10 text-justify">Esta alternativa la conocen todos y es la favorita de nuestro
      inversionista
      xxxx. Diversos plazos de inversión para tickets medianos. Pero claro, en Zuma, no te vamos a presentar el banco
      tradicional AAA que te paga 1 – 3% anual. ¡No! Presentamos alternativas del mercado con mayor rendimiento de
      instituciones más pequeñas, pero con cobertura del Seguro de Depósito. Así, si inviertes el monto adecuado, pase
      lo
      que pase, tu capital está garantizado.
    </p>
    <div class="flex justify-end gap-2">
      <Button label="Quiero saber más " severity="warn" rounded @click="registrarYRedirigir(3, '/tasas-fijas')"
        class="!text-lg !px-10 !py-2 !my-6 !border-none !mx-auto !bg-[#FF4929] !text-white hover:!bg-[#6790FF] transition-all duration-300" />
    </div>
  </Dialog>

</template>

<script setup>
import FooterWidget from '@/components/landing/FooterWidget.vue';
import TopbarWidget from '@/components/landing/TopbarWidget.vue';
import { ref } from 'vue';
import { visitaService } from '@/services/visitaService'
import { useRouter } from 'vue-router'

const facturas = ref(false);
const prestamos = ref(false);
const depositos = ref(false);


const registrarYRedirigir = async (productoId, urlDestino) => {
  try {
    await visitaService.registrarVisita(productoId)
    window.location.href = urlDestino
  } catch (error) {
    console.error('Error registrando visita:', error)
  }
}
const redireccionQuiz = async (url) => {
  window.open(url, '_blank') 
}
</script>