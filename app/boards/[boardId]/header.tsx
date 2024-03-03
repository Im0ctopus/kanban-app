'use client'

import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { FC, Suspense, useEffect, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { useFormStatus } from 'react-dom'
import Image from 'next/image'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  changeStates,
  delState,
  getBoardsStates,
  getMembers,
  removeRole,
  updateRole,
} from '@/db/queries'
import {
  handleFormCard,
  handleFormState,
  handleCreateRole,
  handleEditState,
} from '@/lib/serverfuncs'
import { Reorder } from 'framer-motion'

type THeader = {
  boardId: number
  role: number
  owner: string
}

type TShowStates = {
  boardId: number
}

const Loading = () => (
  <div className="flex-grow w-full flex-1 flex justify-center items-center gap-4">
    <div className="w-4 h-4 rounded-full bg-secondary animate-load-1"></div>
    <div className="w-4 h-4 rounded-full bg-secondary animate-load-2"></div>
    <div className="w-4 h-4 rounded-full bg-secondary animate-load-3"></div>
  </div>
)

const ShowStates: FC<TShowStates> = async ({ boardId }) => {
  const states = await getBoardsStates(boardId)
  if (states.length == 0) return <option disabled>No states!</option>
  else
    return states.map((state: any) => (
      <option
        className="bg-black"
        key={state.id}
        title={state.statename}
        value={state.id}
      >
        {state.statename}
      </option>
    ))
}

