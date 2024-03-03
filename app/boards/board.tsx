'use client'

import { FC } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { delBoard } from '@/db/queries'

type TBoard = {
  owner: any
  board: any
  index: number
}

const Board: FC<TBoard> = ({ owner, board, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        bounce: 0.3,
        duration: 1.2,
        delay: index / 20,
      }}
    >
      <div className="relative">
        <Link
          href={'/boards/' + board.id}
          key={board.id}
          className="peer bg-secondary hover:bg-primary/80 hover:scale-105 cursor-pointer transition-all ease-in-out col-span-1 rounded-xl relative flex justify-center items-center h-40"
        >
          <h2 className="uppercase px-3 break-all">{board.name}</h2>
          <p className="absolute bottom-0 right-0 opacity-60 text-xs font-thin w-full p-2 text-nowrap text-ellipsis text-end overflow-hidden">
            {owner}
          </p>
        </Link>
        <Button
          onClick={() => delBoard(board.id, board.userid)}
          className="absolute top-0 right-0 z-30 md:hidden md:peer-hover:block md:hover:block"
          size={'icon'}
          variant={'link'}
        >
          <Image src="/delete.svg" width={20} height={20} alt="Delete svg" />
        </Button>
      </div>
    </motion.div>
  )
}
export default Board
