<script setup lang="ts">
import { useItemsStore } from '@/stores/items'
import { onMounted, watch } from 'vue'
import { useCartStore } from '@/stores/cart'
import ProductsList from '@/components/ProductsList.vue'

const itemsStore = useItemsStore()
const cartStore = useCartStore()

watch(
   cartStore.cartItems,
   () => {
      localStorage.setItem('cart', JSON.stringify(cartStore.cartItems))
   },
   { deep: true }
)
</script>

<template>
   <h2 class="text-3xl font-bold mb-8 mt-7">Все кроссовки</h2>
   <span
      v-if="itemsStore.errors"
      class="w-full m-auto flex items-center justify-center mt-10"
   >
      <p class="text-red-500 font-semibold text-2xl text-center">
         {{ itemsStore.errors }}
      </p>
   </span>
   <div v-auto-animate class="grid grid-cols-4
      max-[1700px]:grid-cols-3
      max-[1110px]:grid-cols-2
      max-[765px]:grid-cols-1
      gap-5 mt-10"
   >
      <ProductsList :items="itemsStore.items "/>
   </div>
</template>

<style scoped></style>
