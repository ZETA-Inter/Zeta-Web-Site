import React from 'react';
import styles from './CardProdutor.module.css';

function CardProdutor({ nome, segmento, image, active, image_size }) {

  const fallbackFoto = image || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  return (
    <li className={styles.ProdutorCard}>
      <img src={fallbackFoto} alt={nome} className={styles.ProdutorFoto}
        style={{
          width: image_size || '10%',
        }}
      />

      <div className={styles.ProdutorInfo}>
        <div className={styles.ProdutorNome}>{nome}</div>

        <div className={styles.ProdutorStatus}>
            Status: 
            <span className={active ? styles.Active : styles.Inactive}>
                {active ? 'Ativo' : 'Inativo'}
            </span>
        </div>

        <div className={styles.ProdutorSegmento}>Segmentos: {segmento.toLowerCase()}</div>
      </div>
    </li>
  );
}

export default CardProdutor;