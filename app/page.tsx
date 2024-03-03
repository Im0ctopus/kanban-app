'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { FirstLoginBtn, LastLoginBtn } from './btns'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { motion } from 'framer-motion'

const CreateDemo = () => (
  <div className="flex flex-col justify-center items-center gap-3 border border-zinc-700 px-6 py-4 rounded-lg">
    <div className="w-full grid grid-cols-3 items-center gap-3">
      <div className="w-full col-span-2">
        <label className="opacity-50">Card title</label>
        <Input type="text" name="title" />
      </div>
      <div className="w-full col-span-1">
        <label>Card State</label>
        <select
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          name="state"
        >
          <option className="bg-black">TODO</option>
          <option className="bg-black">Complete</option>
          <option className="bg-black">Constum State</option>
        </select>
      </div>
    </div>
    <div className="w-full">
      <label className="opacity-50">Card description</label>
      <Textarea className="resize-none" name="desc" />
    </div>
    <div className="w-full grid grid-cols-2 gap-3">
      <div className="w-full col-span-1">
        <label className="opacity-50">Start Date</label>
        <Input type="date" name="start" />
      </div>
      <div className="w-full col-span-1">
        <label className="opacity-50">End Date</label>
        <Input type="date" name="end" />
      </div>
    </div>
    <div className="w-full text-end mt-5">
      <Button className="h-10">Create Card</Button>
    </div>
  </div>
)

const CardDemo = () => (
  <div className="px-6 py-5 border border-zinc-700 rounded-lg flex flex-col justify-center items-center gap-4">
    <div>
      <div>Website Redesign Launch</div>
      <p className="font-light text-sm mb-4 mt-2">Created by: some@mail.com</p>
      <div className="">
        Finalize content updates, complete testing, and coordinate the go-live
        process for the new website.
      </div>
    </div>
    <div className="row-span-1 grid grid-cols-2 gap-3 w-full">
      <p
        className={`border rounded-xl w-full h-10 flex justify-center items-center col-span-1`}
      >
        09-04-2026
      </p>
      <p
        className={`border rounded-xl w-full h-10 flex justify-center items-center col-span-1`}
      >
        15-04-2026
      </p>
    </div>
  </div>
)

const Page = () => {
  const { data: session } = useSession()
  return (
    <div className=" flex pt-20 flex-col gap-20 pb-28 justify-center items-center w-full max-w-[1280px] mx-auto">
      <div className="w-full absolute top-0 left-0 bg-gradient-to-tr from-[#ffb300] via-[#e96900] to-primary h-[700px] -z-10">
        <motion.div
          initial={{ y: 150 }}
          whileInView={{
            y: 0,
            transition: {
              duration: 0.6,
            },
          }}
          viewport={{ once: true, amount: 0.7 }}
          className="bg-hero-pattern absolute -bottom-1 bg-no-repeat w-full max-w-screen h-full bg-contain bg-bottom"
        ></motion.div>
      </div>
      <section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-center h-[600px]">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{
            opacity: 1,
            x: 0,
            transition: {
              type: 'spring',
              bounce: 0.3,
              duration: 1.2,
            },
          }}
          viewport={{ once: true, amount: 0.7 }}
          className="flex flex-col justify-center items-center lg:items-start gap-5"
        >
          <h1 className="text-5xl font-black text-center">
            Organize your chaos.
          </h1>
          <h1 className="text-5xl font-black -mt-5 text-center">
            Conquer your tasks.
          </h1>
          {session ? (
            <Link href={'/boards'}>
              <Button className="px-20 py-10 text-2xl font-bold">
                Get To It
              </Button>
            </Link>
          ) : (
            <FirstLoginBtn />
          )}
        </motion.div>
        <div className="relative w-full h-full select-none hidden lg:block">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.2,
              },
            }}
            viewport={{ once: true, amount: 0.7 }}
            className="absolute top-20 right-0"
          >
            <Image
              className="rounded-lg w-[550px]"
              src="/p1.png"
              width={1000}
              height={900}
              alt="print 1"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 150 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.5,
              },
            }}
            viewport={{ once: true, amount: 0.7 }}
            className="absolute bottom-28 left-0"
          >
            <Image
              className="rounded-lg w-96"
              src="/p2.png"
              width={700}
              height={900}
              alt="print 1"
            />
          </motion.div>
        </div>
      </section>
      <section className="w-full grid grid-cols-1 lg:grid-cols-3 gap-20 px-10 lg:gap-4 items-center">
        <div className="w-full col-span-1 lg:col-span-2 flex flex-col justify-start items-center gap-5">
          <motion.h1
            initial={{ opacity: 0, x: -40 }}
            whileInView={{
              opacity: 1,
              x: 0,
              transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.2,
              },
            }}
            viewport={{
              once: true,
              amount: 0.7,
              margin: '0px 0px -100px 0px',
            }}
            className="text-5xl font-black -mt-5 text-center lg:text-start"
          >
            Your to-do list just got an upgrade.
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, x: -40 }}
            whileInView={{
              opacity: 1,
              x: 0,
              transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.2,
              },
            }}
            viewport={{ once: true, amount: 0.8 }}
            className="text-5xl font-black col-span-1 text-center lg:text-start"
          >
            Meet your new <span className="italic">KanBan</span> sidekick.
          </motion.h1>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{
            opacity: 1,
            x: 0,
            transition: {
              type: 'spring',
              bounce: 0.3,
              duration: 1.2,
            },
          }}
          viewport={{ once: true, amount: 0.7 }}
        >
          <CreateDemo />
        </motion.div>
      </section>
      <section className="w-full flex justify-center flex-col-reverse gap-20 lg:grid lg:grid-cols-3 lg:gap-4 items-center px-10">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{
            opacity: 1,
            x: 0,
            transition: {
              type: 'spring',
              bounce: 0.3,
              duration: 1.2,
            },
          }}
          viewport={{ once: true, amount: 0.7 }}
          className="col-span-1"
        >
          <CardDemo />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{
            opacity: 1,
            x: 0,
            transition: {
              type: 'spring',
              bounce: 0.3,
              duration: 1.2,
            },
          }}
          viewport={{ once: true, amount: 0.7 }}
          className="w-full lg:col-span-2 col-start-1"
        >
          <h1 className="text-5xl font-black -mt-5">
            <span className="italic">KanBan</span> app: Where projects get
            finished,not forgotten.
          </h1>
        </motion.div>
      </section>
      <section className="flex flex-col gap-5 justify-center items-center">
        <motion.h1
          initial={{ opacity: 0, y: 75, scale: 0 }}
          whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
              type: 'spring',
              bounce: 0.3,
              duration: 1.2,
            },
          }}
          viewport={{ once: true, amount: 0.7 }}
          className="text-5xl font-black mt-20"
        >
          Stop procrastinating. Get organized.
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: -75, scale: 0 }}
          whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
              type: 'spring',
              bounce: 0.3,
              duration: 1.2,
              delay: 0.1,
            },
          }}
          viewport={{ once: true, amount: 1 }}
        >
          {session ? (
            <Link href={'/boards'}>
              <Button className="px-16 py-10 text-2xl font-bold">
                Get in the Kanban app
              </Button>
            </Link>
          ) : (
            <LastLoginBtn />
          )}
        </motion.div>
      </section>
    </div>
  )
}
export default Page
