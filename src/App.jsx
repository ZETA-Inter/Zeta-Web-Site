import './App.css'
import { BrowserRouter as Router, Routes, Route, Meta } from "react-router-dom";
import SideBar from "./components/Sidebar/Sidebar";
import Home from "./pages/Home/Home";
import Produtor from "./pages/Produtor/Produtor";
import Curso from "./pages/Curso/Curso";
import Metas from "./pages/Metas/Metas";
import CreateMetas from "./pages/CreateMetas/CreateMetas"

function App() {
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
            <Route path="metas/create" element={<CreateMetas />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App