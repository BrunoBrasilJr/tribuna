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
import PerfilPublico from "./pages/PerfilPublico";
import Feed from "./pages/Feed";
import Torcida from "./pages/Torcida";
import BuscaClubes from "./components/BuscaClubes";
import ModalLogin from "./components/ModalLogin";
import LateralEsquerda from "./components/LateralEsquerda";
import LateralDireita from "./components/LateralDireita";
import { LogOut } from "lucide-react";

function Menu() {
  const { usuario, sair, abrirModal } = useAuth();
  const navigate = useNavigate();

  async function aoSair() {
    await sair();
    navigate("/");
  }

  return (
    <nav>
      <Link to="/" className="nav-logo">
        Tribuna
      </Link>

      <BuscaClubes />

      <div className="nav-links">
        {usuario ? (
          <button className="nav-sair" onClick={aoSair}>
            <LogOut size={16} /> Sair
          </button>
        ) : (
          <button className="nav-link-botao" onClick={abrirModal}>
            Entrar
          </button>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Menu />
        <ModalLogin />
        <div className="layout">
          <LateralEsquerda />
          <main className="layout-centro">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jogo/:id" element={<Jogo />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/usuario/:id" element={<PerfilPublico />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/torcida/:slug" element={<Torcida />} />
            </Routes>
          </main>
          <LateralDireita />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
