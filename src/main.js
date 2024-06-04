import '/assets/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'

import { useAuthStore } from './stores/auth'
import { useCartStore } from './stores/cart'

import Home from './pages/main.vue'
import Products from './pages/products.vue'
import Register from './pages/register.vue'
import Login from './pages/login.vue'
import App from './App.vue'
import Cart from './pages/cart.vue'
import Profile from './pages/profile.vue'
import CartOrder from './pages/cartOrder.vue'

const routes = [
   { path: '/', component: Products, name: 'home' },
   { path: '/products', component: Products, name: 'products' },
   { path: '/register', component: Register, name: 'register' },
   { path: '/login', component: Login, name: 'login' },
   { path: '/cart', component: Cart, name: 'cart' },
   { path: '/cart/order', component: CartOrder, name: 'cartOrder' },
   { path: '/profile', component: Profile, name: 'profile' },
]

const router = createRouter({
   history: createWebHistory(),
   routes,
})
router.beforeEach((to, from, next) => {
   const authStore = useAuthStore()
   const cartStore = useCartStore()

   if (
      localStorage.getItem('token') == null &&
      to.name !== 'login' &&
      to.name !== 'register'
   ) {
      next({ name: 'login' })
   } else if (
      localStorage.getItem('token') &&
      (to.name === 'login' || to.name === 'register')
   ) {
      next({ name: 'home' })
   } else if (
      to.name === 'cartOrder' &&
      cartStore.cartItems.length === 0
   ) {
      next({ name: 'products' });
   } else {
      next()
   }
})

createApp(App)
   .use(createPinia())
   .use(router)
   .use(autoAnimatePlugin)
   .mount('#app')
