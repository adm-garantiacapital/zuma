<script setup lang="ts">
import { ref } from 'vue';
</script>

<template>
    <br>
    <br>
    <div class="space-y-4">
        <!-- Encabezado -->
        <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">ELiminar Cuenta</h2>
            <p>Elimina tu cuenta y todos sus recursos..</p>
        </div>

        <!-- Advertencia -->
         <br>
        <Message severity="error" :closable="false">
            <h4>Advertencia</h4>
            <p>This action is permanent and cannot be undone.</p>
            <Button label="Delete account" severity="danger"/>
        </Message>
    </div>
</template>
