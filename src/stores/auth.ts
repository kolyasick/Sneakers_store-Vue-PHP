import { defineStore } from 'pinia'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { API_URL } from '../api/api'
import { ref } from 'vue'

interface IAuthStore {
   id: number | null
   role: string
   email: string
   name: string
}

const defaultValue: { user: IAuthStore } = {
   user: {
      id: null,
      email: '',
      name: '',
      role: '',
   },
}

export const useAuthStore = defineStore('authStore', {
   state: () => ({
      user: defaultValue.user,
      token: localStorage.getItem('token') || '',
      errors: null as string | null,
      router: useRouter(),
      message: null as string | null,
      serverError: null as string | null,
      isLoading: false,
   }),
   actions: {
      async register(payload: any) {
         this.isLoading = true
         this.errors = null

         if (!this.validateRegistrationData(payload)) {
            return
         }

         try {
            const config = {
               headers: {
                  'Content-Type': 'multipart/form-data',
               },
            }

            const formData = new FormData()
            formData.append('nickname', payload.nickname)
            formData.append('email', payload.email)
            formData.append('password', payload.password)
            formData.append('repeat_password', payload.repeatPassword)

            const response = await axios.post(
               `${API_URL}/users/register`,
               formData,
               config
            )
            this.message = 'Вы успешно зарегистрировались'
            setTimeout(() => {
               this.message = null
            }, 2000)
         } catch (error: string | any) {
            this.errors = error.response?.data || 'Неизвестная ошибка'
         } finally {
            this.isLoading = false
         }
      },
      async login(payload: any) {
         this.isLoading = true
         this.errors = null
         this.message = null

         const config = {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         }

         const formData = new FormData()
         formData.append('email', payload.email)
         formData.append('password', payload.password)

         try {
            let response = await axios.post<any>(
               `${API_URL}/users/login`,
               formData,
               config
            )

            this.token = response.data.message
            this.errors = null
            this.message = 'Вы успешно вошли'
            setTimeout(() => {
               this.message = null
            }, 2000)

            localStorage.setItem('token', response.data.message)

            await this.getUser()
         } catch (error: string | any) {
            switch (error.response?.data) {
               case 'Wrong password':
                  this.errors = 'Неправильный пароль'
                  break
               case 'No user with such email':
                  this.errors = 'Нет пользователя с таким email'
                  break
               case 'User is not confirmed':
                  this.errors = 'Пользователь не подтвержден'
                  break
               default:
                  this.errors = 'Что-то пошло не так'
            }
         } finally {
            this.isLoading = false
         }
      },
      async getUser() {
         try {
            await axios.get(`${API_URL}/users/info`,{
               headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
               }
            }) .then((response) => {
               this.user.id = response.data.id
               this.user.name = response.data.nickname
               this.user.role = response.data.role
               this.user.email = response.data.email
            })

         } catch (error) {
            this.logout()
         }
      },

      logout() {
         this.user.id = null
         this.user.email = ''
         this.user.name = ''
         this.user.role = ''

         localStorage.removeItem('token')
         this.router.push('/login')
      },
      validateRegistrationData(payload: any) {
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
         const passwordRegex = /^.{8,}$/
         const usernameRegex = /^[a-zA-Z]+[0-9]*$/

         if (
            !payload.nickname ||
            !payload.email ||
            !payload.password ||
            !payload.repeatPassword
         ) {
            this.errors = 'Необходимо заполнить все поля'
            return false
         } else if (!emailRegex.test(payload.email)) {
            this.errors = 'Некорректная почта, пример: example@mail.ru'
            return false
         } else if (!passwordRegex.test(payload.password)) {
            this.errors = 'Пароль должен содержать не менее 8 символов'
            return false
         } else if (!usernameRegex.test(payload.nickname)) {
            this.errors = 'Никнейм должен содержать только латинские буквы'
            return false
         } else if (payload.password !== payload.repeatPassword) {
            this.errors = 'Пароли не совпадают'
            return false
         }

         return true
      },
   },
})
