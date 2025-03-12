<script setup lang="ts">
import {useUserStore} from "@/stores/user.ts";
import {storeToRefs} from "pinia";
import AuthView from "@/views/AuthView.vue";
import {Toolbar, Button, Avatar} from "primevue";
import {onMounted} from "vue";

const userStore = useUserStore();

const {isAuthenticated, user} = storeToRefs(userStore)

onMounted(() => {
  console.log(user.value?.user_metadata.avatar_url)
})

</script>

<template>

  <Toolbar class="h-[6vh]! rounded-none!">
    <template #end>
      <div class="flex items-center gap-2 " v-if="isAuthenticated">
        <Avatar :image="user?.user_metadata?.avatar_url" shape="circle" class="h-[3vh]! w-[3vh]!"/>
      </div>
    </template>
  </Toolbar>
  <main class="h-[94vh]">
    <div class="h-full flex items-center justify-center">
      <AuthView v-if="!isAuthenticated"/>
      <slot v-else/>
    </div>
  </main>
</template>

<style scoped>

</style>