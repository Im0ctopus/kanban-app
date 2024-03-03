import { FC, Suspense } from 'react'
import Header from './header'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import {
  getOwnerEmail,
  getRole,
  getAllBoards,
  getBoardTasks,
  getBoardsStates,
} from '@/db/queries'
import Cards from './cards'
import { Skeleton } from '@/components/ui/skeleton'

type TPage = {
  params: {
    boardId: number
  }
}

export const revalidate = 60

export async function generateStaticParams() {
  const boards = await getAllBoards()

  return boards.map((board) => ({
    boardId: board.id.toString(),
  }))
}

type TShowStates = {
  boardId: number
  owner: string
  role: number
}

const ShowStates: FC<TShowStates> = async ({ boardId, owner, role }) => {
  const states = await getBoardsStates(boardId)
  const cards = await getBoardTasks(boardId)
  if (states.length == 0)
    return (
      <div className="w-full h-full flex justify-center items-center font-thin text-xl">
        No States in your Board
      </div>
    )
  else
    return (
      <Cards
        states={states}
        cards={cards}
        boardId={boardId}
        owner={owner}
        role={role}
      />
    )
}

const Page: FC<TPage> = async ({ params }) => {
  const session = await getServerSession()
  if (!session) redirect('/')
  const ownerEmail = await getOwnerEmail(params.boardId)
  const role = await getRole(params.boardId)
  return (
    <div className="w-full h-full pt-20 flex flex-col gap-0 justify-center items-center">
      <Header role={role} boardId={params.boardId} owner={ownerEmail} />
      <Suspense
        fallback={
          <div className="flex justify-start w-full h-full gap-5 p-5">
            <Skeleton className="bg-secondary w-80 rounded-xl relative flex justify-center items-center h-40"></Skeleton>
            <Skeleton className="bg-secondary w-80 rounded-xl relative flex justify-center items-center h-40"></Skeleton>
            <Skeleton className="bg-secondary w-80 rounded-xl relative flex justify-center items-center h-40"></Skeleton>
          </div>
        }
      >
        <ShowStates boardId={params.boardId} owner={ownerEmail} role={role} />
      </Suspense>
    </div>
  )
}
export default Page
