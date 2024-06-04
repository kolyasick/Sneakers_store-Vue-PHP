import { defineStore } from 'pinia'
import { useItemsStore } from './items.js'
import type { IProductsStore as ICartStore } from '../types/item.type'
import { reactive } from 'vue';
import axios from 'axios'
import { API_URL } from '../api/api.js';

interface IOrderDetails {
  name: string
  email: string
  phone: number | null
  address: string
  note: string
  cartItems: string
}

export const useCartStore = defineStore('cartItems', {
  state: () => reactive({
    cartItems: [] as ICartStore[],
    itemsStore: useItemsStore(),
    promocode: ['PROMO', 'PROMO2', 'PROMO3']
  }),
  actions: {
    addToCart(item: ICartStore) {
      if (item.quantity === 0) {
        item.isAdded = true
        item.quantity++
        this.cartItems.push(item)
      } else {
        item.quantity++
      }
    },
    decrementQuantity(item: ICartStore) {
      if (item.quantity > 1) {
        item.quantity--
      } else {
        this.deleteFromCart(item)
      }
    },
    deleteFromCart(item: ICartStore) {
      this.cartItems.splice(this.cartItems.indexOf(item), 1)
      item.quantity = 0
      item.isAdded = false
    },
    async makeOrder(payload: IOrderDetails) {

      try {
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }

        const formData = new FormData()
        formData.append('name', payload.name)
        formData.append('email', payload.email)
        formData.append('phone', payload.phone)
        formData.append('address', payload.address)
        formData.append('note', payload.note)
        formData.append('cartItems', payload.cartItems)

        let response = await axios.post(
          `${API_URL}/cart/order/post`,
          formData,
          config
        )
        console.log(response);

        this.clearCart()
        return true;  // Возвращаем true при успешном заказе
      } catch (error) {
        console.log(error);
        return false; // Возвращаем false при ошибке
      }
    },
    clearCart() {
      this.cartItems = []
      localStorage.removeItem('cart')
      this.itemsStore.items.forEach((item: ICartStore) => {
        item.quantity = 0
        item.isAdded = false
      })
    },
  },
})
