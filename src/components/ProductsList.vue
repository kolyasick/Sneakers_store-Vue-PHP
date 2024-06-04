<script setup lang="ts">

import Product from '@/components/Product.vue'
import { useCartStore } from '@/stores/cart'
import type { IProductsStore } from '@/types/item.type'


interface Props{
   items: IProductsStore
}

defineProps<Props>()

</script>

<template>
   <Product
      v-for="item in items"
      :key="item.id"
      :item="item"
   />
</template>

<style scoped>

</style>