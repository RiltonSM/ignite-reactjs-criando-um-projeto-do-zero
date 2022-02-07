/* eslint-disable prettier/prettier */
import Link from 'next/link';

import styles from './header.module.scss';

export default function Header() {
  return(
    <Link href='/'>
      <a>
        <header className={styles.container}>
          <img src="/images/logo.svg" alt="logo" className={styles.logo} />
        </header>
      </a>
    </Link>
  )
}
