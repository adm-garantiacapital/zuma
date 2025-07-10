<template>
<div class="p-10 my-10 rounded-3xl bg-[#F0F1F9]">
        <div class="grid grid-cols-8 gap-0">
            <div class="col-span-8 lg:col-span-4 mb-5">
                <h3 class="m-0 text-[#171717]">Mi billetera</h3>
                <p class="m-0 text-[#171717]">Puedes utilizar ambas monedas al momento de hacer la inversión.
                </p>
            </div>
            <div class="col-span-8 lg:col-span-4 text-end mb-5">
                <Button label="Calcular" icon="pi pi-plus"
                    class="!border-none !text-white !bg-[#171717] hover:!bg-[#6790FF] focus:!border-none focus:!bg-[#FF4929] !font-bold !rounded-3xl !px-5 !py-3 !me-3 !transition !duration-100 !ease-in" />
                <Button label="Retiro" icon="pi pi-minus"
                    class="border-general-black !border-none !text-[#171717] !bg-transparent hover:!bg-[#6790FF] focus:!border-none focus:!bg-[#FF4929] !font-bold !rounded-3xl !px-5 !py-3 !transition !duration-100 !ease-in" />
                <Button v-if="wallet" @click="showWallet" icon="pi pi-angle-up" aria-label="Mostrar Billetera"
                    variant="link" class="!text-black" />
                <Button v-else @click="showWallet" icon="pi pi-angle-down" aria-label="Mostrar Billetera" variant="link"
                    class="!text-black" />
            </div>
            <div class="col-span-8">
                <button type="button"
                    class="text-[#171717] bg-white focus:outline-none hover:bg-[#6790FF] focus:bg-[#FF4929] font-bold rounded-3xl px-5 py-3 me-3 transition duration-100 ease-in">
                    <img src="/imagenes/zuma/pen.png" alt="Logo Zuma" class="inline-block me-2" width="20" />
                    <span class="inline-block align-middle">PEN</span>
                </button>
                <div v-if="wallet" class="grid grid-cols-3 gap-4 my-5">
                    <div class="col-span-3 lg:col-span-1">
                        <div class="rounded-3xl bg-white relative p-10">
                            <i
                                class="pi pi-wallet text-[#171717] !text-[2.8rem] inline-block align-top mt-5 mb-3 me-10"></i>
                            <div class="inline-block">
                                <h5 class="text-[#171717] m-0 font-semibold">Saldo disponible</h5>
                                <h3 class="text-[#171717] m-0 font-bold">S/ 0.00</h3>
                                <a class="text-[#6790FF] m-0 font-medium">Ver más...</a>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-3 lg:col-span-1">
                        <div class="rounded-3xl bg-white relative p-10">
                            <i
                                class="pi pi-building-columns text-[#171717] !text-[2.8rem] inline-block align-top mt-5 mb-3 me-10"></i>
                            <div class="inline-block">
                                <h5 class="text-[#171717] m-0 font-semibold">Total invertido</h5>
                                <h3 class="text-[#171717] m-0 font-bold">S/ 0.00</h3>
                                <a class="text-[#6790FF] m-0 font-medium">Ver más...</a>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-3 lg:col-span-1">
                        <div class="rounded-3xl bg-white relative p-10">
                            <i
                                class="pi pi-money-bill text-[#171717] !text-[2.8rem] inline-block align-top mt-5 mb-3 me-10"></i>
                            <div class="inline-block">
                                <h5 class="text-[#171717] m-0 font-semibold">Retorno esperado</h5>
                                <h3 class="text-[#171717] m-0 font-bold">S/ 0.00</h3>
                                <a class="text-[#6790FF] m-0 font-medium">Ver más...</a>
                            </div>
                        </div>
                    </div>
                </div>
                <button type="button"
                    class="text-[#171717] bg-white focus:outline-none hover:bg-[#6790FF] focus:bg-[#FF4929] font-bold rounded-3xl px-5 py-3 me-3 transition duration-100 ease-in">
                    <img src="/imagenes/zuma/usd.png" alt="Logo Zuma" class="inline-block me-2" width="20" />
                    <span class="inline-block align-middle">USD</span>
                </button>
                <div v-if="wallet" class="grid grid-cols-3 gap-4 mt-5">
                    <div class="col-span-3 lg:col-span-1">
                        <div class="rounded-3xl bg-white relative p-10">
                            <i
                                class="pi pi-wallet text-[#171717] !text-[2.8rem] inline-block align-top mt-5 mb-3 me-10"></i>
                            <div class="inline-block">
                                <h5 class="text-[#171717] m-0 font-semibold">Saldo disponible</h5>
                                <h3 class="text-[#171717] m-0 font-bold">$ 0.00</h3>
                                <a class="text-[#6790FF] m-0 font-medium">Ver más...</a>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-3 lg:col-span-1">
                        <div class="rounded-3xl bg-white relative p-10">
                            <i
                                class="pi pi-building-columns text-[#171717] !text-[2.8rem] inline-block align-top mt-5 mb-3 me-10"></i>
                            <div class="inline-block">
                                <h5 class="text-[#171717] m-0 font-semibold">Total invertido</h5>
                                <h3 class="text-[#171717] m-0 font-bold">$ 0.00</h3>
                                <a class="text-[#6790FF] m-0 font-medium">Ver más...</a>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-3 lg:col-span-1">
                        <div class="rounded-3xl bg-white relative p-10">
                            <i
                                class="pi pi-money-bill text-[#171717] !text-[2.8rem] inline-block align-top mt-5 mb-3 me-10"></i>
                            <div class="inline-block">
                                <h5 class="text-[#171717] m-0 font-semibold">Retorno esperado</h5>
                                <h3 class="text-[#171717] m-0 font-bold">$ 0.00</h3>
                                <a class="text-[#6790FF] m-0 font-medium">Ver más...</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const wallet = ref(false);

const showWallet = () => {
    if (wallet.value) {
        wallet.value = false
    } else {
        wallet.value = true
    }
}

</script>