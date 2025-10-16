import './App.css'
import { BrowserRouter as Router, Routes, Route, Meta } from "react-router-dom";
import SideBar from "./components/Sidebar/Sidebar";
import Home from "./components/Home";
import Produtor from "./components/Produtor";
import Curso from "./components/Curso";
import Metas from "./components/Metas";

function App() {
 

  return (
    <Router>
      <div style={{ display: "flex", minHeight: "100vh", gap: "20px", padding: "20px" }}>
        <SideBar />

        <div style={{ flex: 1 }}>
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
