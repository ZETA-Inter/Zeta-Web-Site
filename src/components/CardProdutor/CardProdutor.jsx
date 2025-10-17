import React from 'react';
import styles from './CardProdutor.module.css';

function CardProdutor({ nome, segmento, foto }) {
  return (
    <li className={styles.ProdutorCard}>
      <img src={foto} alt={nome} className={styles.ProdutorFoto} />
      <div className={styles.ProdutorInfo}>
        <div className={styles.ProdutorNome}>{nome}</div>
        <div className={styles.ProdutorSegmento}>Segmento: {segmento.toLowerCase()}</div>
      </div>
    </li>
  );
}

export default CardProdutor;