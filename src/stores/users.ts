import {ref} from 'vue'
import {defineStore} from 'pinia'
import type {User} from '@/models/user'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])

  function add(user: Omit<User, 'id'>) {
    users.value.push({
      id: Math.random().toString(36).slice(2),
      ...user
    })
  }

  function update(user: User) {
    const index = users.value.findIndex(u => u.id === user.id)

    if (index !== -1) {
      users.value[index] = user
    }
  }

  function remove(user: Pick<User, 'id'>) {
    users.value = users.value.filter(_user => _user.id !== user.id)
  }

  return {users, add, remove, update}
}, {persist: true})