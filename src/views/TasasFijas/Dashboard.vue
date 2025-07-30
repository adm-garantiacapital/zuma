<template>
    <br />
    <Breadcrumb :home="home" :model="items" />

    <div class="mb-10 rounded-3xl bg-[#6790FF] relative overflow-hidden">
        <div class="px-10 py-20 relative superior inline-block">
            <h2 class="m-0 text-[#171717]">Bienvenido {{ fullName }} a tu perfil del inversionista</h2>
        </div>
        <div class="mask absolute -top-14 -right-8">
            <img src="/imagenes/zuma/imagen-1.png" alt="Logo Zuma"
                class="inline-block w-49 hover:scale-110 transition duration-100 ease-in" />
        </div>
    </div>
    <StatsWidget />
    <div class="p-10 my-10 rounded-3xl bg-[#F0F1F9]">
        <div class="grid grid-cols-8 gap-0">
            <div class="col-span-8 lg:col-span-4 mb-5">
                <h3 class="m-0 text-[#171717]">Mi billetera</h3>
                <p class="m-0 text-[#171717]">Puedes utilizar ambas monedas al momento de hacer la inversión.</p>
            </div>
            <div class="col-span-8 lg:col-span-4 text-end mb-5">
                <Button label="Depósito" icon="pi pi-plus" iconPos="left"
                    class="!border-none !text-white !bg-[#171717] hover:!bg-[#6790FF] focus:!border-none focus:!bg-[#FF4929] !font-bold !rounded-3xl !px-5 !py-3 !me-3 !transition !duration-100 !ease-in"
                    rounded @click="showDepositoDialog = true" />
                <Button label="Retiro" icon="pi pi-minus" iconPos="left"
                    class="border-button-black !border-none !text-[#171717] !bg-transparent hover:!bg-[#6790FF] focus:!border-none focus:!bg-[#FF4929] !font-bold !rounded-3xl !px-5 !py-3 !me-3 !transition !duration-100 !ease-in"
                    rounded @click="showRetiroDialog = true" />
                
                <!-- Botón para mostrar/ocultar montos -->
                <Button :icon="showAmounts ? 'pi pi-eye' : 'pi pi-eye-slash'" severity="contrast" variant="outlined"
                    rounded @click="toggleAmounts" :title="showAmounts ? 'Ocultar montos' : 'Mostrar montos'" 
                    class="!me-3" />
                
                <Button v-if="wallet" @click="showWallet" icon="pi pi-angle-up" aria-label="Mostrar Billetera"
                    variant="link" class="!text-black" />
                <Button v-else @click="showWallet" icon="pi pi-angle-down" aria-label="Mostrar Billetera" variant="link"
                    class="!text-black" />
            </div>

            <div class="col-span-8">
                <!-- PEN -->
                <button type="button"
                    class="text-[#171717] bg-white focus:outline-none hover:bg-[#6790FF] focus:bg-[#FF4929] font-bold rounded-3xl px-5 py-3 me-3 transition duration-100 ease-in">
                    <img src="/imagenes/zuma/pen.png" alt="Logo Zuma" class="inline-block me-2" width="20" />
                    <span class="inline-block align-middle">PEN</span>
                </button>

                <div v-if="wallet" class="grid grid-cols-3 gap-4 my-5">
                    <div class="col-span-3 lg:col-span-1" v-for="(label, key, index) in penLabels" :key="index">
                        <div class="rounded-3xl bg-white relative p-10">
                            <i :class="label.icon"
                                class="text-[#171717] !text-[2.8rem] inline-block align-top mt-5 mb-3 me-10"></i>
                            <div class="inline-block">
                                <h5 class="text-[#171717] m-0 font-semibold">{{ label.title }}</h5>
                                <h3 class="text-[#171717] m-0 font-bold">
                                    {{ showAmounts ? `S/ ${balances.PEN[key].toFixed(2)}` : 'S/ ••••••' }}
                                </h3>
                                <a class="text-[#6790FF] m-0 font-medium">Ver más...</a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- USD -->
                <button type="button"
                    class="text-[#171717] bg-white focus:outline-none hover:bg-[#6790FF] focus:bg-[#FF4929] font-bold rounded-3xl px-5 py-3 me-3 transition duration-100 ease-in">
                    <img src="/imagenes/zuma/usd.png" alt="Logo Zuma" class="inline-block me-2" width="20" />
                    <span class="inline-block align-middle">USD</span>
                </button>

                <div v-if="wallet" class="grid grid-cols-3 gap-4 mt-5">
                    <div class="col-span-3 lg:col-span-1" v-for="(label, key, index) in usdLabels" :key="index">
                        <div class="rounded-3xl bg-white relative p-10">
                            <i :class="label.icon"
                                class="text-[#171717] !text-[2.8rem] inline-block align-top mt-5 mb-3 me-10"></i>
                            <div class="inline-block">
                                <h5 class="text-[#171717] m-0 font-semibold">{{ label.title }}</h5>
                                <h3 class="text-[#171717] m-0 font-bold">
                                    {{ showAmounts ? `$ ${balances.USD[key].toFixed(2)}` : '$ ••••••' }}
                                </h3>
                                <a class="text-[#6790FF] m-0 font-medium">Ver más...</a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
    <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 xl:col-span-6">
            <NotificationsWidget />
        </div>
        <div class="col-span-12 xl:col-span-6">
            <BestSellingWidget />
        </div>
    </div>
    <div class="text-center py-10">
        <h3 class="text-[#171717] font-bold text-2xl mb-4">Descubre nuevas oportunidades</h3>
        <p class="text-[#555] mb-6">Explora nuetras tasas fijas disponibles desde la más alta hasta la menor.</p>

        <router-link to="/tasas-fijas/Search">
            <Button label="Explorar Tasas fijas" icon="pi pi-search" iconPos="left"
                class="!bg-[#171717] hover:!bg-[#6790FF] !border-none !text-white font-bold !px-6 !py-3 rounded-3xl text-base transition duration-150 ease-in-out" />
        </router-link>
    </div>

    <AddDeposito v-model:visible="showDepositoDialog" @success="handleDepositSuccess" />
    <AddRetiro v-model:visible="showRetiroDialog" @success="handleWithdrawSuccess" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import profileService from '@/services/profileService';
