import React from 'react';
import styles from './CardMeta.module.css';

function CardMeta({ titulo, descricao }) {
  return (
    <div className={styles.MetaItem}>
      <div className={styles.MetaTitle}>{titulo}</div>
      <p>{descricao}</p>
    </div>
  );
}

export default CardMeta;