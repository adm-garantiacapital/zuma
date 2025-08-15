<template>
    <br />
    <Breadcrumb :home="home" :model="items" />

    <Breadcrumb :home="home" :model="items" />
    <section class="px-1 md:px-7">
        <div
            class=" mb-6 md:mb-10 rounded-3xl border bg-[#6790FF] text-card-foreground shadow-sm relative overflow-hidden">
            <div
                class="mx-5     p-4 sm:px-6 md:px-8 lg:px-15 md:mx-5 lg:mx-10 py-6 sm:py-10 md:py-15 relative superior">
                <h3 class="scroll-m-20 text-sm sm:text-lg md:text-xl font-semibold text-black max-w-32 md:max-w-full">
                    Bienvenido {{ fullName }} a tu perfil del inversionista
                </h3>
            </div>
            <a class="mask absolute -top-12 sm:-top-16 -right-5" href="https://fondeo.apros.global/" target="_blank">
                <img src="/imagenes/zuma/imagen-1.png" alt="Logo Zuma"
                    class="inline-block w-60 sm:w-80 hover:scale-110 transition duration-100 ease-in" />
            </a>
        </div>
    </section>

    <StatsWidget />

    <div class="p-4 sm:p-6 md:p-10 my-6 md:my-10 rounded-3xl bg-[#F0F1F9]">
        <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 lg:col-span-8 mb-4">
                <h3 class="m-0 text-[#171717] text-lg md:text-xl">Mi billetera</h3>
                <p class="m-0 text-[#171717] text-sm md:text-base">Puedes utilizar ambas monedas al momento de hacer la
                    inversión.</p>
            </div>

            <div class="col-span-12 lg:col-span-4 text-left lg:text-end mb-4">
                <div class="flex flex-wrap gap-2 justify-start lg:justify-end items-center">
                    <Button label="Depósito" icon="pi pi-plus" iconPos="left"
                        class="!border-none !text-white !bg-[#171717] hover:!bg-[#6790FF] focus:!border-none focus:!bg-[#FF4929] !font-bold !rounded-3xl !px-3 sm:!px-5 !py-2 sm:!py-3 !transition !duration-100 !ease-in"
                        rounded @click="showDepositoDialog = true" />

                    <Button label="Retiro" icon="pi pi-minus" iconPos="left"
                        class="border-button-black !border-none !text-[#171717] !bg-transparent hover:!bg-[#6790FF] focus:!border-none focus:!bg-[#FF4929] !font-bold !rounded-3xl !px-3 sm:!px-5 !py-2 sm:!py-3 !transition !duration-100 !ease-in"
                        rounded @click="showRetiroDialog = true" />

                    <!-- Botón para mostrar/ocultar montos -->
                    <Button :icon="showAmounts ? 'pi pi-eye' : 'pi pi-eye-slash'" severity="contrast" variant="outlined"
                        rounded @click="toggleAmounts" :title="showAmounts ? 'Ocultar montos' : 'Mostrar montos'"
                        class="!p-2 sm:!p-3" />
                </div>
            </div>

            <div class="col-span-12">
                <TabView>
                    <TabPanel header="">
                        <!-- Tabs header responsive -->
                        <template #header>
                            <div class="flex flex-wrap gap-2">
                                <button type="button"
                                    class="text-[#171717] bg-white focus:outline-none hover:bg-[#6790FF] focus:bg-[#FF4929] font-bold rounded-3xl px-3 sm:px-5 py-2 sm:py-3 transition duration-100 ease-in">
                                    <img src="/imagenes/zuma/pen.png" alt="PEN" class="inline-block me-2 w-4 sm:w-5" />
                                    <span class="inline-block align-middle text-sm sm:text-base">PEN</span>
                                </button>

                                <button type="button"
                                    class="text-[#171717] bg-white focus:outline-none hover:bg-[#6790FF] focus:bg-[#FF4929] font-bold rounded-3xl px-3 sm:px-5 py-2 sm:py-3 transition duration-100 ease-in">
                                    <img src="/imagenes/zuma/usd.png" alt="USD" class="inline-block me-2 w-4 sm:w-5" />
                                    <span class="inline-block align-middle text-sm sm:text-base">USD</span>
                                </button>
                            </div>
                        </template>

                        <!-- Contenido de las tabs -->
                        <div v-if="wallet" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-4 sm:my-5">
                            <div class="col-span-1" v-for="(label, key, index) in penLabels" :key="index">
                                <div class="rounded-3xl bg-white relative p-6 sm:p-8 md:p-10">
                                    <i :class="label.icon"
                                        class="text-[#171717] !text-[2rem] sm:!text-[2.5rem] md:!text-[2.8rem] inline-block align-top mt-3 sm:mt-5 mb-2 sm:mb-3 me-4 sm:me-6 md:me-10"></i>
                                    <div class="inline-block">
                                        <h5 class="text-[#171717] m-0 font-semibold text-sm sm:text-base">{{ label.title
                                            }}</h5>
                                        <h3 class="text-[#171717] m-0 font-bold text-lg sm:text-xl md:text-2xl">
                                            {{ showAmounts ? `S/ ${balances.PEN[key].toFixed(2)}` : 'S/ ••••••' }}
                                        </h3>
                                        <a class="text-[#6790FF] m-0 font-medium text-sm sm:text-base">Ver más...</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                </TabView>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-12 gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 md:px-0">
        <div class="col-span-12 xl:col-span-6">
            <NotificationsWidget />
        </div>
        <div class="col-span-12 xl:col-span-6">
            <BestSellingWidget />
        </div>
    </div>

    <div class="text-center py-6 md:py-10 px-4 sm:px-6 md:px-0">
        <h3 class="text-[#171717] font-bold text-xl sm:text-2xl mb-3 sm:mb-4">Descubre nuevas oportunidades</h3>
        <p class="text-[#555] mb-4 sm:mb-6 text-sm sm:text-base">Explora nuestras tasas fijas disponibles desde la más
            alta
            hasta la menor.</p>

        <router-link to="/tasas-fijas/Search">
            <Button label="Explorar Tasas fijas" icon="pi pi-search" iconPos="left"
                class="!bg-[#171717] hover:!bg-[#6790FF] !border-none !text-white font-bold !px-4 sm:!px-6 !py-2 sm:!py-3 rounded-3xl text-sm sm:text-base transition duration-150 ease-in-out" />
        </router-link>
    </div>

    <AddDeposito v-model:visible="showDepositoDialog" @success="handleDepositSuccess" />
    <AddRetiro v-model:visible="showRetiroDialog" @success="handleWithdrawSuccess" />
