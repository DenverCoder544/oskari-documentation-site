import { allPosts } from '@/.contentlayer/generated'
import HighlightBox from '@/components/HighlightBox'
import Layout from '@/components/Layout'
import Error from '@/components/Error'
import styles from '@/styles/blog.module.scss'
import { format } from 'date-fns'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import { slugify } from '@/lib/utils'
import Image from 'next/image'

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post._raw.flattenedPath,
  }))
}

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find(
    (post) =>
      encodeURI(slugify(post._raw.flattenedPath.split('/')[1])) === params.slug
  )
  if (post) return { title: post.title || '' }
}

export default function BlogSinglePostPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = allPosts.find(
    (post) =>
      encodeURI(slugify(post._raw.flattenedPath.split('/')[1])) === params.slug
  )

  if (!post) {
    return <Error text='No blog posts found' code='404' />
  }

  return (
    <Layout heroSmall heroTitle='Blog'>
      <div className='container--content'>
        <div className='breadcrumbs mb-8 text-sm'>
          <Link
            href='/blog'
            className='flex gap-2 font-bold items-center text-gray-400 transition'
          >
            <ArrowLeftIcon className='h-6 w-6' />
            See all posts
          </Link>
        </div>
        <h2 className={styles.post__title}>{post.title}</h2>
        <div className={styles.post__date}>
          {format(new Date(post.date), 'yyyy-MM-dd')}
        </div>
        {(post.image || post.imagesFromPost) && (
          <Image
            src={post.image || post.imagesFromPost[0]}
            alt={post.title}
            className=' w-full h-auto max-h[500px] object-cover rounded-3xl mb-16'
            width={1440}
            height={500}
          />
        )}
        <div
          className='md-content max-w-full'
          dangerouslySetInnerHTML={{ __html: post.body.html }}
          style={{ maxWidth: '100%', marginTop: 0 }}
        />
      </div>
      {post.author && (
        <HighlightBox
          otter
          style={{
            backgroundColor: 'var(--color-beige)',
            marginTop: '10rem',
            marginBottom: '10rem',
          }}
          contentStyles={{
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'left',
            paddingTop: '4rem',
            paddingBottom: '4rem',
            alignItems: 'flex-start',
          }}
        >
          <span>Author</span>
          <span style={{ fontWeight: 'bold' }}>{post.author}</span>
        </HighlightBox>
      )}
    </Layout>
  )
}