const ManageStates: FC<TShowStates> = ({ boardId }) => {
  const [states, setStates] = useState<any>()
  const [loading, setLoading] = useState<boolean>(true)
  const [edit, setEdit] = useState<number>(-1)

  const fetchData = async () => {
    setLoading(true)
    const fetchedStates = await getBoardsStates(boardId)
    setStates(fetchedStates)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleStateDel = async (stateId: number) => {
    await delState(stateId, boardId)
    fetchData()
  }

  const handleSave = async () => {
    await changeStates(states, boardId)
    fetchData()
  }

  const handleEdit = () => {
    setEdit(-1)
    fetchData()
  }

  return (
    <div className="flex flex-col gap-6 justify-center items-center w-full">
      {!states || loading ? (
        <Loading />
      ) : (
        <div className=" w-10/12 flex border-primary border-2 mt-3 rounded-xl">
          <div className="h-full w-2"></div>
          <div className="w-full px-3 h-56 overflow-y-auto">
            <Reorder.Group
              axis="y"
              values={states}
              onReorder={setStates}
              className="w-full"
            >
              {states.map((state: any) => {
                const formEdit = handleEditState.bind(null, state.id, boardId)
                return (
                  <Reorder.Item
                    title={state.statename}
                    key={state.id}
                    value={state}
                    className="w-full h-10 my-2 bg-secondary rounded-lg grid grid-cols-10 items-center cursor-grab focus:cursor-grabbing"
                  >
                    {!(edit == state.id) ? (
                      <p className="col-span-8 px-4 w-full text-nowrap overflow-hidden text-ellipsis">
                        {state.statename}
                      </p>
                    ) : (
                      <form
                        className="col-span-8 px-4 w-full relative"
                        action={formEdit}
                      >
                        <Input
                          name="name"
                          type="text"
                          defaultValue={state.statename}
                          className="border-2 border-primary w-full"
                        />
                        <Button
                          type="submit"
                          variant={'link'}
                          size={'icon'}
                          className="absolute right-6 inset-y-0 my-auto"
                        >
                          <Image
                            src="/check.svg"
                            width={20}
                            height={20}
                            alt="Check"
                          />
                        </Button>
                      </form>
                    )}
                    <Button
                      onClick={() => setEdit(state.id)}
                      variant={'link'}
                      size={'icon'}
                      className="col-span-1"
                    >
                      <Image
                        src="/edit.svg"
                        width={20}
                        height={20}
                        alt="Edit"
                      />
                    </Button>
                    <Button
                      onClick={() => handleStateDel(state.id)}
                      variant={'link'}
                      size={'icon'}
                      className="col-span-1"
                    >
                      <Image
                        src="/delete.svg"
                        width={20}
                        height={20}
                        alt="Delete svg"
                      />
                    </Button>
                  </Reorder.Item>
                )
              })}
            </Reorder.Group>
          </div>
          <div className="h-full w-2"></div>
        </div>
      )}
      <div className="w-full flex items-center gap-3 justify-end">
        <DialogClose>
          <Button variant={'secondary'}>Cancel</Button>
        </DialogClose>
        <Button onClick={handleSave} disabled={loading}>
          Save
        </Button>
      </div>
    </div>
  )
}

const Header: FC<THeader> = ({ role, owner, boardId }) => {
  const session = useSession()
  const { pending } = useFormStatus()
  const [members, setMembers] = useState<any[]>()

  const handleMembers = async () => {
    setMembers(await getMembers(boardId))
  }

  const ShowMember = async () => {
    const members = await getMembers(boardId)
    return members.map((m: any) => {
      if (m.email == owner) return
      return (
        <div key={m.userid} className="grid grid-cols-6 w-full">
          <p className="w-full col-span-3">{m.email}</p>
          <select
            onChange={(e) =>
              updateRole(parseInt(e.target.value), m.userid, boardId)
            }
            defaultValue={m.roleid}
            name=""
            id=""
            className="flex col-span-2 h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option className="bg-black" value="1">
              Admin
            </option>
            <option className="bg-black" value="2">
              Editor
            </option>
            <option className="bg-black" value="3">
              Viewer
            </option>
          </select>
          <div className="text-center">
            <Button
              onClick={() => {
                handleMembers()
                removeRole(m.userid, boardId)
              }}
              className="col-span-1"
              size={'icon'}
              variant={'link'}
            >
              <Image src="/rem.svg" width={20} height={20} alt="Remove" />
            </Button>
          </div>
        </div>
      )
    })
  }

  const formState = handleFormState.bind(null, boardId)
  const formCard = handleFormCard.bind(null, boardId)
  const formEmail = handleCreateRole.bind(null, boardId)

  return (
    <div className="lg:flex lg:justify-between px-4 lg:px-10 items-center w-full py-4 bg-secondary border-b-2 border-primary grid grid-rows-2 md:gap-8">
      <div className="w-fit flex justify-center items-center gap-5 mx-auto lg:mx-0">
        {role != 3 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-10">New Card</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Creating new Card</DialogTitle>
              </DialogHeader>
              <form
                className="flex flex-col justify-center items-center gap-3"
                action={formCard}
              >
                <div className="w-full grid grid-cols-3 items-center gap-3">
                  <div className="w-full col-span-2">
                    <Label className="opacity-50">Card title</Label>
                    <Input type="text" name="title" />
                  </div>
                  <div className="w-full col-span-1">
                    <Label>Card State</Label>
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      name="state"
                    >
                      <Suspense fallback={<option disabled>Loading...</option>}>
                        <ShowStates boardId={boardId} />
                      </Suspense>
                    </select>
                  </div>
                </div>
                <div className="w-full">
                  <Label className="opacity-50">Card description</Label>
                  <Textarea className="resize-none" name="desc" />
                </div>
                <div className="w-full grid grid-cols-2 gap-3">
                  <div className="w-full col-span-1">
                    <Label className="opacity-50">Start Date</Label>
                    <Input type="date" name="start" />
                  </div>
                  <div className="w-full col-span-1">
                    <Label className="opacity-50">End Date</Label>
                    <Input type="date" name="end" />
                  </div>
                </div>
                <div className="w-full text-end mt-5">
                  <DialogClose asChild>
                    <Button
                      type="submit"
                      aria-disabled={pending}
                      className="h-10"
                    >
                      Create Card
                    </Button>
                  </DialogClose>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
        {role == 1 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-10">New State</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Creating new State</DialogTitle>
              </DialogHeader>
              <form
                className="flex flex-col justify-center items-center gap-3"
                action={formState}
              >
                <div className="w-full">
                  <Label className="opacity-50">State Name</Label>
                  <Input className="resize-none" name="name" />
                </div>
                <DialogClose className="w-full" asChild>
                  <div className="w-full text-end mt-5">
                    <Button
                      type="submit"
                      aria-disabled={pending}
                      className="h-10"
                    >
                      Create State
                    </Button>
                  </div>
                </DialogClose>
              </form>
            </DialogContent>
          </Dialog>
        )}
        {role == 1 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-10">Manage States</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manage your States</DialogTitle>
              </DialogHeader>
              <ManageStates boardId={boardId} />
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="w-fit flex flex-wrap justify-center items-center gap-5 mx-auto lg:mx-0">
        {owner == session.data?.user?.email && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-10">Manage Perms</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Board&#39;s members perms</DialogTitle>
              </DialogHeader>
              <div className="w-full gap-3 flex flex-col justify-center items-center">
                <div className="h-52 w-full gap-2 border-2 border-primary rounded-md flex flex-col justify-start items-center p-3 overflow-y-auto overflow-x-hidden scroll-p-10">
                  <Suspense fallback={<Loading />}>
                    <ShowMember />
                  </Suspense>
                </div>
                <form
                  action={formEmail}
                  className="w-full grid grid-cols-2 gap-3"
                >
                  <Input
                    className="col-span-1 h-10"
                    placeholder="New Email"
                    name="email"
                  />
                  <Button
                    onClick={handleMembers}
                    className="h-10 col-span-1"
                    type="submit"
                  >
                    Add
                  </Button>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        )}
        <a href={'mailto:' + owner}>
          <Button className="h-10">Board of {owner}</Button>
        </a>
      </div>
    </div>
  )
}
export default Header
