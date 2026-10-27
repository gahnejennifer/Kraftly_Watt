<template>
  <div>
    <h1>Flyttanmälan</h1>
    <div class="card" style="max-width: 560px">
      <p style="margin-bottom: 14px">Fyll i uppgifterna nedan så flyttar vi ditt elavtal.</p>
      <KField
        v-model="form.address"
        label="Ny adress"
        autocomplete="street-address"
        :error="errors.address"
      />
      <KField
        v-model="form.zip"
        label="Postnummer"
        inputmode="numeric"
        autocomplete="postal-code"
        :error="errors.zip"
      />
      <KField v-model="form.city" label="Ort" autocomplete="address-level2" :error="errors.city" />
      <KField v-model="form.date" label="Inflyttningsdatum (ÅÅÅÅ-MM-DD)" :error="errors.date" />
      <label for="contract">Avtal</label>
      <select id="contract" v-model="form.contract">
        <option disabled value="">Välj avtal</option>
        <option>Rörligt pris</option>
        <option>Fast pris 1 år</option>
        <option>Fast pris 3 år</option>
      </select>
      <p v-if="errors.contract" style="color: #b42318">{{ errors.contract }}</p>
      <KButton @click="submit">Skicka flyttanmälan</KButton>
      <p class="hint" style="margin-top: 8px">Anmälan måste göras senast 14 dagar före flytt</p>
      <p v-if="reference" style="color: #067647; margin-top: 10px">
        Tack! Referensnummer: {{ reference }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import KButton from '../components/KButton.vue'
import KField from '../components/KField.vue'
import { submitMove } from '../services/api'
import { validateMove } from '../utils/validateMove.js'

const form = reactive({ address: '', zip: '', city: '', date: '', contract: '' })
const errors = ref({})
const reference = ref(null)

// validateMove ger true/false per fält. Här översätter vi false till ett meddelande.
const messages = {
  address: 'Ange din nya adress',
  zip: 'Postnummer ska vara fem siffror',
  city: 'Ange ort',
  date: 'Flyttdatumet måste vara minst 14 dagar från idag (ÅÅÅÅ-MM-DD)',
  contract: 'Välj ett avtal',
}

const submit = async () => {
  const validation = validateMove(form)
  const found = {}
  for (const field in messages) {
    if (!validation[field]) found[field] = messages[field]
  }
  errors.value = found
  if (Object.keys(found).length > 0) return

  const res = await submitMove(form)
  reference.value = res.ref
}
</script>
