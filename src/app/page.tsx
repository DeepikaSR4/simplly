import ClientApp, { BlogEntry } from "@/components/ClientApp";
import fs from "fs";
import path from "path";

export default function Page() {
  const blogsDir = path.join(process.cwd(), "src/content/blog");
  const blogs: BlogEntry[] = [];
  
  if (fs.existsSync(blogsDir)) {
    const files = fs.readdirSync(blogsDir);
    for (const file of files) {
      if (file.endsWith(".md")) {
        const content = fs.readFileSync(path.join(blogsDir, file), "utf-8");
        // Simple frontmatter parser natively separating frontmatter and body HTML
        const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        
        if (match) {
           const fmStr = match[1];
           // Replace React className convention back to class for `dangerouslySetInnerHTML` rendering correctly
           const body = match[2].replace(/className=/g, 'class=');
           
           const title = fmStr.match(/title:\s*(.*)/)?.[1] || "Untitled";
           const description = fmStr.match(/description:\s*(.*)/)?.[1] || "";
           const category = fmStr.match(/category:\s*(.*)/)?.[1] || "Uncategorized";
           const readTime = fmStr.match(/readTime:\s*(.*)/)?.[1] || "5 min read";
           
           blogs.push({
             id: file.replace(".md", ""),
             title,
             description,
             category,
             readTime,
             body
           });
        }
      }
    }
  }

  // Sort them so they appear consistently, e.g. alphabetically. Or add a date in the frontmatter if desired!
  blogs.sort((a, b) => a.title.localeCompare(b.title));

  return <ClientApp initialBlogs={blogs} />;
}
