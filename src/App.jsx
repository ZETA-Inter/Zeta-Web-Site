import './App.css'
import { BrowserRouter as Router, Routes, Route, Meta } from "react-router-dom";
import SideBar from "./components/Sidebar/Sidebar";
import Home from "./components/Home/Home";
import Produtor from "./components/Produtor";
import Curso from "./components/Curso";
import Metas from "./components/Metas";

function App() {
  // Removendo o padding do contêiner principal e movendo o minHeight para o CSS global.
  // Vamos usar um className aqui para facilitar o estilo.
  return (
    <Router>
      <div className="app-layout"> 
        <SideBar />

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/curso" element={<Curso />} />
            <Route path="/metas" element={<Metas />} />
            <Route path="/produtor" element={<Produtor />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App