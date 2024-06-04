<script setup lang="ts"></script>

<template>
   <section id="reviews">
      <h1 class="font-bold text-4xl my-10 text-slate-700">
         Отзывы покупателей
      </h1>

      <div class="grid grid-cols-4 gap-5">
         <div
            class="relative bg-white border border-slate-200 rounded-md p-8 text-center mb-10"
         >
            <h2 class="font-semibold text-lg text-center mb-5"></h2>
            <p class="mb-5"></p>
            <img
               width="100"
               class="absolute -bottom-7 left-2 text-start"
               src=""
               alt=""
            />
         </div>
      </div>
      <a
         class="border border-slate-400 p-3 rounded-md hover:bg-slate-400 transition"
         href="/review/add"
         >Добавить отзыв</a
      >
   </section>
</template>

<style scoped></style>
