import fs from "fs";
import path from "path";
import remark from "remark";
import externalLinks from "remark-external-links";
import matter from "gray-matter";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

export type PostSlugs = { params: { slug: string } }[];
export type PostData = {
  slug: string;
  date: string;
  title: string;
};

export const getSortedPostsData: () => PostData[] = () => {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData: PostData[] = fileNames.map((fileName) => {
    const slug = fileName.replace(".md", "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);

    return {
      slug,
      ...matterResult.data,
    } as PostData;
  });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
};

export const getAllPostSlugs = (): PostSlugs => {
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames.map((fileName: string) => ({
    params: {
      slug: fileName.replace(".md", ""),
    },
  }));
};

export const getPostData = async (slug: string) => {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .use(externalLinks)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    contentHtml,
    ...matterResult.data,
  };
};
