import React from 'react';
import styles from './CardMeta.module.css';

function CardMeta({ name, description }) {
  return (
    <div className={styles.MetaItem}>
      <div className={styles.MetaTitle}>{name}</div>
      <p>{description}</p>
    </div>
  );
}

export default CardMeta;