import React, {useMemo, useState, useEffect} from "react";
import styles from "./Produtor.module.css";
import ProdutoresList from "../../components/ProdutoresList/ProdutoresList";
import SegmentosList from "../../components/SegmentosList/SegmentosList";
import WorkerService from "../../services/workerService"

const getInitialData = (key, defaultValue) => { 
    const saved = localStorage.getItem(key);
    if (saved) {
        return JSON.parse(saved);
    }
    return defaultValue;
}

function Produtor() {

  const companyId = localStorage.getItem("companyId") || 1;

  const [workers, setWorkers] = useState(() => getInitialData("workers", []));

  const hasCachedWorkers = workers.length > 0;
  const [workersLoading, setWorkersLoading] = useState(!hasCachedWorkers); 
  const [metasStats, satMetasStats] = useState({
    concluidas: 0, 
    naoConcluidas: 0,
    percentual: 0
  });

  const [goalsLoading, setGoalsLoading] = useState(true);

    useEffect(() => {
  
      async function fetchWorkers() {
          if (!hasCachedWorkers) setWorkersLoading(true);
  
          try {
              const fetchedWorkers = await WorkerService.listWorkersByCompany(companyId);
              setWorkers(fetchedWorkers);
              localStorage.setItem("workers", JSON.stringify(fetchedWorkers));
          } catch (error) {
              console.error("Erro ao carregar produtores: ", error);
          } finally {
              setWorkersLoading(false);
          }
      }

      fetchWorkers();
    }, [companyId, hasCachedWorkers]);

  const [segmentoAtivo, setSegmentoAtivo] = useState(null);
  const [searchText, setSearchText] = useState('');
  
    const produtoresFiltrados = useMemo(() => {
      if (!segmentoAtivo) {
        return workers;
      }

      if (searchText) {
          const lowerCaseSearch = searchText.toLowerCase();
          lista = lista.filter(workers => 
              (workers.name && workers.name.toLowerCase().includes(lowerCaseSearch)) ||
              (workers.email && workers.email.toLowerCase().includes(lowerCaseSearch))
          );
      }
      
      return workers.filter(w => 
        w.segments && w.segments.includes(segmentoAtivo) 
      );
      
    }, [segmentoAtivo, workers]);
  
    const handleSegmentoSelection = (segmento) => {
      setSegmentoAtivo(segmento);
    };

    useEffect(() => {
      async function fetchGoals() {
        if(workers.length === 0) return;

        setGoalsLoading(true);

        try {
          const goalPromisses = worker.map(w => 
            WorkerService.ListGoalsByWorker(w.id)
          );

          const goalsResults = await Promise.all(goalPromisses);

          const allGoals = goalsResults.flat();

          const metasConcluidas = allGoals.filter(goal =>
            goal.status === "concluida"
          )

          const totalMetas = allGoals.length;

          const metasNaoConcluidas = totalMetas - metasConcluidas.length;

          const percentual = totalMetas === 0 ? 0 : Math.round((metasConcluidas.length / totalMetas) * 100);

          setMetasStats({
            concluidas: metasConcluidas.length,
            naoConcluidas: metasNaoConcluidas,
            percentual: percentual
          });
        } catch (error) {
          console.error("Erro ao carregar metas: ", error);
        } finally {
          setGoalsLoading(false);
        }
      }

      console.log("Workers: ", workers);

      fetchGoals();
    }, [workers]);
    
    
  return (
    <main className={styles.ProdutorPage}>
 
      <div className={styles.MainContent}>
        <h1 className={styles.PageTitle}>Produtores</h1>
        
        <div className={styles.SearchBar}>
          <input 
            type="text"   
            placeholder="Pesquisar"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button className={styles.SearchButton}>🔍</button>
        </div>

        <div className={styles.SegmentosContainer}>
          <SegmentosList 
            onSelectSegmento={handleSegmentoSelection}
            segmentoAtivo={segmentoAtivo} 
          />
        </div>

        <div className={styles.ListWrapper}>
          {workersLoading ? (
            <p>Carregando produtores...</p>
          ) : (
            <ProdutoresList produtores={produtoresFiltrados} />
            )}
        </div>
      </div>

      <aside className={styles.StatsSidebar}>
        <div className={styles.dashProdutorees}>
          <div className={styles.dashAtivos}>
            <p>Produtores <span>Ativos</span></p>
            <h2>{workers.filter(worker => worker.active).length}</h2>
          </div>
          <div className={styles.dashInativos}>
            <p>Produtores <span>Inativos</span></p>
            <h2>{workers.filter(worker => !worker.active).length}</h2>
          </div>
        </div>

        <div className={styles.MetasCard}>
            <p>Progresso de metas</p>
            <div className={styles.ChartPlaceholder}
              style={{
                background: `conic-gradient(
                  var(--cor-progresso) 75%,
                  var(--cor-fundo-grafico) 75%
                )`
                }}>
              
                <span>{metasStats.percentual}%</span>
              </div>
            <p>Metas concluídas: {metasStats.concluidas}</p>
            <p>Metas não concluídas: {metasStats.naoConcluidas}</p>
        </div>

        <button className={styles.AddButton}>Adicionar produtor</button>

      </aside>
    </main>
  ) 
}

export default Produtor;
