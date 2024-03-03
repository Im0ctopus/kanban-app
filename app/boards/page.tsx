import { getBoards, getEmail, getMaxIndex } from '@/db/queries'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import CreateButton from './createBtn'
import { Skeleton } from '@/components/ui/skeleton'
import Board from './board'

const Loading = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 w-full gap-4 px-4 py-4">
      <Skeleton className="bg-secondary col-span-1 rounded-xl relative flex justify-center items-center h-40"></Skeleton>
      <Skeleton className="bg-secondary col-span-1 rounded-xl relative flex justify-center items-center h-40"></Skeleton>
      <Skeleton className="bg-secondary col-span-1 rounded-xl relative flex justify-center items-center h-40"></Skeleton>
      <Skeleton className="bg-secondary col-span-1 rounded-xl relative flex justify-center items-center h-40"></Skeleton>
    </div>
  )
}

const ShowBoards = async () => {
  const boards = await getBoards()
  if (boards.length == 0)
    return (
      <h3 className="text-3xl text-center font-black py-20">
        You have no Boards
      </h3>
    )
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 w-full gap-4 px-4 py-4">
      {boards.map((board, index) => {
        const owner = getEmail(board.userid)
        return <Board key={index} owner={owner} board={board} index={index} />
      })}
    </div>
  )
}

const Page = async () => {
  const session = await getServerSession()
  if (!session) redirect('/')

  return (
    <div className="pt-24 flex justify-center flex-col items-center gap-2 px-3 lg:px-10 w-full max-w-[1080px] mx-auto">
      <div className="w-full flex justify-start items-center">
        <CreateButton />
      </div>
      <div className="w-full border-primary overflow-hidden min-h-10 rounded-xl border-2 text-center">
        <Suspense fallback={<Loading />}>
          <ShowBoards />
        </Suspense>
      </div>
    </div>
  )
}
export default Page
