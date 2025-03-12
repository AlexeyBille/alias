<script setup lang="ts">

import { Button, RadioButton, ProgressSpinner } from 'primevue'
import { GAME_STATE, useGameStore } from '@/stores/game.ts'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useSupabase } from '@/composables/supabase.ts'
import type Word from '@/models/word.ts'

const supabase = useSupabase()

const gameStore = useGameStore()
const { state, pack, words } = storeToRefs(gameStore)
const loading = ref(false)
const loadingGame = ref(false)
const packs = ref<any[]>([])


onMounted(async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('packs')
    .select()

  packs.value = data as any[]
  loading.value = false
})
const goBack = () => {
  state.value = GAME_STATE.SELECT_TEAM
}

const startGame = async () => {
  loadingGame.value = true
  const { data, error } = await supabase
    .from('pack_words')
    .select()
    .eq('pack_id', pack.value.id)

  words.value = data as Word[]
  gameStore.prepareRound()
  loadingGame.value = false
}

</script>

<template>
  <div class="flex flex-col">
  <h2>Наборы:</h2>

  <ProgressSpinner strokeWidth="8" fill="transparent" animationDuration=".5s" v-if="loading"
                   class="w-[50px]! h-[50px]! my-4!" />
  <div class="my-4 flex flex-col gap-2" v-else>

    <div v-for="packItem in packs" :key="packItem.id" class="flex items-center gap-2">
      <RadioButton v-model="pack" :inputId="'pack-' + packItem.id" name="dynamic" :value="packItem" />
      <label :for="'pack-' + packItem.id">{{ packItem.name }}</label>
    </div>
  </div>

  <div class="flex justify-between gap-2">
    <Button severity="secondary" label="Назад" @click="goBack" />
    <Button type="submit" severity="primary" label="Далее" :disabled="!pack" :loading="loadingGame" @click="startGame"/>
  </div>
  </div>
</template>

<style scoped>

</style>