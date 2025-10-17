import React, { useState } from "react";
import styles from "./Home.module.css"
import mascote from "../../assets/images/zenin.svg" 

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

  const segmentos = ["Bovinos", "Suínos", "Aves"];

  const [segmentoAtivo, setSegmentoAtivo] = useState(null);

  // Filtrar os produtores pelo segmento selecionado
  const produtoresFiltrados = segmentoAtivo
  ? allProdutores.filter(p => p.segmento === segmentoAtivo)
  : allProdutores;

  // Lógica do clique do Segmento
  const handleSegmentoClick = (segmento) => {
    if (segmento === segmentoAtivo) {
      setSegmentoAtivo(null)
    } else {
      setSegmentoAtivo(segmento)
    }
  }

  return(
    <main className={styles.HomeContainer}> 
      <h2>Bem vindo, Usuário</h2> 

      <img src={mascote} alt="Mascote ZETA" className={styles.Mascote} />

      <div className={styles.WelcomeBanner}>
        <div className={styles.BannerContent}>
          <h3>Bem vindo à plataforma de gerenciamento do seu zeta!</h3>
          <p>Permitindo moldar sua estrutura para realizar os treinamentos</p>
        </div>
      </div>
      
      <div className={styles.Informacoes}>
        <div className={styles.InfosProdutores}>
          <ul className={styles.Segmentos}>
            {segmentos.map(segmento => (
                  <li key={segmento} onClick={() => handleSegmentoClick(segmento)}
                  className={segmento === segmentoAtivo ? styles.SegmentoAtivo : ""}>
                    {segmento}
                  </li>
            ))}
          </ul>
          
          <ul className={styles.Produtores}>
            {produtoresFiltrados.map(produtor => (
              <li key={produtor.id} className={styles.ProdutorCard}>
                <img src={produtor.foto} alt={produtor.nome} className={styles.ProdutorFoto} />
                <div className={styles.ProdutorInfo}>
                  <div className={styles.ProdutorNome}>{produtor.nome}</div>
                  <div className={styles.ProdutorSegmento}>Segmento: {produtor.segmento.toLowerCase()}</div>
                </div>
              </li>
            ))}
          </ul>
          {produtoresFiltrados.length === 0 && (
            <p>Nenhum produtor encontrado para o segmento "{segmentoAtivo}".</p>
          )}
        </div>

        <div className={styles.MetasVinculadas}>
          <div className={styles.MetasHeader}>Metas vinculadas a Produtor</div>
          
          <div className={styles.MetasList}>
            {metas.map(meta => (
              <div key={meta.id} className={styles.MetaItem}>
                <div className={styles.MetaTitle}>{meta.titulo}</div>
                <p>{meta.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

export default Home;