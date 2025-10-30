export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: Date;
  topic: 'tech' | 'marketing' | 'entrepreneurship' | 'productivity' | 'health';
  tags: string[];
  image?: string;
  shareMessage?: string;
}

interface AstroModule {
  frontmatter?: {
    title: string;
    description: string;
    author: string;
    date: string;
    topic: 'tech' | 'marketing' | 'entrepreneurship' | 'productivity' | 'health';
    tags?: string[];
    image?: string;
    shareMessage?: string;
  };
}

// Automatically discover all blog posts from src/pages/blog/*.astro files
const blogModules = import.meta.glob('../pages/blog/*.astro', { eager: true });

let cachedPosts: BlogPost[] | null = null;

function loadBlogPosts(): BlogPost[] {
  if (cachedPosts) return cachedPosts;

  const posts: BlogPost[] = [];

  for (const [path, module] of Object.entries(blogModules)) {
    // Extract slug from filename: ../pages/blog/my-post.astro -> my-post
    const slug = path.split('/').pop()?.replace('.astro', '') || '';

    // Get frontmatter from module
    const frontmatter = (module as AstroModule).frontmatter;

    if (frontmatter) {
      posts.push({
        slug,
        title: frontmatter.title,
        description: frontmatter.description,
        author: frontmatter.author,
        date: new Date(frontmatter.date),
        topic: frontmatter.topic,
        tags: frontmatter.tags || [],
        image: frontmatter.image,
        shareMessage: frontmatter.shareMessage,
      });
    }
  }

  cachedPosts = posts;
  return posts;
}

export function getBlogPost(slug: string): BlogPost | undefined {
  const posts = loadBlogPosts();
  return posts.find(post => post.slug === slug);
}

export function getAllBlogPosts(): BlogPost[] {
  const posts = loadBlogPosts();
  return [...posts].sort((a, b) => b.date.getTime() - a.date.getTime());
}
