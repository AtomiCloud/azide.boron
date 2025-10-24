import type { APIRoute } from 'astro';
import { getBlogPost, getAllBlogPosts } from '../../../lib/blog-posts';
import { generateBlogOgImage } from '../../../lib/generate-blog-og-image';
import { getThemeForTopic } from '../../../lib/blog-themes';
import { getConfig } from '../../../lib/config';

export function getStaticPaths() {
  return getAllBlogPosts().map(post => ({
    params: { slug: post.slug },
  }));
}

export const GET: APIRoute = async ({ params }) => {
  if (!params.slug) {
    return new Response('Slug is required', { status: 400 });
  }

  const post = getBlogPost(params.slug);

  if (!post) {
    return new Response('Not found', { status: 404 });
  }

  const config = getConfig();
  const theme = getThemeForTopic(post.topic);

  // Format date as "Jan 24, 2025"
  const formattedDate = post.date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const png = await generateBlogOgImage({
    title: post.title,
    subtitle: post.description,
    author: post.author,
    date: formattedDate,
    blogName: config.app.name,
    theme,
    topic: post.topic,
  });

  return new Response(png as unknown as BodyInit, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
