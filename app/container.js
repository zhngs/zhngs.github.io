import Head from 'next/head';
import Image from 'next/image';
import styles from './container.module.css';
import utilStyles from './utils.module.css';
import Link from 'next/link';
import headPhoto from '../public/images/head.jpeg'

const name = 'zhngs';
export const siteTitle = 'zhngs blog';

export default function Container({ children, home }) {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                {home ? (
                    <>
                        <Image
                            priority
                            src={headPhoto}
                            className={utilStyles.borderCircle}
                            height={144}
                            width={144}
                            alt=""
                        />
                        <h1 className={utilStyles.heading2Xl}>{name}</h1>
                    </>
                ) : (
                    <>
                        <Link href="/">
                            <Image
                                priority
                                src={headPhoto}
                                className={utilStyles.borderCircle}
                                height={108}
                                width={108}
                                alt=""
                            />
                        </Link>
                        <h2 className={utilStyles.headingLg}>
                            <Link href="/" className={utilStyles.colorInherit}>
                                {name}
                            </Link>
                        </h2>
                    </>
                )}
            </header>
            <main>{children}</main>
            {!home && (
                <div className={styles.backToHome}>
                    <Link href="/">← Back to home</Link>
                </div>
            )}
        </div>
    );
}