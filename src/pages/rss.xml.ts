import rss from '@astrojs/rss';
import { getAllBlogPosts } from '../lib/blog-posts';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const sortedPosts = getAllBlogPosts();

  return rss({
    title: 'Azide Boron Blog',
    description: 'Insights on tech, marketing, entrepreneurship, productivity, and health',
    site: context.site?.toString() || 'https://azide-boron.pages.dev',
    items: sortedPosts.map(post => ({
      title: post.title,
      description: post.description,
      pubDate: post.date,
      author: post.author,
      link: `/blog/${post.slug}/`,
      categories: [post.topic],
    })),
    customData: '<language>en-us</language>',
  });
}
