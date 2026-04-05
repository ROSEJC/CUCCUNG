import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { marked } from 'marked';
import clsx from 'clsx';
import { cache } from 'react';

// ISR: revalidate every 60s
export const revalidate = 60;

// ----------------------
// Cached DB query
// ----------------------
const getPost = cache(async (slug: string) => {
  return prisma.post.findUnique({
    where: { slug },
    include: {
      category: true,
      author: true,
    },
  });
});

// ----------------------
// Format date
// ----------------------
function formatDate(date: Date) {
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ----------------------
// Metadata (SEO)
// ----------------------
export async function generateMetadata(
  { params }: { params: Promise<{ category: string; slug: string }> }
): Promise<Metadata> {
  const { slug, category } = await params;
  const post = await getPost(slug);

  if (!post) return {};

  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt || undefined; // Fix: null to undefined

  return {
    title,
    description,
    alternates: {
      canonical: `https://yourdomain.com/${category}/${slug}`,
    },
    openGraph: {
      title,
      description: description ?? undefined,
      type: 'article',
      url: `https://yourdomain.com/${category}/${slug}`,
      images: post.metaImage ? [post.metaImage] : [],
    },
  };
}

// ----------------------
// Page
// ----------------------
export default async function ArticlePage(
  { params }: { params: Promise<{ category: string; slug: string }> }
) {
  const { slug } = await params;
  const post = await getPost(slug);

  // Guard clause handles null post/relations
  if (!post || !post.category || !post.author) return notFound();

  // Related posts
  const relatedPosts = await prisma.post.findMany({
    where: {
      categoryId: post.categoryId,
      slug: { not: post.slug },
      published: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  const html = await marked.parse(post.content || '');

  const isImageInContent = (content: string, imageUrl: string | null) => {
    if (!imageUrl) return false;
    return content.includes(imageUrl);
  };

  const showFeaturedImage = post.metaImage && !isImageInContent(post.content || '', post.metaImage);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.metaDescription || post.excerpt,
            "image": post.metaImage,
            "author": {
              "@type": "Person",
              "name": post.author.name,
            },
            "datePublished": post.createdAt.toISOString(),
            "category": post.category.name,
          }),
        }}
      />

      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6 text-slate-500" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 whitespace-nowrap overflow-x-auto no-scrollbar scroll-smooth">
            <li className="flex items-center shrink-0">
              <Link href="/" className="hover:text-emerald-600 transition-colors">Trang chủ</Link>
              <span className="mx-2 text-slate-300">/</span>
            </li>
            <li className="flex items-center shrink-0">
              <Link href={`/${post.category.slug}`} className="hover:text-emerald-600 transition-colors uppercase tracking-wider font-bold text-[10px]">
                {post.category.name}
              </Link>
              <span className="mx-2 text-slate-300">/</span>
            </li>
            <li className="text-emerald-700 font-bold truncate max-w-[200px]" aria-current="page">
              {post.title}
            </li>
          </ol>
        </nav>

        {/* Header Section */}
        <header className="mb-10 text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 mt-2">
            {post.author.avatar && (
              <Image
                src={post.author.avatar}
                alt={post.author.name || 'Author'}
                width={36}
                height={36}
                className="rounded-full border"
              />
            )}
            <div>
              <div className="font-medium text-emerald-700">
                {post.author.name}
              </div>
              <div className="text-xs text-gray-500">
                {formatDate(post.createdAt)}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        {showFeaturedImage && post.metaImage && (
          <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mb-4">
            <Image
              src={post.metaImage}
              alt={post.featuredImageAlt || post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 700px"
            />
          </div>
        )}

        <article
          className={clsx(
            'prose prose-emerald max-w-none',
            'prose-img:rounded-lg prose-img:mx-auto prose-img:my-4',
            'prose-h2:mt-8 prose-h2:mb-2',
            'prose-h3:mt-6 prose-h3:mb-2',
            'prose-p:leading-relaxed'
          )}
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <aside className="mt-12 border-t pt-6">
            <h2 className="text-lg font-semibold mb-4 text-emerald-700">
              Bài viết liên quan
            </h2>

            <ul className="grid gap-3 md:grid-cols-2">
              {relatedPosts.map((rp) => (
                <li key={rp.id}>
                  {/* Using post.category.slug here is safe because of our guard clause above */}
                  <Link
                    href={`/${post.category.slug}/${rp.slug}`}
                    className="block p-3 rounded-lg hover:bg-emerald-50 transition border border-gray-100"
                  >
                    <div className="font-medium text-emerald-800 truncate">
                      {rp.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 truncate">
                      {rp.excerpt}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </main>
    </>
  );
}