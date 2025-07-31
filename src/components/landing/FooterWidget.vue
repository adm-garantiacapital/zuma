<script setup></script>

<template>
    <footer class="bg-[#171717] text-white pt-10">
        <div class="px-10 lg:px-20 grid grid-cols-12 gap-10">
            <div class="col-span-12 md:col-span-3 text-sm">
                <div class="mb-6">
                    <h1>
                        <span class="relative">
                            <img src="/imagenes/landing/logo-zuma-blanco.svg" alt="Logo Zuma" class="inline-block w-28" />
                        </span>
                    </h1>
                </div>
                <div class="flex space-x-3 text-xl mb-6">
                    <div class="bg-white text-[#171717] hover:bg-[#6790FF] hover:text-white transition rounded-full w-10 h-10 flex items-center justify-center cursor-pointer">
                        <i class="pi pi-facebook"></i>
                    </div>
                    <div class="bg-white text-[#171717] hover:bg-[#6790FF] hover:text-white transition rounded-full w-10 h-10 flex items-center justify-center cursor-pointer">
                        <i class="pi pi-instagram"></i>
                    </div>
                    <div class="bg-white text-[#171717] hover:bg-[#6790FF] hover:text-white transition rounded-full w-10 h-10 flex items-center justify-center cursor-pointer">
                        <i class="pi pi-whatsapp"></i>
                    </div>
                    <div class="bg-white text-[#171717] hover:bg-[#6790FF] hover:text-white transition rounded-full w-10 h-10 flex items-center justify-center cursor-pointer">
                        <i class="pi pi-linkedin"></i>
                    </div>
                    <div class="bg-white text-[#171717] hover:bg-[#6790FF] hover:text-white transition rounded-full w-10 h-10 flex items-center justify-center cursor-pointer">
                        <i class="pi pi-video"></i>
                    </div>
                </div>

                <div class="space-y-2 text-[#EDEAE4]">
                    <p><i class="pi pi-phone mr-2"></i> <strong>+51 616 6610</strong></p>
                    <p><i class="pi pi-envelope mr-2"></i> <strong>zuma@zuma.com.pe</strong></p>
                    <p><i class="pi pi-map-marker mr-2"></i> Av. Faustino Sánchez Carrión 417, Magdalena del Mar, Lima - Perú</p>
                </div>
            </div>
            <!-- Columna 2: Invertir -->
            <div class="col-span-12 md:col-span-3 text-sm text-[#EDEAE4] py-4">
                <h4 class="font-bold text-white mb-2">Invertir</h4>
                <ul class="space-y-2 list-disc list-inside">
                    <li class="cursor-pointer font-medium">Préstamos hipotecarios</li>
                    <li class="cursor-pointer font-medium">Factoring</li>
                    <li class="cursor-pointer font-medium">Renta fija</li>
                    <li class="cursor-pointer font-medium">Activos inmobiliarios</li>
                </ul>
            </div>

            <!-- Columna 3: Empresa -->
            <div class="col-span-12 md:col-span-3 text-sm text-[#EDEAE4] py-4">
                <h4 class="font-bold text-white mb-2">Empresa</h4>
                <ul class="space-y-2 list-disc list-inside">
                    <li class="cursor-pointer font-medium">Quiénes Somos</li>
                    <li class="cursor-pointer font-medium">Únete al equipo</li>
                    <li class="cursor-pointer font-medium">Programa Referidos</li>
                    <li class="cursor-pointer font-medium">Red de Asesores Externos</li>
                </ul>
            </div>

            <!-- Columna 4: Más Información -->
            <div class="col-span-12 md:col-span-3 text-sm text-[#EDEAE4] py-4">
                <h4 class="font-bold text-white mb-2">Más Información</h4>
                <ul class="space-y-2 list-disc list-inside">
                    <li class="cursor-pointer font-medium">Preguntas Frecuentes</li>
                    <li class="cursor-pointer font-medium">Blog</li>
                    <li class="cursor-pointer font-medium">Canal de denuncias</li>
                    <li class="cursor-pointer font-medium">Términos y Condiciones</li>
                </ul>
            </div>
        </div>
        <!-- Línea inferior -->
        <div class="bg-[#171717] mt-10 text-center py-4 text-sm text-white/80">
            <span class="relative">
                <img src="/imagenes/landing/logo-zuma-blanco.svg" alt="Logo Zuma" class="inline-block w-12" />
            </span> - Todos los derechos reservados 2025
        </div>
    </footer>
</template>