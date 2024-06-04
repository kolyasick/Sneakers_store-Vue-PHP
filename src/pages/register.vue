<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Input } from '../components/ui/input/index'
import { Button } from '../components/ui/button/index'

const authStore = useAuthStore()
const nickname = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const repeatPassword = ref<string>('')
const router = useRouter()

const shaking = ref<boolean>(false)

const shake = () => {
   shaking.value = true
   setTimeout(() => {
      shaking.value = false
   }, 500)
}

const register = async () => {
   await authStore.register({
      email: email.value,
      password: password.value,
      nickname: nickname.value,
      repeatPassword: repeatPassword.value,
   })

   if (!authStore.errors) {
      authStore.isLoading = true
      setTimeout(() => {
         router.push('/login')
         authStore.isLoading = false
      }, 2000)
   }
}

watch(() => authStore.errors, () => {
   shake()
})
</script>

<template>
   <div class="flex flex-col items-center">
      <h1 class="text-3xl mb-10 font-bold">Регистрация</h1>

      <form
         class="flex flex-col items-center gap-3 border border-gray-300 rounded-2xl p-6 w-1/4 shadow-2xl shadow-black"
         @submit.prevent="register"
      >
         <Input
            v-model="nickname"
            class="w-full"
            type="text"
            placeholder="Имя"
            name="nickname"
         />
         <Input
            v-model="email"
            class="w-full"
            type="text"
            placeholder="Почта"
            name="email"
         />
         <Input
            v-model="password"
            class="w-full"
            type="password"
            placeholder="Пароль"
            name="password"
         />
         <Input
            v-model="repeatPassword"
            class="w-full"
            type="password"
            placeholder="Подтвердите пароль"
         />

         <div class="w-full">
            <Button
               class="mt-3 mb-2 w-full text-md"
               :disabled="authStore.message"
               variant="secondary"
            >
               {{
                  authStore.message ? authStore.message : 'Зарегистрироваться'
               }}
            </Button>
            <span v-if="authStore.errors" class="flex gap-2 items-start">
               <p :class="{shake: shaking}" class="w-100 text-red-500 font-semibold leading-4">
                  {{ authStore.errors }}
               </p>
            </span>
            <span
               v-if="authStore.isLoading && !authStore.errors"
               class="flex items-center justify-center -mb-5"
            >
               <img width="40" src="/bouncing-ball.svg" alt="" />
            </span>
            <div class="mt-5 flex gap-2">
               <p>Уже есть аккаунт?</p>
               <router-link class="underline text-blue-500" to="/login"
                  >Войти</router-link
               >
            </div>
         </div>
      </form>
   </div>
</template>

<style scoped>

</style>
