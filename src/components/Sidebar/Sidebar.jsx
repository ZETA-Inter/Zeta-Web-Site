import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./SideBar.module.css";
import logo from "../../assets/images/logo_zeta.svg"
import iconHome from "../../assets/icons/icon_home.svg"
import iconMetas from "../../assets/icons/icon_metas.svg"
import iconProdutor from "../../assets/icons/icon_produtor.svg"


function SideBar() {
  const location = useLocation(); 

  const { logout } = useAuth();

  const getLinkClass = (path) => {
    return location.pathname === path ? styles.activeLink : '';
  };

  return (
    <div className={styles.SideBar}>
      <div> 
        <div className={styles.logo}>
          <img src={logo} alt="ZETA" className="img-zeta"/> 
          <span>ZETA</span>
        </div>

        <nav>
          <ul>
            <li className="home">
              <Link to="/home" className={getLinkClass("/home")}>
                  <img src={iconHome} alt="Home"/>
                  Home
              </Link>
            </li>
            <li className="metas">
              <Link to="/metas" className={getLinkClass("/metas")}>
                  <img src={iconMetas} alt="Metas" />
                  Metas
              </Link>
            </li>
            <li className="produtor">
              <Link to="/produtor" className={getLinkClass("/produtor")}>
                  <img src={iconProdutor} alt="Produtor" />
                  Produtor
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      <div className={styles.LogoutContainer}>
        <button
          className={styles.LogoutButton}
          onClick={logout}
          >Sair</button>
      </div>

    </div>
  );
}

export default SideBar; 