import { GetServerSideProps } from "next/types"
import prisma from "../../lib/prisma"
import { PostProps } from ".."

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  })
  return {
    props: post!,
  }
}

const Post: React.FC<PostProps> = (props) => {
  let title = props.title
  if (!props.published) {
    title = `${title} (Draft)`
  }

  return (
    <div className="p-6">
      <h2 className="font-bold">{props.title}</h2>
      <small>By {props.author?.name || "unknown"}</small>
      {/* <ReactMarkdown children={post.content} /> */}
      <div>{props.content}</div>
    </div>
  )
}

export default Post
