<template>
   <h1 class="text-3xl font-bold my-7 text-center">Личный кабинет</h1>
   <div class="">
      <div class="p-8 max-[900px]:p-2">

         <ProfileUserInfo />

         <ProfileFooter />

      </div>
   </div>

</template>
<script setup lang="ts">
import ProfileUserInfo from '@/components/ProfileUserInfo.vue'
import ProfileFooter from '@/components/ProfileFooter.vue'
</script>