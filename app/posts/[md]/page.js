import Head from 'next/head';
import Container from '../../container'
import { getPostData, getAllPostIds } from '../../lib/post'
import Date from '../../date';
import utilStyles from '../../utils.module.css';

export default async function Post({ params }) {
    const postData = await getPostData(params.md);
    return (
        <Container>
            <Head>
                <title>{postData.title}</title>
            </Head>
            <article>
                <h1 className={utilStyles.headingXl}>{postData.title}</h1>
                <div className={utilStyles.lightText}>
                    <Date dateString={postData.date} />
                </div>
                <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
            </article>
        </Container>
    );
}

export async function generateStaticParams() {
    const allpost = getAllPostIds();
    return allpost;
}