<script setup lang="ts">
import Layout from './layouts/default.vue'
import { onMounted, watch, ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'

import { useItemsStore } from './stores/items'
import { useCartStore } from './stores/cart'
import { useAuthStore } from './stores/auth'

const itemsStore = useItemsStore()
const cartStore = useCartStore()
const authStore = useAuthStore()
const route = useRoute()

onMounted(async () => {
   const localCart = localStorage.getItem('cart')
   cartStore.cartItems = localCart ? JSON.parse(localCart) : []

   await itemsStore.fetchItems()
   await authStore.getUser()
})


watch(
   () => route.path,
   () => {
      authStore.errors = null
      authStore.message = null
      authStore.isLoading = false
   },
   { immediate: true }
)
</script>

<template>
   <Layout>
      <RouterView />
   </Layout>
</template>

<style scoped></style>
