<script setup lang="ts">
import { useGameStore } from '@/stores/game.ts'
import { Button, Column, DataTable } from 'primevue'
import { storeToRefs } from 'pinia'

const gameStore = useGameStore()

const { currentPlayer, team } = storeToRefs(gameStore)


</script>

<template>
  <div>
    <DataTable :value="team">
      <Column field="name" header="Игрок"></Column>
      <Column field="points" header="Очки" dataType="boolean">
        <template #body="{ index, data }">
          {{ gameStore.getPlayerPoints(index) }}
        </template>
      </Column>
    </DataTable>
    <p class="mb-4 mt-4">Текущий игрок: <b>{{ currentPlayer.name }}</b></p>
    <Button @click="gameStore.startRound()" class="w-full">Начать</Button>
  </div>
</template>

<style scoped>

</style>