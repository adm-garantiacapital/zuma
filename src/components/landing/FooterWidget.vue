<script setup></script>

<template>
    <footer class="bg-[#171717] text-white pt-10">
        <div class="px-10 lg:px-20 grid grid-flow-col auto-cols-max gap-20 justify-center">
            <div class="col-span-12 md:col-span-3 text-sm">
                <div class="mb-6">
                    <h1>
                        <span class="relative">
                            <img src="/imagenes/landing/logo-zuma-blanco.svg" alt="Logo Zuma"
                                class="inline-block w-28" />
                        </span>
                    </h1>
                </div>
                <div class="flex space-x-3 text-xl mb-6">
                    <div
                        class="bg-white text-[#171717] hover:bg-[#6790FF] hover:text-white transition rounded-full w-10 h-10 flex items-center justify-center cursor-pointer">
                        <i class="pi pi-linkedin"></i>
                    </div>
                    <div
                        class="bg-white text-[#171717] hover:bg-[#6790FF] hover:text-white transition rounded-full w-10 h-10 flex items-center justify-center cursor-pointer">
                        <i class="pi pi-tiktok"></i>
                    </div>
                    <div
                        class="bg-white text-[#171717] hover:bg-[#6790FF] hover:text-white transition rounded-full w-10 h-10 flex items-center justify-center cursor-pointer">
                        <i class="pi pi-facebook"></i>
                    </div>
                    <div
                        class="bg-white text-[#171717] hover:bg-[#6790FF] hover:text-white transition rounded-full w-10 h-10 flex items-center justify-center cursor-pointer">
                        <i class="pi pi-instagram"></i>
                    </div>
                    <div
                        class="bg-white text-[#171717] hover:bg-[#6790FF] hover:text-white transition rounded-full w-10 h-10 flex items-center justify-center cursor-pointer">
                        <i class="pi pi-whatsapp"></i>
                    </div>
                </div>
            </div>
            <div class="col-span-12 md:col-span-3 text-sm text-[#EDEAE4] py-4">
                <h4 class="font-bold text-white mb-2">Contacto</h4>
                <div class="space-y-3 text-[#EDEAE4]">
                    <p class="flex items-center gap-3">
                        <i class="pi pi-envelope text-white text-lg"></i>
                        <strong>zuma@zuma.com.pe</strong>
                    </p>
                    <p class="flex items-center gap-3">
                        <i class="pi pi-phone text-white text-lg"></i>
                        <strong>+51 616 6610</strong>
                    </p>
                    <p class="flex items-center gap-3">
                        <i class="pi pi-whatsapp text-white text-lg"></i>
                        <strong>+51 616 6610</strong>
                    </p>
                    <p class="flex items-start gap-3">
                        <i class="pi pi-map-marker text-white text-lg mt-1"></i>
                        Av. Faustino Sánchez Carrión 417,<br> Magdalena del Mar, <br> Lima - Perú
                    </p>
                </div>
            </div>
            <div class="col-span-12 md:col-span-3 text-sm text-[#EDEAE4] py-4">
                <h4 class="font-bold text-white mb-2">Invierte</h4>
                <ul class="space-y-2 list-none">
                    <li class="cursor-pointer font-medium hover:text-[#FF4929]">Inversiones en facturas</li>
                    <li class="cursor-pointer font-medium hover:text-[#FF4929]">Inversiones en hipotecas</li>
                    <li class="cursor-pointer font-medium hover:text-[#FF4929]">Inversiones en tasas fijas</li>
                </ul>
            </div>
            <div class="col-span-12 md:col-span-3 text-sm text-[#EDEAE4] py-4">
                <h4 class="font-bold text-white mb-2">Transparencia</h4>
                <ul class="space-y-3 list-none">
                    <li class="cursor-pointer font-medium flex items-center space-x-2">
                        <i class="pi pi-exclamation-circle" style="font-size: 1.3rem; color: white;"></i>
                        <span>Canal de denuncias</span>
                    </li>
                    <li class="cursor-pointer font-medium flex items-center space-x-2">
                        <i class="pi pi-file" style="font-size: 1.3rem; color: white;"></i>
                        <span>Términos y condiciones</span>
                    </li>
                </ul>
                <!-- Imagen debajo del texto, ajustada al ancho de la columna -->
                <img src="/public/imagenes/landing/libro.svg" class="mt-4 w-full h-auto rounded">
            </div>

        </div>
        <div class="bg-[#171717] mt-10 text-center py-4 text-sm text-white/80">
            <span class="relative">
                <img src="/imagenes/landing/logo-zuma-blanco.svg" alt="Logo Zuma" class="inline-block w-12" />
            </span> - Todos los derechos reservados 2025
        </div>
    </footer>
</template>