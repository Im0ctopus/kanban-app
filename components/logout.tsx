'use client'

import { FC } from 'react'
import { signOut } from 'next-auth/react'

type TLogout = {
  children: any
}

const Logout: FC<TLogout> = ({ children }) => {
  return <div onClick={() => signOut()}>{children}</div>
}
export default Logout
