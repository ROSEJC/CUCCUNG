import prisma from '../lib/prisma';

async function main() {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      metaImage: true,
      featuredImageAlt: true,
      published: true
    },
    take: 10
  });

  console.log('--- POSTS IN DB ---');
  posts.forEach(p => {
    console.log(`[${p.id}] Title: ${p.title}`);
    console.log(`- MetaImage: ${p.metaImage || 'NULL'}`);
    console.log(`- FeaturedImageAlt: ${p.featuredImageAlt || 'NULL'}`);
    console.log(`- Published: ${p.published}`);
    console.log('-------------------');
  });
}

main().catch(console.error);
