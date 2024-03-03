'use client'

import { FC, useState } from 'react'
import { updateTaskState, delTask } from '@/db/queries'
import { useSession } from 'next-auth/react'
import { Input } from '@/components/ui/input'
import { MdDelete } from 'react-icons/md'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { handleUpdateTask } from '@/lib/serverfuncs'

type TCards = {
  states: any
  cards: any
  boardId: number
  owner: string
  role: number
}

const Cards: FC<TCards> = ({ states, cards, boardId, owner, role }) => {
  const { data: session } = useSession()
  const [over, setOver] = useState<number>(-1)
  const [dragged, setDragged] = useState<number>(-1)

  const handleDrop = async (e: any) => {
    e.preventDefault()
    const res = await updateTaskState(dragged, over, boardId)
    setOver(-1)
    setDragged(-1)
  }

  type TDialog = {
    card: any
  }

  const Edit: FC<TDialog> = ({ card }) => {
    const start = new Date(card.startday)
    const end = new Date(card.endday)
    const formCard = handleUpdateTask.bind(null, card.id, boardId)
    return (
      <DialogContent>
        <form action={formCard}>
          <DialogHeader>
            <DialogTitle className="w-[95%] grid grid-cols-12 gap-3">
              <Input
                defaultValue={card.title}
                name="title"
                className="col-span-10"
              />
              <DialogClose asChild>
                <Button
                  size={'icon'}
                  className="col-span-2"
                  variant={'destructive'}
                >
                  <MdDelete
                    size={20}
                    onClick={() => delTask(card.id, boardId)}
                  />
                </Button>
              </DialogClose>
            </DialogTitle>
            <p className="font-light text-sm">Created by: {card.email}</p>
          </DialogHeader>
          <Textarea
            name="desc"
            className="resize-none h-52 mt-4"
            defaultValue={card.descriptiontext}
          />
          <div className="row-span-1 grid grid-cols-2 gap-3 mt-4">
            <Input
              type="date"
              name="start"
              defaultValue={
                start.getFullYear() +
                '-' +
                (start.getMonth() + 1).toString().padStart(2, '0') +
                '-' +
                start.getDate().toString().padStart(2, '0')
              }
            />
            <Input
              name="end"
              type="date"
              defaultValue={
                end.getFullYear() +
                '-' +
                (end.getMonth() + 1).toString().padStart(2, '0') +
                '-' +
                end.getDate().toString().padStart(2, '0')
              }
            />
          </div>
          <DialogFooter className="sm:justify-end mt-4">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" variant="default">
                Save
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    )
  }

  const NoEdit: FC<TDialog> = ({ card }) => {
    const now = new Date()
    const start = new Date(card.startday)
    const end = new Date(card.endday)
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{card.title}</DialogTitle>
          <p className="font-light text-sm">Created by: {card.email}</p>
          <DialogDescription className="">
            {card.descriptiontext}
          </DialogDescription>
        </DialogHeader>
        <div
          title={now < start ? 'TO COME' : now < end ? 'DOING' : 'OVER'}
          className="row-span-1 grid grid-cols-2 gap-3"
        >
          <p
            className={`border rounded-xl w-full h-10 flex justify-center items-center col-span-1`}
          >
            {start.getDate() +
              '-' +
              start.getMonth() +
              '-' +
              start.getFullYear()}
          </p>
          <p
            className={`border rounded-xl w-full h-10 flex justify-center items-center col-span-1`}
          >
            {end.getDate() + '-' + end.getMonth() + '-' + end.getFullYear()}
          </p>
        </div>
      </DialogContent>
    )
  }

  return (
    <div className="h-full w-full flex-row flex overflow-x-auto justify-start gap-5 p-5">
      {states.map((state: any) => (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setOver(state.id)
          }}
          onDragLeave={() => setOver(-1)}
          onDrop={(e) => handleDrop(e)}
          key={state.id}
          className={`${
            over == state.id && 'scale-105'
          } w-80 relative transition-all ease-in-out gap-5 flex flex-col justify-start items-center rounded-md bg-secondary max-h-full overflow-auto min-h-40 h-fit p-5 shrink-0`}
        >
          <h1
            title={state.statename}
            className="absolute w-full top-4 text-nowrap overflow-hidden px-3 text-ellipsis text-center font-bold"
          >
            {state.statename}
          </h1>
          {cards.map((card: any) => {
            const now = new Date()
            const start = new Date(card.startday)
            const end = new Date(card.endday)
            if (card.stateid != state.id) return
            else
              return (
                <Dialog key={card.id}>
                  <DialogTrigger className="w-full">
                    <div
                      className={`
                  ${
                    now < start
                      ? 'bg-background'
                      : now < end
                      ? 'bg-green-600/40'
                      : 'bg-red-600/40'
                  } grid grid-rows-3 gap-0 w-full rounded-md h-40 hover:scale-105 transition-all cursor-pointer p-4`}
                      draggable={role == 1}
                      onDragStart={() => setDragged(card.id)}
                    >
                      <h1
                        title={card.title}
                        className="text-start p-0 w-full text-lg font-bold overflow-hidden text-ellipsis text-nowrap row-span-1"
                      >
                        {card.title}
                      </h1>
                      <div
                        title={
                          now < start ? 'TO COME' : now < end ? 'DOING' : 'OVER'
                        }
                        className="row-span-1 grid grid-cols-2 gap-3"
                      >
                        <p
                          className={`border-2 border-white/80 rounded-xl w-full h-10 flex justify-center items-center col-span-1`}
                        >
                          {start.getDate() +
                            '-' +
                            start.getMonth() +
                            '-' +
                            start.getFullYear()}
                        </p>
                        <p
                          className={`border-2 border-white/80 rounded-xl w-full h-10 flex justify-center items-center col-span-1`}
                        >
                          {end.getDate() +
                            '-' +
                            end.getMonth() +
                            '-' +
                            end.getFullYear()}
                        </p>
                      </div>
                      <p
                        className="w-full text-end overflow-hidden text-nowrap text-ellipsis text-sm font-thin row-span-1 flex justify-end items-end"
                        title={card.email}
                      >
                        Created by: {card.email}
                      </p>
                    </div>
                  </DialogTrigger>
                  {session?.user?.email == card.email ||
                  session?.user?.email == owner ? (
                    <Edit card={card} />
                  ) : (
                    <NoEdit card={card} />
                  )}
                </Dialog>
              )
          })}
        </div>
      ))}
    </div>
  )
}
export default Cards
