import React, { useState } from 'react';
import styles from './SegmentosList.module.css';

function SegmentosList({ onSelectSegmento }) {
  
  const segmentos = ["Bovino", "Suíno", "Aves"];
  const [segmentoAtivo, setSegmentoAtivo] = useState(null);

  const handleSegmentoClick = (segmento) => {
    let novoSegmento = segmento === segmentoAtivo ? null : segmento;
    
    setSegmentoAtivo(novoSegmento);
    onSelectSegmento(novoSegmento); 
  };

  return (
    <ul className={styles.Segmentos}>
      {segmentos.map(segmento => (
        <li 
          key={segmento} 
          onClick={() => handleSegmentoClick(segmento)}
          className={segmento === segmentoAtivo ? styles.SegmentoAtivo : ""}
        >
          {segmento}
        </li>
      ))}
    </ul>
  );
}

export default SegmentosList;