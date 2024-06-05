import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'
import { API_URL } from '../api/api'
import type { IProductsStore } from '../types/item.type'
import type { ICategories } from '../types/item.type'
import { useCartStore } from './cart'

export const useItemsStore: any = defineStore('itemsStore', {
   state: () => ({
      items: [] as IProductsStore[],
      errors: null as string | null,
      auth: useAuthStore(),
      categories: [] as ICategories[],
      cartStore: useCartStore()
   }),
   actions: {
      async fetchItems() {
         this.errors = null

         try {
            this.errors = null
            const { data } = await axios.get<IProductsStore[]>(
               `${API_URL}/product/all`
            )
            this.items = data.map((item: IProductsStore) => ({
               ...item,
               isAdded: this.cartStore.cartItems.some((cartItem: IProductsStore) => cartItem.id === item.id),
               quantity:
                  this.cartStore.cartItems.find((cartItem: IProductsStore) => cartItem.id === item.id)
                     ?.quantity || 0,
            }))
         } catch (error) {
            this.auth.serverError =
               'Сервис недоступен, уже разбираемся с этим. Код ошибки: 500'
         }
      },
      async fetchCategories() {
         try {
            const { data } = await axios.get<ICategories[]>(
               `${API_URL}/categories/all`
            )
            this.categories = data
         } catch (error) {
            this.auth.serverError =
               'Сервис недоступен, уже разбираемся с этим. Код ошибки: 500'
         }
      },
      async fetchFilters(params: string, type: 'query' | 'category') {
         this.errors = null

         const stroke = type === 'category' ? `/categories/` : '/search?q='

         try {
            const { data } = await axios.get(`${API_URL}${stroke}${params}`)

            if (data !== null) {
               this.items = data.map((item: IProductsStore) => ({
                  ...item,
                  isAdded: this.cartStore.cartItems.some((cartItem: IProductsStore) => cartItem.id === item.id),
                  quantity:
                     this.cartStore.cartItems.find((cartItem: IProductsStore) => cartItem.id === item.id)
                        ?.quantity || 0,
               }))
            }
            else {
               this.items = []
               this.errors = `По вашему запросу "${params}" ничего не найдено`
               console.log(this.errors)
            }
         } catch (error) {
            this.auth.serverError = 'Сервер недоступен, уже разбираемся с этим'
         }
      },
   },
})
