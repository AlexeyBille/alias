<script setup lang="ts">

import { Button, DataTable, Column, Dialog, InputText } from 'primevue'
import router from '@/router'
import { GAME_STATE, GAME_TYPES, useGameStore } from '@/stores/game.ts'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const gameStore = useGameStore()
const { state, gameType, team } = storeToRefs(gameStore)

const dialogVisible = ref(false)
const selectedIndex = ref(-1)
const selectedName = ref('')

const openAddDialog = () => {
  selectedIndex.value = -1
  selectedName.value = ''
  dialogVisible.value = true
}

const openEditDialog = (index: number) => {
  selectedIndex.value = index
  selectedName.value = team.value[index].name
  dialogVisible.value = true
}

const deleteElement = (index: number) => {
  team.value.splice(index, 1)
}

const save = () => {
  if (selectedIndex.value === -1) {
    team.value.push({ name: selectedName.value })
  } else {
    team.value[selectedIndex.value] = { name: selectedName.value }
  }

  closeDialog()
}

const closeDialog = () => {
  selectedIndex.value = -1
  dialogVisible.value = false
}

const goForward = () => {
  state.value = GAME_STATE.SELECT_PACK
}

const goBack = () => {
  state.value = GAME_STATE.CONFIGURE
}
</script>

<template>
  <div class="w-[200px]">
    <div>
      <DataTable :value="team">
        <Column field="name" :header="gameType === GAME_TYPES.PERSONAL ? 'Игрок' : 'Команда'"></Column>
        <template #footer>
          <Button icon="pi pi-plus" aria-label="Add" label="Добавить" @click="openAddDialog" />
        </template>
        <Column>
          <template #body="slotProps">
            <i class="pi pi-pencil cursor-pointer" @click="openEditDialog(slotProps.index)"></i>
            <i class="pi pi-trash cursor-pointer ml-2" @click="deleteElement(slotProps.index)"></i>
          </template>
        </Column>
      </DataTable>
      <div class="flex justify-between gap-2 mt-5">
        <Button severity="secondary" label="Назад" @click="goBack" class="w-full" />
        <Button type="submit" severity="primary" label="Далее" :disabled="team.length < 2" @click="goForward"
                class="w-full" />
      </div>
    </div>

    <Dialog v-model:visible="dialogVisible" modal header="Добавить">
      <form @submit.prevent="save">
        <div class="flex items-center gap-4 mb-4">
          <label for="name" class="font-semibold w-24">Имя</label>
          <InputText id="name" class="flex-auto" v-model="selectedName" autocomplete="off" autofocus />
        </div>
        <div class="flex justify-end gap-2">
          <Button type="button" label="Отмена" severity="secondary" @click="closeDialog" class="w-full"></Button>
          <Button type="submit" label="Сохранить" class="w-full"></Button>
        </div>
      </form>
    </Dialog>
  </div>
</template>

<style scoped>

</style>