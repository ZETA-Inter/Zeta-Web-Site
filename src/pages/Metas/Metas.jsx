import React, { useState, useMemo, useEffect } from "react";
import styles from "./Metas.module.css"; 
import GoalService from "../../services/goalService"; 
import MetaCard from "../../components/CardMeta/CardMetaEdit"; 
import WorkerCard from "../../components/CardProdutor/CardProdutor";
import { useNavigate } from "react-router-dom";

const getInitialData = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    if (saved) {
        return JSON.parse(saved);
    }
    return defaultValue;
};

function Metas() {

    const navigate = useNavigate();
    
    const loadGoalsFromStorage = () => getInitialData("goals", []);

    const [workers, setWorkers] = useState(() => getInitialData("workers", []));
    const [goals, setGoals] = useState(loadGoalsFromStorage);

    useEffect(() => {
      const handleStorageChange = () => {
          console.log("Detectada mudança no armazenamento! Recarregando metas...");
          setGoals(loadGoalsFromStorage()); 
      };

      window.addEventListener("storageUpdate", handleStorageChange);

      return () => {
          window.removeEventListener("storageUpdate", handleStorageChange);
      };
  }, []);

    const goalsLoading = goals.length === 0;

    const [searchText, setSearchText] = useState('');
    const [activeGoalId, setActiveGoalId] = useState(null); 
    const [workersGoalIds, setWorkersGoalIds] = useState([]);
    
    const metasFiltradas = useMemo(() => {
        let lista = goals;

        if (searchText) {
            const lowerCaseSearch = searchText.toLowerCase();
            lista = lista.filter(meta => 
                (meta.title && meta.title.toLowerCase().includes(lowerCaseSearch)) ||
                (meta.description && meta.description.toLowerCase().includes(lowerCaseSearch))
            );
        }
        
        return lista;
        
    }, [searchText, goals]);

    useEffect(() => {
        if (!activeGoalId) {
            setWorkersGoalIds([]);
            return;
        }

        async function getWorkerGoalIds() {
            try {
                const ids = await GoalService.listWorkerIdsByGoalId(activeGoalId); 
                setWorkersGoalIds(ids);
            } catch (error) {
                console.error(`Erro ao carregar Worker IDs para a meta ${activeGoalId}:`, error);
                setWorkersGoalIds([]);
            }
        }

        getWorkerGoalIds();
    }, [activeGoalId]);

    const workersSideBar = useMemo(() => {
        if (workersGoalIds.length === 0) {
            return [];
        }

        return workers.filter(worker => 
            workersGoalIds.includes(worker.id)
        );
    }, [workersGoalIds, workers]); 

    if (goalsLoading) {
        return <p>Carregando dados globais do cache...</p>;
    }

    const handleAddGoalClick = () => {
      navigate('/metas/create'); 
    };
    
    return (
        <main className={styles.MetasPage}>
            
            <h1 className={styles.PageTitle}>Metas</h1>
            
            <div className={styles.SearchAndFilters}>
                <div className={styles.SearchBar}>
                    <input 
                        type="text" 
                        placeholder="Pesquisar"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button className={styles.SearchButton}>🔍</button>
                </div>
                
            </div>

            <div className={styles.ContentWrapper}>

                {/* LISTA CENTRAL DE METAS */}
                <div className={styles.MetaListArea}>
                    {metasFiltradas.length > 0 ? (
                        metasFiltradas.map((meta, index) => (
                            <MetaCard 
                                key={meta.id} 
                                title={meta.title || `Meta ${index + 1}`} 
                                description={meta.description} 
                                onEdit={() => console.log('Editar:', meta.id)}
                                onDelete={() => console.log('Excluir:', meta.id)}
                                onClick={() => setActiveGoalId(meta.id)}
                                className={meta.id === activeGoalId ? styles.ActiveMeta : ''} 
                            />
                        ))
                    ) : (
                        <p>Nenhuma meta encontrada para a busca: "{searchText || 'todas'}"</p>
                    )}
                </div>

                <div className={styles.SidebarSticky}>
                    <h2 className={styles.SidebarTitle}>
                        Produtores vinculados à meta ({workersSideBar.length})
                    </h2>
                    
                    <div className={styles.WorkerList}>
                        {workersSideBar.length > 0 ? (
                             workersSideBar.map(worker => (
                                <WorkerCard 
                                    key={worker.id}
                                    nome={worker.name}
                                    segmento={worker.segments ? worker.segments.join(', ') : 'N/A'} 
                                    foto={worker.image_url}
                                    active={worker.active}
                                />
                            ))
                        ) : (
                            <p>Selecione uma meta para ver os produtores vinculados.</p>
                        )}
                       
                    </div>

                    <button className={styles.AddButton}
                    onClick={handleAddGoalClick}>Adicionar meta</button>
                </div>
            </div>
        </main>
    );
}

export default Metas;