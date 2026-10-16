<template>
  <span :class="['status-chip', status === 'Betald' ? 'status-betald' : 'status-obetald']">{{
    invoice.status
  }}</span>
</template>

<script setup>
// Statusen på en faktura – samma chip i fakturalistan och i Storybook.
import { computed } from 'vue'
import { invoiceStatus } from '../utils/invoice.js'

const props = defineProps({
  invoice: { type: Object, required: true },
})

const status = computed(() => invoiceStatus(props.invoice, new Date()))
</script>
