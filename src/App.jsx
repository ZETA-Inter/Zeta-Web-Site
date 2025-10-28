import './App.css'
import { BrowserRouter as Router} from "react-router-dom";
import AppLayout from './pages/AppLayout/AppLayout';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout /> 
      </AuthProvider>
    </Router>
  );
}

export default App