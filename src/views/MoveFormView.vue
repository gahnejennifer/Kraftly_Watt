<template>
  <div>
    <h1>Flyttanmälan</h1>
    <div class="card" style="max-width: 560px">
      <p style="margin-bottom: 14px">Fyll i uppgifterna nedan så flyttar vi ditt elavtal.</p>
      <input v-model="form.address" type="text" placeholder="Ny adress" />
      <input v-model="form.zip" type="text" placeholder="Postnummer" />
      <input v-model="form.city" type="text" placeholder="Ort" />
      <input v-model="form.date" type="text" placeholder="Inflyttningsdatum (ÅÅÅÅ-MM-DD)" />
      <select v-model="form.contract">
        <option disabled value="">Välj avtal</option>
        <option>Rörligt pris</option>
        <option>Fast pris 1 år</option>
        <option>Fast pris 3 år</option>
      </select>
      <BaseButton @click="submit">Skicka flyttanmälan</BaseButton>
      <p class="hint" style="margin-top: 8px">Anmälan måste göras senast 14 dagar före flytt</p>
      <p v-if="reference" style="color: #12b76a; margin-top: 10px">
        Tack! Referensnummer: {{ reference }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import BaseButton from '../components/BaseButton.vue'
import { submitMove } from '../services/api'
import { validateMove } from '../utils/validateMove.js'

const form = reactive({ address: '', zip: '', city: '', date: '', contract: '' })
const reference = ref(null)

const submit = async () => {
  const validation = validateMove(form)
  if (
    !validation.address ||
    !validation.zip ||
    !validation.city ||
    !validation.date ||
    !validation.contract
  ) {
    if (!validation.date) {
      alert('Flyttdatumet måste vara minst 14 dagar från idag.')
      return
    }

    alert('Vänligen fyll i alla fält')
    return
  }
  const res = await submitMove(form)
  reference.value = res.ref
}
</script>
