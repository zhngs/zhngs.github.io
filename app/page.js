import Head from 'next/head';
import Container, { siteTitle } from './container'
import utilStyles from './utils.module.css';
import { getSortedPostsData } from './lib/post';
import Link from 'next/link';
import Date from './date';


export default function Home() {
    const allPostsData = getSortedPostsData();
    return (
        <Container home>
            <Head>
                <title>{siteTitle}</title>
            </Head>
            <section className={utilStyles.headingMd}>
                <p>hello I am zhngs</p>
                <p>
                    This is my blog website
                </p>
            </section>
            <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
                <h2 className={utilStyles.headingLg}>Blog</h2>
                <ul className={utilStyles.list}>
                    {allPostsData.map(({ id, date, title }) => (
                        <li className={utilStyles.listItem} key={id}>
                            <Link href={`/posts/${id}`}>{title}</Link>
                            <br />
                            <small className={utilStyles.lightText}>
                                <Date dateString={date} />
                            </small>
                        </li>
                    ))}
                </ul>
            </section>
        </Container>
    )
}
