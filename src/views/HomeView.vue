<script setup lang="ts">
import {Button} from "primevue"
import { useGameStore } from '@/stores/game.ts'
import router from '@/router'

const gameStore = useGameStore()

gameStore.reset()

const newGame = () => {
  gameStore.reset()
  router.push('/game')
}

</script>

<template>
  <section class="pt-5">
      <Button @click.prevent="newGame">
        Новая игра
      </Button>
  </section>
</template>
