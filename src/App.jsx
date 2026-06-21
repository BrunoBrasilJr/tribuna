import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/auth-context";
import Home from "./pages/Home";
import Jogo from "./pages/Jogo";
import Perfil from "./pages/Perfil";
import Login from "./pages/Login";
import { LogOut } from "lucide-react";

function Menu() {
  const { usuario, sair } = useAuth();
  const navigate = useNavigate();

  async function aoSair() {
    await sair();
    navigate("/");
  }

  return (
    <nav>
      <Link to="/">Início</Link>
      {usuario ? (
        <>
          <Link to="/perfil">Perfil</Link>
          <button className="nav-sair" onClick={aoSair}>
            <LogOut size={16} /> Sair
          </button>
        </>
      ) : (
        <Link to="/login">Entrar</Link>
      )}
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Menu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jogo" element={<Jogo />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
