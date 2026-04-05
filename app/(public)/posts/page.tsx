import prisma from '@/lib/prisma';
import Link from 'next/link';
import { format } from 'date-fns';

export default async function PostsPage() {
  // Fetch all posts
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: {
      category: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">All Posts</h1>

      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.id} className="border-b pb-4">
            <Link href={`/${post.category?.slug}/${post.slug}`} className="block hover:underline">
              <h2 className="text-xl font-semibold text-emerald-700">{post.title}</h2>
            </Link>
            <p className="text-sm text-gray-500">
              {post.category?.name && (
                <span className="mr-2">Category: {post.category.name}</span>
              )}
              <span>Published: {format(new Date(post.createdAt), 'MMMM dd, yyyy')}</span>
            </p>
            <p className="text-gray-700 mt-2">{post.excerpt}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}