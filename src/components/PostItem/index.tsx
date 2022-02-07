/* eslint-disable prettier/prettier */
import { FiCalendar, FiUser } from 'react-icons/fi';
import styles from './styles.module.scss';

interface PostItemProps {
  title: string;
  subtitle: string;
  publishedAt: string;
  author: string;
}

export function PostItem({
  title,
  subtitle,
  publishedAt,
  author,
}: PostItemProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{subtitle}</p>

      <div className={styles.row}>
        <div className={styles.iconAndData}>
          <FiCalendar size={20} />
          <span>{publishedAt}</span>
        </div>

        <div className={styles.iconAndData}>
          <FiUser size={20} />
          <span>{author}</span>
        </div>
      </div>
    </div>
  );
}
