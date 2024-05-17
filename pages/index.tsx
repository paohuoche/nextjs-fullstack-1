import prisma from "../lib/prisma"
import Image from "next/image"
import { Inter } from "next/font/google"
import { Button } from "@/components/ui/button"
import { z } from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { GetStaticProps } from "next/types"
import { Router, useRouter } from "next/router"

const inter = Inter({ subsets: ["latin"] })

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
  })
  return {
    props: { feed },
    revalidate: 10,
  }
}

export type PostProps = {
  id: string
  title: string
  author: {
    name: string
    email: string
  } | null
  content: string
  published: boolean
}

type Props = {
  feed: PostProps[]
}

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author ? post.author.name : "Unknown author"
  const router = useRouter()
  return (
    <div
      className="cursor-pointer p-4 border border-gray-200 rounded-md shadow-md hover:shadow-lg transition duration-200 ease-in-out"
      onClick={() => router.push("/p/[id]", `/p/${post.id}`)}
    >
      <h2 className="font-bold">{post.title}</h2>
      <small>By {authorName}</small>
      {/* <ReactMarkdown children={post.content} /> */}
      <div>{post.content}</div>
    </div>
  )
}

const Blog: React.FC<Props> = (props) => {
  return (
    <div>
      <div className="p-6">
        <h1 className="mb-4">Public Feed</h1>
        <main>
          {props.feed.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
    </div>
  )
}

export default Blog
