import React, { useState, useMemo } from "react";
import styles from "./Home.module.css"
import mascote from "../../assets/images/zenin.svg"
import SegmentosList from "../../components/SegmentosList/SegmentosList"; 
import ProdutoresList from "../../components/ProdutoresList/ProdutoresList";
import MetasList from "../../components/MetasList/MetasList";

function Home() {

  const allProdutores = [
    { id: 1, nome: "Roberto Campos", segmento: "Bovinos", foto: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png" },
    { id: 2, nome: "Júlia Silva", segmento: "Suínos", foto: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png" },
    { id: 3, nome: "Carlos Almeida", segmento: "Bovinos", foto: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png" },
    { id: 4, nome: "Mariana Souza", segmento: "Aves", foto: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png" },
    { id: 5, nome: "Lucas Degasperi", segmento: "Bovinos", foto: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png" },
    { id: 6, nome: "George Mesquita", segmento: "Suínos", foto: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png" },
    { id: 7, nome: "Denise Perereira", segmento: "Aves", foto: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png" },
  ];

  const metas = [
    { id: 1, titulo: "Meta 1", descricao: "Descrição do que deve ser feito" },
    { id: 2, titulo: "Meta 2", descricao: "Descrição do que deve ser feito" },
    { id: 3, titulo: "Meta 3", descricao: "Descrição do que deve ser feito" },
    { id: 4, titulo: "Meta 4", descricao: "Descrição do que deve ser feito" },
    { id: 5, titulo: "Meta 5", descricao: "Descrição do que deve ser feito" },
    { id: 6, titulo: "Meta 6", descricao: "Descrição do que deve ser feito" },
    { id: 7, titulo: "Meta 7", descricao: "Descrição do que deve ser feito" },
  ];

  const [segmentoAtivo, setSegmentoAtivo] = useState(null);

  const produtoresFiltrados = useMemo(() => {
    return segmentoAtivo
      ? allProdutores.filter(p => p.segmento === segmentoAtivo)
      : allProdutores;
  }, [segmentoAtivo, allProdutores]);

  const handleSegmentoSelection = (segmento) => {
    setSegmentoAtivo(segmento);
  };

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
          
          <SegmentosList 
            onSelectSegmento={handleSegmentoSelection}
          />
          
          <ProdutoresList produtores={produtoresFiltrados} />

        </div>

        <MetasList metas={metas} />
        
      </div>
    </main>
  )
}

export default Home;