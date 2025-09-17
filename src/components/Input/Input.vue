<script setup lang="ts">
import {ref} from "vue";
import type {Emits, Props} from "@/components/Input/type.ts";

const emit = defineEmits<Emits>()
const {
    value = '',
    type = 'text',
    placeholder,
    maxLength,
    error = false
} = defineProps<Props>()
const input = ref<string>(value || '');

function handleBlur() {
    emit('onBlur', input.value.trim())
}
</script>

<template>
    <input
        v-if="['text', 'password'].includes(type)"
        :maxlength="maxLength"
        :class="['w-full border rounded-md p-1 align-top', { 'border-red-500': error }]"
        v-model="input"
        @blur="handleBlur"
        :type="type"
        :placeholder="placeholder"/>

    <textarea
        v-else
        :maxlength="maxLength"
        :class="['border rounded-md p-1 resize-none align-top', { 'border-red-500': error }]"
        v-model="input"
        @blur="handleBlur"
        :placeholder="placeholder"
        rows="1"/>
</template>