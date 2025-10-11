<template>
  <Breadcrumb :home="home" :model="items" />
  <section class="px-1 md:px-7">
    <div class=" mb-6 md:mb-10 rounded-3xl border bg-[#6790FF] text-card-foreground shadow-sm relative overflow-hidden">
      <div class="mx-5     p-4 sm:px-6 md:px-8 lg:px-15 md:mx-5 lg:mx-10 py-6 sm:py-10 md:py-15 relative superior">
        <h3 class="scroll-m-20 text-base sm:text-xl md:text-2xl font-bold text-white max-w-32 md:max-w-full">
          <div className='flex gap-2 mb-2'>
            <img
              src="/imagenes/landing/logo-zuma.svg"
              alt="logo"
              className="h-auto w-auto max-w-[140px] object-contain duration-200"
            /> 
            <span>invierte contigo, </span> 
          </div>          
          <span className='w-full d-inline-block'>Participamos en cada oportunidad que ves</span>
        </h3>
      </div>
      <a class="mask absolute -top-12 sm:-top-16 -right-5" href="https://fondeo.apros.global/" target="_blank">
        <img src="/imagenes/zuma/imagen-1.png" alt="Logo Zuma"
          class="inline-block w-60 sm:w-80 hover:scale-110 transition duration-100 ease-in" />
      </a>
    </div>
  </section>

  <StatsWidget />

  <section class="bg-[#f5f6fb] rounded-2xl p-6 m-6">
    <!-- HEADER -->
    <div class="flex flex-wrap items-center gap-4 mb-6 justify-between">
      <!-- Izquierda: Título + Monedas -->
      <div class="flex items-center gap-4">
        <!-- Título -->
        <div>
          <h3 class="sans-serif text-lg sm:text-xl md:text-2xl font-semibold text-black m-0 tracking-tight">
            Mi billetera
          </h3>
        </div>

        <!-- Monedas PEN / USD -->
        <div class="flex gap-2">
          <!-- Card PEN -->
          <button @click="setActiveTab('PEN')"
            :class="['flex items-center gap-2 px-3 py-1 rounded-3xl cursor-pointer', activeTab === 'PEN' ? 'bg-white text-black shadow-sm' : 'bg-gray-100 text-gray-500']">
            <img src="/imagenes/zuma/pen.png" class="w-5 h-5" />
            <span class="font-bold text-sm">PEN</span>
          </button>

          <!-- Card USD -->
          <button @click="setActiveTab('USD')"
            :class="['flex items-center gap-2 px-3 py-1 rounded-3xl cursor-pointer', activeTab === 'USD' ? 'bg-white text-black shadow-sm' : 'bg-gray-100 text-gray-500']">
            <img src="/imagenes/zuma/usd.png" class="w-5 h-5" />
            <span class="font-bold text-sm">USD</span>
          </button>
        </div>
      </div>

      <!-- Derecha: Toggle / Depósito / Retiro -->
      <div class="flex items-center gap-3">
        <!-- Toggle amounts -->
        <div @click="toggleAmounts" class="hidden md:flex items-center gap-2 cursor-pointer">
          <Icon v-if="showAmounts" icon="solar:eye-outline" width="22" height="22" style="color: #000" />
          <Icon v-else icon="mage:eye-off" width="22" height="22" style="color: #000" />
          <div class="text-black hover:underline">
            {{ showAmounts ? 'Ocultar' : 'Mostrar' }}
          </div>
        </div>

        <!-- Depósito -->
        <button
          class="bg-black text-white rounded-full px-5 py-2 text-sm hidden md:flex items-center gap-2 hover:bg-zinc-800"
          @click="showDepositoDialog = true">
          + Depósito
        </button>

        <!-- Retiro -->
        <button
          class="border border-black rounded-full px-5 py-2 text-sm hidden md:flex items-center gap-2 hover:bg-blue-400 hover:text-white hover:border-blue-400 hover:underline"
          @click="showRetiroDialog = true">
          - Retiro
        </button>
      </div>
    </div>


    <!-- TABS -->
    <!-- <div class="flex gap-2 mb-6">

      <button @click="setActiveTab('PEN')" :class="[
        'flex flex-col items-center px-3 py-1 transition-colors',
        activeTab === 'PEN' ? 'text-black' : 'text-gray-500'
      ]">
        <div class="flex gap-2 items-center">
          <img src="/imagenes/zuma/pen.png" class="w-5 h-5" />
          <span class="text-sm sm:text-base md:text-lg font-bold">PEN</span>
        </div>

        <div :class="[
          'h-1 w-full mt-2 rounded-full transition',
          activeTab === 'PEN' ? 'bg-black' : 'bg-transparent'
        ]" />
      </button>

      
      <button @click="setActiveTab('USD')" :class="[
        'flex flex-col items-center px-3 py-1 transition-colors',
        activeTab === 'USD' ? 'text-black' : 'text-gray-500'
      ]">
        <div class="flex gap-2 items-center">
          <img src="/imagenes/zuma/usd.png" class="w-5 h-5" />
          <span class="text-sm sm:text-base md:text-lg font-bold">USD</span>
        </div>

        <div :class="[
          'h-1 w-full mt-2 rounded-full transition',
          activeTab === 'USD' ? 'bg-black' : 'bg-transparent'
        ]" />
      </button>
    </div> -->

    <!-- CONTENT -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white rounded-3xl p-8 max-h-40 ">
        <div class="flex gap-4 items-center justify-center" s>
          <img src="/icons/amount-available.svg" alt="" class="w-10  md:w-12">

          <div>
            <div>
              <div class="scroll-m-20 text-md md:text-lg font-semibold tracking-tight">Saldo disponible
              </div>
              <div class="text-xl font-bold">
                {{ showAmounts
                  ? (activeTab === 'PEN'
                    ? `S/ ${balances.PEN.amount.toLocaleString('es-PE', {
                      minimumFractionDigits: 2, maximumFractionDigits: 2
                    })}`
                    : `$ ${balances.USD.amount.toLocaleString('es-PE', {
                      minimumFractionDigits: 2, maximumFractionDigits: 2
                    })}`
                  )
                  : '•••••'
                }}
              </div>
              <RouterLink :to="'hipotecas/Estado-Cuenta'">
                <div class="mt-2 text-blue-400 hover:border-b-2 border-blue-400">
                  Ver más detalles
                </div>
              </RouterLink>

            </div>
          </div>
        </div>

      </div>
      <div class="bg-white rounded-3xl p-8 max-h-40">
        <div class="flex gap-4 items-center justify-center">
          <img src="/icons/investment-amount.svg" alt="" class="w-10 md:w-16">

          <div>
            <div class="scroll-m-20 text-md md:text-lg font-semibold tracking-tight">Total invertido</div>
            <div class="text-2xl font-bold">
              {{ showAmounts
                ? (activeTab === 'PEN'
                  ? `S/ ${balances.PEN.invested_amount.toLocaleString('es-PE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}`
                  : `$ ${balances.USD.invested_amount.toLocaleString('es-PE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}`
                )
                : '•••••'
              }}
            </div>
            <!-- <RouterLink :to="'hipotecas/Estado-Cuenta'">
              <div class="mt-2 text-blue-400 hover:border-b-2 border-blue-400">
                Ver mas detalles
              </div>
            </RouterLink> -->

          </div>
        </div>

      </div>
      <div class="bg-white rounded-3xl p-8 max-h-40">
        <div class="flex gap-4 items-center justify-center">
          <img src="/icons/money-in-hands.svg" alt="" class="w-10 md:w-16">
          <div>
            <div class="scroll-m-20 text-md md:text-lg font-semibold tracking-tight">Retorno esperado</div>
            <div class="text-2xl font-bold">
              {{ showAmounts
                ? (activeTab === 'PEN'
                  ? `S/ ${balances.PEN.expected_amount.toLocaleString('es-PE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}`
                  : `$ ${balances.USD.expected_amount.toLocaleString('es-PE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}`
                )
                : '•••••'
              }}
            </div>
            <!-- <RouterLink :to="'hipotecas/Estado-Cuenta'">
              <div class="mt-2 text-blue-400 hover:border-b-2 border-blue-400">
                Ver mas detalles
              </div>
            </RouterLink> -->
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="grid grid-cols-12 gap-8">
    <div class="col-span-12 xl:col-span-6">
      <NotificationsWidget />
    </div>
    <div class="col-span-12 xl:col-span-6">
      <RevenueStreamWidget />
    </div>
  </div>

  <div class="text-center py-10">
    <h3 class="text-[#171717] font-bold text-2xl mb-4">Descubre nuevas oportunidades de inversión</h3>
    <p class="text-[#555] mb-6">Explora hipotecas disponibles desde la más alta hasta la menor.</p>

    <router-link to="/hipotecas/buscar">
      <Button label="Explorar Hipotecas" icon="pi pi-search" iconPos="left"
        class="!bg-[#171717] hover:!bg-[#6790FF] !border-none !text-white font-bold !px-6 !py-3 rounded-3xl text-base transition duration-150 ease-in-out" />
    </router-link>
  </div>

  <AddDeposito v-model:visible="showDepositoDialog" @success="handleDepositSuccess" />
  <AddRetiro v-model:visible="showRetiroDialog" @success="handleWithdrawSuccess" />
