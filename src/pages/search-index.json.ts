import type { APIRoute } from 'astro';
import { getAllBlogPosts } from '../lib/blog-posts';

export const GET: APIRoute = () => {
  const posts = getAllBlogPosts();

  // FlexSearch doesn't need pre-built index - we'll build it client-side
  // Just return the documents with searchable fields
  const searchData = {
    documents: posts.map(post => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      author: post.author,
      date: post.date.toISOString(),
      topic: post.topic,
      tags: post.tags,
    })),
  };

  return new Response(JSON.stringify(searchData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
