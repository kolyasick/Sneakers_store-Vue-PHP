<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'

const authStore = useAuthStore()
const cartStore = useCartStore()

const user = computed(() => authStore.user)
</script>

<template>
   <header
      class="flex justify-between
      max-[666px]:flex-col
      max-[666px]:items-center
      max-[666px]:gap-7
      max-[450px]:px-5
      border-b border-slate-200 px-10 py-8 mx-auto"
   >
      <div class="flex items-center gap-4">
         <img src="/public/logo.png" alt="Logo" class="w-10" />
         <div class="">
            <h2 class="text-xl font-bold uppercase">
               <router-link to="/products">Vue3 + PHP</router-link>
            </h2>
            <p class="text-slate-400">Магазин лучших кроссовок</p>
         </div>
      </div>

      <ul class="nav-list flex items-center gap-7">
         <li
            class="flex items-center gap-3 cursor-pointer text-gray-500 hover:text-black"
         >
            <router-link class="flex items-center gap-3" to="/cart">
               <div class="relative">
                  <img src="/public/cart.svg" alt="Cart" />
                  <p class="text-[12px] absolute -top-3 -right-2 pt-1 text-white flex items-center justify-center bg-orange-500 rounded-full w-3.5 h-3.5">
                     {{cartStore.cartItems.length}}
                  </p>
               </div>

               <b class="cart">Корзина</b>
            </router-link>
         </li>

         <li
            v-if="user.name === ''"
            class="flex items-center gap-3 cursor-pointer text-gray-500 hover:text-black"
         >
            <img src="/public/profile.svg" alt="Profile" />
            <span>
               <router-link
                  to="/login"
                  class="fs-6 btn btn-outline-success text-success btn-profile"
               >
                  <b>Войти</b>
               </router-link>
            </span>
         </li>
         <li
            v-if="user.name !== ''"
            class="flex items-center gap-3 cursor-pointer text-gray-500 hover:text-black"
         >
            <span>
               <b
                  @click="authStore.logout()"
                  class="text-red-500 hover:text-red-800"
               >
                  Выйти
               </b>
            </span>
         </li>
         <li
            v-if="user.name !== ''"
            class="flex items-center gap-3 cursor-pointer text-gray-500 hover:text-black"
         >
            <img src="/public/profile.svg" alt="Profile" />
            <router-link :to="user ? '/profile' : '/login'">
               <b>{{ user.name }}</b>
            </router-link>
         </li>
      </ul>
   </header>
</template>

<style scoped>

</style>
