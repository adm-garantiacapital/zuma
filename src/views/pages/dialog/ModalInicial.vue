<template>
  <Dialog  
    v-model:visible="visible"
    modal :style="{ width: '600px' }" 
    
    
  >
    <!-- Título centrado -->
    <template #header>
      <div class="w-full text-center text-xl font-bold" style="color: #000;">
       Aviso
      </div>
    </template>

    <div class="flex flex-col gap-6 " style="color: #000;">

        Para participar en nuestras oportunidades de inversión "Préstamos con garantía hipotecaria", es
        importante contar con el monto total que desee invertir antes de iniciar el proceso así como su
        disponibilidad de tiempo. Esta modalidad requiere que el capital esté disponible en su totalidad, ya
        que el préstamo se otorga de forma íntegra y bajo un cronograma de pagos.
        Tener los fondos disponibles asegura que la operación se ejecute sin retrasos.
        Nuestro equipo lo orientará en todo el proceso, atendiendo sus preguntas y brindando la
        información necesaria para que su inversión se realice con total claridad y seguridad.

    </div>

    <!-- Footer del modal -->
    <template #footer>
      <div class="flex w-full">      
        <Button
            label="Aceptar"
            icon="pi pi-check"  
            rounded
            outlined
            @click="closeDialog"      
            class="flex-1 !bg-transparent !text-black !border-black hover:!bg-slate-100 transition-colors duration-200 !font-semibold !tracking-wide !border-2" />
      </div>
    </template>

  </Dialog>
</template>

<script setup>
import { useToast } from 'primevue/usetoast'
import { computed, onMounted, ref, watch } from 'vue'

const visible = ref(false)

// Cargar datos al montar el componente
onMounted(() => {
  visible.value = true
})

const closeDialog = () => {
  visible.value = false
}
</script>