</template>

<script setup>
import BestSellingWidget from "@/components/dashboardTasas/BestSellingWidget.vue";
import NotificationsWidget from "@/components/dashboardTasas/NotificationsWidget.vue";
import profileService from '@/services/profileService';
import reportsService from '@/services/reportsService';
import { onMounted, ref } from "vue";
import AddDeposito from "./EstadoCuenta/Desarrollo/AddDeposito.vue";
import AddRetiro from "./EstadoCuenta/Desarrollo/AddRetiro.vue";

const home = ref({ icon: 'pi pi-home' });
const items = ref([{ label: 'Tasas fijas' }, { label: 'Mi billetera' }]);
const profile = ref(null);
const fullName = ref('');
const wallet = ref(true);
const showDepositoDialog = ref(false)
const showRetiroDialog = ref(false)
const showAmounts = ref(true);

const penLabels = {
    amount: { title: "Saldo disponible", icon: "pi pi-wallet" },
    invested_amount: { title: "Total invertido", icon: "pi pi-building-columns" },
    expected_amount: { title: "Retorno esperado", icon: "pi pi-money-bill" }
};
const usdLabels = penLabels;

const balances = ref({
    PEN: {
        amount: 0,
        invested_amount: 0,
        expected_amount: 0
    },
    USD: {
        amount: 0,
        invested_amount: 0,
        expected_amount: 0
    }
});

const showWallet = () => {
    wallet.value = !wallet.value;
};

const toggleAmounts = () => {
    showAmounts.value = !showAmounts.value;
    localStorage.setItem('showAmounts', showAmounts.value.toString());
};

const loadProfile = async () => {
    try {
        const response = await profileService.getProfile();
        profile.value = response.data.data;
        fullName.value = profile.value.alias;
    } catch (error) {
        console.error('Error cargando el perfil:', error);
    }
};

const loadBalances = async () => {
    try {
        const response = await reportsService.getBalances();
        const data = response.data.data;

        data.forEach(item => {
            const currency = item.currency;
            if (currency === 'PEN' || currency === 'USD') {
                balances.value[currency] = {
                    amount: parseFloat(item.amount),
                    invested_amount: parseFloat(item.invested_amount),
                    expected_amount: parseFloat(item.expected_amount)
                };
            }
        });
    } catch (error) {
        console.error('Error cargando balances:', error);
    }
};

const handleDepositSuccess = () => {
    emit('deposit-success')
    loadBalances()
}

const handleWithdrawSuccess = () => {
    emit('withdraw-success')
    loadBalances()
}

onMounted(() => {
    loadProfile();
    loadBalances();

    const savedShowAmounts = localStorage.getItem('showAmounts');
    if (savedShowAmounts !== null) {
        showAmounts.value = savedShowAmounts === 'true';
    }
});
</script>

<style scoped>
/* Ajustes adicionales para móviles muy pequeños */
@media (max-width: 360px) {
    .mask img {
        width: 50px;
        top: -8px;
    }

    .superior {
        padding: 1rem;
    }
}
</style>