import fs from 'fs';
import path from 'path';

const contentDir = path.join(process.cwd(), 'content', 'blog_posts');

export interface BlogPosts {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  content: string;
}

/**
 * Reads all blog post entries from content/blog_posts/
 */
export function getBlogPostsList(): BlogPosts[] {
  if (!fs.existsSync(contentDir)) {
    console.warn(`Content directory not found: ${contentDir}`);
    return [];
  }
  
  const files = fs.readdirSync(contentDir);
  return files
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const filePath = path.join(contentDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      try {
        const data = JSON.parse(fileContent) as BlogPosts;
        // Ensure _id is defined, default to filename if missing
        if (!data._id) {
          data._id = file.replace(/\.json$/, '');
        }
        return data;
      } catch (e) {
        console.error(`Error parsing JSON in file ${file}`, e);
        return null;
      }
    })
    .filter((post): post is BlogPosts => post !== null)
    .sort((a, b) => new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()); // Sort newest first
}

/**
 * Reads a single blog post entry by its _id
 */
export function getBlogPosts(id: string): BlogPosts | null {
  const filePath = path.join(contentDir, `${id}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const fileContent = fs.readFileSync(filePath, 'utf8');
  try {
    const data = JSON.parse(fileContent) as BlogPosts;
    if (!data._id) {
      data._id = id;
    }
    return data;
  } catch (e) {
    console.error(`Error parsing JSON in file ${id}.json`, e);
    return null;
  }
}
