<script setup>
import { fixedTermInvestmentService } from '@/services/fixedTermInvestmentService';
import { simulationService } from '@/services/simulationService';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';
import Billetera from './Billetera.vue';

const toast = useToast();
const detaill = ref(false);
const schedule = ref(false);
const home = ref({ icon: 'pi pi-home' });
const items = ref([{ label: 'Buscar Oportunidades' }]);

const simulationItems = ref();
const chosenItem = ref({
    id: 37,
    nombre: '',
    tea: '',
    plazo: '',
    retorno: ''
});

const loading = ref({
    simulate: false,
    schedule: false,
    invest: false,
    compare: false,
    export: false
});

// Datos
const simulationResults = ref([]);
const paymentFrequencies = ref([]);
const selectedRate = ref('');
const scheduleData = ref(null);
const comparisonResults = ref([]);

const compareForm = ref({
    selectedRates: [],
    paymentFrequencyId: null
});

const simulationForm = ref({
    amount: ''
});

const activeTab = ref(0);
const scheduleForm = ref({
    paymentFrequencyId: null,
    startDate: new Date(),
    taxRate: 0.05
});

const loadPaymentFrequencies = async () => {
    try {
        const response = await simulationService.getPaymentFrecuencies();
        if (response.data.success) {
            paymentFrequencies.value = response.data.data;
        }
    } catch (error) {
        console.error('Error cargando frecuencias:', error);
    }
};

const formatDate = (date) => {
    if (!date) return null;
    return date.toISOString().split('T')[0];
};

const generateSchedule = async () => {
    if (!scheduleForm.value.paymentFrequencyId) {
        toast.add({
            severity: 'warn',
            summary: 'Atención',
            detail: 'Seleccione una tasa y configure la frecuencia de pago',
            life: 3000
        });
        return;
    }

    loading.value.schedule = true;

    try {
        const response = await simulationService.getGenerateSchedule({
            rate_id: chosenItem.value.id,
            amount: simulationForm.value.amount,
            payment_frequency_id: scheduleForm.value.paymentFrequencyId,
            start_date: scheduleForm.value.startDate ? formatDate(scheduleForm.value.startDate) : null,
            tax_rate: scheduleForm.value.taxRate
        });

        if (response.data.success) {
            scheduleData.value = response.data.data;
            activeTab.value = 1;

            toast.add({
                severity: 'success',
                summary: 'Cronograma Generado',
                detail: 'Se ha generado el cronograma de pagos',
                life: 3000
            });

            schedule.value = true;
        }
    } catch (error) {
        console.error('Error generando cronograma:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data?.message || 'Error al generar cronograma',
            life: 5000
        });
    } finally {
        loading.value.schedule = false;
    }
};

const simulationDetaill = (nombre, id, tea, plazo, retorno) => {
    chosenItem.value.nombre = nombre;
    chosenItem.value.id = id;
    chosenItem.value.tea = tea;
    chosenItem.value.plazo = plazo;
    chosenItem.value.retorno = retorno;
    detaill.value = true;
};

const onAmountChange = () => {
    if (!simulationForm.value.amount) {
        simulationResults.value = [];
        selectedRate.value = null;
        scheduleData.value = null;
        comparisonResults.value = [];
    }
};

const sumFormat = (amountA, amountB) => {
    console.log(amountA);
    console.log(amountB);
    return parseFloat(amountA.slice(3)) + parseFloat(amountB);
};

