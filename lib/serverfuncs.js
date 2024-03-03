'use server'
import {
  createTask,
  createBoardsState,
  giveRole,
  updateTask,
  editState,
} from '@/db/queries'
import { revalidatePath } from 'next/cache'

export const handleFormCard = async (boardId, formData) => {
  const title = formData.get('title')
  const desc = formData.get('desc')
  const start = formData.get('start')
  const end = formData.get('end')
  const state = formData.get('state')
  if (!title || !desc || !start || !end || !state) return
  const task = await createTask(title, desc, start, end, state, boardId)
  console.log(task)
  if (task.length > 0) revalidatePath('/boards/' + boardId)
}

export const handleFormState = async (boardId, formData) => {
  const name = formData.get('name')
  if (!name) return
  const state = await createBoardsState(name, boardId)
  if (state.length > 0) revalidatePath('/boards/' + boardId)
  console.log(state)
}

export const handleCreateRole = async (boardId, formData) => {
  const email = formData.get('email')
  if (!email) return
  const role = await giveRole(email, boardId, 3)
  console.log(role)
}

export const handleUpdateTask = async (taskId, boardId, formData) => {
  const title = formData.get('title')
  const desc = formData.get('desc')
  const start = formData.get('start')
  const end = formData.get('end')
  const id = await updateTask(title, desc, start, end, taskId, boardId)
  console.log(id)
}

export const handleEditState = async (stateId, boardId, formData) => {
  const name = formData.get('name')
  const id = await editState(stateId, name, boardId)
  console.log(id)
}
