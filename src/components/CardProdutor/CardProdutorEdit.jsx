import React from "react";
import styles from './CardProdutor.module.css';


function CardProdutorEdit({ id, name, segmento, image, active, image_size,onEdit, onDelete }) {
  const fallbackFoto = image || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
    return (
        <li className={styles.ProdutorCard}>
              <img src={fallbackFoto} alt={name} className={styles.ProdutorFoto}
                style={{
                  width: image_size || '10%',
                }}
              />
        
              <div className={styles.ProdutorInfo}>
                <div className={styles.ProdutorNome}>{name}</div>
        
                <div className={styles.ProdutorStatus}>
                    Status: 
                    <span className={active ? styles.Active : styles.Inactive}>
                        {active ? 'Ativo' : 'Inativo'}
                    </span>
                </div>
        
                {/* <div className={styles.ProdutorSegmento}>Segmentos: {segmento.toLowerCase()}</div> */}
              </div>

              <div className={styles.Actions}>
                    <img
                        src="/src/assets/icons/icon_edit.svg" 
                        className={styles.EditButton} 
                        onClick={(e) => { 
                            e.stopPropagation();
                            onEdit(id); 
                        }}
                    />
                    
                    <img
                        src="/src/assets/icons/icon_delete.svg" 
                        className={styles.DeleteButton} 
                        onClick={(e) => { 
                            e.stopPropagation();
                            onDelete(id); 
                        }}
                    />
                </div>
            </li>
    )
}


export default CardProdutorEdit;