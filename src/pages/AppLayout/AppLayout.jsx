import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import SideBar from "../../components/Sidebar/Sidebar";
import Home from "../Home/Home";
import Produtor from "../Produtor/Produtor";
import Curso from "../Curso/Curso";
import Metas from "../Metas/Metas";
import CreateMetas from "../CreateMetas/CreateMetas"
import CreateProdutor from "../CreateProdutor/CreateProdutor"
import Login from "../Login/Login"
import ProtectedRoute from '../../components/ProtectedRoute/ProtectedRoute';

function AppLayout() {
  const location = useLocation();
  
  const noSideBarRoutes = ['/', '/login']; 

  const showSideBar = !noSideBarRoutes.includes(location.pathname);

  if (showSideBar) {
    return (
      <div className="app-layout"> 
        <SideBar />
        <div className="main-content">
          <Routes>
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/curso" element={<ProtectedRoute><Curso /></ProtectedRoute>} />
            <Route path="/metas" element={<ProtectedRoute><Metas /></ProtectedRoute>} />
            <Route path="/produtor" element={<ProtectedRoute><Produtor /></ProtectedRoute>} />
            <Route path="/metas/create/:goalId?" element={<ProtectedRoute><CreateMetas /></ProtectedRoute>} />
            <Route path="/worker/create/:workerId?" element={<ProtectedRoute><CreateProdutor /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Login />} />      
    </Routes>
  );
}

export default AppLayout