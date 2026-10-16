<template>
  <div>
    <h1>Fakturor</h1>
    <div class="card">
      <table>
        <tr>
          <th>Faktura</th>
          <th>Period</th>
          <th>Belopp</th>
          <th>Förfaller</th>
          <th>Status</th>
          <th></th>
        </tr>
        <tr v-for="invoice in invoices" :key="invoice.id">
          <td>{{ invoice.id }}</td>
          <td>{{ invoice.period }}</td>
          <td>{{ invoice.amount }} kr</td>
          <td>{{ invoice.due }}</td>
          <td>
            <StatusChip :invoice="invoice" />
          </td>
          <td>
            <KButton v-if="invoice.downloadable" variant="text" @click="downloadInvoice(invoice)"
              >Ladda ner</KButton
            >
          </td>
          <!-- Bara synas om fakturan finns som URL -->
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchInvoices } from '../services/api'
import StatusChip from '../components/StatusChip.vue'
import KButton from '../components/KButton.vue'

const invoices = ref([])

onMounted(async () => {
  invoices.value = await fetchInvoices()
})

const downloadInvoice = (invoice) => {
  // PDF generation coming in phase 2 per the quote
  console.log('download', invoice.id)
  alert('Nedladdning kommer snart')
}
</script>
