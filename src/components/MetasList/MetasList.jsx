import React from 'react';
import styles from './MetasList.module.css'; // Crie este novo arquivo CSS
import CardMeta from '../CardMeta/CardMeta'; 

function MetasList({ metas }) {
  
  if (!metas || metas.length === 0) {
    return (
      <div className={styles.MetasVinculadas}>
        <div className={styles.MetasHeader}>Metas vinculadas a Produtor</div>
        <p className={styles.NoMetas}>Nenhuma meta vinculada no momento.</p>
      </div>
    );
  }

  return (
    <div className={styles.MetasVinculadas}>
      <div className={styles.MetasHeader}>Metas vinculadas a Produtor</div>
      
      <div className={styles.MetasListContainer}> 
        {metas.map(meta => (
          <CardMeta
            key={meta.id}
            titulo={meta.titulo}
            descricao={meta.descricao}
          />
        ))}
      </div>
    </div>
  );
}

export default MetasList;