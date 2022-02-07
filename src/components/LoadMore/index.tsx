/* eslint-disable prettier/prettier */

import styles from './styles.module.scss';

interface LoadMoreProps {
    handleClick: () => void;
}

export function LoadMore({ handleClick }: LoadMoreProps) {
    return(
        <button
            type="button"
            className={styles.content}
            onClick={handleClick}
        >
            Carregar mais posts
        </button>
    )
}