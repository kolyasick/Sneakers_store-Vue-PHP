<script setup lang="ts">
import { onMounted } from 'vue'
import { useItemsStore } from '@/stores/items'
import { useAuthStore } from '@/stores/auth'
import { Input } from '../components/ui/input'

const itemsStore = useItemsStore()
const authStore = useAuthStore()

const filters = ($event: any) => {
   $event.target.value == 0
      ? itemsStore.fetchItems()
      : itemsStore.fetchFilters($event.target.value, 'category')
}

const search = ($event: any) => {
   itemsStore.fetchFilters($event.target.value, 'query')
}

onMounted(() => {
   itemsStore.fetchCategories()
})

</script>

<template>
   <div class="p-10 main-wrapper max-[450px]:p-5">
      <div
         v-if="$route.path == '/products' && authStore.user.name !== ''"
         class="flex justify-between items-center max-[528px]:justify-center"
      >
         <h2 class="text-3xl font-bold mb-8"></h2>

         <div class="flex gap-4 max-[528px]:flex-col-reverse
         max-[528px]:items-start
         max-[528px]:gap-5
         max-[528px]:items-center
         max-[528px]:justify-center max-[528px]:w-full">
            <select
               @change="filters($event)"
               class="select py-2 px-3 border rounded-md outline-none bg-white
               text-gray-700 border-gray-300 focus:border-black focus:ring
               focus:ring-black focus:ring-opacity-50 transition duration-150
               ease-in-out
               max-[528px]:w-3/4"
            >
               <option value="0">Все кроссовки</option>
               <option
                  v-for="category in itemsStore.categories"
                  :key="category.id"
                  :value="category.id"
                  class="text-gray-700 bg-white hover:bg-gray-100"
               >
                  {{ category.title }}
               </option>
            </select>

            <div class="relative max-[528px]:w-3/4">
               <img
                  class="absolute left-4 top-3"
                  src="/public/search.svg"
                  alt="Search"
               />
               <Input
                  @input="search($event)"
                  class="border rounded-md py-2 pl-11 pr-4 outline-none
                  focus:border-gray-400 transition placeholder:text-[15px]
                  "
                  placeholder="Поиск..."
               />
            </div>
         </div>
      </div>

      <slot />
   </div>
</template>
