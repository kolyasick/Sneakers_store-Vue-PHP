<template>
    <div v-if="visible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-5 rounded-lg">
        <h2 class="text-xl font-bold mb-4">Заказ успешно выполнен</h2>
        <p>Ваш заказ был успешно отправлен. Спасибо за покупку!</p>
         <p class="text-center mt-2">Номер заказа:
            <b>
            {{ Math.floor(Math.random() * 500000) }}
            </b>
         </p>
        <button @click="close" class="mt-5 bg-lime-500 rounded-md py-2 px-4 text-white">Закрыть</button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, defineProps, defineEmits } from 'vue';
  import {useRouter} from 'vue-router'

  const router = useRouter()
  
  const props = defineProps({
    visible: {
      type: Boolean,
      required: true,
    },
  });
  
  const emit = defineEmits(['close']);
  
  const close = () => {
    emit('close');
    router.push('/')
  };
  </script>
  
  <style scoped>
  /* Добавьте стили для вашего модального окна */
  </style>
  