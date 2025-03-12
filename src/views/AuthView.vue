<script setup lang="ts">

import {GoogleLogin} from "vue3-google-login";
import {useSupabase} from "@/composables/supabase.ts";
import {useUserStore} from "@/stores/user.ts";

const supabase = useSupabase()
const userStore = useUserStore()
const onAuthenticated = async (response: any) => {
  try {

    const {data, error} = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: response.credential,
    })

    userStore.setUser(data.user)
  } catch (e) {
    console.error(e)
    alert(e)
  }
}

</script>

<template>
  <div>
    <GoogleLogin :callback="onAuthenticated"/>
  </div>
</template>

<style scoped>

</style>