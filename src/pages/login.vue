<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Button } from '../components/ui/button/index'
import { Input } from '../components/ui/input/index'

const authStore = useAuthStore()
const email = ref<string>('')
const password = ref<string>('')
const router = useRouter()

const shaking = ref<boolean>(false)

const shake = () => {
   shaking.value = true
   setTimeout(() => {
      shaking.value = false
   }, 500)
}

const signin = async () => {
   if (!email.value || !password.value) {
      authStore.errors = 'Необходимо заполнить все поля'
   } else {
      await authStore.login({ email: email.value, password: password.value })
      if (!authStore.errors) {
         authStore.isLoading = true

         setTimeout(() => {
            router.push('/')
            authStore.isLoading = false
         }, 2000)
      }
   }
}

watch(() => authStore.errors, () => {
   shake()
})

</script>

<template>
   <div class="flex flex-col items-center mt-5">
      <h1 class="text-3xl mb-10 font-bold text-[#18181B]">Войдите в аккаунт</h1>

      <form
         @submit.prevent="signin"
         class="border border-gray-300 rounded-2xl p-6 w-1/4 flex flex-col shadow-2xl shadow-black
         max-[1720px]:w-1/3
         max-[1310px]:w-1/2
         max-[906px]:w-full
"
      >
         <div class="flex flex-col gap-3">
            <Input
               @input="authStore.errors = null"
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
         </div>

         <div class="w-full">
            <Button
               variant="secondary"
               class="w-full mt-5 mb-2 text-md"
               :disabled="authStore.message"
            >
               {{ authStore.message ? authStore.message : 'Войти' }}
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
            <div class="mt-5 flex gap-2 max-[504px]:flex-col max-[504px]:items-start">
               <p>Нет аккаунта?</p>
               <router-link class="underline text-blue-500" to="/register"
                  >Зарегистрироваться</router-link
               >
            </div>
         </div>
      </form>
   </div>
</template>

<style scoped>
@keyframes shake {
   0%, 100% { transform: translateX(0); }
   10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
   20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.shake {
   animation: shake 0.5s ease-in-out;
}
</style>