</template>

<script setup>
import NotificationsWidget from "@/components/dashboard/NotificationsWidget.vue";
import RevenueStreamWidget from "@/components/dashboard/RevenueStreamWidget.vue";
import StatsWidget from "@/components/dashboard/StatsWidget.vue";
import profileService from '@/services/profileService';
import reportsService from '@/services/reportsService';
import { Icon } from "@iconify/vue";
import { onMounted, ref } from "vue";
import AddDeposito from "./pages/EstadoCuenta/Desarrollo/AddDeposito.vue";
import AddRetiro from "./pages/EstadoCuenta/Desarrollo/AddRetiro.vue";


const home = ref({ icon: 'pi pi-home' });
const items = ref([{ label: 'Subasta hipotecas' }, { label: 'Mi billetera' }]);
const profile = ref(null);
const fullName = ref('');
const wallet = ref(true);
const showDepositoDialog = ref(false);
const showRetiroDialog = ref(false);

const activeTab = ref('PEN'); // Añadir esta línea

// Nueva variable para controlar la visibilidad de los montos
const showAmounts = ref(true);

// Labels para las tarjetas
const penLabels = {
  amount: { title: "Saldo disponible", icon: "pi pi-wallet" },
  invested_amount: { title: "Total invertido", icon: "pi pi-building-columns" },
  expected_amount: { title: "Retorno esperado", icon: "pi pi-money-bill" }
};
const usdLabels = penLabels;

// Balance reactivo
const balances = ref({
  PEN: { amount: 0, invested_amount: 0, expected_amount: 0 },
  USD: { amount: 0, invested_amount: 0, expected_amount: 0 }
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
    fullName.value = `${profile.value.alias}`;
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

const handleDepositSuccess = () => {
  emit('deposit-success');
  loadBalances();
};

const handleWithdrawSuccess = () => {
  emit('withdraw-success');
  loadBalances();
};
// Función para cambiar la pestaña activa
const setActiveTab = (tab) => {
  activeTab.value = tab;
};


onMounted(() => {
  loadProfile();
  loadBalances();

  const savedShowAmounts = localStorage.getItem('showAmounts');
  if (savedShowAmounts !== null) {
    showAmounts.value = savedShowAmounts === 'true';
  }
});
</script>