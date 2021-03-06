import React, { useEffect } from "react";
import { getAllPostSlugs, getPostData, PostSlugs } from "../../lib/posts";
import { GetStaticPaths, GetStaticProps } from "next";
import Layout from "../../components/layout";
import Date from "../../components/date";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import Head from "next/head";

type Params = {
  slug: string;
};

type Props = {
  postData: PostData;
};

type PostData = {
  [p: string]: any;
  contentHtml: string;
  slug: string;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: PostSlugs = getAllPostSlugs();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props, Params> = async (
  context
) => {
  const params = context.params!;
  return {
    props: {
      postData: await getPostData(params.slug),
    },
  };
};

const Post = ({ postData }: PostData) => {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
        <meta property="og:title" content={postData.title} />
        <meta
          name="description"
          itemProp="description"
          property="og:description"
          content={postData.description}
        />
        {postData.image ? (
          <meta property="og:image" content={postData.image} />
        ) : null}
        <meta name="twitter:description" content={postData.description} />
        <meta
          property="og:url"
          content={`https://blog.sweller.de/posts/${postData.slug}`}
        />
      </Head>
      <article>
        <h1>{postData.title}</h1>
        <Date dateString={postData.date} />
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
};

export default Post;
