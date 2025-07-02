<template>

    <div class="card">
        <div class="mb-6">
            <h1 class="text-2xl font-semibold mb-1">Configuración</h1>
            <p class="py-4">Administra tu perfil y la configuración de tu cuenta</p>
        </div>
        <Tabs value="0">
            <TabList>
                <Tab value="0">Perfil</Tab>
                <Tab value="1">Contraseña</Tab>
                <Tab value="2">Historial</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="0">
                    <Perfil/>
                </TabPanel>
                <TabPanel value="1">
                    <Password/>
                </TabPanel>
                <TabPanel value="2">
                    <Historial/>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
</template>
<script setup>
import Perfil from './Desarrollo/Perfil.vue';
import Password from './Desarrollo/Password.vue';
import Historial from './Desarrollo/Historial.vue';
</script>
<style scoped></style>