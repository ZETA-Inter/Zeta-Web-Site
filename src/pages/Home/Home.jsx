import React, { useState, useMemo, useEffect } from "react";
import styles from "./Home.module.css"
import mascote from "../../assets/images/zenin.svg"
import SegmentosList from "../../components/SegmentosList/SegmentosList"; 
import ProdutoresList from "../../components/ProdutoresList/ProdutoresList";
import MetasList from "../../components/MetasList/MetasList";
import GoalService from "../../services/goalService"
import WorkerService from "../../services/workerService"

const getInitialData = (key, defaultValue) => {
  const saved = localStorage.getItem(key);
  if (saved) {
      return JSON.parse(saved);
  }
  return defaultValue;
};

function Home() {

  const companyId = localStorage.getItem("companyId") || 1;

  console.log(companyId  )

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
  }, [])

  const hasCachedWorkers = workers.length > 0;
  const hasCachedGoals = goals.length > 0;

  const [workersLoading, setWorkersLoading] = useState(!hasCachedWorkers);    
  const [goalsLoading, setGoalsLoading] = useState(!hasCachedGoals);

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

    async function fetchGoals() {
         if (!hasCachedGoals) setGoalsLoading(true);

        try {
            const fetchedGoals = await GoalService.listGoalsByCompanyId(companyId);
            setGoals(fetchedGoals);
            localStorage.setItem("goals", JSON.stringify(fetchedGoals));
        } catch (error) {
            console.error("Erro ao carregar metas: ", error);
        } finally {
            setGoalsLoading(false);
        }
    }
      
    fetchGoals();
    fetchWorkers();

  }, [companyId, hasCachedWorkers, hasCachedGoals]);

  const [segmentoAtivo, setSegmentoAtivo] = useState(null);

  const produtoresFiltrados = useMemo(() => {
    if (!segmentoAtivo) {
      return workers;
    }
    
    return workers.filter(w => 
      w.segments && w.segments.includes(segmentoAtivo) 
    );
    
  }, [segmentoAtivo, workers]);

  const handleSegmentoSelection = (segmento) => {
    setSegmentoAtivo(segmento);
  };

  const isLoading = workersLoading || goalsLoading;

    return(
      <main className={styles.HomeContainer}> 
        <h2>Bem vindo, Usuário</h2> 

        {/* <img src={mascote} alt="Mascote ZETA" className={styles.Mascote} /> */}

        <div className={styles.WelcomeBanner}>
          <div className={styles.BannerContent}>
            <h3>Bem vindo à plataforma de gerenciamento do seu Zeta!</h3>
            <p>Permitindo moldar sua estrutura para realizar os treinamentos</p>
          </div>
          {/* <img src="/src/assets/images/circulo-home-zeni.png" alt="" /> */}
        </div>
        
        <div className={styles.Informacoes}>

          <div className={styles.filterworkers}>
            <div className={styles.InfosSegmentos}>
                <SegmentosList
                  onSelectSegmento={handleSegmentoSelection}
                />
            </div>
            
            <div className={styles.InfosProdutores}>
            
              {workersLoading ? (
                <p>Carregando produtores...</p>
              ) : (
                <ProdutoresList produtores={produtoresFiltrados} />
              )}
            </div>
          </div>

          <div className={styles.ListMetas}>
            {goalsLoading ? (
              <p>Carregando metas...</p>
            ) : (
              <MetasList metas={goals} />
            )}
          </div>
          
        </div>
      </main>
    )
}

export default Home;