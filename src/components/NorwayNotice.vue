<template>
  <div v-if="enabled" class="card norway" data-testid="norway-notice">
    <h2>Hej Norge! Kraftly tar sig över gränsen</h2>
    <p>
      Nu växer vi västerut. Från och med i vår kan du som har elavtal i både Sverige och Norge följa
      din förbrukning och dina fakturor på ett och samma ställe, direkt här på Mina sidor. Inga fler
      inloggningar, inga fler flikar.
    </p>
  </div>
</template>

<script setup>
// Norge-stödet enligt CTO:ns expansionsplan. Ligger bakom en feature flag som sätts
// per miljö när containern startar: på i staging, av i produktion tills affären är klar.
// Att slå av den kräver ingen ny build och ingen rollback – bara en miljövariabel.
import { isEnabled } from '../utils/features'

const enabled = isEnabled('norway')
</script>

<style scoped>
.norway {
  border-left: 4px solid #ba0c2f;
}
</style>
