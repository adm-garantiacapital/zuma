<script setup lang="ts">
import { ref } from 'vue';
</script>

<template>
    <div class="space-y-6">
        <!-- Encabezado -->
        <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Actualizar contraseña</h2>
            <p>
                Asegúrese de que su cuenta esté usando una contraseña larga y aleatoria para mantenerse segura.
            </p>
        </div>

        <div class="space-y-6">
            <!-- Contraseña actual -->
            <div class="flex flex-col gap-2">
                <label for="current_password" class="text-sm font-medium">Contraseña actual</label>
                <InputText
                    id="current_password"
                    ref="currentPasswordInput"
                    type="password"
                    autocomplete="current-password"
                    placeholder="Contraseña actual"
                    class="w-full"
                />
            </div>

            <!-- Nueva contraseña -->
            <div class="flex flex-col gap-2">
                <label for="password" class="text-sm font-medium">Nueva contraseña</label>
                <InputText
                    id="password"
                    ref="passwordInput"
                    type="password"
                    autocomplete="new-password"
                    placeholder="Nueva contraseña"
                    class="w-full"
                />
            </div>

            <!-- Confirmación -->
            <div class="flex flex-col gap-2">
                <label for="password_confirmation" class="text-sm font-medium">Confirmar contraseña</label>
                <InputText
                    id="password_confirmation"
                    type="password"
                    autocomplete="new-password"
                    placeholder="Confirmar contraseña"
                    class="w-full"
                />
            </div>

            <!-- Botón y mensaje -->
            <div class="flex items-center gap-4">
                <Button
                    label="Actualizar"
                    type="submit"
                    severity="primary"
                />
                <transition
                    enter-active-class="transition-opacity duration-300"
                    enter-from-class="opacity-0"
                    leave-active-class="transition-opacity duration-300"
                    leave-to-class="opacity-0"
                >
                </transition>
            </div>
        </div>
    </div>
</template>
