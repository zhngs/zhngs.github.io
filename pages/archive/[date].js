import Layout,  { siteTitle }  from '../../components/layout'
import { getSortedPostsDataWithYear, getAllDate } from '../../lib/posts'
import Head from 'next/head'
import Date from '../../components/date'
import Link from 'next/link'
import utilStyles from '../../styles/utils.module.css'

export default function Post({ year, allPostsData }) {
    return (
        <Layout>
        <Head>
            <title>{siteTitle}</title>
        </Head>
        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
            <h2 className={utilStyles.headingLg}>🗓️ {year}</h2>
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

export async function getStaticPaths() {
    const paths = getAllDate()
    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({ params }) {
    const year = params.date;
    const allPostsData = await getSortedPostsDataWithYear(year);
    return {
        props: {
            year,
            allPostsData
        }
    }
}
