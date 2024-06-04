<script setup lang="ts">
import { ref, watchEffect, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {API_URL} from '@/api/api'

const authStore = useAuthStore()
const location = ref('Locating…')

const name = ref(authStore.user.name)
const email = ref(authStore.user.email)
const password = ref<string>('')
const errors = ref<string | null>(null)
const message = ref<string | null>(null)
const isModalOpen = ref<boolean>(false)
const shaking = ref<boolean>(false)

watchEffect(() => {
   name.value = authStore.user.name
   email.value = authStore.user.email
})

async function getCityAndCountry(latitude: number, longitude: number) {
   try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
         params: {
            lat: latitude,
            lon: longitude,
            format: 'json'
         }
      })

      const address = response.data.address
      const city = address.city || address.town || address.village
      const country = address.country
      location.value = `${city}, ${country}`
   } catch (error) {
      location.value = 'Unable to retrieve your location'
   }
}

onMounted(() => {
   if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
         (position) => {
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
            getCityAndCountry(latitude, longitude)
         },
         () => {
            location.value = 'Unable to retrieve your location'
         }
      )
   } else {
      location.value = 'Geolocation is not supported by your browser'
   }
})

const showPassword = ref(false)

const openModal = () => {

   isModalOpen.value = true


   document.body.style.overflow = 'hidden'
}

const closeModal = () => {
   isModalOpen.value = false
   showPassword.value = false
   errors.value = null
   message.value = null
   name.value = authStore.user.name
   email.value = authStore.user.email
   password.value = ''
   document.body.style.overflow = ''
}

const shake = () => {
   shaking.value = true
   setTimeout(() => {
      shaking.value = false
   }, 500)
}

const updateUser = async () => {

   const config = { headers: { 'Content-Type': 'multipart/form-data' } }
   const formData = new FormData()
   formData.append('email', email.value)
   formData.append('nickname', name.value)
   formData.append('password', password.value)

   if (showPassword.value && password.value) {

      try {
         await axios.post(`${API_URL}/personal/${authStore.user.id}/edit`, formData, config)

         errors.value = null
         message.value = 'Данные успешно обновлены'
         setTimeout(() => {message.value = null; closeModal()}, 1500)

         await authStore.getUser()

         showPassword.value = false
         password.value = ''
      } catch (error: string | any) {
         errors.value = error.response.data === 'Wrong password' ? 'Неправильный пароль'
            : error.response.data === 'Email exists' ? 'Такая почта уже существует'
               : error.response.data === 'Wrong nickname format' ? 'Неверный формат имени'
                  : ''
         shake()
         return
      }
   } else if (authStore.user.name === name.value && authStore.user.email === email.value) {
      return
   } else {
      showPassword.value = true
   }
}

</script>

<template>
   <div class="flex justify-center gap-20 items-end">
      <div class="border shadow-xl p-12 rounded-xl w-3/4
      max-[900px]:w-full max-[900px]:p-5">
         <div class="w-48 h-48 mx-auto bg-indigo-100 rounded-full shadow-2xl flex items-center justify-center text-indigo-500
         max-[372px]:w-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24" viewBox="0 0 20 20" fill="currentColor">
               <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
         </div>

         <div class="flex gap-20 items-center border-b justify-center">
            <div class="mt-20 text-center pb-8">
               <h1 class="text-4xl font-medium text-gray-700">{{ authStore.user.name }}, <span class="font-light text-gray-500">18</span></h1>
               <p class="font-light text-gray-600 mt-3">{{ location }}</p>
               <p class="mt-8 text-gray-500">{{authStore.user.role === 'admin' ? 'Главный администратор' : 'Пользователь'}}</p>
               <p class="mt-2 text-gray-500">
                  Расскажите о себе...
               </p>
            </div>
         </div>
         <p @click="openModal" class="text-center text-indigo-500 cursor-pointer mt-5">Редактировать профиль</p>
      </div>

      <transition name="modal">
         <div v-if="isModalOpen" class="modal-backdrop">
            <div class="modal-content border shadow-xl p-40 rounded-xl">
               <h2 class="text-2xl font-medium text-gray-700 my-7 text-center">Редактировать профиль</h2>
               <form @submit.prevent="updateUser" class="border border-gray-300 rounded-2xl p-6 flex flex-col h-full">
                  <div class="flex flex-col gap-3">
                     <Input v-model="name" class="w-full" type="text" placeholder="Имя" name="name" />
                     <Input v-model="email" class="w-full" type="text" placeholder="Почта" name="email" />
                     <transition-group name="fade">
                        <div v-if="showPassword" class="password-container flex flex-col gap-3">
                           <Input v-model="password" class="w-full" type="password" placeholder="Пароль" name="password" />
                        </div>
                        <span class="text-red-500" :class="{ 'shake': shaking }" v-if="errors">{{ errors }}</span>
                        <span class="text-green-500" v-if="message">{{ message }}</span>
                     </transition-group>
                  </div>

                  <div class="w-full">
                     <Button
                        type="submit"
                        variant="secondary"
                        class="w-full mt-5 mb-2 text-md disabled:cursor-not-allowed disabled:bg-gray-300"
                        :disabled="authStore.user.name === name && authStore.user.email === email"
                     >
                        {{showPassword ? 'Сохранить' : 'Изменить'}}
                     </Button>
                  </div>
                  <Button @click="closeModal" variant="destructive" class="w-full mt-2 opacity-80">Отмена</Button>
                  <p v-if="showPassword" :class="{ 'shake': showPassword }" class=" text-gray-500 mt-2">Подтвердите пароль</p>
               </form>
            </div>
         </div>
      </transition>
   </div>
</template>

<style>
@keyframes shake {
   0%, 100% { transform: translateX(0); }
   10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
   20%, 40%, 60%, 80% { transform: translateX(10px); }
}

.shake {
   animation: shake 0.5s ease-in-out;
}

.modal-backdrop {
   position: fixed;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   background: rgba(0, 0, 0, 0.5);
   display: flex;
   justify-content: center;
   align-items: center;
   z-index: 1000;
}

.modal-content {
   background: white;
   padding: 20px;
   border-radius: 10px;
   width: 400px;
}

.modal-enter-active, .modal-leave-active {
   transition: opacity 0.5s ease;
}

.modal-enter-from, .modal-leave-to {
   opacity: 0;
}

.fade-enter-active, .fade-leave-active {
   transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
   opacity: 0;
}
</style>
