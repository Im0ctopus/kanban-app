'use client'

import { FormEvent, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { createBoard } from '@/db/queries'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { revalidatePath } from 'next/cache'
import { useRouter } from 'next/navigation'

const CreateButton = () => {
  const { pending } = useFormStatus()
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [name, setName] = useState<string>('')

  const handleForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    if (name == '') return
    const id = await createBoard(name)
    router.push(`/boards/${id}`)
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>New Board</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-4">
          <DialogTitle>Creating new Board</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => handleForm(e)}
          className="flex justify-center items-start flex-col gap-2"
        >
          <Label>Board Name</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="w-full text-end mt-3">
            <Button disabled={loading} type="submit">
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
export default CreateButton
