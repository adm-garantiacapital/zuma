<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { authService } from '@/services/auth.js';
import FooterWidget from '@/components/landing/FooterWidget.vue';
import TopbarWidget from '@/components/landing/TopbarWidget.vue';

const router = useRouter();
const toast = useToast();

const document = ref('');
const password = ref('');
const checked = ref(false);
const loading = ref(false);

// ✅ Valor por defecto para los radios
const ingredient = ref('inversionista');


</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">
    <Toast />
    <TopbarWidget />

    <!-- Contenido centrado -->
    <div class="flex-1 flex flex-col items-center justify-center p-4 bg-white">

      <!-- Perfil de Inversionista -->
      <div class="w-full max-w-md flex justify-between items-center mb-6 py-8 px-6">
        <div class="flex items-center gap-2 hover:text-[#FF4929] transition-colors">
          <RadioButton v-model="ingredient" inputId="ingredient1" name="perfil" value="inversionista" />
          <label for="ingredient1" class="text-sm cursor-pointer hover:text-[#FF4929]">Perfil inversionista</label>
        </div>
        <div class="flex items-center gap-2 hover:text-[#FF4929] transition-colors">
          <RadioButton v-model="ingredient" inputId="ingredient2" name="perfil" value="empresa" />
          <label for="ingredient2" class="text-sm cursor-pointer hover:text-[#FF4929]">Perfil empresa</label>
        </div>
      </div>

      <!-- Formulario de login -->
      <div class="w-full max-w-xl">
        <div class="border border-gray-200 p-10 rounded-3xl shadow-sm">
          <!-- Header -->
          
        </div>
      </div>
    </div>
    <br>
    <FooterWidget />
  </div>
</template>
