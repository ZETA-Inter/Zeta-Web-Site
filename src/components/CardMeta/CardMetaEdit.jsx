import React from 'react';
import styles from './CardMetaEdit.module.css';

function CardMetaEdit({ id, name, description, onEdit, onDelete, onClick, className }) {
    return (
        <div 
            className={`${styles.MetaCardEdit} ${className || ''}`}
            onClick={onClick}
            role="button"
            tabIndex={0}
        >
            <div className={styles.LeftBar}></div>
            
            <div className={styles.MetaContent}>
                <div className={styles.MetaTitle}>{name}</div>
                <p className={styles.MetaDescription}>{description}</p>
            </div>
            
            <div className={styles.Actions}>
                <img
                    src="/src/assets/icons/icon_edit.svg" 
                    className={styles.EditButton} 
                    onClick={(e) => { 
                        e.stopPropagation();
                        onEdit(id); 
                    }}
                    aria-label={`Editar meta ${name}`}
                />
                
                <img
                    src="/src/assets/icons/icon_delete.svg" 
                    className={styles.DeleteButton} 
                    onClick={(e) => { 
                        e.stopPropagation();
                        onDelete(id); 
                    }}
                    aria-label={`Excluir meta ${name}`}
                />
            </div>
        </div>
    );
}

export default CardMetaEdit;