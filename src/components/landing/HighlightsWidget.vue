<template>
  <div id="highlights" class="w-full py-10" style="background-color: #EDEAE4;">
    <div class="text-center max-w-screen-xl mx-auto px-6">
      <div class="text-[#171717] font-light text-3xl md:text-4xl">
        Dime quien eres y
      </div>
      <div class="text-3xl md:text-4xl font-bold text-[#171717]">
        te diré como <span class="text-[#4A90E2]">invertir</span>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-0 max-w-6xl mx-auto mt-20">
      <div class="col-span-12 md:col-span-4 px-5 mb-10">
        <div class="bg-white rounded-[50px] relative h-[540px]">
          <div class="bg-[#FF4929] rounded-[30px] py-2 px-4 text-white relative -top-8 w-[16rem] mx-auto">
            <h3 class="m-0 text-[#171717] font-bold text-center font-noto">Trekker</h3>
          </div>
          <p class="text-center relative -top-6 m-0">Perfil Conservador</p>
          <img src="/imagenes/landing/trekker.svg" alt="Imagen principal" class="max-h-[220px] w-full py-8 px-14" />
          <p class="px-10 pb-10 pt-4 text-[#171717] font-normal text-center">Este inversionista prefiere rutas seguras y
            bien planeadas. No busca emociones fuertes ni grandes saltos de rentabilidad. Prefiere ir paso a paso,
            asegurado en cada movimiento. Si tiene que elegir un animal para identificarse, elegiría el búho, sabio y
            tranquilo. Se rige por la frase: “Lento pero seguro”.</p>
        </div>
      </div>
      <div class="col-span-12 md:col-span-4 px-5 mb-10">
        <div class="bg-white rounded-[50px] relative h-[540px]">
          <div class="bg-[#FF4929] rounded-[30px] py-2 px-4 text-white relative -top-8 w-[16rem] mx-auto">
            <h3 class="m-0 text-[#171717] font-bold text-center font-noto">Surfista</h3>
          </div>
          <p class="text-center relative -top-6 m-0">Perfil Moderado</p>
          <img src="/imagenes/landing/surfista.svg" alt="Imagen principal" class="max-h-[220px] w-full py-5 px-14" />
          <p class="px-10 pb-10 pt-16 text-[#171717] font-normal text-center">Sabe que el mar tiene sus riesgos, pero
            también conoce
            las olas y cómo dominarlas. Acepta cierta volatilidad, buscando equilibrio entre riesgo y rentabilidad.</p>
        </div>
      </div>
      <div class="col-span-12 md:col-span-4 px-5 mb-5">
        <div class="bg-white rounded-[50px] relative h-[540px]">
          <div class="bg-[#FF4929] rounded-[30px] py-2 px-4 text-white relative -top-8 w-[16rem] mx-auto">
            <h3 class="m-0 text-[#171717] font-bold text-center font-noto">Paracaidista</h3>
          </div>
          <p class="text-center relative -top-6 m-0">Perfil Agresivo</p>
          <img src="/imagenes/landing/paracaidista.svg" alt="Imagen principal"
            class="max-h-[220px] w-full py-5 px-14" />
          <p class="px-10 pb-10 pt-2 text-[#171717] font-normal text-center">Este inversionista busca adrenalina y altos
            retornos.
            Está dispuesto a asumir riesgos importantes, confiando en su experiencia o en una buena estrategia de
            aterrizaje. Puede darse el lujo de tomar inversiones a largo plazo e inclusive en opciones de retorno
            variable.</p>
        </div>
      </div>

      <div class="col-span-12 text-center">
        <h4 class="text-lg font-medium">Descubre tu perfil de inversionista</h4>
        <Button label="Accede al quiz" severity="warn" rounded
          class="!border-none !text-2xl !px-20 !py-5 !relative !mx-auto !bg-[#171717] !text-white hover:!bg-[#6790FF] transition-all duration-300" />

      </div>
    </div>



  </div>
</template>