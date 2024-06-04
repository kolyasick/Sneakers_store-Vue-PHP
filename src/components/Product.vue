<script setup lang="ts">
import type {IProductsStore} from '@/types/item.type'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()

interface Props{
   item: IProductsStore
}

defineProps<Props>()
</script>

<template>

   <div
      class="relative bg-white border border-slate-200 rounded-3xl
      p-8 cursor-pointer transition hover:-translate-y-2 hover:shadow-xl"
   >
      <img
         src="/public/like-1.svg"
         alt="Like 1"
         class="absolute top-8 left-8"
      />
      <a href=""
      ><img class="xl:w-72" :src="'/public/sneakers/' + item.img" alt="Sneaker"
      /></a>
      <p class="mt-2 font-semibold">{{ item.title }}</p>
      <div class="flex justify-between mt-5">
         <div class="flex flex-col">
            <span class="text-slate-400">Цена:</span>
            <b>{{ item.price }} руб.</b>
            <s>{{ item.oldPrice }}</s>
         </div>
         <p
            v-if="!item.isAdded"
            @click="cartStore.addToCart(item)"
            class="hover:scale-110 transition"
         >
            <img
               :src="item.isAdded ? '/checked.svg' : '/plus.svg'"
               alt="Plus"
            />
         </p>
         <div v-else class="flex flex-col justify-between">
            <div class="flex gap-3 items-center justify-between">
               <img
                  @click="cartStore.decrementQuantity(item)"
                  class="border rounded-md p-1"
                  width="25"
                  src="/minus-add.svg"
                  alt=""
               />
               <p class="text-slate-700">{{ item.quantity }}</p>
               <img
                  @click="cartStore.addToCart(item)"
                  class="border rounded-md p-1"
                  width="25"
                  src="/plus-add.svg"
                  alt=""
               />
            </div>
            <p class="text-slate-500 text-center">В корзине</p>
         </div>
      </div>
   </div>

</template>

<style scoped>

</style>