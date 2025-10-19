import React from "react";
import { Link, useLocation } from "react-router-dom"; 
import styles from "./SideBar.module.css";
import logo from "../../assets/images/logo_zeta.svg"
import iconHome from "../../assets/icons/icon_home.svg"
import iconCurso from "../../assets/icons/icon_curso.svg"
import iconMetas from "../../assets/icons/icon_metas.svg"
import iconProdutor from "../../assets/icons/icon_produtor.svg"


function SideBar() {
  const location = useLocation(); 

  const getLinkClass = (path) => {
    return location.pathname === path ? styles.activeLink : '';
  };

  return (
    <div className={styles.SideBar}>
      <div> 
        <div className={styles.logo}>
          <img src={logo} alt="ZETA" width={60} height={60}/> 
          <span>ZETA</span>
        </div>

        <nav>
          <ul>
            <li>
              <Link to="/" className={getLinkClass("/")}>
                  <img src={iconHome} alt="Home" width={20} height={20} />
                  Home
              </Link>
            </li>
            <li>
              <Link to="/curso" className={getLinkClass("/curso")}>
                  <img src={iconCurso} alt="Curso" width={20} height={20} />
                  Curso
              </Link>
            </li>
            <li>
              <Link to="/metas" className={getLinkClass("/metas")}>
                  <img src={iconMetas} alt="Metas" width={20} height={20} />
                  Metas
              </Link>
            </li>
            <li>
              <Link to="/produtor" className={getLinkClass("/produtor")}>
                  <img src={iconProdutor} alt="Produtor" width={20} height={20} />
                  Produtor
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      <div className={styles.exploreButton}>
        <div>Explorar novas funcionalidades</div>
        <div>acesse novos planos</div>
        <button>Planos</button> 
      </div>
    </div>
  );
}

export default SideBar; 