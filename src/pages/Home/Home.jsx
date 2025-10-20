import React, { useState, useMemo, useEffect } from "react";
import styles from "./Home.module.css"
import mascote from "../../assets/images/zenin.svg"
import SegmentosList from "../../components/SegmentosList/SegmentosList"; 
import ProdutoresList from "../../components/ProdutoresList/ProdutoresList";
import MetasList from "../../components/MetasList/MetasList";
import GoalService from "../../services/goalService"
import WorkerService from "../../services/workerService"

function Home() {

  const companyId = 1

  const [workers, setWorkers] = useState([]);
  const [goals, setGoals] = useState([]);
 
  const [workersLoading, setWorkersLoading] = useState(true);
  const [goalsLoading, setGoalsLoading] = useState(true);

  useEffect(() => {

    async function fetchWorkers() {
      try {
        setWorkersLoading(true);
        const workers = await WorkerService.listWorkersByCompany(companyId)
        setWorkers(workers)
      } catch (error) {
        console.error("Erro ao carregar produtores: ", error);
      } finally {
        setWorkersLoading(false);
      }
    }

    async function fetchGoals() {
      try {
        setGoalsLoading(true);
        const goals = await GoalService.listGoalsByCompanyId(companyId)
        setGoals(goals);
      } catch (error) {
        console.error("Erro ao carregar metas: ", error);
      } finally {
        setGoalsLoading(false);
      }
    }
    
    fetchGoals()
    fetchWorkers()

  }, [companyId])

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

      <img src={mascote} alt="Mascote ZETA" className={styles.Mascote} />

      <div className={styles.WelcomeBanner}>
        <div className={styles.BannerContent}>
          <h3>Bem vindo à plataforma de gerenciamento do seu zeta!</h3>
          <p>Permitindo moldar sua estrutura para realizar os treinamentos</p>
        </div>
        <img src="/src/assets/images/circulo-home-zeni.png" alt="" />
      </div>
      
      <div className={styles.Informacoes}>
        <div className={styles.InfosProdutores}>
          
          <div className={styles.InfosSegmentos}>
            <SegmentosList 
              onSelectSegmento={handleSegmentoSelection}
            />
          </div>
        
          
          {workersLoading ? (
             <p>Carregando produtores...</p>
          ) : (
            <ProdutoresList produtores={produtoresFiltrados} />
          )}

        </div>

        {goalsLoading ? (
          <p>Carregando metas...</p>
        ) : (
          <MetasList metas={goals} />
        )}
        
      </div>
    </main>
  )
}

export default Home;