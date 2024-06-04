<script setup>
import { watch, computed } from 'vue';
import { useCartStore } from '@/stores/cart';
import {Button} from "@/components/ui/button/index.ts";

const cartStore = useCartStore();

const totalPrice = computed(() => cartStore.cartItems.reduce((acc, item) => acc + parseFloat(item.price * item.quantity), 0))
const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 0 }).format(price);
};

watch(cartStore.cartItems, () => {
  localStorage.setItem('cart', JSON.stringify(cartStore.cartItems))
}, {deep: true})
</script>

<template>
    <h1 class="font-bold text-3xl mb-10 mt-7">Содержание корзины:</h1>


    <div v-auto-animate class="grid grid-cols-4 gap-5 mt-10 max-[1700px]:grid-cols-3
      max-[1110px]:grid-cols-2
      max-[765px]:grid-cols-1">
        <div v-for="item in cartStore.cartItems" :key="item.id" class="relative bg-white border border-slate-200 rounded-3xl p-8 cursor-pointer transition hover:-translate-y-2 hover:shadow-xl" >
            <div class="flex justify-between items-center">
              <img src="/like-1.svg" alt="Like 1" class="">
              <img @click="cartStore.deleteFromCart(item)" src="/close.svg" alt="Like 1" class="">
            </div>
            <a href=""><img :src="'/public/sneakers/' + item.img" alt="Sneaker"></a>
            <p class="mt-2 font-semibold">{{ item.title }}</p>
            <p>{{ item.content }}</p>
            <div class="flex justify-between mt-5">
                <div class="flex flex-col">
                    <span class="text-slate-400">Цена:</span>
                    <b>{{ item.price }} руб.</b>
                    <s>{{ item.oldPrice }}</s>
                </div>
              <div class="flex gap-3 items-center justify-between">
                <img
                   @click="cartStore.decrementQuantity(item)"
                   class="border rounded-md p-1"
                   width="25"
                   src="/minus-add.svg"
                   alt=""
                />
                {{ item.quantity }}
                <img
                   @click="cartStore.addToCart(item)"
                   class="border rounded-md p-1"
                   width="25"
                   src="/plus-add.svg"
                   alt=""
                />
              </div>
            </div>
        </div>
    </div>

    <p v-if="cartStore.cartItems.length > 0" class=" mt-3">
       <b>Сумма: </b>{{ formatPrice(totalPrice) }} руб
        <div class="flex mt-4 max-[436px]:flex-col max-[436px]:gap-3 ">
          <router-link to="/cart/order">
            <Button class="me-3 max-[436px]:w-full" variant="lime">
            Оформить заказ
            </Button>
          </router-link>
          <Button @click="cartStore.clearCart()" class="max-[436px]:w-full" variant="destructive">
            Очистить коризну
          </Button>
        </div>
    </p>

    <div v-else class="flex flex-col items-center ">
        <img class="mt-7" width="240" src="/package-icon.png" alt="">
       <h2 class=" w-full text-3xl text-center">Корзина пуста</h2>
        <router-link class="mt-7" to="/products">
          <Button class="text-md" variant="secondary">Набрать товаров</Button>
        </router-link>
    </div>
        
</template>