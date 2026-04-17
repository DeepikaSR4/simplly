import ClientApp, { BlogEntry } from "@/components/ClientApp";
import { getBlogPostsList } from "@/lib/cms";

export default function Page() {
  const cmsPosts = getBlogPostsList();
  
  const blogs: BlogEntry[] = cmsPosts.map((post) => ({
    id: post._id,
    title: post.title,
    description: post.description || "",
    category: post.category || "Uncategorized",
    readTime: post.readTime || "5 min read",
    body: post.content || ""
  }));

  // Sort them so they appear consistently, e.g. based on createdAt
  blogs.sort((a, b) => a.title.localeCompare(b.title));

  return <ClientApp initialBlogs={blogs} />;
}
