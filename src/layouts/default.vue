<script setup>
import Header from '@/components/Header.vue'
import SearchBlock from '@/components/SearchBlock.vue'
import { useAuthStore } from '@/stores/auth'
import ServerError from '@/components/ServerError.vue'

const authStore = useAuthStore()

</script>

<template>
   <div class="bg-white w-4/5 m-auto rounded-xl shadow-xl mt-14">
      <Header />

      <ServerError v-if="authStore.serverError" />

      <SearchBlock v-else>
         <slot />
      </SearchBlock>
   </div>
</template>
