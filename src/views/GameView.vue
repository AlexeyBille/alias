<script setup lang="ts">
import { useGameStore } from '@/stores/game.ts'
import GameSettings from '@/components/GameSettings.vue'
import GamePackSelector from '@/components/GamePackSelector.vue'
import { storeToRefs } from 'pinia'
import { GAME_STATE } from '@/stores/game.ts'
import GameTeamSelection from '@/components/GameTeamSelection.vue'
import GameConfirmation from '@/components/GameConfirmation.vue'
import GameRound from '@/components/GameRound.vue'
import GameRoundSummary from '@/components/GameRoundSummary.vue'


const gameStore = useGameStore()

const { state } = storeToRefs(gameStore)

</script>

<template>
  <GameSettings v-if="state === GAME_STATE.CONFIGURE" />
  <GameTeamSelection v-else-if="state === GAME_STATE.SELECT_TEAM" />
  <GamePackSelector v-else-if="state === GAME_STATE.SELECT_PACK" />
  <GameConfirmation v-else-if="state === GAME_STATE.ROUND_PENDING" />
  <GameRound v-else-if="state === GAME_STATE.ROUND_RUNNING" />
  <GameRoundSummary v-else-if="state === GAME_STATE.ROUND_SUMMARY" />
</template>

<style scoped>

</style>