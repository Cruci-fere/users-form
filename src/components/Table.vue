<script setup lang="ts">
import type { User } from '@/models/user';
import { Type } from '@/models/type';
import { useUsersStore } from '@/stores/users';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import Input from "@/components/Input/Input.vue";
import Trash from "@/icons/Trash.vue";
import EyeOff from "@/icons/EyeOff.vue";
import EyeOn from "@/icons/EyeOn.vue";

interface FieldProps {
  [userId: string]: {
    [fieldName: string]: { visible?: boolean, error?: boolean }
  }
}

const store = useUsersStore();
const { users } = storeToRefs(store);
const fieldProps = ref<FieldProps>({})

function handleDelete(user: User) {
  store.remove(user);
}

function handleTypeChange(userId: string) {
  const user = users.value.find(user => user.id === userId);

  if (user) {
    store.update({
      ...user,
      password: user.type === 'Local' ? '' : null
    })
  }
}

function handleEyeClick(userId: string) {
  const value = fieldProps.value[userId]?.password?.visible;

  if (value !== undefined) {
    fieldProps.value[userId].password.visible = !value
  } else {
    fieldProps.value = {
      ...fieldProps.value,
      [userId]: {
        password: { error: false, visible: true }
      }
    }
  }
}

function validateField(user: User, field: keyof Pick<User, 'login' | 'password' | 'mark'>, value: string) {
  let valid = false;

  switch (field) {
    case "login":
      valid = !!value.length
      break;
    case "password":
      valid = user.type === 'LDAP' || !!value.length
      break;
    case "mark":
      valid = true;
      break;
  }

  if (fieldProps.value[user.id]?.[field]) {
    fieldProps.value[user.id][field] = { visible: true, error: !valid }
  } else {
    fieldProps.value = {
      ...fieldProps.value,
      [user.id]: {
        [field]: { visible: true, error: !valid }
      }
    }
  }

  if (!valid) {
    return
  }

  const _value = field === 'mark'
    ? value.split(';').map(mark => mark.trim()).filter(Boolean)
    : field === 'password'
    ? user.type === 'LDAP' ? null : value
    : value

  if (valid) {
    store.update({
      ...user,
      [field]: _value
    })
  }
}

</script>

<template>
  <div class="overflow-x-auto">
    <table class="min-w-full">
      <thead>
        <tr>
          <th class="px-4 py-2 text-left">Метки</th>
          <th class="px-4 py-2 text-left">Тип записи</th>
          <th class="px-4 py-2 text-left">Логин</th>
          <th class="px-4 py-2 text-left">Пароль</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td class="px-4 py-2">
            <Input
              :max-length="50"
              @onBlur="value => validateField(user, 'mark', value)"
              placeholder="Значение"
              :value="user.mark?.join('; ') || ''"
              type="text-area"
            />
          </td>

          <td class="px-4 py-2">
            <select
              v-model="user.type"
              class="border rounded-md p-1"
              @change="() => handleTypeChange(user.id)"
            >
              <option :value="Type.Local" class="text-black">Локальная</option>
              <option :value="Type.LDAP" class="text-black">LDAP</option>
            </select>
          </td>

          <td
            class="px-4 py-2"
            :colspan="user.type === Type.LDAP ? 2 : 1"
          >
            <Input
              :max-length="100"
              placeholder="Значение"
              :value="user.login"
              @onBlur="value => validateField(user, 'login', value)"
              :error="fieldProps[user.id]?.['login']?.error"/>
          </td>

          <td
            v-if="user.type !== Type.LDAP"
            class="px-4 py-2"
          >
            <div class="relative">
              <Input
                :max-length="100"
                :type="fieldProps[user.id]?.['password']?.visible ? 'text' : 'password'"
                placeholder="Значение"
                :value="user.password"
                @onBlur="value => validateField(user, 'password', value)"
                :error="fieldProps[user.id]?.['password']?.error"
              />

              <button
                type="button"
                @click="() => handleEyeClick(user.id)"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <EyeOn v-if="fieldProps[user.id]?.['password']?.visible"/>
                <EyeOff v-else/>
              </button>
            </div>
          </td>

          <td class="pt-1">
            <button @click="() => handleDelete(user)">
              <Trash/>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>