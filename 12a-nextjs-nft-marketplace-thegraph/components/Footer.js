import styles from '../styles/Home.module.css';

export default function Footer() {
  function openGithub() {
    window.open(
      'https://github.com/0xpolarzero/full-blockchain-solidity-course-js',
      '_blank',
    );
  }

  return (
    <footer className={styles.footer}>
      <a href='https://polarzero.xyz/' target={'_blank'}>
        Built by polarzero
      </a>
      <i className='fa-brands fa-github icon-footer' onClick={openGithub}></i>
    </footer>
  );
}
