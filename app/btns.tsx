'use client'
import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'

export const FirstLoginBtn = () => (
  <Button
    onClick={() => signIn('google')}
    className="px-20 py-10 text-2xl font-bold"
  >
    Get To It
  </Button>
)

export const LastLoginBtn = () => (
  <Button
    onClick={() => signIn('google')}
    className="px-16 py-10 text-2xl font-bold"
  >
    Get in the Kanban app
  </Button>
)
