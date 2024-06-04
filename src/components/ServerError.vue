<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const Load = () => {
   authStore.isLoading = true
   setTimeout(() => {
      authStore.isLoading = false
      window.location.reload()
   }, 4000)
}
</script>

<template>
   <div class="w-full min-h-[50vh] relative" v-if="authStore.serverError">
         <span
            class="flex flex-col items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
         >
            <h1 class="text-3xl font-bold text-red-500 text-center">
               {{ authStore.serverError }}
            </h1>

            <span
               v-if="authStore.isLoading && !authStore.errors"
               class="flex items-center justify-center mt-5"
            >
               <img width="40" src="/bouncing-ball.svg" alt="" />
            </span>

            <router-link
               @click="Load"
               class="border border-slate-300 bg-slate-100 text-slate-600 p-2 rounded-md mt-5 text-center hover:bg-slate-200 transition"
               to="/"
            >
               Перезагрузить
            </router-link>
         </span>
   </div>
</template>

<style scoped>

</style>