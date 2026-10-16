<template>
  <div class="login-wrap">
    <div class="card login-card">
      <img src="../assets/logo-dark.svg" class="login-logo" alt="Kraftly" />
      <h1>Logga in på Mina sidor</h1>
      <label for="login-email">E-postadress</label>
      <input id="login-email" v-model="email" type="email" autocomplete="username" />
      <label for="login-password">Lösenord</label>
      <input
        id="login-password"
        v-model="password"
        type="password"
        autocomplete="current-password"
      />
      <KButton block :disabled="loading" @click="handleLogin">Logga in</KButton>
      <p v-if="error" role="alert" class="hint" style="color: #c0392b; margin-top: 10px">
        {{ error }}
      </p>
      <p class="hint" style="margin-top: 10px">
        Problem att logga in? Ring kundservice 020-123 456
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../services/api'
import { setAccessToken } from '../services/token'
import KButton from '../components/KButton.vue'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  try {
    const { accessToken } = await login(email.value, password.value)
    setAccessToken(accessToken)
    router.push('/')
  } catch {
    error.value = 'Fel e-postadress eller lösenord.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
label {
  display: block;
  font-size: 13px;
  color: #4a5468;
  margin-bottom: 4px;
}

.login-wrap {
  display: flex;
  justify-content: center;
  padding-top: 60px;
}
.login-card {
  width: 380px;
}
.login-logo {
  height: 34px;
  margin-bottom: 18px;
}
</style>
