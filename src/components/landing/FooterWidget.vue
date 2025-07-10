<template>
    <footer class="bg-[#6790FF] text-white pt-10">
        <div class="max-w-7xl mx-auto px-10 lg:px-20 grid grid-cols-12 gap-10">

            <!-- Columna 1: Logo + contacto + redes -->
            <div class="col-span-12 md:col-span-3 text-sm">
                <div class="mb-6">
                    <h1>
                        <span class="relative">
                            <img src="/imagenes/landing/logo-zuma-blanco.svg" alt="Logo Zuma" class="inline-block w-28" />
                            <div class="absolute mb-2 left-0 w-full h-1 bg-slate-200 rounded-full opacity-30"></div>
                        </span>
                    </h1>
                </div>
                <div class="flex space-x-3 text-xl mb-6">
                    <div
                        class="bg-white text-[#6790FF] hover:bg-[#FF4929] hover:text-white transition rounded-full w-10 h-10 flex items-center justify-center cursor-pointer">
                        <i class="pi pi-facebook"></i>
                    </div>
                    <div
                        class="bg-white text-[#6790FF] hover:bg-[#FF4929] hover:text-white transition rounded-full w-10 h-10 flex items-center justify-center cursor-pointer">
                        <i class="pi pi-instagram"></i>
                    </div>
                    <div
                        class="bg-white text-[#6790FF] hover:bg-[#FF4929] hover:text-white transition rounded-full w-10 h-10 flex items-center justify-center cursor-pointer">
                        <i class="pi pi-whatsapp"></i>
                    </div>
                    <div
                        class="bg-white text-[#6790FF] hover:bg-[#FF4929] hover:text-white transition rounded-full w-10 h-10 flex items-center justify-center cursor-pointer">
                        <i class="pi pi-linkedin"></i>
                    </div>
                    <div
                        class="bg-white text-[#6790FF] hover:bg-[#FF4929] hover:text-white transition rounded-full w-10 h-10 flex items-center justify-center cursor-pointer">
                        <i class="pi pi-video"></i> <!-- TikTok or video icon -->
                    </div>
                </div>

                <div class="space-y-2 text-[#EDEAE4]">
                    <p><i class="pi pi-phone mr-2"></i> <strong>616-6600</strong></p>
                    <p><i class="pi pi-envelope mr-2"></i> <strong>garantia@garantiacapital.com</strong></p>
                    <p><i class="pi pi-map-marker mr-2"></i> Av. Faustino Sánchez Carrión 417, Magdalena del Mar, Lima -
                        Perú</p>
                </div>
            </div>

            <!-- Columna 2: Préstamos e inversiones -->
            <div class="col-span-12 md:col-span-3 text-sm text-[#EDEAE4]">
                <h4 class="font-bold text-white mb-2">Préstamos</h4>
                <ul class="space-y-2">
                    <li class="flex items-center space-x-2 group cursor-pointer">
                        <div
                            class="bg-white text-[#6790FF] group-hover:bg-[#FF4929] group-hover:text-white transition rounded-full w-8 h-8 flex items-center justify-center">
                            <i class="pi pi-car"></i>
                        </div>
                        <span class="text-[#EDEAE4] group-hover:text-white font-medium">Préstamo con garantía
                            vehicular</span>
                    </li>
                    <li class="flex items-center space-x-2 group cursor-pointer">
                        <div
                            class="bg-white text-[#6790FF] group-hover:bg-[#FF4929] group-hover:text-white transition rounded-full w-8 h-8 flex items-center justify-center">
                            <i class="pi pi-home"></i>
                        </div>
                        <span class="text-[#EDEAE4] group-hover:text-white font-medium">Préstamo hipotecario</span>
                    </li>
                    <li class="flex items-center space-x-2 group cursor-pointer">
                        <div
                            class="bg-white text-[#6790FF] group-hover:bg-[#FF4929] group-hover:text-white transition rounded-full w-8 h-8 flex items-center justify-center">
                            <i class="pi pi-building"></i>
                        </div>
                        <span class="text-[#EDEAE4] group-hover:text-white font-medium">Préstamo constructor</span>
                    </li>
                </ul>

                <h4 class="font-bold text-white mt-4 mb-2">Inversiones</h4>
                <ul class="space-y-2">
                    <li class="flex items-center space-x-2 group cursor-pointer">
                        <div
                            class="bg-white text-[#6790FF] group-hover:bg-[#FF4929] group-hover:text-white transition rounded-full w-8 h-8 flex items-center justify-center">
                            <i class="pi pi-wallet"></i>
                        </div>
                        <span class="text-[#EDEAE4] group-hover:text-white font-medium">Renta fija</span>
                    </li>
                </ul>
                <h4 class="font-bold text-white mt-4 mb-2">Factoring</h4>
                <h4 class="font-bold text-white mt-2">Confirming</h4>
            </div>

            <!-- Columna 3: Nosotros -->
            <div class="col-span-12 md:col-span-3 text-sm text-[#EDEAE4]">
                <h4 class="font-bold text-white mb-2">Nosotros</h4>
                <ul class="space-y-1">
                    <li>Noticias</li>
                    <li><strong>Únete al equipo</strong></li>
                    <li>Contacto</li>
                </ul>
            </div>

            <!-- Columna 4: FAQ + Legales -->
            <div class="col-span-12 md:col-span-3 text-sm text-[#EDEAE4]">
                <h4 class="font-bold text-white mb-2">Preguntas Frecuentes</h4>
                <h4 class="font-bold text-white mt-4 mb-2">Transparencia</h4>
                <ul class="space-y-2">
                    <li class="flex items-center space-x-2 group cursor-pointer">
                        <div
                            class="bg-white text-[#6790FF] group-hover:bg-[#FF4929] group-hover:text-white transition rounded-full w-8 h-8 flex items-center justify-center">
                            <i class="pi pi-exclamation-triangle"></i>
                        </div>
                        <span class="text-[#EDEAE4] group-hover:text-white font-medium">Canal de denuncias</span>
                    </li>
                </ul>

                <h4 class="font-bold text-white mt-4 mb-2">Legales</h4>
                <ul class="space-y-2">
                    <li class="flex items-center space-x-2 group cursor-pointer">
                        <div
                            class="bg-white text-[#6790FF] group-hover:bg-[#FF4929] group-hover:text-white transition rounded-full w-8 h-8 flex items-center justify-center">
                            <i class="pi pi-file"></i>
                        </div>
                        <span class="text-[#EDEAE4] group-hover:text-white font-medium">Términos y condiciones</span>
                    </li>
                </ul>
                <!-- Botón libro de reclamaciones -->
                <div class="mt-6">
                    <button
                        class="border border-white text-white px-4 py-2 rounded hover:bg-white hover:text-[#6790FF] transition">
                        <i class="pi pi-book mr-2"></i> <strong>Libro de reclamaciones</strong>
                    </button>
                </div>
            </div>
        </div>

        <!-- Línea inferior -->
        <div class="bg-[#6790FF] mt-10 text-center py-4 text-sm text-white/80">
            <span class="relative">
                <img src="/imagenes/landing/logo-zuma-blanco.svg" alt="Logo Zuma" class="inline-block w-12" />
                <div class="absolute -bottom-2 left-0 w-full h-1 bg-slate-200 rounded-full opacity-30"></div>
            </span> - Todos los derechos reservados 2025
        </div>
    </footer>
</template>