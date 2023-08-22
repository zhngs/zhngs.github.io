import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData, getPostsDir, getPinnedPostsData } from '../lib/posts'
import Link from 'next/link'
import Date from '../components/date'

export default function Home({ allPostsDir, allPostsData, pinnedPostsData }) {
    return (
        <Layout home>
            <Head>
                <title>{siteTitle}</title>
            </Head>
            <section className={utilStyles.headingMd}>
                <p>
                    Hello👋, I’m <strong>zhngs</strong>. I’m a software engineer.
                </p>
                <p>
                    welcome to my blog😀.
                </p>
            </section>
            <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
                <h2 className={utilStyles.headingLg}>🗂️ Directory</h2>
                <ul className={utilStyles.list}>
                    {allPostsDir.map((dir) => (
                        <li className={utilStyles.listItem} key={dir}>
                            <Link href={`/posts/${dir}`}>{dir}</Link>
                        </li>
                    ))}
                </ul>
            </section>
            <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
                <h2 className={utilStyles.headingLg}>📍 Pinned</h2>
                <ul className={utilStyles.list}>
                    {pinnedPostsData.map(({ id, dir, date }) => (
                        <li className={utilStyles.listItem} key={id}>
                            <Link href={`/posts/${dir}/${id}`}>{id}</Link>
                            <br />
                            <small className={utilStyles.lightText}>
                                {dir} <Date dateString={date} />
                            </small>
                        </li>
                    ))}
                </ul>
            </section>
            <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
                <h2 className={utilStyles.headingLg}>📖 Recent Blog</h2>
                <ul className={utilStyles.list}>
                    {allPostsData.map(({ id, dir, date }) => (
                        <li className={utilStyles.listItem} key={id}>
                            <Link href={`/posts/${dir}/${id}`}>{id}</Link>
                            <br />
                            <small className={utilStyles.lightText}>
                                {dir} <Date dateString={date} />
                            </small>
                        </li>
                    ))}
                </ul>
            </section>
        </Layout>
    )
}

export async function getStaticProps() {
    const allPostsData = getSortedPostsData();
    const pinnedPostsData = getPinnedPostsData();
    const allPostsDir = getPostsDir();
    return {
        props: {
            allPostsDir,
            allPostsData,
            pinnedPostsData
        }
    }
}
