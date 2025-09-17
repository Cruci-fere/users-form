<script setup lang="ts">
import { Type } from '@/models/type';
import { useUsersStore } from '@/stores/users';
import Plus from '@/icons/Plus.vue'
import Question from '@/icons/Question.vue'

const store = useUsersStore();

function onClick() {
  store.add({
    login: '',
    type: Type.Local,
    mark: [],
    password: ''
  });
}
</script>

<template>
  <div class="flex flex-col gap-2 w-max px-4">
    <div class="flex gap-2">
      <h1>Учётные записи</h1>

      <button @click="onClick" class="text-black border rounded-md">
        <Plus />
      </button>
    </div>

    <div class="flex gap-2 items-center px-2 py-1 rounded-md bg-sky-100/70">
      <Question />
      <p>Для указания нескольких меток для одной пары логин/пароль ипользуйте разделитель ;</p>
    </div>
  </div>

</template>
