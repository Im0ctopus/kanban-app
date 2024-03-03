'use client'

import { signIn } from 'next-auth/react'
import { Button } from './ui/button'

const LogInBtn = () => {
  return (
    <div className="relative">
      <Button className="animate-ping absolute -z-10">Log In</Button>
      <Button onClick={() => signIn('google')}>Log In</Button>
    </div>
  )
}
export default LogInBtn
