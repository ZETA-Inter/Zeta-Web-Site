import React from 'react';
import styles from './ProdutoresList.module.css';
import CardProdutor from '../CardProdutor/CardProdutor';

function ProdutoresList({ produtores }) {
  
  if (produtores.length === 0) {
    return <p>Nenhum produtor encontrado para o segmento selecionado.</p>;
  }

  return (
    <ul className={styles.Produtores}>
      {produtores.map(produtor => (
        <CardProdutor
          key={produtor.id}
          nome={produtor.name}
          segmento={produtor.segments.join(', ')}
          active={produtor.active}
          foto={produtor.image_url}
        />
      ))}
    </ul>
  );
}

export default ProdutoresList;