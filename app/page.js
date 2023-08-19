import Head from 'next/head';
import Container, { siteTitle } from './container'
import utilStyles from './utils.module.css';

export default function Home() {
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
    </Container>
  )
}
