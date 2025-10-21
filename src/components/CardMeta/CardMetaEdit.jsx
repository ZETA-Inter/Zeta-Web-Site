import React from 'react';
import styles from './CardMetaEdit.module.css';

function CardMetaEdit({ id, title, description, onEdit, onDelete, onClick, className }) {
    return (
        <div 
            className={`${styles.MetaCardEdit} ${className || ''}`}
            onClick={onClick}
            role="button"
            tabIndex={0}
        >
            <div className={styles.LeftBar}></div>
            
            <div className={styles.MetaContent}>
                <div className={styles.MetaTitle}>{title}</div>
                <p className={styles.MetaDescription}>{description}</p>
            </div>
            
            <div className={styles.Actions}>
                <button 
                    className={styles.EditButton} 
                    onClick={(e) => { 
                        e.stopPropagation();
                        onEdit(id); 
                    }}
                    aria-label={`Editar meta ${title}`}
                >
                    ✏️
                </button>
                
                <button 
                    className={styles.DeleteButton} 
                    onClick={(e) => { 
                        e.stopPropagation();
                        onDelete(id); 
                    }}
                    aria-label={`Excluir meta ${title}`}
                >
                    🗑️
                </button>
            </div>
        </div>
    );
}

export default CardMetaEdit;