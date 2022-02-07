/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';
import * as prismicH from '@prismicio/helpers';
import Prismic from "@prismicio/client";
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { getPrismicClient } from '../../services/prismic';

import Header from '../../components/Header';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const [ isMounted, setIsMounted ] = useState(false);
  const [ timeForRead, setTimeForRead ] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if(!router.isFallback){
      setIsMounted(true);

      const wordsPerMinutes = 200;

      const words = post.data.content.reduce((acc: any, word: any) => {
        const text = `${acc} ${word.heading} ${prismicH.asText(word.body)}`;

        return text;
      }, "");

      setTimeForRead(() => Math.ceil(words.split(/\s/g).length / wordsPerMinutes));
    }
  }, [post.data.content, router.isFallback]);

  return (
    <>
      <Header />
      {
        isMounted ? (
          <>
            <img src='/images/banner.png' alt='post' className={styles.postBanner}/>

            <article className={styles.container}>
              <div className={styles.articleHeader}>
                <h1 className={styles.title}>{post?.data?.title}</h1>
                
                <FiCalendar/>
                <span>{format(new Date(post?.first_publication_date), 'dd LLL yyyy', {
                    locale: ptBR,
                  })}
                </span>

                <FiUser/>
                <span>{post?.data?.author}</span>

                <FiClock/>
                <span>{timeForRead} min</span>
              </div>

              { post.data.content.map((texts: any) => {
                const generateContent = prismicH.asHTML(texts.body);
                return (
                  <section key={`${post.data.title}-${texts.heading}`}>
                    <h2 className={styles.subTopic}>{texts.heading}</h2>
                    <div className={styles.textContent} dangerouslySetInnerHTML={{ __html: generateContent}}/>
                  </section>
                )

              })}
            </article>
          </>
        )
        : (
            <h2>Carregando...</h2>
        )
        
      }
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.predicates.at('document.type', 'post')
  ], {
    pageSize: 2,
  }
  );

  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid
      }
    }
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({params}) => {
  const { slug } = params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content,
    }
  }

  return {
    props: {
      post,
    }
  }
  // TODO
};
