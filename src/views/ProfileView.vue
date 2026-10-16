<template>
  <div>
    <h1>Mina uppgifter</h1>
    <div v-if="store.user" class="card" style="max-width: 560px">
      <div class="field">
        <span class="field-label">Kundnummer</span>
        <span>{{ store.user.customerNo }}</span>
      </div>
      <label for="name">Namn</label>
      <input id="name" v-model="name" type="text" />
      <label for="email">Mejladress</label>
      <input id="email" v-model="email" type="text" />
      <label for="address">Postadress</label>
      <input id="address" v-model="address" type="text" />
      <KButton @click="save">Spara ändringar</KButton>
      <KButton variant="secondary" style="margin-left: 10px" @click="reset">Ångra</KButton>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import KButton from '../components/KButton.vue'
import { useUserStore } from '../stores/user'

const store = useUserStore()
const name = ref('')
const email = ref('')
const address = ref('')

const reset = () => {
  name.value = store.user.name
  email.value = store.user.email
  address.value = store.user.address
}

const save = () => {
  store.save({ name: name.value, email: email.value, address: address.value })
}

onMounted(async () => {
  if (!store.user) await store.load()
  reset()
})
</script>

<style scoped>
.field {
  display: flex;
  justify-content: space-between;
  padding: 8px 0 14px;
  font-size: 14px;
}
.field-label {
  color: #5c6679;
}
</style>
