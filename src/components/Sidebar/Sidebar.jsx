import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./SideBar.module.css";
import logo from "../../assets/images/logo_zeta.svg";
import iconHome from "../../assets/icons/icon_home.svg";
import iconMetas from "../../assets/icons/icon_metas.svg";
import iconProdutor from "../../assets/icons/icon_produtor.svg";

function SideBar() {
  const location = useLocation(); 
  const { logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const getLinkClass = (path) => location.pathname === path ? styles.activeLink : '';

  return (
    <>
      <div className={styles.Hamburger} onClick={() => setIsOpen(!isOpen)}>
        <span style={{ transform: isOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }}></span>
        <span style={{ opacity: isOpen ? 0 : 1 }}></span>
        <span style={{ transform: isOpen ? "rotate(-45deg) translate(6px, -6px)" : "none" }}></span>
      </div>

      <div className={`${styles.SideBar} ${isOpen ? "mobileHidden" : ""}`}
          style={{opacity: !isOpen ? 0 : 1}}
      >
        <div >
          <div className={styles.logo}>
            <img src={logo} alt="ZETA" className="img-zeta"/> 
            <span>ZETA</span>
          </div>

          <nav>
            <ul>
              <li>
                <Link to="/home" className={getLinkClass("/home")}>
                  <img src={iconHome} alt="Home"/>
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/metas" className={getLinkClass("/metas")}>
                  <img src={iconMetas} alt="Metas"/>
                  <span>Metas</span>
                </Link>
              </li>
              <li>
                <Link to="/produtor" className={getLinkClass("/produtor")}>
                  <img src={iconProdutor} alt="Produtor"/>
                  <span>Produtor</span>
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
    </>
  );
}

export default SideBar;
