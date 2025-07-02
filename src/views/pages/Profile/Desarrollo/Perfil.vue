<template>
  <div>
    <h1 class="text-xl font-bold mb-2">Información del perfil</h1>
    <p class="mb-6">Actualiza tus datos personales</p>

    <div class="space-y-4">
      <!-- Nombre -->
      <div class="grid gap-2">
        <label for="name" class="font-medium">Nombre</label>
        <InputText id="name" class="w-full" v-model="profile.name" required disabled/>
      </div>

      <!-- Apellidos (paterno y materno) -->
      <div class="flex gap-4">
        <div class="w-1/2 grid gap-2">
          <label for="first_last_name" class="font-medium">Apellido Paterno</label>
          <InputText id="first_last_name" class="w-full" v-model="profile.first_last_name" disabled/>
        </div>
        <div class="w-1/2 grid gap-2">
          <label for="second_last_name" class="font-medium">Apellido Materno</label>
          <InputText id="second_last_name" class="w-full" v-model="profile.second_last_name" disabled/>
        </div>
      </div>

      <!-- Alias y Documento -->
      <div class="flex gap-4">
        <div class="w-1/2 grid gap-2">
          <label for="alias" class="font-medium">Alias</label>
          <InputText id="alias" class="w-full" v-model="profile.alias" />
        </div>
        <div class="w-1/2 grid gap-2">
          <label for="document" class="font-medium">Documento</label>
          <InputText id="document" class="w-full" v-model="profile.document" disabled/>
        </div>
      </div>

      <!-- Correo electrónico y Teléfono -->
      <div class="flex gap-4">
        <div class="w-1/2 grid gap-2">
          <label for="email" class="font-medium">Correo electrónico</label>
          <InputText id="email" class="w-full" type="email" v-model="profile.email" disabled/>
        </div>
        <div class="w-1/2 grid gap-2">
          <label for="telephone" class="font-medium">Teléfono</label>
          <InputText id="telephone" class="w-full" v-model="profile.telephone" />
        </div>
      </div>

      <!-- Botón de actualización -->
      <div class="pt-4">
        <Button label="Actualizar perfil" icon="pi pi-save" @click="updateProfile" />
      </div>
    </div>
  </div>
  <DeleteCuenta/>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import profileService from '@/services/profileService'
import DeleteCuenta from './DeleteCuenta.vue'
const profile = ref({
  id: '',
  name: '',
  first_last_name: '',
  second_last_name: '',
  alias: '',
  document: '',
  email: '',
  telephone: '',
  district: '',
  address: '',
  has_relationship_pep: 0
})

const fetchProfile = async () => {
  try {
    const res = await profileService.getProfile()
    profile.value = { ...profile.value, ...res.data.data }
  } catch (err) {
    console.error('Error al obtener perfil:', err)
  }
}

const updateProfile = async () => {
  try {
    const payload = { ...profile.value }
    await profileService.updateProfile(payload)
    alert('Perfil actualizado correctamente')
  } catch (err) {
    console.error('Error al actualizar perfil:', err)
    alert('Error al actualizar perfil')
  }
}

onMounted(() => {
  fetchProfile()
})
</script>

<style scoped>
/* Estilos opcionales para ajustar aún más si se desea */
</style>
