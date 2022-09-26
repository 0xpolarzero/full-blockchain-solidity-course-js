import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Smart Contract Lottery</title>
        <meta
          name='description'
          content='A smart contract lottery built with NextJS'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>{/*  */}</main>

      <footer className={styles.footer}>{/*  */}</footer>
    </div>
  );
}
