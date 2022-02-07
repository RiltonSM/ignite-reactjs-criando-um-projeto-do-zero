/* eslint-disable prettier/prettier */
import { useState, useCallback, useEffect } from 'react'
import { GetStaticProps } from 'next';
import Prismic from "@prismicio/client";
import Link from 'next/link';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { PostItem } from '../components/PostItem';
import { LoadMore } from '../components/LoadMore';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPageUrl, setNextPageUrl] = useState(postsPagination.next_page);
  
  const handleClickLoadMorePosts = useCallback(() => {
    const myRequest = new Request(postsPagination.next_page, {method: 'GET'})
    fetch(myRequest)
      .then((res) => res.json())
      .then(data => {
        setPosts((oldPosts) => {
          const results = data.results.map((post) => {
            return {
              uid: post.uid,
              first_publication_date: post.first_publication_date,
              data: {
                author: post.data.author,
                title: post.data.title,
                subtitle: post.data.subtitle,
              }
            }
          });

          return [
            ...oldPosts,
            ...results
          ]
        });

        setNextPageUrl(data.next_page);
      });
  }, [postsPagination.next_page]);

  return (
    <main className={styles.container}>
      <header>
        <img src="/images/logo.svg" alt="logo" />
      </header>

      <section className={styles.posts}>
        { posts.map(post => {
          return(
            <Link key={post.uid} href={`/post/${post.uid}`}>
              <a>
                <PostItem
                  title={post.data.title}
                  subtitle={post.data.subtitle}
                  publishedAt={format(new Date(post.first_publication_date), 'dd LLL yyyy', {
                    locale: ptBR,
                  })}
                  author={post.data.author}
                />
              </a>
            </Link>
          )
        })}
      </section>
      
      { nextPageUrl && 
        <LoadMore handleClick={handleClickLoadMorePosts}/>
      }
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  
  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'post')
  ], {
      fetch: ['post.title', 'post.subtitle', 'post.author'],
      pageSize: 1,
  });

  const nextPageUrl = postsResponse.next_page;
  const results = postsResponse.results.map((post) => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        author: post.data.author,
        title: post.data.title,
        subtitle: post.data.subtitle,
      }
    }
  });

  // TODO

  return {
    props: {
      postsPagination: {
        next_page: nextPageUrl,
        results
      }
    },
    revalidate: 60 * 30, // 30 minutes
  };
};
