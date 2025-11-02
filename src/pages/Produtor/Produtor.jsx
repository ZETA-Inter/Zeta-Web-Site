import React, {useMemo, useState, useEffect } from "react";
import styles from "./Produtor.module.css";
import CardProdutorEdit from "../../components/CardProdutor/CardProdutorEdit";
import SegmentosList from "../../components/SegmentosList/SegmentosList";
import WorkerService from "../../services/workerService"
import GoalService from "../../services/goalService"
import { useNavigate } from "react-router-dom";

const getInitialData = (key, defaultValue) => { 
    const saved = localStorage.getItem(key);
    if (saved) {
        return JSON.parse(saved);
    }
    return defaultValue;
}

function Produtor() {

  const navigate = useNavigate();

  const companyId = localStorage.getItem("companyId") || 1;

  const [workers, setWorkers] = useState(() => getInitialData("workers", []));

  const hasCachedWorkers = workers.length > 0;
  // const [workersLoading, setWorkersLoading] = useState(!hasCachedWorkers); 
  const [metasStats, setMetasStats] = useState({
    concluidas: 0,
    percentual: 0
  });

    useEffect(() => {
  
      async function fetchWorkers() {
          if (!hasCachedWorkers) setWorkersLoading(true);
  
          try {
              const fetchedWorkers = await WorkerService.listWorkersByCompany(companyId);
              setWorkers(fetchedWorkers);
              localStorage.setItem("workers", JSON.stringify(fetchedWorkers));
          } catch (error) {
              console.error("Erro ao carregar produtores: ", error);
          }
      }

      async function fetchPercentual() {
        try {
            const stats = await GoalService.CountProgressGoals(companyId); 
            
            setMetasStats({
                concluidas: stats.concluidas || 0, 
                percentual: stats.percentual || 0  
            });

        } catch (error) {
            console.error("Erro ao carregar percentual das metas: ", error);
            
            setMetasStats({
                concluidas: 0,
                percentual: 0
            });
        }
      }
      fetchWorkers(), fetchPercentual();
    }, [companyId, hasCachedWorkers]);

  const [segmentoAtivo, setSegmentoAtivo] = useState(null);
  const [searchText, setSearchText] = useState('');
  
    const produtoresFiltrados = useMemo(() => {
  let lista = [...workers];

  if (segmentoAtivo) {
    lista = lista.filter(w => w.segments && w.segments.includes(segmentoAtivo));
  }

  if (searchText) {
    const lowerCaseSearch = searchText.toLowerCase();
    lista = lista.filter(w =>
      (w.name && w.name.toLowerCase().includes(lowerCaseSearch)) ||
      (w.email && w.email.toLowerCase().includes(lowerCaseSearch))
    );
  }

  return lista;
}, [segmentoAtivo, searchText, workers]);




  
    const handleSegmentoSelection = (segmento) => {
      setSegmentoAtivo(segmento);
    };
  

    const handleAddWorkerClick = () => {
      navigate('/worker/create');
    };

    const handleEditWorker = (workerid) => {
      console.log("Editando produtor:", workerid);
      navigate(`/worker/create/${workerid}`)
    }

    const handleDeleteWorker = async (workerid) => {
  console.log(`Inativando produtor: ${workerid}`);

  try {
    await WorkerService.inactiveWorker(workerid);

    const existWorkers = JSON.parse(localStorage.getItem("workers") || "[]");

    const updatedWorkers = existWorkers.map(worker =>
      worker.id === workerid ? { ...worker, active: false } : worker
    );

    localStorage.setItem("workers", JSON.stringify(updatedWorkers));

    window.dispatchEvent(new Event("storageUpdate"));

    console.log(`Produtor ID ${workerid} inativado com sucesso.`);
    alert("Produtor inativado com sucesso!");
  } catch (error) {
    console.error(`Erro ao inativar produtor ID ${workerid}:`, error);
    alert("Falha ao inativar produtor. Tente novamente.");
  }
};



    
  return (
    <main className={styles.ProdutorPage}>
 
      <div className={styles.MainContent}>
        
        <div className={styles.filters}>

          <h1 className={styles.PageTitle}>Produtores</h1>
          
          <div className={styles.SearchBar}>
            <input
              type="text"
              placeholder="Pesquisar"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <img src="/src/assets/icons/icon_search.svg" alt="search icon" className={styles.SearchButton} />
            
          </div>
          <div className={styles.SegmentosContainer}>
            <SegmentosList
              onSelectSegmento={handleSegmentoSelection}
              segmentoAtivo={segmentoAtivo}
            />
          </div>
        </div>

        <div className={styles.ListWrapper}>
            {produtoresFiltrados.length > 0 ? (
              produtoresFiltrados.map((worker) => (
                <CardProdutorEdit
                  key={worker.id}
                  name={worker.name}
                  segmento={worker.segmento}
                  image={worker.image}
                  image_size={worker.image_size}
                  active={worker.active}
                  onEdit={() => handleEditWorker(worker.id)}
                  onDelete={() => handleDeleteWorker(worker.id)}
                />
              ))): (
                <p>Nenhum produtor encontrada para a busca: "{searchText || 'todas'}"</p>
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
                  var(--cor-progresso) ${metasStats.percentual}%,
                  var(--cor-fundo-grafico) ${metasStats.percentual}%
                )`
                }}> 
              
                <span>{metasStats.percentual}%</span>
              </div>
        </div>

        <button className={styles.AddButton}
        onClick={handleAddWorkerClick}>Adicionar produtor</button>

      </aside>
    </main>
  ) 
}

export default Produtor;
