<script setup>
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import FooterWidget from '@/components/landing/FooterWidget.vue'
import TopbarWidget from '@/components/landing/TopbarWidget.vue'
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">
    <Toast />
    <TopbarWidget />

    <div class="flex-1 flex flex-col items-center justify-center p-4 bg-white">
      <div class="w-full max-w-3xl">
        <div class="border border-gray-200 p-10 rounded-3xl shadow-sm space-y-6">
          <h2 class="text-2xl font-bold text-[#171717] text-center mb-4">
            Términos y Condiciones
          </h2>

          <section class="space-y-2 text-gray-700 text-sm leading-relaxed">
            <h3 class="font-semibold text-base text-[#171717]">1. Aceptación de los Términos</h3>
            <p>
              Al registrarte o utilizar nuestra plataforma, aceptas estar sujeto a estos términos y condiciones,
              así como a nuestras políticas de privacidad. Si no estás de acuerdo con alguno de estos términos, no debes usar nuestros servicios.
            </p>
          </section>

          <section class="space-y-2 text-gray-700 text-sm leading-relaxed">
            <h3 class="font-semibold text-base text-[#171717]">2. Uso del Servicio</h3>
            <p>
              El usuario se compromete a utilizar la plataforma de manera responsable, evitando cualquier actividad fraudulenta o que viole la legislación vigente.
            </p>
          </section>

          <section class="space-y-2 text-gray-700 text-sm leading-relaxed">
            <h3 class="font-semibold text-base text-[#171717]">3. Registro y Seguridad</h3>
            <p>
              Es responsabilidad del usuario mantener la confidencialidad de sus credenciales de acceso. Toda actividad realizada con sus credenciales se considerará realizada por el usuario.
            </p>
          </section>

          <section class="space-y-2 text-gray-700 text-sm leading-relaxed">
            <h3 class="font-semibold text-base text-[#171717]">4. Propiedad Intelectual</h3>
            <p>
              Todos los contenidos, marcas y logotipos presentes en esta plataforma son propiedad de la empresa o de sus respectivos titulares y están protegidos por la ley.
            </p>
          </section>

          <section class="space-y-2 text-gray-700 text-sm leading-relaxed">
            <h3 class="font-semibold text-base text-[#171717]">5. Modificaciones</h3>
            <p>
              Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Los cambios se notificarán a través de la plataforma o por correo electrónico.
            </p>
          </section>

          <section class="space-y-2 text-gray-700 text-sm leading-relaxed">
            <h3 class="font-semibold text-base text-[#171717]">6. Contacto</h3>
            <p>
              Si tienes dudas o preguntas sobre estos términos, puedes contactarnos a través de nuestro correo: <strong>soporte@tuempresa.com</strong>
            </p>
          </section>
        </div>
      </div>
    </div>

    <br />
    <FooterWidget />
  </div>
</template>
