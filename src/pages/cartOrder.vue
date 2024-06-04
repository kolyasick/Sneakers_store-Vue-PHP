<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { computed, watch, ref } from "vue";
import OrderSuccessful from '@/components/OrderSuccessful.vue';
import { useRouter } from 'vue-router';
import number = CSS.number
import { Button } from '@/components/ui/button'

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

const name = ref<string>('')
const phone = ref<number | null>(null)
const address = ref<string>('')
const note = ref<string>('')
const discount = ref<number>(1)

const totalPrice = computed(() => cartStore.cartItems.reduce((acc, item) => acc + ((((item.price * item.quantity) + (item.price * item.quantity * 0.05)) * discount.value)), 0))
const tax = computed(() => Math.round(totalPrice.value * 0.05))

interface IOrderDetails {
    name: string
    email: string
    phone: number | null
    address: string
    note: string
    cartItems: string
}

const orderDetails = computed<IOrderDetails>(() => ({
    name: name.value,
    email: authStore.user.email,
    phone: phone.value,
    address: address.value,
    note: note.value,
    cartItems: JSON.stringify(cartStore.cartItems.map(item => ({ ...item })))
}));

const isModalVisible = ref(false);

watch(cartStore.cartItems, () => {
  localStorage.setItem('cart', JSON.stringify(cartStore.cartItems))
}, {deep: true})

const itemsQty = computed(() => cartStore.cartItems.reduce((acc, item) => acc + item.quantity, 0))

const handleOrder = async () => {
   if (cartStore.cartItems.length === 0) {
      return
   }
  try {
    const success = await cartStore.makeOrder(orderDetails.value);
    if (success) {
      isModalVisible.value = true;
    }
  } catch (error) {
    console.error(error);
  }
};

const isFormEmpty = () => {
  return !name.value || !phone.value || !address.value;
}

const promocode = ref<string>('')
const isPromocodeValid = ref<'default' | 'valid' | 'invalid'>('default')

const handlePromocode = () => {
   if (cartStore.promocode.includes(promocode.value)) {
      isPromocodeValid.value = 'valid'
      discount.value = 0.9
   } else {
      isPromocodeValid.value = 'invalid'
      discount.value = 1
   }
}

watch(promocode, () => {
   isPromocodeValid.value = 'default'
})
</script>

<template>
  <div class="flex justify-between items-center mt-3">
    <h1 class="font-bold text-3xl mb-10">Оформление заказа</h1>
  </div>

  <div class="flex gap-5
  max-[1478px]:flex-col
  ">
    <form @submit.prevent="handleOrder" class="border border-gray-300 border rounded-xl w-3/4 p-5 inline-block
    max-[1478px]:w-full">
      <input
         v-model="name"
         class="bg-gray-200 w-full border rounded-md p-2"
         type="text"
         placeholder="ФИО">
      <input
         disabled
         class="bg-gray-200 w-full rounded-md p-2 mt-5"
         type="e-mail"
         placeholder="e-mail"
         :value="authStore.user.email">
      <input
         v-model="phone"
         @input="phone = phone.replace(/[^0-9+]/g, '')"
         class="bg-gray-200 w-full rounded-md p-2 mt-5"
         type="tel"
         placeholder="Телефон">
      <input
         v-model="address"
         class="bg-gray-200 w-full rounded-md p-2 mt-5"
         type="text"
         placeholder="Адрес доставки">
      <textarea
         v-model="note"
         class="bg-gray-200 w-full border rounded-md p-2 mt-5"
         placeholder="Комментарий"
         cols="30" rows="5">
      </textarea>
      <input
         :disabled="isFormEmpty() || cartStore.cartItems.length === 0"
         class="mt-5 disabled:hover:shadow-none
         disabled:cursor-not-allowed bg-lime-500
         w-full rounded-md py-3 text-white cursor-pointer
         disabled:bg-slate-300 hover:bg-lime-600 hover:shadow-lg
         transition active:bg-lime-700"
         type="submit"
         value="Оформить заказ">
    </form>

    <div class="border border-gray-300 border rounded-xl w-1/2 p-5 flex flex-col justify-between gap-4 relative
    max-[1478px]:w-full">
      <div>
        <p class="text-2xl mt-5">Товары:</p>
      </div>
      <div v-auto-animate :class="{'overflow-y-auto': cartStore.cartItems.length > 2}" class="grid grid-cols-1 gap-5 h-72 p-3">
        <div v-for="item in cartStore.cartItems" class="card relative flex items-center border border-slate-200 p-4 rounded-xl gap-4 h-32
        max-[644px]:flex-col
        max-[644px]:h-72
        max-[644px]:items-start
        max-[644px]:w-full
        max-[644px]:place-items-center">
          <img :src="'/sneakers/' + item.img" class="w-25 h-28
          max-[644px]:w-36
          max-[644px]:h-32
          max-[644px]:self-center
          max-[356px]:w-full
          max-[356px]:h-24" alt="s">
          <div class="flex flex-col">
            <p class="mt-2">{{ item.title }}</p>
            <div class="flex justify-between mt-2">
              <b>{{ item.price }} руб.</b>
            </div>
            <p>{{ item.quantity }} шт.</p>
          </div>
          <img @click="cartStore.deleteFromCart(item)" class="close-img opacity-40 hover:opacity-100 cursor-pointer transition absolute right-6 top-6" src="/close.svg" alt="close">
        </div>
      </div>

      <div class="self-end w-full">
        <div class="justify-self-end mb-5">
          <p class="mt-6 font-semibold">Есть промокод на скидку?</p>
          <div class="flex gap-2 items-end
          max-[534px]:flex-col">
             <div class="relative w-2/4 max-[534px]:w-full">
               <input
                  :disabled="isPromocodeValid === 'valid'"
                  v-model="promocode"
                  class="bg-gray-200 w-full border rounded-md mt-2 p-2 disabled:text-slate-400"
                  type="text"
                  placeholder="Ввести промокод"
               >
                <img v-if="isPromocodeValid === 'valid'" class="absolute top-3 right-1" src="/checked.svg" alt="">
                <svg v-if="isPromocodeValid === 'invalid'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="absolute top-3 right-1" width="30" height="30">
                   <path fill="#FF0000" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
             </div>
            <Button
               class="max-[534px]:w-full"
               :disabled="isPromocodeValid === 'valid' || promocode === ''"
               @click="handlePromocode"
               variant="lime"
               >Применить
            </Button>
          </div>
        </div>
        <div class="flex gap-2 justify-self-end">
          <span>Кол-во:</span>
          <div class="flex-1 border-b border-dashed"></div>
          <b>{{itemsQty}} шт.</b>
        </div>
        <div class="flex gap-2 justify-self-end">
          <span>Налог 5%:</span>
          <div class="flex-1 border-b border-dashed"></div>
          <b>{{ tax }} руб.</b>
        </div>
        <div class="flex gap-2 justify-self-end">
          <span>Сумма с учетом налога:</span>
          <div class="flex-1 border-b border-dashed"></div>
          <b>{{ Math.round(totalPrice) }} руб.</b>
        </div>
      </div>
    </div>
  </div>
   <transition>
      <OrderSuccessful :visible="isModalVisible" @close="isModalVisible = false" />
   </transition>
</template>

<style>
.v-enter-active,
.v-leave-active {
   transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
   opacity: 0;
}
</style>
