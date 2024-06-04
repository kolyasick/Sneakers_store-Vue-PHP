<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useItemsStore } from '@/stores/items'
import { useCartStore } from '@/stores/cart'

import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import Reviews from '@/components/Reviews.vue'

const router = useRouter()
const authStore = useAuthStore()
const itemsStore = useItemsStore()
const cartStore = useCartStore()


onMounted(() => {
   itemsStore.fetchCategories()
})
</script>

<template>
   <main class="mt-6">
      <section
         class="cover rounded-xl text-slate-200 flex py-10 items-center w-full"
      >
         <div
            class="cover__left-side relative w-1/2 h-4/6 border rounded-xl border-slate-200 p-5 ms-10 bg-white p-6 rounded-xl shadow-lg backdrop-blur-lg backdrop-filter backdrop-blur-lg bg-opacity-10"
         >
            <h1 style="padding-top: 1.3em" class="text-5xl font-bold">
               Магазин лучших кроссовок
            </h1>
            <p class="text-xl mt-8">
               Мы позиционируемся на продаже самых брендированных и качественных
               кроссовок во всем мире!
            </p>
            <div class="flex gap-4 mt-10 items-center absolute bottom-10">
               <router-link
                  class="border border-slate-200 p-4 rounded-md"
                  to="/products"
                  >Каталог товаров</router-link
               >

               <a class="" href="">О нас</a>
            </div>
         </div>
      </section>

      <h1 class="font-bold text-4xl my-10 text-slate-700">
         Список наших спонсоров и брендов
      </h1>

      <section class="brends__cover my-10"></section>

      <section class="my-10">
         <h1 class="font-bold text-4xl mb-10 text-slate-700">
            Акции этой недели
         </h1>

         <div class="grid grid-cols-4 gap-5">
            <div
               v-for="item in itemsStore.items.slice(0, 4)"
               :key="item.id"
               class="relative bg-white border border-slate-200 rounded-3xl p-8 cursor-pointer transition hover:-translate-y-2 hover:shadow-xl"
            >
               <img
                  src="/public/like-1.svg"
                  alt="Like 1"
                  class="absolute top-8 left-8"
               />
               <a href=""
               ><img :src="'/public/sneakers/' + item.img" alt="Sneaker"
               /></a>
               <p class="mt-2 font-semibold">{{ item.title }}</p>
               <p>{{ item.content }}</p>
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
                     <p class="text-slate-500">В корзине</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <section>
         <h1 class="font-bold text-4xl my-10 text-slate-700">
            Категории товаров
         </h1>
         <div class="flex mb-5 gap-3 mx-auto items-center justify-evenly">
            <router-link
               v-for="category in itemsStore.allCategories"
               class="w-1/4 hover:bg-gray-300 transition border rounded-md border-gray-400 p-3 mb-2 text-center"
               to="/products"
            >
               <div>
                  <h2
                     class="category-title text-2xl font-bold mb-2 text-gray-700"
                  >
                     <p>{{ category.title }}</p>
                  </h2>
                  <p>{{ category.description }}</p>
               </div>
            </router-link>
         </div>
      </section>

      <Reviews />
   </main>
</template>

<style scoped></style>
