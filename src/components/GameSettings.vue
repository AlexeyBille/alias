<script setup lang="ts">

import {GAME_STATE, GAME_TYPES, useGameStore} from "@/stores/game.ts";
import {storeToRefs} from "pinia";
import {reactive, ref} from "vue";
import {Slider, Message, Button, SelectButton} from "primevue";
import {Form, type FormResolverOptions} from "@primevue/forms";
import type {FormSubmitEvent} from "@primevue/forms/form";
import router from "@/router";

const gameStore = useGameStore();

const {gameType,state, time} = storeToRefs(gameStore)

const initialValues = reactive({
  time: time.value,
  gameType: gameType.value
});
const resolver = (options: FormResolverOptions) => {
  const errors: Record<string, { message: string }[]> = {};

  return {
    values: options.values,
    errors
  };
};

const gameTypes = [
  {name: "Каждый за себя", value: GAME_TYPES.PERSONAL},
  {name: "Командная игра", value: GAME_TYPES.TEAM},
]

const onFormSubmit = (e: FormSubmitEvent) => {
  if (e.valid) {
    time.value = e.values.time;
    state.value = GAME_STATE.SELECT_TEAM
  }
};

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <Form v-slot="$form" :resolver="resolver" :initialValues="initialValues" @submit="onFormSubmit"
        class="flex flex-col gap-4 w-[250px]">
    <div class="flex flex-col gap-4">
      <label for="time">Тип игры:</label>
      <SelectButton name="gameType" :options="gameTypes" optionLabel="name" option-value="value"/>
      <Message v-if="$form.gameType?.invalid" severity="error" size="small" variant="simple">
        {{ $form.gameType.error?.message }}
      </Message>
    </div>
    <div class="flex flex-col gap-4">
      <label for="time">Время игры: {{ $form.time?.value }} секунд</label>
      <Slider name="time" :min="60" :max="300" :step="30" class="w-full"/>
      <Message v-if="$form.time?.invalid" severity="error" size="small" variant="simple">{{
          $form.time.error?.message
        }}
      </Message>
    </div>
    <div class="flex justify-between gap-2">
      <Button severity="secondary" label="Назад" @click="goBack" class="w-full"/>
      <Button type="submit" severity="primary" label="Далее" class="w-full"/>
    </div>
  </Form>
</template>

<style scoped>

</style>