import reportsService from '@/services/reportsService';
import NotificationsWidget from "@/components/dashboardTasas/NotificationsWidget.vue";
import BestSellingWidget from "@/components/dashboardTasas/BestSellingWidget.vue";
import AddDeposito from "./EstadoCuenta/Desarrollo/AddDeposito.vue";
import AddRetiro from "./EstadoCuenta/Desarrollo/AddRetiro.vue";

const home = ref({ icon: 'pi pi-home' });
const items = ref([{ label: 'Tasas fijas' }, { label: 'Mi billetera' }]);
const profile = ref(null);
const fullName = ref('');
const wallet = ref(false);
const showDepositoDialog = ref(false)
const showRetiroDialog = ref(false)

// Nueva variable para controlar la visibilidad de los montos
const showAmounts = ref(true);

// Labels para las tarjetas
const penLabels = {
    amount: { title: "Saldo disponible", icon: "pi pi-wallet" },
    invested_amount: { title: "Total invertido", icon: "pi pi-building-columns" },
    expected_amount: { title: "Retorno esperado", icon: "pi pi-money-bill" }
};
const usdLabels = penLabels; // Reutilizamos los mismos textos e íconos

// Balance reactivo
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

// Función para alternar la visibilidad de los montos
const toggleAmounts = () => {
    showAmounts.value = !showAmounts.value;
    localStorage.setItem('showAmounts', showAmounts.value.toString());
};

// Cargar perfil
const loadProfile = async () => {
    try {
        const response = await profileService.getProfile();
        profile.value = response.data.data;
        fullName.value = profile.value.alias;
    } catch (error) {
        console.error('Error cargando el perfil:', error);
    }
};

// Cargar balances
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

// Éxito en depósito
const handleDepositSuccess = () => {
    emit('deposit-success')
    loadBalances()
}

// Éxito en retiro
const handleWithdrawSuccess = () => {
    emit('withdraw-success')
    loadBalances()
}

onMounted(() => {
    loadProfile();
    loadBalances();
    
    // Cargar la preferencia desde localStorage
    const savedShowAmounts = localStorage.getItem('showAmounts');
    if (savedShowAmounts !== null) {
        showAmounts.value = savedShowAmounts === 'true';
    }
});
</script>