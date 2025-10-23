<!-- CustomToggle.vue -->
<template>
    <div class="relative inline-flex items-center cursor-pointer select-none" @click="toggle">
        <div class="w-14 h-7 rounded-full flex items-center transition-colors duration-300"
            :class="isOn ? 'bg-emerald-500' : 'bg-amber-500'">
            <!-- SI label -->
            <span class="absolute text-sm font-bold left-3 transition-opacity duration-200"
                :class="isOn ? 'opacity-100 text-white' : 'opacity-0'">
                SI
            </span>

            <!-- NO label -->
            <span class="absolute text-sm font-bold right-2 transition-opacity duration-200"
                :class="isOn ? 'opacity-0' : 'opacity-100 text-black'">
                NO
            </span>

            <!-- Circle -->
            <div class="bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300"
                :class="isOn ? 'translate-x-8' : 'translate-x-0'"></div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    modelValue: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue'])

const isOn = computed(() => props.modelValue)
const toggle = () => emit('update:modelValue', !isOn.value)
</script>
