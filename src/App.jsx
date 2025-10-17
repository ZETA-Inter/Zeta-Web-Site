import './App.css'
import { BrowserRouter as Router, Routes, Route, Meta } from "react-router-dom";
import SideBar from "./components/Sidebar/Sidebar";
import Home from "./pages/Home/Home";
import Produtor from "./pages/Produtor/Produtor";
import Curso from "./pages/Curso/Curso";
import Metas from "./pages/Metas/Metas";

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