const formatMoney = (amount) => {
    if (!amount) return '0.00';
    return new Intl.NumberFormat('es-PE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
};

function verPDF(item) {
  if (!item.pdf_url) {
    toast.add({
      severity: 'warn',
      summary: 'Advertencia',
      detail: 'Esta cooperativa no tiene un PDF asociado',
      life: 3000
    })
    return
  }

  const link = document.createElement('a')
  link.href = `/storage/pdfs/${item.pdf_url}`
  link.download = `${item.cooperativa || 'documento'}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}


const simulateByAmount = async () => {
    if (!simulationForm.value.amount || simulationForm.value.amount < 100) {
        toast.add({
            severity: 'warn',
            summary: 'Atención',
            detail: 'Ingrese un monto válido (mínimo S/ 100)',
            life: 3000
        });
        return;
    }
    loading.value.simulate = true;
    try {
        const response = await simulationService.getSimulateByAmount({
            amount: simulationForm.value.amount
        });
        if (response.data.success) {
            simulationResults.value = response.data.data;
            selectedRate.value = null;
            scheduleData.value = null;
            comparisonResults.value = [];

            toast.add({
                severity: 'success',
                summary: 'Éxito',
                detail: `Se encontraron ${simulationResults.value.length} opciones`,
                life: 3000
            });

            simulationResponse.value;
        }
    } catch (error) {
        console.error('Error simulando:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data?.message || 'Error al buscar tasas',
            life: 5000
        });
    } finally {
        loading.value.simulate = false;
    }
};

/*const simulationResponse = computed(() => {
    let total = 0;
    let id = 0;
    simulationItems.value = [];
    simulationResults.value.forEach((coop) => {
        let datos = {};
        datos.id = id;
        datos.nombre = coop.cooperativa;
        datos.pdf_url = coop.pdf_url; // Agregar la URL del PDF
        coop.tipos_tasa.forEach((res) => {
            if (res.tipo_tasa == 'TEA') {
                let arreglo = [];
                if (res.tasas.length == 9) {
                    for (let i = res.tasas.length - 1; i >= 0; i--) {
                        arreglo.push([res.tasas[i].id, res.tasas[i].TEA, res.tasas[i].plazo_dias, res.tasas[i].retorno]);
                        datos.tea = arreglo;
                    }
                } else {
                    arreglo.push(['', '', '', ''], ['', '', '', ''], ['', '', '', '']);
                    for (let i = res.tasas.length - 1; i >= 0; i--) {
                        arreglo.push([res.tasas[i].id, res.tasas[i].TEA, res.tasas[i].plazo_dias, res.tasas[i].retorno]);
                        datos.tea = arreglo;
                    }
                    arreglo.splice(4, 0, ['', '', '', '']);
                    arreglo.splice(6, 0, ['', '', '', '']);
                    arreglo.push(['', '', '', '']);
                }
                simulationItems.value.push(datos);
                id++;
            }
        });
    });

    return total;
});*/

const simulationResponse = computed(() => {
    let total = 0;
    let id = 0;
    simulationItems.value = [];

    simulationResults.value.forEach((coop) => {
        let datos = {};
        datos.id = id;
        datos.nombre = coop.cooperativa;
        datos.pdf_url = coop.pdf_url;

        // Recorremos todos los tipos de tasa, no solo TEA
        coop.tipos_tasa.forEach((res) => {
            let arreglo = [];

            if (res.tasas.length === 9) {
                for (let i = res.tasas.length - 1; i >= 0; i--) {
                    arreglo.push([
                        res.tasas[i].id,
                        res.tasas[i].TEA,
                        res.tasas[i].plazo_dias,
                        res.tasas[i].retorno
                    ]);
                }
            } else {
                // Agregamos espacio vacío para mantener formato
                arreglo.push(['', '', '', ''], ['', '', '', ''], ['', '', '', '']);

                for (let i = res.tasas.length - 1; i >= 0; i--) {
                    arreglo.push([
                        res.tasas[i].id,
                        res.tasas[i].TEA,
                        res.tasas[i].plazo_dias,
                        res.tasas[i].retorno
                    ]);
                }

                arreglo.splice(4, 0, ['', '', '', '']);
                arreglo.splice(6, 0, ['', '', '', '']);
                arreglo.push(['', '', '', '']);
            }

            datos.tea = arreglo;
            simulationItems.value.push(datos);
            id++;
        });
    });

    return total;
});


onMounted(async () => {
    await loadPaymentFrequencies();
    scheduleForm.value.startDate = new Date();
});

const createInvestment = async () => {
    if (!chosenItem.value.id || !simulationForm.value.amount || !scheduleForm.value.paymentFrequencyId) {
        toast.add({
            severity: 'warn',
            summary: 'Atención',
            detail: 'Complete todos los campos requeridos',
            life: 3000
        });
        return;
    }

    loading.value.invest = true;

    try {
        const response = await fixedTermInvestmentService.store({
            fixed_term_rate_id: chosenItem.value.id,
            term_plan_id: 1,
            payment_frequency_id: scheduleForm.value.paymentFrequencyId,
            amount: simulationForm.value.amount
        });

        if (response.data.success) {
            toast.add({
                severity: 'success',
                summary: 'Inversión Creada',
                detail: 'Su inversión se ha creado exitosamente',
                life: 3000
            });

            detaill.value = false;

            simulationForm.value.amount = '';
            scheduleForm.value.paymentFrequencyId = null;
            scheduleForm.value.startDate = new Date();
        }
    } catch (error) {
        console.error('Error creando inversión:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data?.message || 'Error al crear la inversión',
            life: 5000
        });
    } finally {
        loading.value.invest = false;
    }
};
</script>
<template>
    <Breadcrumb :home="home" :model="items" />
    <Billetera />
    <br />
    <br />
    <div class="p-10 mb-10 rounded-3xl bg-[#F0F1F9]">
        <h3 class="m-0 text-[#171717]">Bolsa de entidades</h3>
        <p class="m-0 text-[#171717] pb-10">
            Aquí puedes consultar y hacer una simulación los cambios de la bolsa de entidades. Solo, ingresa el monto a
            invertir, elije el tipo de moneda y realiza la consulta. Luego presiona el botón calculadora para revisar
            los detalles.
        </p>

        <form class="">
            <div class="grid grid-cols-6 gap-0">
                <div class="col-span-6 lg:col-span-1 mb-3">
                    <label class="text-[#171717] font-bold md:text-left mb-1 md:mb-0 pr-4 py-3 static lg:absolute"
                        for="inline-full-name"> Monto a invertir </label>
                </div>
                <div class="col-span-3 lg:col-span-3 pe-3">
                    <InputNumber id="amount" v-model="simulationForm.amount" mode="currency" currency="PEN"
                        locale="es-PE" :min="100" :max="1000000" placeholder="Ingrese el monto" @input="onAmountChange"
                        class="!w-full general" />
                </div>
                <div class="col-span-3 lg:col-span-2">
                    <Button label="Show" @click="simulateByAmount"
                        class="!border-none !w-full !text-white !bg-[#171717] hover:!bg-[#6790FF] focus:!border-none focus:!bg-[#FF4929] !font-bold !rounded-3xl !px-5 !py-3 !me-3 !transition !duration-100 !ease-in">
                        <i class="pi pi-search inline-block align-middle me-2"></i>
                        <span class="inline-block align-middle">Consultar</span>
                    </Button>
                </div>
            </div>
        </form>

        <div v-if="simulationItems" class="relative overflow-x-auto rounded-3xl mt-10">
            <table class="w-full text-left rtl:text-right text-gray-500">
                <thead class="text-[#171717] border-b border-[#D9D9D9] bg-gray-50">
                    <tr>
                        <th scope="col" class="px-5 py-3">Entidad</th>
                        <th v-tooltip.top="'90 días'" scope="col" class="px-3 py-3">3 m.</th>
                        <th v-tooltip.top="'180 días'" scope="col" class="px-3 py-3">6 m.</th>
                        <th v-tooltip.top="'270 días'" scope="col" class="px-3 py-3">9 m.</th>
                        <th v-tooltip.top="'360 días'" scope="col" class="px-3 py-3">12 m.</th>
                        <th v-tooltip.top="'540 días'" scope="col" class="px-3 py-3">18 m.</th>
                        <th v-tooltip.top="'720 días'" scope="col" class="px-3 py-3">24 m.</th>
                        <th v-tooltip.top="'1080 días'" scope="col" class="px-3 py-3">36 m.</th>
                        <th v-tooltip.top="'1440 días'" scope="col" class="px-3 py-3">48 m.</th>
                        <th v-tooltip.top="'1800 días'" scope="col" class="px-3 py-3">60 m.</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in simulationItems" :key="item.id"
                        class="odd:bg-white even:bg-gray-50 text-[#171717]">
                        <th scope="row" class="px-5 py-3 font-medium">
                            <div class="flex items-center justify-between">
                                <span>{{ item.nombre }}</span>
                                <Button 
                                    @click="verPDF(item)"
                                    label="Más información"
                                    aria-label="Ver documento PDF" 
                                    variant="link"
                                    v-tooltip.top="'Ver más información en PDF'"
                                    class="!text-[#FF4929] hover:!text-[#6790FF] focus:!text-[#FF4929] !transition !duration-100 !ease-in !ml-2 !font-bold !text-sm" />

                            </div>
                        </th>
                        <td v-for="subitem in item.tea" :key="subitem.id" class="px-3 py-3">
                            {{ subitem[1] }}
                            <Button v-if="subitem[1] != ''"
                                @click="simulationDetaill(item.nombre, subitem[0], subitem[1], subitem[2], subitem[3])"
                                icon="pi pi-calculator" aria-label="Save" variant="link"
                                class="!text-black !w-[20px] hover:!text-[#6790FF] focus:!text-[#FF4929] !transition !duration-100 !ease-in" />
                            <span v-else>-</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <Dialog v-model:visible="detaill" modal class="!bg-white !m-5 !overflow-hidden" :style="{ width: '90rem' }">
            <template #header>
                <div class="inline-flex justify-center gap-2">
                    <h2 class="text-[#171717] block m-0">{{ chosenItem.nombre }}</h2>
                </div>
            </template>
            <div class="grid grid-cols-8 gap-0">
                <div class="col-span-8 md:col-span-4 mb-5">
                    <h3 class="text-[#171717] m-0"><span class="font-normal">Monto invertido:</span> S/ {{
                        formatMoney(simulationForm.amount) }}</h3>
                </div>
                <div class="col-span-8 md:col-span-4 text-end mb-5">
                    <Button label="Invertir" icon="pi pi-money-bill" :loading="loading.invest" @click="createInvestment"
                        class="!border-none !text-white !bg-[#FF4929] hover:!bg-[#6790FF] focus:!border-none focus:!bg-[#FF4929] !font-bold !rounded-3xl !px-5 !py-3 !transition !duration-100 !ease-in" />
                </div>
            </div>
            <div class="relative overflow-x-auto rounded-3xl mt-5">
                <table class="w-full text-left rtl:text-right text-gray-500">
                    <thead class="text-[#171717] border-b border-[#D9D9D9] bg-gray-50">
                        <tr>
                            <th scope="col" class="px-5 py-3">Tasa</th>
                            <th scope="col" class="px-5 py-3">Plazo</th>
                            <th scope="col" class="px-5 py-3">Interés ganado</th>
                            <th scope="col" class="px-5 py-3">Retorno total</th>
                            <th scope="col" class="px-5 py-3">Frecuencia de Pago</th>
                            <th scope="col" class="px-5 py-3">Fecha de Inicio</th>
                            <th scope="col" class="px-5 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="odd:bg-white even:bg-gray-50 text-[#171717]">
                            <th scope="row" class="px-5 py-3 font-medium text-nowrap">
                                {{ chosenItem.tea }}
                            </th>
                            <td class="px-5 py-3 text-nowrap">{{ chosenItem.plazo }} días</td>
                            <td class="px-5 py-3 text-nowrap">
                                {{ chosenItem.retorno }}
                            </td>
                            <td class="px-5 py-3 font-bold text-[#6790FF] text-nowrap">S/ {{
                                formatMoney(sumFormat(chosenItem.retorno, simulationForm.amount)) }}</td>
                            <td class="px-5 py-3">
                                <Dropdown v-model="scheduleForm.paymentFrequencyId" :options="paymentFrequencies"
                                    option-label="nombre" option-value="id" placeholder="Seleccionar frecuencia"
                                    class="!w-full !bg-white !text-[#171717] !rounded-3xl !px-5 !py-3" />
                            </td>
                            <td class="px-5 py-3">
                                <Calendar v-model="scheduleForm.startDate" date-format="dd/mm/yy"
                                    placeholder="Seleccionar fecha" class="!w-full border-calendar-gray general"
                                    :min-date="new Date()" />
                            </td>
                            <td class="px-5 py-3 text-nowrap text-end">
                                <Button label="Cronograma" icon="pi pi-eye" :loading="loading.schedule"
                                    :disabled="!scheduleForm.paymentFrequencyId" @click="generateSchedule"
                                    class="!border-none !text-white !bg-[#171717] hover:!bg-[#6790FF] focus:!border-none focus:!bg-[#FF4929] !font-bold !rounded-3xl !px-5 !py-3 !me-3 !transition !duration-100 !ease-in" />
                                <Button label="Excel" icon="pi pi-file-excel"
                                    class="border-general-black !border-none !text-[#171717] !bg-transparent hover:!bg-[#6790FF] focus:!border-none focus:!bg-[#FF4929] !font-bold !rounded-3xl !px-5 !py-3 !transition !duration-100 !ease-in" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Dialog>

        <Dialog v-model:visible="schedule" modal header="" class="!bg-white !m-5 !overflow-hidden"
            :style="{ width: '90rem' }">
            <template #header>
                <div class="inline-flex justify-center gap-2">
                    <h2 class="text-[#171717] block m-0">Cronograma</h2>
                </div>
            </template>
            <div v-if="scheduleData">
                <DataTable :value="scheduleData.cronograma" :paginator="true" :rows="6" size="small" :scrollable="true"
                    class="!rounded-3xl !overflow-hidden" scroll-height="400px">
                    <Column field="numero_pago" header="Mes" class="!text-[#171717] !py-3" sortable />
                    <Column field="fecha_cronograma" header="Cronograma" class="!text-[#171717] !py-3" sortable>
                        <template #body="slotProps">
                            <span class="text-[#171717]">{{ slotProps.data.fecha_cronograma }}</span>
                        </template>
                    </Column>
                    <Column field="fecha_pago" header="Fecha de Pago" class="!text-[#171717] !py-3" sortable>
                        <template #body="slotProps">
                            <span class="text-[#171717]">{{ slotProps.data.fecha_pago ?? '-' }}</span>
                        </template>
                    </Column>
                    <Column field="dias_periodo" header="Días" class="!text-[#171717] !py-3" sortable>
                        <template #body="slotProps">
                            <span class="text-[#171717]">{{ slotProps.data.dias_periodo ?? '-' }}</span>
                        </template>
                    </Column>
                    <Column field="monto_base" header="Monto base" class="!text-[#171717] !py-3" sortable>
                        <template #body="slotProps">
                            <span class="text-[#171717] text-nowrap">S/ {{ formatMoney(slotProps.data.monto_base)
                                }}</span>
                        </template>
                    </Column>
                    <Column field="interes_bruto" header="Interés base (S/.)" class="!text-[#171717] !py-3" sortable>
                        <template #body="slotProps">
                            <span v-if="slotProps.data.interes_bruto > 0" class="text-[#171717] text-nowrap"> S/ {{
                                formatMoney(slotProps.data.interes_bruto) }} </span>
                            <span v-else>-</span>
                        </template>
                    </Column>
                    <Column field="impuesto_2da" header="Impuesto 2da categoría" class="!text-[#171717] !py-3" sortable>
                        <template #body="slotProps">
                            <span v-if="slotProps.data.impuesto_2da > 0" class="text-[#FF4929] text-nowrap"> S/ {{
                                formatMoney(slotProps.data.impuesto_2da) }} </span>
                            <span v-else>-</span>
                        </template>
                    </Column>
                    <Column field="interes_neto" header="Interés a depositar" class="!text-[#171717] !py-3" sortable>
                        <template #body="slotProps">
                            <span v-if="slotProps.data.interes_neto > 0"
                                class="text-[#6790FF] font-semibold text-nowrap"> S/ {{
                                    formatMoney(slotProps.data.interes_neto) }} </span>
                            <span v-else>-</span>
                        </template>
                    </Column>
                    <Column field="devolucion_capital" header="Devolución capital" class="!text-[#171717] !py-3"
                        sortable>
                        <template #body="slotProps">
                            <span v-if="slotProps.data.devolucion_capital > 0"
                                class="text-[#FF4929] font-semibold text-nowrap"> S/ {{
                                    formatMoney(slotProps.data.devolucion_capital) }} </span>
                            <span v-else>-</span>
                        </template>
                    </Column>
                    <Column field="saldo_capital" header="Saldo de capital" class="!text-[#171717] !py-3" sortable>
                        <template #body="slotProps">
                            <span class="text-[#171717] text-nowrap">S/ {{ formatMoney(slotProps.data.saldo_capital)
                                }}</span>
                        </template>
                    </Column>
                    <Column field="total_a_depositar" header="Total a depositar" class="!text-[#171717] !py-3" sortable>
                        <template #body="slotProps">
                            <span v-if="slotProps.data.total_a_depositar > 0"
                                class="font-bold text-[#6790FF] text-nowrap"> S/ {{
                                    formatMoney(slotProps.data.total_a_depositar) }} </span>
                            <span v-else>-</span>
                        </template>
                    </Column>
                </DataTable>
            </div>

            <div class="mt-5 text-nowrap text-end">
                <Button label="Invertir" icon="pi pi-money-bill" :loading="loading.invest" @click="createInvestment"
                    class="!border-none !text-white !bg-[#FF4929] hover:!bg-[#6790FF] focus:!border-none focus:!bg-[#FF4929] !font-bold !rounded-3xl !px-5 !py-3 !me-3 !transition !duration-100 !ease-in" />

                <Button label="Excel" icon="pi pi-file-excel"
                    class="border-general-black !border-none !text-[#171717] !bg-transparent hover:!bg-[#6790FF] focus:!border-none focus:!bg-[#FF4929] !font-bold !rounded-3xl !px-5 !py-3 !me-3 !transition !duration-100 !ease-in" />
                <Button label="Volver" icon="pi pi-angle-left" @click="schedule = false"
                    class="!border-none !text-white !bg-[#171717] hover:!bg-[#6790FF] focus:!border-none focus:!bg-[#FF4929] !font-bold !rounded-3xl !px-5 !py-3 !transition !duration-100 !ease-in" />
            </div>
        </Dialog>
    </div>
</template>

<style>

</style>