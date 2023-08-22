import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../lib/posts'
import Head from 'next/head'
import Date from '../../components/date'
import utilStyles from '../../styles/utils.module.css'
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vs as syntaxHighlight } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import MarkdownNavbar from 'markdown-navbar';
import 'markdown-navbar/dist/navbar.css';

const codeBlck = {
    code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '')
        return !inline && match ? (
            <SyntaxHighlighter
                {...props}
                children={String(children).replace(/\n$/, '')}
                style={syntaxHighlight}
                language={match[1]}
                PreTag="div"
            />
        ) : (
            <code {...props} className={className}>
                {children}
            </code>
        )
    }
}

export default function Post({ postData }) {
    return (
        <Layout>
            <Head>
                <title>{postData.id}</title>
            </Head>
            <article>
                <h1 className={utilStyles.headingXl}>{postData.id}</h1>
                <div className={utilStyles.lightText}>
                    <Date dateString={postData.date} />
                </div>
                <MarkdownNavbar source={postData.contentMarkdown} ordered={false} />
                <ReactMarkdown
                    children={postData.contentMarkdown}
                    components={codeBlck}
                />
            </article>
        </Layout>
    )
}

export async function getStaticPaths() {
    const paths = getAllPostIds()
    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({ params }) {
    const postData = await getPostData(params.id[0], params.id[1])
    return {
        props: {
            postData
        }
    }
}
