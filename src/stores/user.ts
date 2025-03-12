import {defineStore} from "pinia";
import {computed, ref} from "vue";
import type {User} from "@supabase/supabase-js";
import {StorageSerializers, useStorage} from "@vueuse/core";

export const useUserStore = defineStore('userStore', () => {
    const user =  useStorage<User|null>('auth-user', null, undefined, { serializer: StorageSerializers.object });

    const isAuthenticated = computed(() => !!user.value)

    const setUser = (val: User|null) => user.value = val

    return {isAuthenticated, user, setUser}
})