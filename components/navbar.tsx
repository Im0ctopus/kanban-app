import { getServerSession } from 'next-auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { Suspense } from 'react'
import LogInBtn from './loginBtn'
import Logout from './logout'

const Log = async () => {
  const session = await getServerSession()
  if (session) {
    return (
      <Logout>
        <Avatar className="hover:scale-110 transition-all ease-in-out cursor-pointer">
          <AvatarImage src={session.user?.image!} />
          <AvatarFallback>{session.user?.name}</AvatarFallback>
        </Avatar>
      </Logout>
    )
  } else {
    return <LogInBtn />
  }
}

const NavBar = () => {
  return (
    <nav className="flex justify-around md:justify-center items-center w-full fixed h-20 bg-black/10 backdrop-blur-sm z-40">
      <Link
        href={'/boards'}
        className="italic text-5xl font-black hover:scale-105"
      >
        KanBan
      </Link>
      <div className="md:absolute md:right-10 flex justify-center items-center">
        <Suspense>
          <Log />
        </Suspense>
      </div>
    </nav>
  )
}
export default NavBar
