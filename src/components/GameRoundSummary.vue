<script setup lang="ts">

import { GAME_STATE, GAME_TYPES, useGameStore } from '@/stores/game.ts'
import { storeToRefs } from 'pinia'
import { computed, onMounted, reactive, ref } from 'vue'
import { DataTable, Column, Button, SelectButton } from 'primevue'

const gameStore = useGameStore()

const { roundNumber, history, currentPlayer } = storeToRefs(gameStore)

const roundHistory = computed(() => {
  return history.value.filter(historyItem => historyItem.round === roundNumber.value)
})

const countIsCorrect = computed(() => {
  return roundHistory.value.length
})

const nextRound = () => {
  gameStore.prepareRound()
}
</script>

<template>
  <div>
    <p class="mb-2">Игрок {{ currentPlayer.name }}</p>
    <p class="mb-2">Раунд {{ roundNumber }}</p>
    <p class="mb-2">Угадали слов: {{ countIsCorrect }} </p>
    <DataTable :value="roundHistory">
      <Column field="word.word" header="Слово"></Column>
      <Column field="isCorrect" header="Угадали?" dataType="boolean">
        <template #body="{ data }">
          <i class="pi"
             :class="{ 'pi-check-circle text-green-500': data.isCorrect, 'pi-times-circle text-red-400': !data.isCorrect }"></i>
        </template>
      </Column>
    </DataTable>
    <div class="flex justify-between gap-2 mt-2">
      <Button type="submit" severity="primary" label="Далее" @click.prevent="nextRound" class="w-full"/>
    </div>
  </div>
</template>

<style scoped>

</style>